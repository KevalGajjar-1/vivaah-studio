import { formatDate, formatTime } from "@/lib/format";

export type VideoExportOptions = {
  videoUrl: string;
  fields: Record<string, string>;
  overlay?: string;
  watermark?: boolean;
  duration?: number;
  width?: number;
  height?: number;
};

function pickMime(): { mime: string; ext: "mp4" | "webm" } {
  if (typeof MediaRecorder === "undefined") throw new Error("Video export is not supported in this browser.");
  const mp4s = ["video/mp4;codecs=avc1.42E01E", "video/mp4;codecs=avc1", "video/mp4"];
  for (const mime of mp4s) {
    if (MediaRecorder.isTypeSupported(mime)) return { mime, ext: "mp4" };
  }
  const webms = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"];
  for (const mime of webms) {
    if (MediaRecorder.isTypeSupported(mime)) return { mime, ext: "webm" };
  }
  return { mime: "", ext: "webm" };
}

function loadVideo(src: string) {
  return new Promise<HTMLVideoElement>((resolve, reject) => {
    const video = document.createElement("video");
    video.src = src;
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";
    video.preload = "auto";
    video.onloadeddata = () => resolve(video);
    video.onerror = () => reject(new Error("Could not load the background video."));
  });
}

function drawCover(ctx: CanvasRenderingContext2D, video: HTMLVideoElement, width: number, height: number) {
  const vw = video.videoWidth || width;
  const vh = video.videoHeight || height;
  const scale = Math.max(width / vw, height / vh);
  const dw = vw * scale;
  const dh = vh * scale;
  ctx.drawImage(video, (width - dw) / 2, (height - dh) / 2, dw, dh);
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawText(
  ctx: CanvasRenderingContext2D,
  fields: Record<string, string>,
  width: number,
  height: number,
  watermark?: boolean,
) {
  const heading = (fields.heading || "").trim();
  const host = (fields.hostLine || "").trim();
  const a = (fields.partnerA || "Your Name").trim();
  const b = (fields.partnerB || "Their Name").trim();
  const wording = (fields.wording || "").trim();
  const date = formatDate(fields.date, "en");
  const time = formatTime(fields.time, "en");
  const venue = [fields.venue, fields.venueAddress].filter(Boolean).join(" · ");

  ctx.textAlign = "center";
  ctx.fillStyle = "#f7f1e8";

  let y = height * 0.14;
  if (host) {
    ctx.font = `italic ${Math.round(width * 0.032)}px "Cormorant Garamond", serif`;
    ctx.globalAlpha = 0.9;
    ctx.fillText(host, width / 2, y);
    y += width * 0.05;
  }
  if (heading) {
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#e8c872";
    ctx.font = `${Math.round(width * 0.028)}px Cinzel, serif`;
    (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = "4px";
    ctx.fillText(heading.toUpperCase(), width / 2, y);
  }

  (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = "0px";
  ctx.fillStyle = "#f7f1e8";
  ctx.font = `${Math.round(width * 0.11)}px "Great Vibes", "Playfair Display", cursive`;
  const nameY = height * 0.42;
  ctx.fillText(a, width / 2, nameY);
  ctx.fillStyle = "#e8c872";
  ctx.font = `italic ${Math.round(width * 0.06)}px "Cormorant Garamond", serif`;
  ctx.fillText("&", width / 2, nameY + width * 0.08);
  ctx.fillStyle = "#f7f1e8";
  ctx.font = `${Math.round(width * 0.11)}px "Great Vibes", "Playfair Display", cursive`;
  ctx.fillText(b, width / 2, nameY + width * 0.2);

  ctx.font = `italic ${Math.round(width * 0.032)}px "Cormorant Garamond", serif`;
  ctx.fillStyle = "#f7f1e8";
  let bottom = height * 0.74;
  if (wording) {
    const lines = wrapText(ctx, wording, width * 0.78);
    for (const line of lines.slice(0, 5)) {
      ctx.fillText(line, width / 2, bottom);
      bottom += width * 0.042;
    }
  }
  ctx.fillStyle = "#e8c872";
  ctx.font = `${Math.round(width * 0.028)}px Cinzel, serif`;
  if (date) {
    ctx.fillText(date.toUpperCase(), width / 2, bottom + width * 0.02);
    bottom += width * 0.045;
  }
  ctx.fillStyle = "#f7f1e8";
  if (time) {
    ctx.fillText(time, width / 2, bottom);
    bottom += width * 0.04;
  }
  if (venue) {
    ctx.fillText(venue, width / 2, bottom);
  }

  if (watermark) {
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(-Math.PI / 6);
    ctx.font = `600 ${Math.round(width * 0.07)}px Outfit, sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = "6px";
    for (let i = -4; i <= 4; i += 1) {
      ctx.fillText("VIVAAH PREVIEW", 0, i * width * 0.22);
    }
    ctx.restore();
  }
}

export async function exportVideoInvitation(opts: VideoExportOptions): Promise<{ blob: Blob; ext: "mp4" | "webm"; mime: string }> {
  await document.fonts.ready;
  const width = opts.width ?? 720;
  const height = opts.height ?? 1280;
  const duration = opts.duration ?? 8;
  const video = await loadVideo(opts.videoUrl);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not open a drawing canvas.");

  const { mime, ext } = pickMime();
  const stream = canvas.captureStream(30);
  const recorder = mime
    ? new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 5_000_000 })
    : new MediaRecorder(stream, { videoBitsPerSecond: 5_000_000 });
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (event) => {
    if (event.data.size) chunks.push(event.data);
  };
  const finished = new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: recorder.mimeType || mime || "video/webm" }));
    recorder.onerror = () => reject(new Error("Video recording failed."));
  });

  video.currentTime = 0;
  await video.play();
  recorder.start(200);

  const started = performance.now();
  await new Promise<void>((resolve) => {
    const tick = () => {
      drawCover(ctx, video, width, height);
      ctx.fillStyle = opts.overlay || "rgba(0,0,0,0.45)";
      ctx.fillRect(0, 0, width, height);
      drawText(ctx, opts.fields, width, height, opts.watermark);
      const elapsed = (performance.now() - started) / 1000;
      if (elapsed >= duration || video.ended) {
        resolve();
        return;
      }
      requestAnimationFrame(tick);
    };
    tick();
  });

  video.pause();
  if (recorder.state !== "inactive") recorder.stop();
  const blob = await finished;
  return { blob, ext, mime: blob.type };
}

export function downloadBlob(blob: Blob, filename: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
