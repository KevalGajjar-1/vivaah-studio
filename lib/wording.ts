import { formatDate, formatTime, joinNames } from "./format";
import { suggestTemplateFromStyle } from "./templates";
import type { CeremonyStyle, InviteData, Language, Tone } from "./types";

export type WordingInput = {
  partnerA: string;
  partnerB: string;
  date?: string;
  time?: string;
  venue?: string;
  venueAddress?: string;
  familyA?: string;
  familyB?: string;
  hostLine?: string;
  language: Language;
  tone?: Tone;
  style?: CeremonyStyle;
};

export type WordingResult = {
  heading: string;
  wording: string;
  hostLine: string;
  suggestedTemplate: string;
  source: "ai" | "fallback";
};

function familiesLine(input: WordingInput): string {
  const a = input.familyA?.trim();
  const b = input.familyB?.trim();
  if (a && b) return `${a} and ${b}`;
  return a || b || "";
}

const headings: Record<Language, Record<string, string>> = {
  en: {
    classic: "The Wedding Of",
    hindu: "Shubh Vivah",
    christian: "Holy Matrimony",
    muslim: "Nikah Ceremony",
    "south-indian": "Kalyanam",
    modern: "We're Getting Married",
    boho: "A Celebration of Love",
    rustic: "Here's to Forever",
    "art-deco": "Request the Pleasure of Your Company",
    default: "Together With Their Families",
  },
  hi: {
    classic: "शुभ विवाह",
    hindu: "शुभ विवाह",
    christian: "पवित्र विवाह",
    muslim: "निकाह समारोह",
    "south-indian": "कल्याणम्",
    modern: "हम विवाह कर रहे हैं",
    boho: "प्रेम का उत्सव",
    rustic: "सदा के लिए",
    "art-deco": "आपकी उपस्थिति का निमंत्रण",
    default: "शुभ विवाह",
  },
  gu: {
    classic: "શુભ લગ્ન",
    hindu: "શુભ લગ્ન",
    christian: "પવિત્ર વિવાહ",
    muslim: "નિકાહ સમારોહ",
    "south-indian": "કલ્યાણમ",
    modern: "અમે પરણીએ છીએ",
    boho: "પ્રેમનો ઉત્સવ",
    rustic: "સદા માટે",
    "art-deco": "આપની હાજરીનું આમંત્રણ",
    default: "શુભ લગ્ન",
  },
};

function headingFor(input: WordingInput): string {
  const style = input.style || "classic";
  const table = headings[input.language] || headings.en;
  return table[style] || table.default;
}

function hostFor(input: WordingInput): string {
  if (input.hostLine?.trim()) return input.hostLine.trim();
  const families = familiesLine(input);
  if (input.language === "hi") {
    if (input.style === "muslim") return "अल्लाह की रहमत से";
    if (input.style === "christian") return "भगवान और परिवार की उपस्थिति में";
    if (input.style === "hindu" || input.style === "south-indian") {
      return families ? `${families} की ओर से, परिवार के आशीर्वाद से` : "परिवार के आशीर्वाद से";
    }
    return families ? `${families} सपरिवार` : "सपरिवार";
  }
  if (input.language === "gu") {
    if (input.style === "muslim") return "અલ્લાહની રહેમતથી";
    if (input.style === "christian") return "ઈશ્વર અને પરિવારની હાજરીમાં";
    if (input.style === "hindu" || input.style === "south-indian") {
      return families ? `${families} તરફથી, કુટુંબના આશીર્વાદથી` : "કુટુંબના આશીર્વાદથી";
    }
    return families ? `${families} સપરિવાર` : "સપરિવાર";
  }
  if (input.style === "muslim") return "With the grace of Allah";
  if (input.style === "christian") return "In the presence of God and our families";
  if (input.style === "boho") return "Barefoot, under the open sky";
  if (families) return `Together with ${families}`;
  return "Together with their families";
}

function englishBody(input: WordingInput, names: string, when: string, where: string): string {
  const tone = input.tone || "warm";
  const style = input.style || "classic";
  if (style === "muslim") {
    return `By the grace of Allah, we request the honour of your presence at the Nikah of ${names}${when}${where}, and pray you will share in the blessings of this sacred union.`;
  }
  if (style === "christian") {
    return `With joyful hearts, ${names} invite you to witness their holy matrimony${when}${where}, and to celebrate afterwards the covenant they will make before God.`;
  }
  if (style === "hindu") {
    return `With the blessings of the divine and the love of our families, ${names} request the honour of your presence as they begin their new life together${when}${where}.`;
  }
  if (style === "south-indian") {
    return `With the blessings of the Almighty and our elders, we invite you to the kalyanam of ${names}${when}${where}, and to share in the music, feast, and festivities that follow.`;
  }
  if (tone === "formal" || style === "art-deco") {
    return `${names} request the pleasure of your company at the celebration of their marriage${when}${where}.`;
  }
  if (tone === "poetic" || style === "boho") {
    return `With full hearts and open arms, ${names} invite you to gather as they promise themselves to one another${when}${where}.`;
  }
  if (tone === "playful") {
    return `${names} are getting married, and it would not be a celebration without you. Please join them${when}${where}.`;
  }
  if (tone === "modern" || style === "modern") {
    return `${names} invite you to a joyful celebration of their marriage${when}${where}.`;
  }
  if (style === "rustic") {
    return `${names} warmly invite you to their wedding in the countryside${when}${where}, for good music, a long table, and the beginning of their life together.`;
  }
  return `With grateful hearts, ${names} invite you to share in the joy of their marriage${when}${where}.`;
}

function hindiBody(input: WordingInput, names: string, when: string, where: string): string {
  const style = input.style || "classic";
  if (style === "muslim") {
    return `अल्लाह की रहमत से, ${names} के निकाह समारोह में${when}${where} आपकी उपस्थिति का सादर निमंत्रण है। इस पावन बंधन की खुशियों में हमारे साथ शामिल हों।`;
  }
  if (style === "christian") {
    return `हर्षित हृदय से ${names} आपको अपने पवित्र विवाह संस्कार में${when}${where} साक्षी बनने और आनंद मनाने का निमंत्रण देते हैं।`;
  }
  if (style === "south-indian") {
    return `ईश्वर और परिवार के आशीर्वाद से, ${names} के कल्याणम् में${when}${where} आपकी पावन उपस्थिति का सादर आमंत्रण है।`;
  }
  return `सपरिवार ${names} अपने शुभ विवाह मुहूर्त पर${when}${where} आपकी पावन उपस्थिति का सादर निमंत्रण देते हैं। कृपया पधारकर आशीर्वाद प्रदान करें।`;
}

function gujaratiBody(input: WordingInput, names: string, when: string, where: string): string {
  const style = input.style || "classic";
  if (style === "muslim") {
    return `અલ્લાહની રહેમતથી, ${names}ના નિકાહ સમારોહમાં${when}${where} આપની હાજરીનું હાર્દિક આમંત્રણ છે. આ પાવન બંધનની ખુશીમાં અમારી સાથે જોડાઓ.`;
  }
  if (style === "christian") {
    return `આનંદિત હૃદયથી ${names} આપને પોતાના પવિત્ર વિવાહમાં${when}${where} સાક્ષી બનવા અને ઉજવણી કરવા આમંત્રણ આપે છે.`;
  }
  if (style === "south-indian") {
    return `ઈશ્વર અને કુટુંબના આશીર્વાદથી, ${names}ના કલ્યાણમમાં${when}${where} આપની પધારમણીની પ્રાર્થના છે.`;
  }
  return `સપરિવાર ${names} પોતાના શુભ લગ્ન મુહૂર્તે${when}${where} આપની પધારમણીની હાર્દિક પ્રાર્થના કરે છે. કૃપા કરીને પધારીને આશીર્વાદ આપશો.`;
}

export function generateFallbackWording(input: WordingInput): WordingResult {
  const language = input.language || "en";
  const names = joinNames(input.partnerA, input.partnerB, language);
  const date = formatDate(input.date, language);
  const time = formatTime(input.time, language);
  const venue = [input.venue, input.venueAddress].filter(Boolean).join(", ");

  let when = "";
  let where = "";
  if (language === "hi") {
    if (date && time) when = ` ${date} को ${time} वाजे`;
    else if (date) when = ` ${date} को`;
    if (venue) where = ` ${venue} में`;
  } else if (language === "gu") {
    if (date && time) when = ` ${date}ના રોજ ${time} વાગ્યે`;
    else if (date) when = ` ${date}ના રોજ`;
    if (venue) where = ` ${venue} ખાતે`;
  } else {
    if (date && time) when = ` on ${date} at ${time}`;
    else if (date) when = ` on ${date}`;
    else if (time) when = ` at ${time}`;
    if (venue) where = ` at ${venue}`;
  }

  const body =
    language === "hi"
      ? hindiBody(input, names, when, where)
      : language === "gu"
        ? gujaratiBody(input, names, when, where)
        : englishBody(input, names, when, where);

  return {
    heading: headingFor(input),
    wording: body,
    hostLine: hostFor(input),
    suggestedTemplate: suggestTemplateFromStyle(input.style),
    source: "fallback",
  };
}

export function applyWording(data: InviteData, result: WordingResult): InviteData {
  return {
    ...data,
    heading: result.heading,
    wording: result.wording,
    hostLine: result.hostLine,
    template: data.template || result.suggestedTemplate,
  };
}

export function buildGeneratePrompt(input: WordingInput): string {
  return [
    "Write wedding invitation wording for a printed card.",
    "Return only the structured fields requested.",
    `Language: ${input.language === "hi" ? "Hindi (Devanagari script)" : input.language === "gu" ? "Gujarati script" : "English"}.`,
    `Tone: ${input.tone || "warm"}.`,
    `Ceremony style: ${input.style || "classic"}.`,
    `Partner A: ${input.partnerA || "(to be named)"}.`,
    `Partner B: ${input.partnerB || "(to be named)"}.`,
    input.date ? `Date: ${formatDate(input.date, "en")}.` : "Date: not provided.",
    input.time ? `Time: ${formatTime(input.time, "en")}.` : "Time: not provided.",
    input.venue ? `Venue: ${input.venue}${input.venueAddress ? `, ${input.venueAddress}` : ""}.` : "Venue: not provided.",
    input.familyA ? `Family A: ${input.familyA}.` : "",
    input.familyB ? `Family B: ${input.familyB}.` : "",
    input.hostLine ? `Preferred host line: ${input.hostLine}.` : "",
    "Constraints:",
    "- heading: 2 to 6 words, culturally appropriate, no emoji.",
    "- hostLine: one short line naming families or blessings, no emoji.",
    "- wording: 1 to 3 elegant sentences, suitable for a formal invitation card. Include names and, if provided, date, time, and venue naturally. No hashtags, no quotation marks around the whole text, no sign-offs.",
    "- suggestedTemplate must be one of: classic-floral, royal-mandala, minimalist-modern, boho-watercolor, art-deco, rustic, church-elegant, nikah-elegant, south-indian-temple.",
    "Choose suggestedTemplate to match the ceremony style and tone.",
  ]
    .filter(Boolean)
    .join("\n");
}
