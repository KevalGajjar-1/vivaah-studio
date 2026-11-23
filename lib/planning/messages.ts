import { formatDate, formatTime, joinNames } from "@/lib/format";
import type { Language } from "@/lib/types";
import type { MessageStyle } from "./types";

export type MessageInput = {
  partnerA: string;
  partnerB: string;
  date?: string;
  time?: string;
  venue?: string;
  venueAddress?: string;
  eventTitle?: string;
  familyA?: string;
  familyB?: string;
  language: Language;
  style: MessageStyle;
};

export type GeneratedMessage = {
  title: string;
  text: string;
};

const STYLES: { id: MessageStyle; label: string; hint: string }[] = [
  { id: "formal", label: "Formal", hint: "Classic, polite wording for elders" },
  { id: "hinglish", label: "Hinglish fun", hint: "Warm, familiar, slightly playful" },
  { id: "shayari", label: "Shayari", hint: "A short poetic invitation" },
  { id: "traditional", label: "Traditional Hindi", hint: "Blessings-first, ceremonial tone" },
];

export const MESSAGE_STYLES = STYLES;

function names(input: MessageInput) {
  const a = input.partnerA.trim() || (input.language === "gu" ? "વર" : input.language === "hi" ? "वर" : "the couple");
  const b = input.partnerB.trim();
  return { a, b, pair: b ? joinNames(a, b, input.language) : a };
}

function whenWhere(input: MessageInput, language: Language) {
  const event = input.eventTitle?.trim();
  const date = formatDate(input.date, language);
  const time = formatTime(input.time, language);
  const place = [input.venue, input.venueAddress].filter(Boolean).join(", ");
  return { event, date, time, place };
}

function formalEn(input: MessageInput): GeneratedMessage[] {
  const { pair } = names(input);
  const { event, date, time, place } = whenWhere(input, "en");
  const occasion = event ? `the ${event}` : "the wedding celebrations";
  const when = [date, time].filter(Boolean).join(" at ");
  const where = place ? ` at ${place}` : "";
  return [
    {
      title: "Short invite",
      text: `You are warmly invited to ${occasion} of ${pair}${when ? `, on ${when}` : ""}${where}. We would be honoured by your presence. Please reply so we can save your seat.`,
    },
    {
      title: "With families",
      text: `${input.familyA && input.familyB ? `The families of ${input.familyA} and ${input.familyB}` : "Together with their families"} request the pleasure of your company at ${occasion} of ${pair}${when ? `, on ${when}` : ""}${where}. Your blessings mean the world to us.`,
    },
  ];
}

function formalHi(input: MessageInput): GeneratedMessage[] {
  const { pair } = names({ ...input, language: "hi" });
  const { event, date, time, place } = whenWhere(input, "hi");
  const occasion = event || "विवाह समारोह";
  const when = [date, time].filter(Boolean).join(", ");
  return [
    {
      title: "संक्षिप्त निमंत्रण",
      text: `सादर निमंत्रण। ${pair} के ${occasion}${when ? ` का शुभ अवसर ${when}` : ""} पर${place ? `, ${place} में` : ""} आपकी उपस्थिति का हार्दिक स्वागत है। कृपया अपनी उपस्थिति की पुष्टि करें।`,
    },
    {
      title: "परिवार की ओर से",
      text: `${input.familyA && input.familyB ? `${input.familyA} एवं ${input.familyB} परिवार` : "सपरिवार"} आप सभी को ${pair} के ${occasion} में सादर आमंत्रित करते हैं${when ? ` — ${when}` : ""}${place ? `, ${place}` : ""}। आपके आशीर्वाद की प्रतीक्षा रहेगी।`,
    },
  ];
}

function formalGu(input: MessageInput): GeneratedMessage[] {
  const { pair } = names({ ...input, language: "gu" });
  const { event, date, time, place } = whenWhere(input, "gu");
  const occasion = event || "લગ્ન સમારોહ";
  const when = [date, time].filter(Boolean).join(", ");
  return [
    {
      title: "ટૂંકું આમંત્રણ",
      text: `સાદર આમંત્રણ. ${pair}ના ${occasion}${when ? ` નિમિત્તે ${when}` : ""} પર${place ? `, ${place} ખાતે` : ""} આપની હાજરીનું હાર્દિક સ્વાગત છે. કૃપા કરીને જવાબ આપશો.`,
    },
    {
      title: "પરિવાર તરફથી",
      text: `${input.familyA && input.familyB ? `${input.familyA} અને ${input.familyB} પરિવાર` : "સપરિવાર"} આપને ${pair}ના ${occasion}માં આમંત્રે છે${when ? ` — ${when}` : ""}${place ? `, ${place}` : ""}. આપના આશીર્વાદની રાહ જોઈશું.`,
    },
  ];
}

function hinglishEn(input: MessageInput): GeneratedMessage[] {
  const { a, b, pair } = names(input);
  const { event, date, time, place } = whenWhere(input, "en");
  const occasion = event || "shaadi";
  const when = [date, time].filter(Boolean).join(", ");
  return [
    {
      title: "WhatsApp ready",
      text: `Namaste! ${b ? `${a} aur ${b}` : pair} ki ${occasion} hai${when ? ` on ${when}` : ""}${place ? ` at ${place}` : ""}. Aap zaroor aana — shaadi without you feel incomplete. RSVP kar dena, please.`,
    },
    {
      title: "Warm note",
      text: `Good news: ${pair} are getting married! ${occasion[0].toUpperCase() + occasion.slice(1)} ho rahi hai${when ? ` ${when}` : ""}${place ? `, ${place}` : ""}. Come, eat, dance, and shaadi-waali blessing de dena. Reply karke bata dena if you're coming.`,
    },
  ];
}

function hinglishHi(input: MessageInput): GeneratedMessage[] {
  const { a, b, pair } = names({ ...input, language: "hi" });
  const { event, date, time, place } = whenWhere(input, "hi");
  const occasion = event || "शादी";
  const when = [date, time].filter(Boolean).join(", ");
  return [
    {
      title: "व्हाट्सऐप संदेश",
      text: `नमस्ते! ${b ? `${a} और ${b}` : pair} की ${occasion} है${when ? ` — ${when}` : ""}${place ? `, ${place}` : ""}। आप ज़रूर आइए, आपके बिना मज़ा अधूरा रहेगा। हाँ या ना में जवाब दे दीजिए।`,
    },
    {
      title: "हल्का निमंत्रण",
      text: `${pair} की ${occasion} में आपका दिल से स्वागत है${when ? `, ${when}` : ""}${place ? ` पर ${place}` : ""}। खाना, नाचना और ढेर सारी दुआएँ — बस आप आ जाइए। RSVP कर देना।`,
    },
  ];
}

function hinglishGu(input: MessageInput): GeneratedMessage[] {
  const { a, b, pair } = names({ ...input, language: "gu" });
  const { event, date, time, place } = whenWhere(input, "gu");
  const occasion = event || "લગ્ન";
  const when = [date, time].filter(Boolean).join(", ");
  return [
    {
      title: "વોટ્સએપ સંદેશ",
      text: `નમસ્તે! ${b ? `${a} અને ${b}` : pair}ના ${occasion} છે${when ? ` — ${when}` : ""}${place ? `, ${place}` : ""}. તમે ચોક્કસ આવજો, તમારા વગર મજા અધૂરી. હા કે ના વાળો જવાબ આપજો.`,
    },
    {
      title: "હળવું આમંત્રણ",
      text: `${pair}ના ${occasion}માં તમારું દિલથી સ્વાગત છે${when ? `, ${when}` : ""}${place ? ` પર ${place}` : ""}. ખાવું, નાચવું અને ઢગલા આશીર્વાદ — બસ તમે આવી જજો.`,
    },
  ];
}

function shayariEn(input: MessageInput): GeneratedMessage[] {
  const { pair } = names(input);
  const { event, date, time, place } = whenWhere(input, "en");
  const when = [date, time].filter(Boolean).join(", ");
  return [
    {
      title: "Poetic invite",
      text: `Two hearts, one promise, a lifetime to begin — ${pair} request your blessings at ${event || "their wedding"}${when ? `, ${when}` : ""}${place ? `, ${place}` : ""}. Come, and let the evening fill with light.`,
    },
    {
      title: "Short verse",
      text: `Where marigold meets moonlight, ${pair} begin forever. Join us${when ? ` on ${when}` : ""}${place ? ` at ${place}` : ""} and leave your blessings in the air.`,
    },
  ];
}

function shayariHi(input: MessageInput): GeneratedMessage[] {
  const { pair } = names({ ...input, language: "hi" });
  const { event, date, time, place } = whenWhere(input, "hi");
  const when = [date, time].filter(Boolean).join(", ");
  return [
    {
      title: "शायरी निमंत्रण",
      text: `दो दिल, एक वादा, और एक नई सुबह — ${pair} के ${event || "विवाह"} में आपके आशीष की चाह${when ? `, ${when}` : ""}${place ? `, ${place}` : ""}। आइए, इस शाम को रोशन कर दीजिए।`,
    },
    {
      title: "छोटा शेर",
      text: `गेंदे की खुशबू, दीयों की लौ, और ${pair} का बंधन। आइए${when ? ` ${when}` : ""}${place ? `, ${place}` : ""} — बस आपके आशीर्वाद चाहिए।`,
    },
  ];
}

function shayariGu(input: MessageInput): GeneratedMessage[] {
  const { pair } = names({ ...input, language: "gu" });
  const { event, date, time, place } = whenWhere(input, "gu");
  const when = [date, time].filter(Boolean).join(", ");
  return [
    {
      title: "કાવ્ય આમંત્રણ",
      text: `બે હૃદય, એક વચન, અને નવી સવાર — ${pair}ના ${event || "લગ્ન"}માં આપના આશીર્વાદની ઈચ્છા${when ? `, ${when}` : ""}${place ? `, ${place}` : ""}. આવો, આ સાંજને ઉજાસથી ભરી દો.`,
    },
    {
      title: "નાની પંક્તિ",
      text: `ગલગોટાની સુગંધ, દીવાની જ્યોત અને ${pair}નું બંધન. આવો${when ? ` ${when}` : ""}${place ? `, ${place}` : ""} — ફક્ત આપના આશીર્વાદ જોઈએ.`,
    },
  ];
}

function traditionalEn(input: MessageInput): GeneratedMessage[] {
  const { pair } = names(input);
  const { event, date, time, place } = whenWhere(input, "en");
  const when = [date, time].filter(Boolean).join(", ");
  return [
    {
      title: "Blessings first",
      text: `With the blessings of our elders and the grace of the divine, we invite you to the ${event || "Shubh Vivah"} of ${pair}${when ? `, on ${when}` : ""}${place ? `, at ${place}` : ""}. Your presence will complete the ceremony.`,
    },
    {
      title: "Family invitation",
      text: `${input.familyA && input.familyB ? `${input.familyA} and ${input.familyB}` : "Our families"} joyfully invite you to seek blessings at the ${event || "wedding rites"} of ${pair}${when ? ` on ${when}` : ""}${place ? ` at ${place}` : ""}. Please honour us with your presence.`,
    },
  ];
}

function traditionalHi(input: MessageInput): GeneratedMessage[] {
  const { pair } = names({ ...input, language: "hi" });
  const { event, date, time, place } = whenWhere(input, "hi");
  const when = [date, time].filter(Boolean).join(", ");
  return [
    {
      title: "परंपरागत निमंत्रण",
      text: `परमेश्वर की कृपा एवं बड़ों के आशीर्वाद से ${pair} का ${event || "शुभ विवाह"}${when ? ` ${when}` : ""} को${place ? `, ${place} में` : ""} आयोजित है। आपकी पावन उपस्थिति एवं आशीर्वाद सादर अपेक्षित हैं।`,
    },
    {
      title: "परिवार निमंत्रण",
      text: `${input.familyA && input.familyB ? `${input.familyA} तथा ${input.familyB} परिवार` : "सपरिवार"} सादर निवेदन करते हैं कि ${pair} के ${event || "विवाह संस्कार"} में पधारें${when ? ` — ${when}` : ""}${place ? `, ${place}` : ""} और हमें आशीर्वाद दें।`,
    },
  ];
}

function traditionalGu(input: MessageInput): GeneratedMessage[] {
  const { pair } = names({ ...input, language: "gu" });
  const { event, date, time, place } = whenWhere(input, "gu");
  const when = [date, time].filter(Boolean).join(", ");
  return [
    {
      title: "પરંપરાગત આમંત્રણ",
      text: `ઈશ્વરની કૃપા અને વડીલોના આશીર્વાદથી ${pair}ના ${event || "શુભ લગ્ન"}${when ? ` ${when}` : ""}ના રોજ${place ? `, ${place} ખાતે` : ""} યોજાશે. આપની પવિત્ર ઉપસ્થિતિ અને આશીર્વાદ સાદર અપેક્ષિત છે.`,
    },
    {
      title: "પરિવાર આમંત્રણ",
      text: `${input.familyA && input.familyB ? `${input.familyA} અને ${input.familyB} પરિવાર` : "સપરિવાર"} વિનંતી કરે છે કે ${pair}ના ${event || "લગ્ન સંસ્કાર"}માં પધારો${when ? ` — ${when}` : ""}${place ? `, ${place}` : ""} અને આશીર્વાદ આપો.`,
    },
  ];
}

const TABLE: Record<MessageStyle, Record<Language, (input: MessageInput) => GeneratedMessage[]>> = {
  formal: { en: formalEn, hi: formalHi, gu: formalGu },
  hinglish: { en: hinglishEn, hi: hinglishHi, gu: hinglishGu },
  shayari: { en: shayariEn, hi: shayariHi, gu: shayariGu },
  traditional: { en: traditionalEn, hi: traditionalHi, gu: traditionalGu },
};

export function generateMessages(input: MessageInput): GeneratedMessage[] {
  const lang: Language = input.language === "hi" || input.language === "gu" ? input.language : "en";
  const style: MessageStyle = TABLE[input.style] ? input.style : "formal";
  return TABLE[style][lang]({ ...input, language: lang, style });
}
