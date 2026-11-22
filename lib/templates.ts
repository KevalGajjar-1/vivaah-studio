import type { CeremonyStyle, InviteData, TemplateMeta } from "./types";

export const templates: TemplateMeta[] = [
  {
    slug: "classic-floral",
    name: "Classic Floral",
    tagline: "Botanical ivory & blush",
    description:
      "A timeless garden invitation with delicate vinework, blush typography, and letterpress-inspired typography on warm ivory paper.",
    style: "classic",
    palette: ["#FBF6EE", "#8B3A42", "#7A8F6E", "#C9A84C"],
    preview: {
      partnerA: "Eleanor",
      partnerB: "James",
      date: "2027-06-20",
      time: "16:30",
      venue: "The Botanical Gardens",
      venueAddress: "Kew, London",
      heading: "The Wedding Of",
      hostLine: "Together with their families",
      familyA: "The Whitmore Family",
      familyB: "The Aldridge Family",
      language: "en",
      wording:
        "With hearts full of gratitude, Eleanor and James invite you to share in the joy of their marriage, surrounded by flowers, friends, and the people who have made their story possible.",
    },
  },
  {
    slug: "royal-mandala",
    name: "Royal Mandala",
    tagline: "Maroon, gold & lotus",
    description:
      "A regal Hindu invitation in deep maroon and gold, framed by a radiating mandala, paisley corners, and lotus ornament.",
    style: "hindu",
    palette: ["#3D0A12", "#E8C872", "#8B1E2D", "#F5E6B8"],
    preview: {
      partnerA: "Ananya Sharma",
      partnerB: "Arjun Mehta",
      date: "2026-12-12",
      time: "19:00",
      venue: "The Leela Palace",
      venueAddress: "Lake Pichola, Udaipur",
      heading: "शुभ विवाह",
      hostLine: "With the blessings of our elders",
      familyA: "Sharma Parivar",
      familyB: "Mehta Parivar",
      language: "en",
      wording:
        "With the blessings of the divine and the love of our families, Ananya and Arjun request the honour of your presence as they begin their new life together, in a ceremony of colour, music, and sacred vows.",
      events: [
        { title: "Mehendi & Sangeet", date: "2026-12-11", time: "17:00", venue: "Palace Courtyard" },
        { title: "Reception", date: "2026-12-12", time: "21:00", venue: "The Grand Durbar" },
      ],
    },
  },
  {
    slug: "minimalist-modern",
    name: "Minimalist Modern",
    tagline: "Quiet type, generous space",
    description:
      "An editorial, contemporary invitation: generous whitespace, refined serif names, and a single golden rule.",
    style: "modern",
    palette: ["#FAFAF7", "#1A1A1A", "#C2A15A", "#6B6B6B"],
    preview: {
      partnerA: "Mia Chen",
      partnerB: "Noah Patel",
      date: "2027-05-08",
      time: "17:00",
      venue: "Brooklyn Botanic Garden",
      venueAddress: "1000 Washington Avenue, Brooklyn",
      heading: "We're getting married",
      hostLine: "Please join us",
      familyA: "",
      familyB: "",
      language: "en",
      wording:
        "Mia and Noah invite you to a simple, joyful celebration of their marriage — an evening of good food, close company, and the start of a life they will write together.",
    },
  },
  {
    slug: "boho-watercolor",
    name: "Boho Watercolour",
    tagline: "Terracotta, sage & sun",
    description:
      "A free-spirited, earthy design with washed terracotta and sage, wild botanicals, and soft hand-lettered names.",
    style: "boho",
    palette: ["#F6EDE3", "#C56A3A", "#7C8A5A", "#D9A441"],
    preview: {
      partnerA: "Sage",
      partnerB: "Rowan",
      date: "2027-09-18",
      time: "16:00",
      venue: "Sunset Ranch",
      venueAddress: "Big Sur, California",
      heading: "A celebration of love",
      hostLine: "Barefoot, under the open sky",
      familyA: "",
      familyB: "",
      language: "en",
      wording:
        "With wildflowers in their hair and the ocean for a witness, Sage and Rowan invite you to gather at golden hour as they promise themselves to one another.",
    },
  },
  {
    slug: "art-deco",
    name: "Art Deco Gold",
    tagline: "Black, geometry & gilded glamour",
    description:
      "A Gatsby-era invitation in jet black and gold leaf, with sunburst geometry, fan motifs, and statuesque typography.",
    style: "art-deco",
    palette: ["#0C0A07", "#D4AF37", "#F3E6C4", "#7A5C16"],
    preview: {
      partnerA: "Clara Moreau",
      partnerB: "Julian Ward",
      date: "2026-11-14",
      time: "18:30",
      venue: "The Gold Room",
      venueAddress: "The Drake, Chicago",
      heading: "Request the Pleasure of Your Company",
      hostLine: "An evening of celebration",
      familyA: "The Moreau Family",
      familyB: "The Ward Family",
      language: "en",
      wording:
        "Clara and Julian request the pleasure of your company at a glittering celebration of their marriage, followed by dinner, dancing, and champagne until the small hours.",
    },
  },
  {
    slug: "rustic",
    name: "Rustic Kraft",
    tagline: "Oak leaves on warm paper",
    description:
      "A country letterpress card on kraft paper, with oak leaves, twine, and honest serif typography in walnut ink.",
    style: "rustic",
    palette: ["#D9C4A0", "#3A2A1C", "#6B4F32", "#8A9A62"],
    preview: {
      partnerA: "Hannah Brooks",
      partnerB: "Caleb Reed",
      date: "2027-10-03",
      time: "15:00",
      venue: "Oak & Willow Barn",
      venueAddress: "Woodstock, Vermont",
      heading: "Here's to forever",
      hostLine: "Together with their families",
      familyA: "The Brooks Family",
      familyB: "The Reed Family",
      language: "en",
      wording:
        "Hannah and Caleb warmly invite you to their wedding in the countryside, where harvest light, good music, and a long table under the trees will mark the beginning of their life together.",
    },
  },
  {
    slug: "church-elegant",
    name: "Church Elegant",
    tagline: "Ivory, navy & sacred arch",
    description:
      "A reverent Christian invitation with a gothic arch, lily vines, and navy-and-gold typography on ivory stock.",
    style: "christian",
    palette: ["#F8F4EB", "#1B2A4A", "#C4A35A", "#4A5568"],
    preview: {
      partnerA: "Grace Bennett",
      partnerB: "Thomas Lang",
      date: "2027-04-17",
      time: "14:00",
      venue: "St. Mary's Cathedral",
      venueAddress: "Westminster, London",
      heading: "Holy Matrimony",
      hostLine: "In the presence of God and our families",
      familyA: "Mr & Mrs David Bennett",
      familyB: "Mr & Mrs Peter Lang",
      language: "en",
      wording:
        "With joyful hearts, Grace and Thomas invite you to witness their holy matrimony and to join them afterwards for a reception in celebration of the covenant they will make before God.",
      events: [{ title: "Wedding Reception", date: "2027-04-17", time: "17:00", venue: "The Chapter House" }],
    },
  },
  {
    slug: "nikah-elegant",
    name: "Nikah Emerald",
    tagline: "Emerald, gold & arabesque",
    description:
      "An elegant Nikah invitation in deep emerald and gold, with geometric arabesque borders and refined Arabic typography.",
    style: "muslim",
    palette: ["#06281E", "#D4AF37", "#0F3D2E", "#F3E6C4"],
    preview: {
      partnerA: "Amina Rahman",
      partnerB: "Yusuf Khan",
      date: "2027-03-21",
      time: "11:00",
      venue: "The Grand Pearl Ballroom",
      venueAddress: "Mayfair, London",
      heading: "Nikah Ceremony",
      hostLine: "With the grace of Allah (SWT)",
      familyA: "The Rahman Family",
      familyB: "The Khan Family",
      language: "en",
      wording:
        "By the grace of Allah, the families of Rahman and Khan request the honour of your presence at the Nikah of their beloved children Amina and Yusuf, and pray you will share in the blessings of this sacred union.",
      events: [{ title: "Walima", date: "2027-03-21", time: "19:00", venue: "The Grand Pearl Ballroom" }],
    },
  },
  {
    slug: "south-indian-temple",
    name: "Temple Kalyanam",
    tagline: "Gopuram, kolam & turmeric gold",
    description:
      "A South Indian wedding card inspired by temple architecture: a gopuram arch, kolam corners, and vermillion-gold colour.",
    style: "south-indian",
    palette: ["#4A0E12", "#E8A317", "#7A1A1A", "#F4E0B0"],
    preview: {
      partnerA: "Meenakshi Iyer",
      partnerB: "Karthik Raman",
      date: "2027-01-24",
      time: "09:00",
      venue: "Kalyanamandapam, Mylapore",
      venueAddress: "Chennai, Tamil Nadu",
      heading: "Kalyanam",
      hostLine: "With the blessings of our kuladeivam",
      familyA: "The Iyer Family",
      familyB: "The Raman Family",
      language: "en",
      wording:
        "With the blessings of the Almighty and our elders, the Iyer and Raman families invite you to the kalyanam of Meenakshi and Karthik, and to share in the music, feast, and festivities that follow.",
      events: [
        { title: "Nischayathartham", date: "2027-01-23", time: "18:00", venue: "Family Residence" },
        { title: "Reception", date: "2027-01-24", time: "19:00", venue: "The Grand Chola Hall" },
      ],
    },
  },
];

export const templateMap = Object.fromEntries(templates.map((t) => [t.slug, t])) as Record<
  string,
  TemplateMeta
>;

export const defaultTemplate = templates[0];

export function getTemplate(slug?: string | null): TemplateMeta {
  if (!slug) return defaultTemplate;
  return templateMap[slug] || defaultTemplate;
}

export function sampleInvite(slug?: string | null): InviteData {
  const template = getTemplate(slug);
  return {
    template: template.slug,
    ...template.preview,
    tone: "warm",
    style: template.style,
    rsvpPhone: "14155550199",
    rsvpName: "",
  };
}

export function emptyInvite(slug?: string | null): InviteData {
  const template = getTemplate(slug);
  return {
    template: template.slug,
    partnerA: "",
    partnerB: "",
    date: "",
    time: "",
    venue: "",
    venueAddress: "",
    heading: "",
    wording: "",
    hostLine: "",
    familyA: "",
    familyB: "",
    language: "en",
    tone: "warm",
    style: template.style,
    rsvpPhone: "",
    rsvpName: "",
    events: [],
  };
}

const styleToSlug: Record<CeremonyStyle, string> = {
  classic: "classic-floral",
  hindu: "royal-mandala",
  christian: "church-elegant",
  muslim: "nikah-elegant",
  "south-indian": "south-indian-temple",
  modern: "minimalist-modern",
  boho: "boho-watercolor",
  rustic: "rustic",
  "art-deco": "art-deco",
};

export function suggestTemplateFromStyle(style?: CeremonyStyle | string): string {
  if (!style) return "classic-floral";
  return styleToSlug[style as CeremonyStyle] || "classic-floral";
}
