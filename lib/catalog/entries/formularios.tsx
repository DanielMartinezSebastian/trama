"use client";

import CheckboxGroup from "@/components/ui/CheckboxGroup";
import OtpInput from "@/components/ui/OtpInput";
import RadioGroup from "@/components/ui/RadioGroup";
import RangeSlider from "@/components/ui/RangeSlider";
import Select from "@/components/ui/Select";
import Stepper from "@/components/ui/Stepper";
import TextField from "@/components/ui/TextField";
import Toggle from "@/components/ui/Toggle";
import type { CatalogEntry } from "../schema";
import { ALL_STYLES, intentProp, variantProp } from "./shared";

export const formularios: CatalogEntry[] = [
  {
    id: "text-field",
    component: "TextField",
    path: "@/components/ui/TextField",
    name: "Campo de texto",
    category: "formularios",
    styles: ALL_STYLES,
    description: "Entrada con etiqueta, ayuda, prefijo y estados de error o éxito. El foco usa --acc. Con multiline dibuja un textarea (ver Formulario de contacto).",
    stageHeight: 260,
    props: [
      { key: "label", label: "Etiqueta", type: "text", default: "Correo electrónico" },
      { key: "placeholder", label: "Placeholder", type: "text", default: "tu@correo.com" },
      { key: "defaultValue", label: "Valor inicial", type: "text", default: "" },
      { key: "hint", label: "Ayuda", type: "text", default: "Solo te escribiremos para confirmar la reserva." },
      { key: "prefix", label: "Prefijo", type: "text", default: "@", when: (p) => !p.multiline },
      intentProp("none", ["none", "success", "info", "warning", "danger"], { label: "Estado de validación (intent)", hint: "danger marca el campo como inválido (aria-invalid)" }),
      { key: "size", label: "Tamaño", type: "select", default: "md", options: ["sm", "md", "lg"], when: (p) => !p.multiline },
      { key: "type", label: "Tipo", type: "select", default: "text", options: ["text", "email", "password", "search"], when: (p) => !p.multiline },
      { key: "multiline", label: "Multilínea (textarea)", type: "boolean", default: false },
      { key: "rows", label: "Filas", type: "number", default: 4, min: 2, max: 10, step: 1, when: (p) => Boolean(p.multiline) },
      variantProp("glass"),
    ],
    render: (p) => (
      <div className="ui-center">
        <TextField
          label={p.label as string}
          placeholder={p.placeholder as string}
          defaultValue={p.defaultValue as string}
          hint={p.hint as string}
          prefix={p.prefix as string}
          intent={p.intent === "none" ? undefined : (p.intent as never)}
          size={p.size as never}
          type={p.type as never}
          multiline={p.multiline as boolean}
          rows={p.rows as number}
          variant={p.variant as never}
        />
      </div>
    ),
  },
  {
    id: "toggle",
    component: "Toggle",
    path: "@/components/ui/Toggle",
    name: "Interruptor",
    category: "formularios",
    styles: ALL_STYLES,
    description: "Interruptor accesible. Retro y terminal lo muestran como texto [ON ]/[OFF].",
    stageHeight: 220,
    props: [
      { key: "label", label: "Texto", type: "text", default: "Notificaciones" },
      { key: "defaultChecked", label: "Activado", type: "boolean", default: true },
      { key: "size", label: "Tamaño", type: "select", default: "md", options: ["sm", "md", "lg"] },
      { key: "onText", label: "Texto «encendido»", type: "text", default: "ON ", when: (p) => p.variant === "retro" || p.variant === "terminal" },
      { key: "offText", label: "Texto «apagado»", type: "text", default: "OFF", when: (p) => p.variant === "retro" || p.variant === "terminal" },
      variantProp("glass"),
    ],
    render: (p) => (
      <div className="ui-center">
        <Toggle label={p.label as string} defaultChecked={p.defaultChecked as boolean} size={p.size as never} onText={p.onText as string} offText={p.offText as string} variant={p.variant as never} />
      </div>
    ),
  },
  {
    id: "range-slider",
    component: "RangeSlider",
    path: "@/components/ui/RangeSlider",
    name: "Deslizador",
    category: "formularios",
    styles: ALL_STYLES,
    description: "Deslizador con pista y pulgar propios de cada estilo.",
    stageHeight: 220,
    props: [
      { key: "label", label: "Etiqueta", type: "text", default: "Intensidad" },
      { key: "min", label: "Mínimo", type: "number", default: 0, min: -100, max: 100, step: 1 },
      { key: "max", label: "Máximo", type: "number", default: 100, min: 1, max: 500, step: 1 },
      { key: "step", label: "Paso", type: "number", default: 1, min: 1, max: 20, step: 1 },
      { key: "defaultValue", label: "Valor inicial", type: "number", default: 40, min: 0, max: 100, step: 1 },
      { key: "unit", label: "Unidad", type: "text", default: "%" },
      { key: "showValue", label: "Mostrar valor", type: "boolean", default: true },
      variantProp("glass"),
    ],
    render: (p) => (
      <div className="ui-center">
        <RangeSlider label={p.label as string} min={p.min as number} max={p.max as number} step={p.step as number} defaultValue={p.defaultValue as number} unit={p.unit as string} showValue={p.showValue as boolean} variant={p.variant as never} />
      </div>
    ),
  },
  {
    id: "select",
    component: "Select",
    path: "@/components/ui/Select",
    name: "Desplegable",
    category: "formularios",
    styles: ALL_STYLES,
    description: "Lista de opciones con estilo propio (no un <select> nativo): mismo aspecto en los 7 estilos, abierto o cerrado.",
    stageHeight: 280,
    props: [
      { key: "label", label: "Etiqueta", type: "text", default: "País" },
      { key: "options", label: "Opciones (separadas por comas)", type: "text", default: "España, Francia, Portugal, Italia, Alemania" },
      { key: "defaultValue", label: "Valor inicial", type: "text", default: "" },
      { key: "placeholder", label: "Placeholder", type: "text", default: "Elige una opción" },
      { key: "size", label: "Tamaño", type: "select", default: "md", options: ["sm", "md", "lg"] },
      variantProp("glass"),
    ],
    render: (p) => (
      <div className="ui-center ui-center--top" style={{ paddingTop: 40 }}>
        <Select label={p.label as string} options={p.options as string} defaultValue={p.defaultValue as string} placeholder={p.placeholder as string} size={p.size as never} variant={p.variant as never} />
      </div>
    ),
  },
  {
    id: "checkbox-group",
    component: "CheckboxGroup",
    path: "@/components/ui/CheckboxGroup",
    name: "Grupo de casillas",
    category: "formularios",
    styles: ALL_STYLES,
    description: "Casillas independientes. Retro y terminal las muestran como texto [x]/[ ].",
    stageHeight: 260,
    props: [
      { key: "label", label: "Etiqueta", type: "text", default: "Notificaciones" },
      { key: "options", label: "Opciones (separadas por comas)", type: "text", default: "Email, SMS, Push, Newsletter" },
      { key: "defaultValue", label: "Marcadas al inicio (separadas por comas)", type: "text", default: "Email, Push" },
      variantProp("glass"),
    ],
    render: (p) => (
      <div className="ui-center">
        <CheckboxGroup label={p.label as string} options={p.options as string} defaultValue={p.defaultValue as string} variant={p.variant as never} />
      </div>
    ),
  },
  {
    id: "radio-group",
    component: "RadioGroup",
    path: "@/components/ui/RadioGroup",
    name: "Grupo de opciones",
    category: "formularios",
    styles: ALL_STYLES,
    description: "Selección única entre varias opciones. Retro y terminal las muestran como texto (•)/( ).",
    stageHeight: 220,
    props: [
      { key: "label", label: "Etiqueta", type: "text", default: "Plan" },
      { key: "options", label: "Opciones (separadas por comas)", type: "text", default: "Mensual, Anual" },
      { key: "defaultValue", label: "Valor inicial", type: "text", default: "Mensual" },
      variantProp("glass"),
    ],
    render: (p) => (
      <div className="ui-center">
        <RadioGroup label={p.label as string} options={p.options as string} defaultValue={p.defaultValue as string} variant={p.variant as never} />
      </div>
    ),
  },
  {
    id: "stepper",
    component: "Stepper",
    path: "@/components/ui/Stepper",
    name: "Pasos",
    category: "formularios",
    styles: ALL_STYLES,
    description: "Indicador de progreso por pasos (alta, checkout, onboarding…). No gestiona el contenido de cada paso.",
    stageHeight: 180,
    props: [
      { key: "steps", label: "Pasos (separados por comas)", type: "text", default: "Datos, Envío, Pago, Confirmación" },
      { key: "current", label: "Paso activo", type: "number", default: 1, min: 0, max: 5, step: 1 },
      variantProp("glass"),
    ],
    render: (p) => (
      <div className="ui-center">
        <Stepper steps={p.steps as string} current={p.current as number} variant={p.variant as never} />
      </div>
    ),
  },
  {
    id: "otp-input",
    component: "OtpInput",
    path: "@/components/ui/OtpInput",
    name: "Código de verificación",
    category: "formularios",
    styles: ALL_STYLES,
    description: "Casillas de código (SMS, autenticación en dos pasos): el foco avanza solo al escribir.",
    stageHeight: 200,
    props: [
      { key: "length", label: "Dígitos", type: "number", default: 6, min: 4, max: 8, step: 1 },
      { key: "size", label: "Tamaño", type: "select", default: "md", options: ["sm", "md", "lg"] },
      variantProp("terminal"),
    ],
    render: (p) => (
      <div className="ui-center">
        <OtpInput length={p.length as number} size={p.size as never} variant={p.variant as never} />
      </div>
    ),
  },
];
