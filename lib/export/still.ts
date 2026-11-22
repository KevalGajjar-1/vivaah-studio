import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

export async function captureCard(card: HTMLElement) {
  await document.fonts.ready;
  return toPng(card, {
    pixelRatio: 3,
    cacheBust: true,
    backgroundColor: "#ffffff",
  });
}

export async function downloadPng(card: HTMLElement, filename: string) {
  const href = await captureCard(card);
  const a = document.createElement("a");
  a.href = href;
  a.download = filename.endsWith(".png") ? filename : `${filename}.png`;
  a.click();
}

export async function downloadPdf(card: HTMLElement, filename: string, size: [number, number] = [5, 7]) {
  const href = await captureCard(card);
  const pdf = new jsPDF({ orientation: "portrait", unit: "in", format: size });
  pdf.addImage(href, "PNG", 0, 0, size[0], size[1]);
  pdf.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
}
