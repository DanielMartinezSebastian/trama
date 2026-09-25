"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { inline } from "@/lib/ui/markdownInline";
import { themeSnapshot } from "@/lib/ui/themeSnapshot";
import { renderGlyph } from "./Icon";
import { vcls, type Variant } from "./variants";

export type ChatReply = string | { text: string; quickReplies?: string[] };

export type ChatWidgetProps = {
  /** nombre del asistente */
  title?: string;
  /** línea bajo el nombre ("" = sin ella) */
  subtitle?: string;
  /** primer mensaje del asistente (Markdown de línea) */
  greeting?: string;
  /**
   * respuestas por reglas, una por línea: `palabra, otra palabra => respuesta || rápida 1, rápida 2`. Gana la regla con más
   * palabras presentes en el mensaje (sin tildes ni mayúsculas). Lo de tras `||` son las respuestas rápidas que se ofrecen después.
   */
  rules?: string;
  /** respuesta cuando ninguna regla encaja */
  fallback?: string;
  /** respuestas rápidas iniciales, separadas por comas */
  quickReplies?: string;
  /** backend propio: recibe el mensaje y el historial y devuelve la respuesta (sustituye a `rules`) */
  onMessage?: (text: string, history: { from: "bot" | "user"; text: string }[]) => Promise<ChatReply> | ChatReply;
  placeholder?: string;
  /** texto del botón flotante ("" = solo icono) */
  launcherLabel?: string;
  /** glifo o `icon:nombre` del asistente */
  avatar?: string;
  position?: "bottom-right" | "bottom-left";
  defaultOpen?: boolean;
  variant?: Variant;
  className?: string;
};

type Msg = { id: number; from: "bot" | "user"; text: string };
type Rule = { keys: string[]; text: string; quick: string[] };

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const list = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);

function parseRules(rules: string): Rule[] {
  return rules
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.includes("=>"))
    .map((l) => {
      const [keys, rest] = l.split("=>");
      const [text, quick = ""] = rest.split("||");
      return { keys: list(norm(keys)), text: text.trim(), quick: list(quick) };
    });
}

/** La regla con más claves presentes en el mensaje (las claves de varias palabras cuentan como una). */
function answer(rules: Rule[], text: string, fallback: string): { text: string; quickReplies: string[] } {
  const t = norm(text);
  let best: Rule | null = null;
  let score = 0;
  for (const r of rules) {
    const s = r.keys.filter((k) => t.includes(k)).length;
    if (s > score) {
      best = r;
      score = s;
    }
  }
  return best ? { text: best.text, quickReplies: best.quick } : { text: fallback, quickReplies: [] };
}

/**
 * Chat de ayuda flotante: un botón en una esquina que abre una conversación con un asistente. Sin backend responde por reglas
 * (palabras clave → respuesta, con respuestas rápidas); con `onMessage` se conecta a un modelo o servicio real. Sale a
 * `document.body` con los tokens copiados, así que ningún ancestro con `backdrop-filter` atrapa su `position: fixed`.
 */
export default function ChatWidget({
  title = "Asistente Maré",
  subtitle = "Responde al momento · o te pasa con el equipo",
  greeting = "¡Hola! Soy el asistente de la escuela. Pregúntame por **clases**, **precios** o **material**.",
  rules = "precio, precios, cuesta, cuanto, tarifa => Una clase de iniciación cuesta **35 €** y el bono de cinco, **150 €**. || Reservar, Clases privadas\nclase, clases, horario, horarios, turno => Hay tres turnos: **9:30**, **12:00** y **17:30**, todos los días. || Reservar, Precios\nreservar, reserva, apuntarme => Puedes reservar en [Reservas](#reservas) en menos de un minuto. || Precios\nmaterial, tabla, neopreno => El neopreno y la tabla van incluidos. Solo trae bañador y toalla.\nprivada, privadas => Las clases privadas son de **1,5 h** con un monitor solo para ti: **70 €**. || Reservar\nhumano, persona, equipo, llamar => Te paso con el equipo: escríbenos a [hola@mare.surf](mailto:hola@mare.surf) o llama al **942 000 000**.",
  fallback = "No estoy seguro de haberte entendido. Prueba con **precios**, **horarios** o **reservar**, o pide hablar con una persona.",
  quickReplies = "Precios, Horarios, Reservar, Hablar con una persona",
  onMessage,
  placeholder = "Escribe tu pregunta…",
  launcherLabel = "¿Te ayudo?",
  avatar = "~",
  position = "bottom-right",
  defaultOpen = false,
  variant = "glass",
  className = "",
}: ChatWidgetProps) {
  const anchor = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(defaultOpen);
  const [style, setStyle] = useState<CSSProperties>({});
  const [msgs, setMsgs] = useState<Msg[]>(() => [{ id: 0, from: "bot", text: greeting }]);
  const [quick, setQuick] = useState<string[]>(() => list(quickReplies));
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    setMounted(true);
    if (anchor.current) setStyle(themeSnapshot(anchor.current));
  }, []);
  // cambiar el saludo o las respuestas rápidas (p. ej. desde el catálogo) reinicia la conversación
  useEffect(() => {
    setMsgs([{ id: 0, from: "bot", text: greeting }]);
    setQuick(list(quickReplies));
  }, [greeting, quickReplies]);
  useEffect(() => {
    if (open) {
      setUnread(0);
      if (anchor.current) setStyle(themeSnapshot(anchor.current));
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  const push = (from: Msg["from"], text: string) => setMsgs((m) => [...m, { id: nextId.current++, from, text }]);

  const send = async (raw: string) => {
    const text = raw.trim();
    if (!text || typing) return;
    setDraft("");
    setQuick([]);
    push("user", text);
    setTyping(true);
    const history = [...msgs.map(({ from, text }) => ({ from, text })), { from: "user" as const, text }];
    let reply: { text: string; quickReplies: string[] };
    try {
      if (onMessage) {
        const r = await onMessage(text, history);
        reply = typeof r === "string" ? { text: r, quickReplies: [] } : { text: r.text, quickReplies: r.quickReplies ?? [] };
      } else {
        reply = answer(parseRules(rules), text, fallback);
        // una pausa corta, proporcional a la respuesta, para que se lea como una conversación
        const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
        await new Promise((r) => setTimeout(r, reduced ? 150 : Math.min(1400, 450 + reply.text.length * 8)));
      }
    } catch {
      reply = { text: "Ahora mismo no puedo responder. Inténtalo de nuevo en un momento.", quickReplies: [] };
    }
    setTyping(false);
    push("bot", reply.text);
    setQuick(reply.quickReplies);
    if (!open) setUnread((n) => n + 1);
  };

  const ui = (
    <div className={`ui-chat ui-chat--${position} ${vcls(variant)} ${className}`} style={style}>
      {open && (
        <div id={`${uid}-panel`} role="dialog" aria-label={title} className="ui-chat__panel ui-surface" onKeyDown={(e) => e.key === "Escape" && setOpen(false)}>
          <header className="ui-chat__head">
            <span className="ui-chat__avatar" aria-hidden>
              {avatar.startsWith("icon:") ? renderGlyph(avatar, 18) : avatar}
            </span>
            <span className="ui-chat__who">
              <strong>{title}</strong>
              {subtitle && (
                <span className="ui-chat__status">
                  <i aria-hidden /> {subtitle}
                </span>
              )}
            </span>
            <button type="button" className="ui-chat__x" aria-label="Cerrar chat" onClick={() => setOpen(false)}>
              {renderGlyph("icon:close", 18)}
            </button>
          </header>
          <div ref={listRef} className="ui-chat__list" role="log" aria-live="polite" aria-label="Conversación">
            {msgs.map((m) => (
              <p key={m.id} className={`ui-chat__msg ui-chat__msg--${m.from}`}>
                {inline(m.text)}
              </p>
            ))}
            {typing && (
              <p className="ui-chat__msg ui-chat__msg--bot ui-chat__typing" aria-label={`${title} está escribiendo`}>
                <i />
                <i />
                <i />
              </p>
            )}
          </div>
          {quick.length > 0 && !typing && (
            <div className="ui-chat__quick">
              {quick.map((q) => (
                <button key={q} type="button" onClick={() => send(q)}>
                  {q}
                </button>
              ))}
            </div>
          )}
          <form
            className="ui-chat__form"
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
          >
            <input ref={inputRef} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={placeholder} aria-label={placeholder} />
            <button type="submit" aria-label="Enviar" disabled={!draft.trim() || typing}>
              {renderGlyph("icon:send", 18)}
            </button>
          </form>
        </div>
      )}
      <button type="button" className={`ui-chat__launcher ${launcherLabel ? "" : "ui-chat__launcher--icon"}`} aria-expanded={open} aria-controls={`${uid}-panel`} onClick={() => setOpen((v) => !v)}>
        {renderGlyph(open ? "icon:close" : "icon:message", 20)}
        {launcherLabel && !open && <span>{launcherLabel}</span>}
        {unread > 0 && !open && (
          <span className="ui-chat__badge" aria-label={`${unread} sin leer`}>
            {unread}
          </span>
        )}
      </button>
    </div>
  );

  return (
    <>
      <span ref={anchor} hidden />
      {mounted && createPortal(ui, document.body)}
    </>
  );
}
