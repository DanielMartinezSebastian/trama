"""
Renombra props del kit sin romper nada: añade la prop nueva, deja la antigua como alias @deprecated y migra los usos
(etiquetas JSX del componente en todo el repo y su entrada del catálogo). Se usó para eliminar ambigüedades de nombres
(ver docs/02-guia-de-componentes.md, glosario); se conserva para futuros renombrados.

  python scripts/rename-prop.py            → aplica la lista RENAMES
"""
import glob
import re

# (componente, prop antigua, prop nueva, descripción de la nueva, otros componentes cuyas etiquetas reciben la prop)
RENAMES = [
    ("BitmapText", "size", "fontSize", "tamaño en px de cada carácter", []),
    ("Marquee", "size", "fontSize", "tamaño de letra en px", []),
    ("Marquee", "speed", "duration", "segundos que tarda una vuelta completa (más = más lento)", []),
    ("NeonSign", "size", "fontSize", "tamaño de letra en px", []),
    ("ScrambleText", "size", "fontSize", "tamaño de letra en px", []),
    ("Spinner", "size", "fontSize", "tamaño en px (el texto va al 70 %)", []),
    ("Typewriter", "size", "fontSize", "tamaño de letra en px", []),
    ("GridBackground", "size", "cellSize", "tamaño de la celda en px", []),
    ("Icon", "size", "iconSize", "lado: px (número) o cualquier longitud CSS", []),
    ("GlyphCursor", "size", "cursorSize", "tamaño del cursor en px", []),
    ("TerminalTyper", "speed", "charsPerSecond", "caracteres por segundo", []),
    ("Modal", "trigger", "triggerLabel", "texto del botón que abre el diálogo", []),
    ("Drawer", "trigger", "triggerLabel", "texto del botón que abre el panel", []),
    ("AsciiBackground", "style", "asciiStyle", "estilo de render ASCII (no confundir con el `style` CSS de React)", []),
    ("AsciiCard", "hover", "textHover", "efecto de hover de asciify-engine con background=\"text\"", []),
    ("AsciiBackground", "hover", "asciiHover", "efecto de hover del motor Studio (mismo nombre que en VideoPlayer)", []),
    ("Button", "tone", "emphasis", "énfasis: primary = relleno · secondary = superficie · outline = borde · ghost = texto · link = enlace", ["MagneticButton"]),
]

SOURCES = glob.glob("components/**/*.tsx", recursive=True) + glob.glob("lib/**/*.tsx", recursive=True)


def tags(src, name):
    """Posiciones (inicio, fin) de cada etiqueta de apertura <name …> respetando llaves y cadenas."""
    out = []
    for m in re.finditer(r"<" + name + r"\b", src):
        i, depth, quote = m.end(), 0, None
        while i < len(src):
            c = src[i]
            if quote:
                if c == quote:
                    quote = None
            elif c in "\"'`" and depth > 0 or (c == '"' and depth == 0):
                quote = c
            elif c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
            elif c == ">" and depth == 0:
                out.append((m.start(), i + 1))
                break
            i += 1
    return out


def rename_attr(src, comp, old, new):
    n = 0
    for start, end in reversed(tags(src, comp)):
        tag = src[start:end]
        new_tag, k = re.subn(r"(\s)" + old + r"=", r"\1" + new + "=", tag)
        if k:
            src = src[:start] + new_tag + src[end:]
            n += k
    return src, n


def patch_component(comp, old, new, desc):
    p = f"components/ui/{comp}.tsx"
    s = open(p, encoding="utf8").read()
    if re.search(r"\n\s*" + new + r"\?:", s):
        return  # ya renombrada (el script es idempotente)
    # tipo: la nueva delante, la antigua como alias
    m = re.search(r"\n(\s*)(/\*\*[^\n]*\*/\n\s*)?" + old + r"\?: ([^;\n]+);", s)
    assert m, (comp, old, "tipo")
    indent, typ = m.group(1), m.group(3)
    s = s[: m.start()] + f"\n{indent}/** {desc} */\n{indent}{new}?: {typ};\n{indent}/** @deprecated usa `{new}` */\n{indent}{old}?: {typ};" + s[m.end():]
    # desestructuración: `old = D` → `new, old: old_legacy` y el valor se resuelve al principio del cuerpo
    m = re.search(r"([{,\s])" + old + r" = ([^,\n}]+)", s)
    assert m, (comp, old, "default")
    default = m.group(2).strip()
    s = s[: m.start()] + f"{m.group(1)}{new}, {old}: legacy{old[0].upper() + old[1:]}" + s[m.end():]
    # cuerpo: primera llave tras la firma (`}: XProps) {` o `ref,\n) {`)
    body = re.search(r"\}: \w+Props\) \{\n", s) or re.search(r"\n\) \{\n", s)
    assert body, (comp, "cuerpo")
    s = s[: body.end()] + f"  const {old} = {new} ?? legacy{old[0].upper() + old[1:]} ?? {default};\n" + s[body.end():]
    open(p, "w", encoding="utf8", newline="\n").write(s)


def patch_catalog(comp, old, new):
    total = 0
    for p in glob.glob("lib/catalog/entries/*.tsx"):
        s = open(p, encoding="utf8").read()
        m = re.search(r'component: "' + comp + r'",', s)
        if not m:
            continue
        start = s.rfind("\n  {\n", 0, m.start())
        nxt = s.find("\n  {\n    id:", m.end())
        end = nxt if nxt != -1 else len(s)
        block = s[start:end]
        block, k1 = re.subn(r'key: "' + old + r'"', f'key: "{new}"', block)
        block, k2 = re.subn(r"\bp\." + old + r"\b", f"p.{new}", block)
        s = s[:start] + block + s[end:]
        open(p, "w", encoding="utf8", newline="\n").write(s)
        total += k1 + k2
    return total


for comp, old, new, desc, extra in RENAMES:
    patch_component(comp, old, new, desc)
    uses = 0
    for f in SOURCES:
        s0 = open(f, encoding="utf8").read()
        s, n = s0, 0
        for c in [comp, *extra]:
            s, k = rename_attr(s, c, old, new)
            n += k
        if n:
            open(f, "w", encoding="utf8", newline="\n").write(s)
            uses += n
    cat = patch_catalog(comp, old, new) + sum(patch_catalog(c, old, new) for c in extra)
    print(f"{comp}.{old} → {new}: {uses} usos, {cat} cambios en el catálogo")
