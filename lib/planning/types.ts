export type WeddingTheme = "ivory" | "wine" | "marigold";
export type GuestSide = "bride" | "groom" | "other";
export type RsvpStatus = "pending" | "invited" | "yes" | "no" | "maybe";
export type MessageStyle = "formal" | "hinglish" | "shayari" | "traditional";

export type PlannedEvent = {
  key: string;
  title: string;
  enabled: boolean;
  date?: string;
  time?: string;
  venue?: string;
  venueAddress?: string;
  notes?: string;
};

export type WeddingRow = {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  partner_a: string;
  partner_b: string;
  wedding_date: string | null;
  wedding_time: string | null;
  venue: string | null;
  venue_address: string | null;
  story: string | null;
  language: "en" | "hi" | "gu";
  theme: WeddingTheme;
  vibe: string | null;
  design_id: string | null;
  is_published: boolean;
  whatsapp_phone: string | null;
  created_at: string;
  updated_at: string;
};

export type WeddingEventRow = {
  id: string;
  wedding_id: string;
  title: string;
  event_key: string | null;
  event_date: string | null;
  event_time: string | null;
  venue: string | null;
  venue_address: string | null;
  notes: string | null;
  sort_order: number;
};

export type GuestRow = {
  id: string;
  wedding_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  side: GuestSide;
  group_name: string | null;
  party_size: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type GuestEventRsvpRow = {
  id: string;
  guest_id: string;
  event_id: string;
  status: RsvpStatus;
  party_size: number | null;
  message: string | null;
  responded_at: string | null;
};
