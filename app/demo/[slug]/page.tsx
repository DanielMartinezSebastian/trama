import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DemoViewer from "@/components/DemoViewer";
import { demos, getDemo } from "@/lib/demos";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return demos.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const demo = getDemo((await params).slug);
  if (!demo) return { title: "Trama" };
  return { title: `${demo.title} · Demo de Trama`, description: demo.blurb, alternates: { canonical: `/demo/${demo.slug}` } };
}

export default async function DemoPage({ params }: Props) {
  const { slug } = await params;
  if (!getDemo(slug)) notFound();
  return <DemoViewer slug={slug} />;
}
