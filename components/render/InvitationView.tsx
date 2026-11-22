import type { CatalogTemplate } from "@/lib/catalog/types";
import { FixedInvite } from "./FixedInvite";
import { VideoInvite } from "./VideoInvite";

export function InvitationView(props: {
  template: CatalogTemplate;
  fields: Record<string, string>;
  watermark?: boolean;
  photoUrl?: string | null;
  className?: string;
  playing?: boolean;
}) {
  if (props.template.kind === "video") {
    return (
      <VideoInvite
        template={props.template}
        fields={props.fields}
        watermark={props.watermark}
        playing={props.playing}
        className={props.className}
      />
    );
  }
  return (
    <FixedInvite
      template={props.template}
      fields={props.fields}
      watermark={props.watermark}
      photoUrl={props.photoUrl}
      className={props.className}
    />
  );
}
