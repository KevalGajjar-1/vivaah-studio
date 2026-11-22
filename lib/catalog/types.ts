export type TemplateKind = "image" | "video";

export type TemplateCategory =
  | "wedding"
  | "engagement"
  | "haldi"
  | "mehendi"
  | "sangeet"
  | "reception"
  | "save-the-date";

export type FieldType = "text" | "textarea" | "date" | "time" | "photo";

export type TemplateField = {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
};

export type Theme = {
  skin: string;
  background: string;
  color: string;
  accent: string;
  muted?: string;
  ornament: string;
  ornamentColor?: string;
  dark?: boolean;
};

export type VideoSource = {
  file: string;
  sourceUrl: string;
  license: string;
  licenseUrl: string;
  credit: string;
  provider: "mixkit" | "pexels" | "pixabay" | "coverr";
  overlay: string;
};

export type CatalogTemplate = {
  id: string;
  kind: TemplateKind;
  name: string;
  tagline: string;
  description: string;
  category: TemplateCategory;
  tags: string[];
  aspect: "5:7" | "9:16" | "16:9";
  theme: Theme;
  fields: TemplateField[];
  sample: Record<string, string>;
  hasPhoto?: boolean;
  video?: VideoSource;
  pricePaise?: number;
};

export const CATEGORIES: { id: TemplateCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "wedding", label: "Wedding" },
  { id: "engagement", label: "Engagement" },
  { id: "haldi", label: "Haldi" },
  { id: "mehendi", label: "Mehendi" },
  { id: "sangeet", label: "Sangeet" },
  { id: "reception", label: "Reception" },
  { id: "save-the-date", label: "Save the date" },
];

export const STYLE_TAGS = [
  "classic",
  "floral",
  "hindu",
  "muslim",
  "christian",
  "south-indian",
  "modern",
  "boho",
  "rustic",
  "art-deco",
  "royal",
  "festive",
];

export const STANDARD_FIELDS: TemplateField[] = [
  { key: "heading", label: "Heading", type: "text" },
  { key: "hostLine", label: "Host line", type: "text" },
  { key: "partnerA", label: "Name 1", type: "text" },
  { key: "partnerB", label: "Name 2", type: "text" },
  { key: "wording", label: "Invitation wording", type: "textarea" },
  { key: "date", label: "Date", type: "date" },
  { key: "time", label: "Time", type: "time" },
  { key: "venue", label: "Venue", type: "text" },
  { key: "venueAddress", label: "Address", type: "text" },
];

export const PHOTO_FIELD: TemplateField = { key: "photo", label: "Photo", type: "photo" };

export const MIXKIT_LICENSE = "Mixkit Stock Video Free License";
export const MIXKIT_LICENSE_URL = "https://mixkit.co/license/";
