import {
  Amiri,
  Cinzel,
  Cormorant_Garamond,
  Great_Vibes,
  Italiana,
  Josefin_Sans,
  Libre_Baskerville,
  Noto_Sans_Devanagari,
  Noto_Sans_Gujarati,
  Outfit,
  Playfair_Display,
  Poiret_One,
  Sacramento,
  Yeseva_One,
} from "next/font/google";

export const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
  display: "swap",
});

export const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const poiret = Poiret_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-poiret",
  display: "swap",
});

export const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-josefin",
  display: "swap",
});

export const baskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-baskerville",
  display: "swap",
});

export const sacramento = Sacramento({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sacramento",
  display: "swap",
});

export const amiri = Amiri({
  subsets: ["latin", "arabic"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-amiri",
  display: "swap",
});

export const yeseva = Yeseva_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-yeseva",
  display: "swap",
});

export const italiana = Italiana({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-italiana",
  display: "swap",
});

export const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-devanagari",
  display: "swap",
});

export const notoGujarati = Noto_Sans_Gujarati({
  subsets: ["gujarati"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-gujarati",
  display: "swap",
});

export const fontVariables = [
  outfit.variable,
  cormorant.variable,
  greatVibes.variable,
  cinzel.variable,
  playfair.variable,
  poiret.variable,
  josefin.variable,
  baskerville.variable,
  sacramento.variable,
  amiri.variable,
  yeseva.variable,
  italiana.variable,
  notoDevanagari.variable,
  notoGujarati.variable,
].join(" ");
