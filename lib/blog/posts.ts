export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  paragraphs: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "wording-a-gujarati-wedding-invitation",
    title: "How to word a Gujarati wedding invitation",
    description:
      "A practical guide to Gujarati, Hindi and English invitation wording, host lines, and what to include for Haldi, Mehendi, Sangeet, the wedding and the reception.",
    date: "2026-11-23",
    paragraphs: [
      "A Gujarati invitation usually opens with a blessing, names the two families, and then gives the couple’s names, the date and the venue. You can write the card in Gujarati, keep a second version in English for friends who read Latin script, or mix a Gujarati heading with English details.",
      "Start with the host line. If both families are hosting, say so clearly: “Sharma Parivar and Mehta Parivar request the pleasure of your company.” For a more traditional tone, open with a short invocation — “With the blessings of our elders” — and then name the families. Keep this to one line on a printed card; longer blessings belong in a WhatsApp message or on the wedding website.",
      "The body of the card should be two or three sentences, not a schedule. Mention the couple, the ceremony (Lagno, Shubh Vivah, or simply the wedding), the date, the time and the venue. If you are hosting several functions, list Haldi, Mehendi, Sangeet, the wedding and the reception on the website or on a second page, each with its own time and address.",
      "Gujarati script looks best in a dedicated Gujarati typeface. If you are designing in Vivaah, switch the language to Gujarati and the card will use a Gujarati font for the wording. Avoid typing Gujarati into a Latin-only template, and never leave the date in two calendars unless you have checked both.",
      "When you send the same news on WhatsApp, shorten it. Elders often prefer a formal or traditional register; cousins may prefer Hinglish. The free message writer on Vivaah drafts both, and you can copy the one that fits each group.",
    ],
  },
  {
    slug: "planning-haldi-mehendi-sangeet",
    title: "Planning your Haldi, Mehendi and Sangeet schedule",
    description:
      "How to space Indian pre-wedding functions, what guests need to know, and how to keep a honest headcount for every event.",
    date: "2026-11-23",
    paragraphs: [
      "Most Indian weddings are not one evening. They are a short festival: Haldi, Mehendi, Sangeet, the wedding, and often a reception the next night. The schedule only works if each function has a date, a start time, a venue and a realistic headcount.",
      "Keep travel in mind. If outstation guests arrive on Thursday evening, Haldi on Friday morning and Mehendi the same afternoon can be gentle; a Sangeet that same night is common, but only if the venues are close. Publish the full list on your wedding website so nobody has to ask the bride what time to arrive.",
      "Each function needs its own list. A Mehendi of 80 and a reception of 400 should not share a single RSVP. Ask guests to reply per event, and count party size, not just names. That is the number the florist, the caterer and the transport desk can actually use.",
      "Share practical notes with the invitation: dress colour if you have one, whether children are invited, and a map link. A short line on the website — “Haldi is a close family gathering; the reception is open to all guests” — prevents awkward conversations later.",
      "Once RSVPs start coming in, look at the pending column every few days. A wedding website form is enough for phase one. WhatsApp reminders, sent from your own number, can follow later without changing the list you already keep.",
    ],
  },
  {
    slug: "what-to-include-on-an-indian-wedding-website",
    title: "What to include on an Indian wedding website",
    description:
      "The essential sections for a wedding website your family can open on a phone: story, schedule, maps, countdown and RSVP.",
    date: "2026-11-23",
    paragraphs: [
      "A wedding website is not a second invitation. It is the page guests open from a chat when they need the time, the map, or a way to reply. If your nani can find the sangeet venue in two taps, the page is doing its job.",
      "Lead with the names, the date and a countdown. Then tell a short story — how you met, or a welcome from both families — in the language your guests actually read. Keep it to a few paragraphs. The invitation wording can live on the card; the website should feel like a host at the door.",
      "The schedule is the heart of an Indian wedding page. List every function, not only the pheras. Add the address and a map link to each one, plus a note about dress or timing if it matters. Guests should not have to scroll through photos to learn when Haldi begins.",
      "Put the RSVP near the end, but do not hide it. Ask for a name, a phone number, the family side, the number of people, and a yes, no or maybe for each function. Those replies should land in the same guest list you already keep, so the headcount stays honest.",
      "You can add travel notes, a blessing from the elders, or a song later. Skip a public photo gallery if you would rather keep pictures in a private album. Launch with the essentials, share one link, and update the schedule if a time changes — the page should always be more current than the printed card.",
    ],
  },
];

export function getPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
