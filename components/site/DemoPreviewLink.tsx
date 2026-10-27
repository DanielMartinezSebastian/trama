import Link from "next/link";
import type { ComponentProps } from "react";
import LinkPreview from "@/components/ui/LinkPreview";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string; previewTitle: string };

/** Adaptador de la web: conserva next/link y delega la miniatura al kit. */
export default function DemoPreviewLink({ href, previewTitle, children, ...props }: Props) {
  return (
    <LinkPreview href={href} title={previewTitle} variant="editorial">
      <Link {...props} href={href} prefetch={false}>{children}</Link>
    </LinkPreview>
  );
}
