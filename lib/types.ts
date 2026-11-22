export type Language = "en" | "hi" | "gu";

export type Tone =
  | "traditional"
  | "formal"
  | "warm"
  | "poetic"
  | "modern"
  | "playful";

export type CeremonyStyle =
  | "classic"
  | "hindu"
  | "christian"
  | "muslim"
  | "south-indian"
  | "modern"
  | "boho"
  | "rustic"
  | "art-deco";

export type EventItem = {
  title: string;
  date?: string;
  time?: string;
  venue?: string;
};

export type InviteData = {
  template: string;
  partnerA: string;
  partnerB: string;
  date: string;
  time?: string;
  venue: string;
  venueAddress?: string;
  heading?: string;
  wording: string;
  hostLine?: string;
  familyA?: string;
  familyB?: string;
  language: Language;
  tone?: Tone;
  style?: CeremonyStyle;
  rsvpPhone?: string;
  rsvpName?: string;
  events?: EventItem[];
};

export type TemplateMeta = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  style: CeremonyStyle;
  palette: string[];
  preview: {
    partnerA: string;
    partnerB: string;
    date: string;
    time: string;
    venue: string;
    venueAddress: string;
    heading: string;
    wording: string;
    hostLine: string;
    familyA: string;
    familyB: string;
    language: Language;
    events?: EventItem[];
  };
};
