// Document-scan style enhancement (runs fully in the browser, no dependencies).
export type ScanMode = "original" | "color" | "gray" | "bw";

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image failed to load"));
    img.src = src;
  });

const CARD_RATIO = 85.6 / 54; // standard ID-1 card (Aadhaar PVC size)

/**
 * Finds the card / document inside a photo (removes table, hand, floor around it).
 * Returns a crop box in original image pixels, or null when nothing reliable is found.
 */
export function detectDocumentBox(img: HTMLImageElement): { x: number; y: number; w: number; h: number } | null {
  const scale = Math.min(1, 240 / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(8, Math.round(img.naturalWidth * scale));
  const h = Math.max(8, Math.round(img.naturalHeight * scale));
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0, w, h);
  const d = ctx.getImageData(0, 0, w, h).data;

  // Background colour = average of a thin ring around the photo
  const ring = Math.max(2, Math.round(Math.min(w, h) * 0.04));
  let r = 0, g = 0, b = 0, n = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (x < ring || y < ring || x >= w - ring || y >= h - ring) {
        const i = (y * w + x) * 4;
        r += d[i]; g += d[i + 1]; b += d[i + 2]; n++;
      }
    }
  }
  r /= n; g /= n; b /= n;

  // Noise of the background (textured table, shadows): decides how strict the cut is
  let noise = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (x < ring || y < ring || x >= w - ring || y >= h - ring) {
        const i = (y * w + x) * 4;
        noise += Math.abs(d[i] - r) + Math.abs(d[i + 1] - g) + Math.abs(d[i + 2] - b);
      }
    }
  }
  noise /= n;
  const threshold = Math.min(150, Math.max(48, noise * 2.6));

  const rows = new Uint16Array(h);
  const cols = new Uint16Array(w);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const diff = Math.abs(d[i] - r) + Math.abs(d[i + 1] - g) + Math.abs(d[i + 2] - b);
      if (diff > threshold) {
        rows[y]++;
        cols[x]++;
      }
    }
  }

  const rowMin = w * 0.15;
  const colMin = h * 0.15;
  let top = 0, bottom = h - 1, left = 0, right = w - 1;
  while (top < h && rows[top] < rowMin) top++;
  while (bottom > top && rows[bottom] < rowMin) bottom--;
  while (left < w && cols[left] < colMin) left++;
  while (right > left && cols[right] < colMin) right--;
  if (top >= bottom || left >= right) return null;

  const bw = right - left + 1;
  const bh = bottom - top + 1;
  const frac = (bw * bh) / (w * h);
  const ratio = bw / bh;
  const nearlyLandscape = ratio > 0.45 && ratio < 2.3;
  if (frac < 0.12 || frac > 0.97 || !nearlyLandscape) return null;

  const padX = bw * 0.012;
  const padY = bh * 0.012;
  const x0 = Math.max(0, left - padX) / scale;
  const y0 = Math.max(0, top - padY) / scale;
  const x1 = Math.min(w, right + 1 + padX) / scale;
  const y1 = Math.min(h, bottom + 1 + padY) / scale;
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

/**
 * Cleans a photo so it looks like a scanned document:
 * removes shadows / uneven lighting, whitens the paper and boosts text contrast.
 * Optionally centre-crops card-shaped photos to the standard card ratio (never rotates).
 */
export async function enhanceScan(
  src: string,
  mode: ScanMode,
  opts: { cardFit?: boolean } = {}
): Promise<string> {
  if (mode === "original" && !opts.cardFit) return src;

  const img = await loadImage(src);
  const source: CanvasImageSource = img;
  let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
  let isCard = false;

  if (opts.cardFit) {
    // 1) Find the card in the photo and crop away the background
    const box = detectDocumentBox(img);
    if (box) {
      sx = box.x;
      sy = box.y;
      sw = box.w;
      sh = box.h;
    }
    // 2) Never rotate. Only landscape card-shaped photos are centre-cropped to the card ratio;
    //    portrait pages / forms keep their own shape and orientation.
    const r = sw / sh;
    isCard = r > 1.2 && r < 2.0;
    if (isCard) {
      if (r > CARD_RATIO) {
        const nw = sh * CARD_RATIO;
        sx += (sw - nw) / 2;
        sw = nw;
      } else {
        const nh = sw / CARD_RATIO;
        sy += (sh - nh) / 2;
        sh = nh;
      }
    }
  }

  const scale = Math.min(1, 1600 / Math.max(sw, sh));
  const w = Math.max(1, Math.round(sw * scale));
  // Card-shaped photos come out at exactly the card ratio (85.6 x 54); anything else keeps its own ratio
  const h = isCard ? Math.max(1, Math.round(w / CARD_RATIO)) : Math.max(1, Math.round(sh * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return src;
  ctx.drawImage(source, sx, sy, sw, sh, 0, 0, w, h);

  if (mode === "original") return canvas.toDataURL("image/jpeg", 0.92);

  // 1) Estimate the lighting/paper colour on a small grid (3x3 max filter keeps text out of it)
  const gw = Math.max(8, Math.round(w / 24));
  const gh = Math.max(8, Math.round(h / 24));
  const small = document.createElement("canvas");
  small.width = gw;
  small.height = gh;
  const sctx = small.getContext("2d", { willReadFrequently: true });
  if (!sctx) return canvas.toDataURL("image/jpeg", 0.92);
  sctx.drawImage(canvas, 0, 0, gw, gh);
  const sd = sctx.getImageData(0, 0, gw, gh).data;
  const bg = new Float32Array(gw * gh * 3);
  for (let y = 0; y < gh; y++) {
    for (let x = 0; x < gw; x++) {
      for (let c = 0; c < 3; c++) {
        let m = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const yy = Math.min(gh - 1, Math.max(0, y + dy));
            const xx = Math.min(gw - 1, Math.max(0, x + dx));
            m = Math.max(m, sd[(yy * gw + xx) * 4 + c]);
          }
        }
        bg[(y * gw + x) * 3 + c] = m;
      }
    }
  }

  const sample = (fx: number, fy: number, c: number) => {
    const x = Math.min(gw - 1.001, Math.max(0, fx));
    const y = Math.min(gh - 1.001, Math.max(0, fy));
    const x0 = Math.floor(x), y0 = Math.floor(y);
    const tx = x - x0, ty = y - y0;
    const a = bg[(y0 * gw + x0) * 3 + c];
    const b = bg[(y0 * gw + x0 + 1) * 3 + c];
    const d = bg[((y0 + 1) * gw + x0) * 3 + c];
    const e = bg[((y0 + 1) * gw + x0 + 1) * 3 + c];
    return (a * (1 - tx) + b * tx) * (1 - ty) + (d * (1 - tx) + e * tx) * ty;
  };

  // 2) Normalise each pixel by the local paper colour, then add contrast
  const image = ctx.getImageData(0, 0, w, h);
  const d = image.data;
  const contrast = (v: number) =>
    Math.max(0, Math.min(255, ((v / 255 - 0.5) * 1.3 + 0.5) * 255));

  for (let y = 0; y < h; y++) {
    const fy = (y / h) * gh - 0.5;
    for (let x = 0; x < w; x++) {
      const fx = (x / w) * gw - 0.5;
      const i = (y * w + x) * 4;
      const n: number[] = [0, 0, 0];
      for (let c = 0; c < 3; c++) {
        const b = Math.max(70, sample(fx, fy, c));
        n[c] = Math.min(255, (d[i + c] * 255) / b);
      }
      if (mode === "color") {
        d[i] = contrast(n[0]);
        d[i + 1] = contrast(n[1]);
        d[i + 2] = contrast(n[2]);
      } else {
        const l = 0.299 * n[0] + 0.587 * n[1] + 0.114 * n[2];
        const v = mode === "bw" ? (l < 165 ? 0 : 255) : contrast(l);
        d[i] = d[i + 1] = d[i + 2] = v;
      }
    }
  }
  ctx.putImageData(image, 0, 0);
  return canvas.toDataURL("image/jpeg", 0.92);
}

/** Rotates an image by a multiple of 90 degrees (clockwise) and returns a JPEG data URL. */
export async function rotateImage(src: string, deg: 90 | 180 | 270): Promise<string> {
  const img = await loadImage(src);
  const swap = deg !== 180;
  const c = document.createElement("canvas");
  c.width = swap ? img.naturalHeight : img.naturalWidth;
  c.height = swap ? img.naturalWidth : img.naturalHeight;
  const ctx = c.getContext("2d");
  if (!ctx) return src;
  ctx.translate(c.width / 2, c.height / 2);
  ctx.rotate((deg * Math.PI) / 180);
  ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
  return c.toDataURL("image/jpeg", 0.95);
}

/** Cuts the background away around a page / card. Returns null when no clear edges are found. */
export async function autoCutImage(src: string): Promise<string | null> {
  const img = await loadImage(src);
  const box = detectDocumentBox(img);
  if (!box) return null;
  const c = document.createElement("canvas");
  c.width = Math.round(box.w);
  c.height = Math.round(box.h);
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(img, box.x, box.y, box.w, box.h, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.95);
}
