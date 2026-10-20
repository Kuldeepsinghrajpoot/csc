// Tiny dependency-free PDF and ZIP writers (run in the browser).

const enc = new TextEncoder();

const concat = (parts: Uint8Array[]): Uint8Array => {
  const total = parts.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(total);
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
};

export type PdfPage = {
  jpeg: Uint8Array; // JPEG bytes
  w: number; // image pixel size
  h: number;
  pw: number; // page size in points
  ph: number;
  x: number; // image placement in points (origin bottom-left)
  y: number;
  dw: number;
  dh: number;
};

const num = (n: number) => String(Math.round(n * 100) / 100);

/** One JPEG per page, written as a plain PDF 1.4 file. */
export function buildPdf(pages: PdfPage[]): Uint8Array {
  const chunks: Uint8Array[] = [];
  const offsets: number[] = [];
  let pos = 0;
  const push = (b: Uint8Array | string) => {
    const bytes = typeof b === "string" ? enc.encode(b) : b;
    chunks.push(bytes);
    pos += bytes.length;
  };
  const beginObj = (id: number) => {
    offsets[id] = pos;
    push(`${id} 0 obj\n`);
  };

  push("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");

  beginObj(1);
  push("<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");

  const kids = pages.map((_, i) => `${3 + i * 3} 0 R`).join(" ");
  beginObj(2);
  push(`<< /Type /Pages /Kids [${kids}] /Count ${pages.length} >>\nendobj\n`);

  pages.forEach((p, i) => {
    const pageId = 3 + i * 3;
    const contentId = pageId + 1;
    const imageId = pageId + 2;

    beginObj(pageId);
    push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${num(p.pw)} ${num(p.ph)}] ` +
        `/Resources << /XObject << /Im0 ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>\nendobj\n`
    );

    const content = `q ${num(p.dw)} 0 0 ${num(p.dh)} ${num(p.x)} ${num(p.y)} cm /Im0 Do Q`;
    beginObj(contentId);
    push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`);

    beginObj(imageId);
    push(
      `<< /Type /XObject /Subtype /Image /Width ${p.w} /Height ${p.h} /ColorSpace /DeviceRGB ` +
        `/BitsPerComponent 8 /Filter /DCTDecode /Length ${p.jpeg.length} >>\nstream\n`
    );
    push(p.jpeg);
    push("\nendstream\nendobj\n");
  });

  const xrefPos = pos;
  const count = 3 + pages.length * 3;
  let xref = `xref\n0 ${count}\n0000000000 65535 f \n`;
  for (let id = 1; id < count; id++) xref += `${String(offsets[id]).padStart(10, "0")} 00000 n \n`;
  push(xref);
  push(`trailer\n<< /Size ${count} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF\n`);

  return concat(chunks);
}

// ---------- ZIP (store only, no compression: JPEGs are already compressed) ----------
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

const crc32 = (data: Uint8Array) => {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i++) c = crcTable[(c ^ data[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

export function buildZip(files: { name: string; data: Uint8Array }[]): Uint8Array {
  const now = new Date();
  const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
  const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();

  const locals: Uint8Array[] = [];
  const centrals: Uint8Array[] = [];
  let offset = 0;

  for (const f of files) {
    const name = enc.encode(f.name);
    const crc = crc32(f.data);

    const lh = new DataView(new ArrayBuffer(30));
    lh.setUint32(0, 0x04034b50, true);
    lh.setUint16(4, 20, true);
    lh.setUint16(6, 0x0800, true); // UTF-8 names
    lh.setUint16(8, 0, true); // stored
    lh.setUint16(10, dosTime, true);
    lh.setUint16(12, dosDate, true);
    lh.setUint32(14, crc, true);
    lh.setUint32(18, f.data.length, true);
    lh.setUint32(22, f.data.length, true);
    lh.setUint16(26, name.length, true);
    lh.setUint16(28, 0, true);
    const local = concat([new Uint8Array(lh.buffer), name, f.data]);
    locals.push(local);

    const ch = new DataView(new ArrayBuffer(46));
    ch.setUint32(0, 0x02014b50, true);
    ch.setUint16(4, 20, true);
    ch.setUint16(6, 20, true);
    ch.setUint16(8, 0x0800, true);
    ch.setUint16(10, 0, true);
    ch.setUint16(12, dosTime, true);
    ch.setUint16(14, dosDate, true);
    ch.setUint32(16, crc, true);
    ch.setUint32(20, f.data.length, true);
    ch.setUint32(24, f.data.length, true);
    ch.setUint16(28, name.length, true);
    ch.setUint32(42, offset, true);
    centrals.push(concat([new Uint8Array(ch.buffer), name]));

    offset += local.length;
  }

  const centralBytes = concat(centrals);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, files.length, true);
  end.setUint16(10, files.length, true);
  end.setUint32(12, centralBytes.length, true);
  end.setUint32(16, offset, true);

  return concat([...locals, centralBytes, new Uint8Array(end.buffer)]);
}
