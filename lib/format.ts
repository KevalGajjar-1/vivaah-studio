import type { Language } from "./types";

const locales: Record<Language, string> = {
  en: "en-IN",
  hi: "hi-IN",
  gu: "gu-IN",
};

export function parseDate(value?: string): Date | null {
  if (!value) return null;
  const iso = value.length <= 10 ? `${value}T00:00:00` : value;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value?: string, language: Language = "en"): string {
  const date = parseDate(value);
  if (!date) return value || "";
  return date.toLocaleDateString(locales[language], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateShort(value?: string, language: Language = "en"): string {
  const date = parseDate(value);
  if (!date) return value || "";
  return date.toLocaleDateString(locales[language], {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(value?: string, language: Language = "en"): string {
  if (!value) return "";
  const match = value.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return value;
  const hours = Number(match[1]);
  const minutes = match[2];
  const date = new Date();
  date.setHours(hours, Number(minutes), 0, 0);
  return date.toLocaleTimeString(locales[language], {
    hour: "numeric",
    minute: minutes === "00" ? undefined : "2-digit",
  });
}

export function monogram(partnerA?: string, partnerB?: string): string {
  const a = (partnerA || "A").trim().charAt(0).toUpperCase() || "A";
  const b = (partnerB || "B").trim().charAt(0).toUpperCase() || "B";
  return `${a}${b}`;
}

export function joinNames(partnerA?: string, partnerB?: string, language: Language = "en"): string {
  const a = (partnerA || "").trim() || (language === "en" ? "Beloved" : "वर");
  const b = (partnerB || "").trim() || (language === "en" ? "Beloved" : "वधू");
  if (language === "hi") return `${a} एवं ${b}`;
  if (language === "gu") return `${a} અને ${b}`;
  return `${a} & ${b}`;
}
