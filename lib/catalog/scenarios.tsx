"use client";

import type { CSSProperties, ReactNode } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Divider from "@/components/ui/Divider";
import NavBar from "@/components/ui/NavBar";
import Progress from "@/components/ui/Progress";
import Toggle from "@/components/ui/Toggle";
import type { CatalogEntry, Category, Values } from "./schema";

export type ScenarioCtx = { entry: CatalogEntry; values: Values; replay: number };
type Scenario = (ctx: ScenarioCtx) => ReactNode;

/** Renderiza el componente que se está editando, con sus props en vivo, en el sitio que le toca. */
const live = ({ entry, values, replay }: ScenarioCtx) => entry.render(values, { replay });

/**
 * Alto mínimo del hueco donde se coloca el componente en vivo: reutiliza `stageHeight`, la misma
 * altura ya calibrada para su vista aislada, así ningún componente queda recortado o descentrado
 * por un hueco demasiado bajo (la mayoría de renders internos son `position: absolute`, así que el
 * hueco no crece solo con su contenido).
 */
const slot = (entry: CatalogEntry, fallback = 220): CSSProperties => ({ minHeight: entry.stageHeight ?? fallback });

/** Cada categoría tiene una única escena: envuelve `live(ctx)` en un contexto creíble, construido con
 * otras piezas del propio kit (a modo de decorado estático). No hay una escena por componente: la
 * misma composición sirve para cualquier entrada de esa categoría, igual que el panel FX. */
export const SCENARIOS: Partial<Record<Category, Scenario>> = {
  fondos: (ctx) => (
    <div className="pg-scn pg-scn--hero">
      <div className="pg-scn__bg">{live(ctx)}</div>
      <div className="pg-scn__navbar">
        <NavBar brand="Estudio" links="Trabajo, Servicios, Contacto" cta="Hablemos" variant="glass" />
      </div>
      <div className="pg-scn__herocopy">
        <span className="pg-scn__kicker">NUEVA COLECCIÓN</span>
        <h2>Un fondo detrás de contenido real</h2>
        <p>Navegación arriba, titular a la izquierda: así se comprueba si el texto sigue siendo legible.</p>
        <Button label="Ver el proyecto" variant="solid" emphasis="primary" glyph="→" />
      </div>
    </div>
  ),

  texto: (ctx) => (
    <div className="pg-scn pg-scn--section">
      <span className="pg-scn__eyebrow">Cómo lo hacemos</span>
      <div className="pg-scn__slot" style={slot(ctx.entry, 140)}>
        {live(ctx)}
      </div>
      <div className="pg-scn__tags">
        <Badge text="Rápido" variant="outline" intent="accent" />
        <Badge text="Accesible" variant="outline" intent="accent" />
        <Badge text="A tu medida" variant="outline" intent="accent" />
      </div>
      <Divider label="disponible desde hoy" variant="minimal" />
      <div className="pg-scn__center">
        <Button label="Saber más" variant="outline" emphasis="secondary" />
      </div>
    </div>
  ),

  tarjetas: (ctx) => (
    <div className="pg-scn pg-scn--grid">
      <span className="pg-scn__eyebrow">Tres planes, la misma tarjeta</span>
      <div className="pg-scn__cards">
        {[0, 1, 2].map((i) => (
          <div key={i} className="pg-scn__cardslot" style={slot(ctx.entry, 280)}>
            {live({ ...ctx, values: { ...ctx.values, index: i + 1 } })}
          </div>
        ))}
      </div>
    </div>
  ),

  interaccion: (ctx) => (
    <div className="pg-scn pg-scn--panel">
      <div className="pg-scn__card">
        <strong>Confirma tu reserva</strong>
        <p>Dos clases de iniciación el sábado por la mañana, con neopreno y tabla incluidos.</p>
        <div className="pg-scn__slot pg-scn__slot--action" style={slot(ctx.entry, 200)}>
          {live(ctx)}
        </div>
      </div>
    </div>
  ),

  transiciones: (ctx) => (
    <div className="pg-scn pg-scn--frame">
      <div className="pg-scn__chrome">
        <i style={{ background: "#ff5f57" }} />
        <i style={{ background: "#febc2e" }} />
        <i style={{ background: "#28c840" }} />
        <span>siguiente-sección.html</span>
      </div>
      <div className="pg-scn__slot pg-scn__slot--frame" style={slot(ctx.entry, 320)}>
        {live(ctx)}
      </div>
    </div>
  ),

  datos: (ctx) => (
    <div className="pg-scn pg-scn--dash">
      <span className="pg-scn__eyebrow">Panel de control</span>
      <div className="pg-scn__dashgrid">
        <div className="pg-scn__slot pg-scn__slot--wide" style={slot(ctx.entry, 260)}>
          {live(ctx)}
        </div>
        <div className="pg-scn__side">
          <div className="pg-scn__widget">
            <span>Uso de API</span>
            <Progress label="" value={72} showValue={false} variant="minimal" />
          </div>
          <div className="pg-scn__widget pg-scn__widget--badges">
            <Badge text="En línea" intent="success" variant="glass" dot />
            <Badge text="3 alertas" intent="warning" variant="glass" />
          </div>
        </div>
      </div>
    </div>
  ),

  navegacion: (ctx) => (
    <div className="pg-scn pg-scn--page">
      <div className="pg-scn__slot" style={slot(ctx.entry, 260)}>
        {live(ctx)}
      </div>
      <div className="pg-scn__pagebody">
        <div className="pg-scn__placeholder" />
        <div className="pg-scn__placeholder" style={{ width: "70%" }} />
        <div className="pg-scn__placeholder" style={{ width: "85%" }} />
      </div>
    </div>
  ),

  formularios: (ctx) => (
    <div className="pg-scn pg-scn--form">
      <strong>Crear cuenta</strong>
      <div className="pg-scn__slot pg-scn__slot--form" style={slot(ctx.entry, 200)}>
        {live(ctx)}
      </div>
      <Toggle label="Acepto los términos y condiciones" defaultChecked variant="minimal" size="sm" />
      <Button label="Crear cuenta" variant="solid" emphasis="primary" fullWidth />
    </div>
  ),

  feedback: (ctx) => (
    <div className="pg-scn pg-scn--stack">
      <span className="pg-scn__eyebrow">Centro de notificaciones</span>
      <div className="pg-scn__slot" style={slot(ctx.entry, 200)}>
        {live(ctx)}
      </div>
      <div className="pg-scn__ghost">Pedido #4821 enviado — hace 2 h</div>
      <div className="pg-scn__ghost">Copia de seguridad completada — ayer</div>
    </div>
  ),

  galerias: (ctx) => (
    <div className="pg-scn pg-scn--product">
      <div className="pg-scn__slot" style={slot(ctx.entry, 320)}>
        {live(ctx)}
      </div>
      <div className="pg-scn__productinfo">
        <Badge text="Nuevo" variant="outline" intent="accent" />
        <strong>Tabla evolutiva 7&apos;2&quot;</strong>
        <p>Galería o vídeo a la izquierda, ficha a la derecha: así se ve si el carrusel deja respirar al texto.</p>
        <span className="pg-scn__price">349 €</span>
        <Button label="Añadir al carrito" variant="solid" emphasis="primary" fullWidth />
      </div>
    </div>
  ),

  overlays: (ctx) => (
    <div className="pg-scn pg-scn--panel">
      <div className="pg-scn__card">
        <strong>Ajustes de la cuenta</strong>
        <p>El disparador vive entre ajustes normales; el overlay se abre encima de toda la página, no dentro de esta tarjeta.</p>
        <div className="pg-scn__rows">
          <Toggle label="Notificaciones por correo" defaultChecked variant="minimal" size="sm" />
          <Toggle label="Perfil público" variant="minimal" size="sm" />
        </div>
        <div className="pg-scn__slot pg-scn__slot--action" style={slot(ctx.entry, 160)}>
          {live(ctx)}
        </div>
      </div>
    </div>
  ),

  pixel: (ctx) => (
    <div className="pg-scn pg-scn--section">
      <span className="pg-scn__eyebrow">Menú de partida</span>
      <div className="pg-scn__slot" style={slot(ctx.entry, 200)}>
        {live(ctx)}
      </div>
      <div className="pg-scn__tags">
        <Button label="Continuar" variant="retro" emphasis="primary" size="sm" />
        <Button label="Opciones" variant="retro" emphasis="secondary" size="sm" />
      </div>
    </div>
  ),
};

export const hasScenario = (category: Category) => Boolean(SCENARIOS[category]);
