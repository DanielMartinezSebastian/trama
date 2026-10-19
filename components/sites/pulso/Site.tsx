"use client";

import { usePathname } from "next/navigation";
import { useMemo, type CSSProperties, type ReactNode } from "react";
import AppShell from "@/components/ui/AppShell";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Chart from "@/components/ui/Chart";
import CommandPalette, { type CommandItem } from "@/components/ui/CommandPalette";
import DataTable, { type DataColumn } from "@/components/ui/DataTable";
import EmptyState from "@/components/ui/EmptyState";
import KpiCard from "@/components/ui/KpiCard";
import { editorialDarkTokens, tokensToStyle } from "@/lib/ui/tokens";
import { SiteFrame, siteHref, useSiteNavigate } from "../shared";
import { CUSTOMERS, MONTHS, RETENTION, REVENUE, SIGNUPS, SLUG, type Customer } from "./data";
import "./pulso.css";

// tema del kit `editorialDarkTokens` con el acento de la marca
const TOKENS: CSSProperties = tokensToStyle({ ...editorialDarkTokens, acc: "#5eead4", r: 12 });

const href = (p = "") => siteHref(SLUG, p);
const eur = (n: number) => n.toLocaleString("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const STATUS_INTENT: Record<Customer["status"], "success" | "info" | "warning" | "neutral"> = { Activo: "success", "En prueba": "info", Impago: "warning", Baja: "neutral" };

const TITLES: Record<string, string> = { "": "Resumen", clientes: "Clientes", informes: "Informes", ajustes: "Ajustes" };

/* ---------- marco ---------- */
export function Shell({ children }: { children: ReactNode }) {
  const navigate = useSiteNavigate();
  const path = usePathname().replace(/\/+$/, "");
  const section = path.replace(`/sitios/${SLUG}`, "").replace(/^\//, "");
  const items: CommandItem[] = useMemo(
    () => [
      { id: "p-resumen", label: "Ir a Resumen", group: "Páginas", href: href(), keywords: "inicio panel" },
      { id: "p-clientes", label: "Ir a Clientes", group: "Páginas", href: href("clientes") },
      { id: "p-informes", label: "Ir a Informes", group: "Páginas", href: href("informes"), keywords: "gráficos métricas" },
      { id: "p-ajustes", label: "Ir a Ajustes", group: "Páginas", href: href("ajustes"), keywords: "configuración cuenta" },
      ...CUSTOMERS.map((c) => ({ id: c.id, label: c.name, hint: `${c.company} · ${c.plan}`, group: "Clientes", href: href("clientes"), keywords: `${c.company} ${c.plan} ${c.status}` })),
    ],
    [],
  );
  return (
    <SiteFrame tokens={TOKENS} className="pl">
      <AppShell
        brand={<><span aria-hidden>◐</span><span>Pulso</span></>}
        title={TITLES[section] ?? "Pulso"}
        groups={[
          {
            items: [
              { label: "Resumen", href: href(), icon: "◧", active: section === "" },
              { label: "Clientes", href: href("clientes"), icon: "◉", badge: String(CUSTOMERS.length), active: section === "clientes" },
              { label: "Informes", href: href("informes"), icon: "◭", active: section === "informes" },
            ],
          },
          { label: "Cuenta", items: [{ label: "Ajustes", href: href("ajustes"), icon: "◌", active: section === "ajustes" }] },
        ]}
        footer={
          <div className="pl-user">
            <Avatar name="Daniel Marín" status="online" size="sm" />
            <span className="ui-app__txt" style={{ fontSize: 13 }}>Daniel Marín</span>
          </div>
        }
        actions={<CommandPalette items={items} onSelect={(it) => navigate({ href: it.href })} placeholder="Busca páginas o clientes…" />}
      >
        {children}
      </AppShell>
    </SiteFrame>
  );
}

/* ---------- páginas ---------- */
const COLUMNS: DataColumn<Customer>[] = [
  { key: "name", label: "Cliente", sortable: true, render: (c) => <span className="pl-name"><Avatar name={c.name} size="sm" /><span><b>{c.name}</b><small>{c.company}</small></span></span> },
  { key: "plan", label: "Plan", sortable: true },
  { key: "mrr", label: "MRR", sortable: true, align: "right", render: (c) => eur(c.mrr) },
  { key: "status", label: "Estado", sortable: true, render: (c) => <Badge text={c.status} intent={STATUS_INTENT[c.status]} variant="editorial" dot /> },
  { key: "last", label: "Última actividad" },
];

function Overview() {
  const mrr = REVENUE.actual[11] * 1000;
  return (
    <div className="pl-page">
      <p className="pl-lead">Así va el negocio este mes. Pulsa <kbd className="ui-kbd">Ctrl K</kbd> para saltar a cualquier página o cliente.</p>
      <div className="pl-grid pl-kpis">
        <KpiCard label="Ingresos recurrentes (MRR)" value={eur(mrr)} delta="+7,6 %" trend="up" note="vs. mes anterior" spark={REVENUE.actual} />
        <KpiCard label="Clientes activos" value="1.284" delta="+118" trend="up" note="este mes" spark={SIGNUPS.altas} />
        <KpiCard label="Bajas" value="16" delta="−5,9 %" trend="down" lowerIsBetter note="vs. mes anterior" spark={SIGNUPS.bajas} />
        <KpiCard label="Retención" value="97,1 %" delta="+0,3 pt" trend="up" note="a 12 meses" spark={RETENTION} />
      </div>
      <div className="pl-grid pl-two">
        <div className="pl-card ui-surface ui-s ui-s--editorial">
          <div className="pl-head"><h2>Ingresos por mes</h2><p>Miles de euros · últimos 12 meses</p></div>
          <Chart kind="area" labels={MONTHS} series={[{ name: "Este año", data: REVENUE.actual, tone: "acc" }, { name: "Año anterior", data: REVENUE.previo, tone: "mut" }]} unit=" k€" height={260} label="Ingresos mensuales de este año y del anterior" />
        </div>
        <div className="pl-card ui-surface ui-s ui-s--editorial">
          <div className="pl-head"><h2>Altas y bajas</h2><p>Por mes</p></div>
          <Chart kind="bar" labels={MONTHS} series={[{ name: "Altas", data: SIGNUPS.altas, tone: "acc" }, { name: "Bajas", data: SIGNUPS.bajas, tone: "acc2" }]} height={260} label="Altas y bajas mensuales" />
        </div>
      </div>
      <div className="pl-card ui-surface ui-s ui-s--editorial" style={{ padding: 0 }}>
        <div className="pl-head" style={{ padding: "16px 18px 0" }}><h2>Últimos clientes</h2><p>Ordena, busca y selecciona</p></div>
        <DataTable columns={COLUMNS} rows={CUSTOMERS.slice(0, 12)} rowKey="id" caption="Últimos clientes" pageSize={5} />
      </div>
    </div>
  );
}

function Customers() {
  return (
    <div className="pl-page">
      <p className="pl-lead">Todos los clientes. Pulsa las cabeceras para ordenar, escribe para filtrar y marca filas para actuar sobre ellas.</p>
      <DataTable columns={COLUMNS} rows={CUSTOMERS} rowKey="id" caption="Clientes" selectable pageSize={8} />
    </div>
  );
}

function Reports() {
  return (
    <div className="pl-page">
      <p className="pl-lead">Tendencias del año. Cada gráfico tiene su tabla de datos para lectores de pantalla y se explora con las flechas del teclado.</p>
      <div className="pl-card ui-surface ui-s ui-s--editorial">
        <div className="pl-head"><h2>Retención de clientes</h2><p>Porcentaje a 12 meses</p></div>
        <Chart kind="line" labels={MONTHS} series={[{ name: "Retención", data: RETENTION, tone: "acc" }]} unit=" %" height={280} label="Retención mensual de clientes" legend={false} />
      </div>
      <div className="pl-card ui-surface ui-s ui-s--editorial">
        <div className="pl-head"><h2>Altas frente a bajas</h2><p>Por mes</p></div>
        <Chart kind="bar" labels={MONTHS} series={[{ name: "Altas", data: SIGNUPS.altas, tone: "acc" }, { name: "Bajas", data: SIGNUPS.bajas, tone: "acc2" }]} height={280} label="Altas y bajas mensuales" />
      </div>
    </div>
  );
}

function Settings() {
  return (
    <div className="pl-page">
      <EmptyState title="Aún no has conectado integraciones" text="Conecta tu pasarela de pago o tu CRM para que Pulso importe los clientes y calcule los indicadores solo." glyph="◌">
        <Button label="Conectar una integración" variant="editorial" emphasis="primary" />
      </EmptyState>
    </div>
  );
}

export function Page({ path }: { path: string[] }) {
  const [a] = path;
  if (!a) return <Overview />;
  if (a === "clientes") return <Customers />;
  if (a === "informes") return <Reports />;
  if (a === "ajustes") return <Settings />;
  return null;
}
