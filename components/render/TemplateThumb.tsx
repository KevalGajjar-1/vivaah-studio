import type { CatalogTemplate } from "@/lib/catalog/types";
import { InvitationView } from "./InvitationView";

export function TemplateThumb({
  template,
  className = "",
}: {
  template: CatalogTemplate;
  className?: string;
}) {
  const fields = { ...template.sample };
  return (
    <div
      className={`pointer-events-none origin-top overflow-hidden ${template.kind === "video" ? "aspect-[9/16]" : "aspect-[5/7]"} ${className}`}
    >
      <InvitationView template={template} fields={fields} playing={false} />
    </div>
  );
}
