"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    Download,
    FileText,
    ImageIcon,
    Images,
    Plus,
    RefreshCw,
    RotateCw,
    Scissors,
    Sparkles,
    Trash2,
    Upload,
    Undo2,
    GalleryVertical,
} from "lucide-react";
import { enhanceScan, autoCutImage, rotateImage, ScanMode } from "@/lib/docScan";
import { buildPdf, PdfPage } from "@/lib/pdfZip";

type Page = { id: string; name: string; original: string; current: string };
type Format = "pdf" | "zip" | "long";
type OutFile = { url: string; filename: string; sizeKb: number };
type Result = { files: OutFile[]; pages: number; note?: string };

const uid = () => Math.random().toString(36).slice(2, 10);
const A4 = { w: 595.28, h: 841.89 };

const loadImg = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Image failed to load"));
        img.src = src;
    });

const readFile = (file: File) =>
    new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => {
            if (typeof r.result !== "string") {
                reject(new Error("Image file could not be read"));
                return;
            }
            resolve(r.result);
        };
        r.onerror = () => reject(r.error ?? new Error("Image file could not be read"));
        r.onabort = () => reject(new Error("Image file read was cancelled"));
        r.readAsDataURL(file);
    });

// Draws an image to a white canvas at the given size and returns JPEG bytes
const encodeJpeg = (img: CanvasImageSource, w: number, h: number, q: number) =>
    new Promise<Uint8Array>((resolve, reject) => {
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        const ctx = c.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not available"));
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        c.toBlob(
            async (b) => (b ? resolve(new Uint8Array(await b.arrayBuffer())) : reject(new Error("Encode failed"))),
            "image/jpeg",
            q,
        );
    });

// Smallest-effort encode that fits maxBytes (0 = no limit). Lowers quality first, then size.
async function encodeToLimit(img: CanvasImageSource, iw: number, ih: number, maxBytes: number, maxSide = 2000) {
    const base = Math.min(1, maxSide / Math.max(iw, ih));
    if (!maxBytes) {
        const w = Math.max(1, Math.round(iw * base));
        const h = Math.max(1, Math.round(ih * base));
        return { data: await encodeJpeg(img, w, h, 0.9), w, h, fits: true };
    }
    let last: { data: Uint8Array; w: number; h: number; fits: boolean } = {
        data: new Uint8Array(),
        w: 1,
        h: 1,
        fits: false,
    };
    for (const s of [1, 0.8, 0.65, 0.5, 0.4, 0.3, 0.22]) {
        const w = Math.max(1, Math.round(iw * base * s));
        const h = Math.max(1, Math.round(ih * base * s));
        for (const q of [0.85, 0.72, 0.6, 0.48, 0.36]) {
            const data = await encodeJpeg(img, w, h, q);
            last = { data, w, h, fits: data.length <= maxBytes };
            if (last.fits) return last;
        }
    }
    return last;
}

const formatCards: { value: Format; title: string; desc: string; icon: React.ElementType }[] = [
    { value: "pdf", title: "PDF", desc: "One file, all pages", icon: FileText },
    { value: "zip", title: "A4 images", desc: "Each page its own JPG", icon: Images },
    { value: "long", title: "One image", desc: "Pages joined into one JPG", icon: GalleryVertical },
];

export default function MultiScan() {
    const [pages, setPages] = useState<Page[]>([]);
    const [autoCut, setAutoCut] = useState(false);
    const [scanMode, setScanMode] = useState<ScanMode>("color");
    const [format, setFormat] = useState<Format>("pdf");
        const [direction, setDirection] = useState<"vertical" | "horizontal">("vertical");
    const [maxKb, setMaxKb] = useState<number>(0);
    const [busy, setBusy] = useState(false);
    const [result, setResult] = useState<Result | null>(null);
    const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const revision = useRef(0);

    useEffect(() => {
        document.title = "Scan Pages to PDF";
    }, []);
    useEffect(() => () => {
        result?.files.forEach((f) => URL.revokeObjectURL(f.url));
    }, [result]);

    const notify = (text: string, type: "success" | "error" = "success") => {
        setToast({ type, text });
        if (toastTimer.current) clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(null), 3500);
    };

    const changed = () => {
        revision.current++;
        setResult(null);
    };

    const addFiles = async (files: File[]) => {
        const images = files.filter((f) => f.type.startsWith("image/"));
        if (!images.length) {
            notify("Please choose image files (JPG, PNG).", "error");
            return;
        }
        try {
            const added: Page[] = [];
            for (const f of images) {
                const raw = await readFile(f);
                const cur = autoCut ? ((await autoCutImage(raw)) ?? raw) : raw;
                await loadImg(cur);
                added.push({ id: uid(), name: f.name, original: raw, current: cur });
            }
            setPages((p) => [...p, ...added]);
            changed();
            notify(`${added.length} page${added.length > 1 ? "s" : ""} added.`);
        } catch (error) {
            console.error("Failed to add scanner images", error);
            notify("Could not read one or more images. Please try different files.", "error");
        }
    };

    const update = (id: string, patch: Partial<Page>) => {
        setPages((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));
        changed();
    };

    const rotate = async (pg: Page) => update(pg.id, { current: await rotateImage(pg.current, 90) });
    const cut = async (pg: Page) => {
        const out = await autoCutImage(pg.current);
        if (!out) return notify("Edges not clear on this page.", "error");
        update(pg.id, { current: out });
    };
    const cutAll = async () => {
        let miss = 0;
        const next: Page[] = [];
        for (const pg of pages) {
            const out = await autoCutImage(pg.current);
            if (!out) miss++;
            next.push(out ? { ...pg, current: out } : pg);
        }
        setPages(next);
        changed();
        notify(miss ? `Cut done. ${miss} page(s) had unclear edges.` : "All pages cut.", miss ? "error" : "success");
    };
    const remove = (id: string) => {
        setPages((p) => p.filter((x) => x.id !== id));
        changed();
    };
    const move = (from: number, to: number) => {
        if (to < 0 || to >= pages.length || from === to) return;
        setPages((p) => {
            const copy = [...p];
            const [m] = copy.splice(from, 1);
            copy.splice(to, 0, m);
            return copy;
        });
        changed();
    };

    // ---------------- build output ----------------
    const create = async () => {
        if (!pages.length) return;
        const startingRevision = revision.current;
        setBusy(true);
        setResult(null);
        try {
            const scanned = await Promise.all(pages.map((p) => enhanceScan(p.current, scanMode)));
            const imgs = await Promise.all(scanned.map(loadImg));
            const limit = maxKb * 1024;
            const files: { data: Uint8Array; filename: string; mime: string }[] = [];
            let note: string | undefined;

            if (format === "pdf") {
                // Every page is a real A4 page (portrait, or landscape for wide photos)
                const per = limit ? Math.max(2000, (limit - 700 - 450 * imgs.length) / imgs.length) : 0;
                const out: PdfPage[] = [];
                let allFit = true;
                for (const img of imgs) {
                    const e = await encodeToLimit(img, img.naturalWidth, img.naturalHeight, per);
                    allFit = allFit && e.fits;
                    const landscape = e.w > e.h;
                    const pw = landscape ? A4.h : A4.w;
                    const ph = landscape ? A4.w : A4.h;
                    const m = 20;
                    const k = Math.min((pw - m * 2) / e.w, (ph - m * 2) / e.h);
                    const dw = e.w * k;
                    const dh = e.h * k;
                    out.push({ jpeg: e.data, w: e.w, h: e.h, pw, ph, x: (pw - dw) / 2, y: (ph - dh) / 2, dw, dh });
                }
                const bytes = buildPdf(out);
                files.push({ data: bytes, filename: "scanned_document.pdf", mime: "application/pdf" });
                if (limit && bytes.length > limit) note = `Could not get under ${maxKb} KB. This is the smallest possible.`;
                else if (!allFit) note = "Some pages were reduced a lot to fit the size.";
            } else if (format === "zip") {
                // Separate A4 images: white A4 sheet (150 dpi) with the page centred on it
                let over = 0;
                for (let i = 0; i < imgs.length; i++) {
                    const img = imgs[i];
                    const landscape = img.naturalWidth > img.naturalHeight;
                    const W = landscape ? 1754 : 1240;
                    const H = landscape ? 1240 : 1754;
                    const c = document.createElement("canvas");
                    c.width = W;
                    c.height = H;
                    const ctx = c.getContext("2d");
                    if (!ctx) throw new Error("Canvas not available");
                    ctx.fillStyle = "#fff";
                    ctx.fillRect(0, 0, W, H);
                    const m = 50;
                    const k = Math.min((W - m * 2) / img.naturalWidth, (H - m * 2) / img.naturalHeight);
                    const dw = img.naturalWidth * k;
                    const dh = img.naturalHeight * k;
                    ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
                    const e = await encodeToLimit(c, W, H, limit, 1754);
                    if (limit && !e.fits) over++;
                    files.push({ data: e.data, filename: `page_${String(i + 1).padStart(2, "0")}.jpg`, mime: "image/jpeg" });
                }
                if (over) note = `${over} page(s) could not get under ${maxKb} KB.`;
            } else {
                // one long image, pages joined in order
                const vertical = direction === "vertical";
                const unit = vertical
                    ? Math.min(1400, Math.max(...imgs.map((i) => i.naturalWidth)))
                    : Math.min(1400, Math.max(...imgs.map((i) => i.naturalHeight)));
                const sized = imgs.map((i) => {
                    const k = vertical ? unit / i.naturalWidth : unit / i.naturalHeight;
                    return { img: i, w: Math.round(i.naturalWidth * k), h: Math.round(i.naturalHeight * k) };
                });
                const gap = 12;
                let W = vertical ? unit : sized.reduce((n, s) => n + s.w, 0) + gap * (sized.length - 1);
                let H = vertical ? sized.reduce((n, s) => n + s.h, 0) + gap * (sized.length - 1) : unit;
                const cap = 14000 / Math.max(W, H);
                const sc = cap < 1 ? cap : 1;
                W = Math.round(W * sc);
                H = Math.round(H * sc);
                const c = document.createElement("canvas");
                c.width = W;
                c.height = H;
                const ctx = c.getContext("2d");
                if (!ctx) throw new Error("Canvas not available");
                ctx.fillStyle = "#fff";
                ctx.fillRect(0, 0, W, H);
                let pos = 0;
                for (const s of sized) {
                    const w = s.w * sc, h = s.h * sc;
                    if (vertical) ctx.drawImage(s.img, 0, pos, w, h);
                    else ctx.drawImage(s.img, pos, 0, w, h);
                    pos += (vertical ? h : w) + gap * sc;
                }
                const e = await encodeToLimit(c, W, H, limit, 14000);
                files.push({ data: e.data, filename: "scanned_pages.jpg", mime: "image/jpeg" });
                if (limit && !e.fits) note = `Could not get under ${maxKb} KB.`;
            }

            if (revision.current !== startingRevision) return;

            const outFiles: OutFile[] = files.map((f) => ({
                url: URL.createObjectURL(new Blob([f.data as BlobPart], { type: f.mime })),
                filename: f.filename,
                sizeKb: Math.round((f.data.length / 1024) * 10) / 10,
            }));
            setResult({ files: outFiles, pages: pages.length, note });
            notify("Ready to download.");
        } catch {
            notify("Something went wrong. Try fewer or smaller photos.", "error");
        } finally {
            setBusy(false);
        }
    };

    const downloadOne = (f: OutFile) => {
        const a = document.createElement("a");
        a.href = f.url;
        a.download = f.filename;
        a.click();
    };

    // Each file is its own download (no ZIP). Small delay so the browser accepts all of them.
    const downloadAll = async () => {
        if (!result) return;
        for (const f of result.files) {
            downloadOne(f);
            await new Promise((r) => setTimeout(r, 350));
        }
    };

    // ---------------- UI ----------------
    const card = "rounded-[28px] border border-slate-200/80 bg-white/85 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm";
    const stepNum = "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-lg shadow-blue-600/20";
    const chip = (active: boolean) =>
        `rounded-full px-4 py-2 text-sm font-semibold transition ${
            active ? "bg-slate-900 text-white shadow-md shadow-slate-900/10" : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
        }`;
    const iconBtn =
        "flex h-8 w-8 items-center justify-center rounded-xl bg-white text-slate-600 ring-1 ring-slate-200 transition hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-35";

    const dropProps = {
        onDragOver: (e: React.DragEvent) => e.preventDefault(),
        onDrop: (e: React.DragEvent) => {
            e.preventDefault();
            if (dragIndex === null) addFiles(Array.from(e.dataTransfer.files));
        },
        onPaste: (e: React.ClipboardEvent) => {
            const files = Array.from(e.clipboardData?.files ?? []);
            if (files.length) addFiles(files);
        },
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_28%),linear-gradient(180deg,#f8fbff_0%,#f3f6fb_100%)] text-slate-900 selection:bg-blue-600 selection:text-white">
            {toast && (
                <div role="status" className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-xl">
                    <span className={`h-2 w-2 rounded-full ${toast.type === "success" ? "bg-emerald-400" : "bg-rose-400"}`} />
                    {toast.text}
                </div>
            )}

            <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
                <header className="mb-8 overflow-hidden rounded-[32px] border border-blue-100/80 bg-white/75 p-6 shadow-[0_20px_50px_rgba(37,99,235,0.08)] backdrop-blur-sm sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700">
                                <Images className="h-3.5 w-3.5" /> Multi-page scanner
                            </span>
                            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                                Turn every page into one clean file.
                            </h1>
                            <p className="mt-3 max-w-xl text-sm text-slate-600 sm:text-base">
                                Add each page, reorder with a drag, enhance it like a scanner, and export as a polished PDF, A4 images, or a single long image.
                            </p>
                        </div>

                        <div className="grid min-w-65 grid-cols-3 gap-3">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Pages</p>
                                <p className="mt-2 text-2xl font-black text-slate-900">{pages.length || 0}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Format</p>
                                <p className="mt-2 text-lg font-black text-slate-900">{format === "pdf" ? "PDF" : format === "zip" ? "A4" : "Long"}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Privacy</p>
                                <p className="mt-2 text-lg font-black text-emerald-600">Local</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
                    {/* LEFT */}
                    <div className="space-y-6">
                        <section className={`${card} p-5 sm:p-6`} {...dropProps}>
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <span className={stepNum}>1</span>
                                    <h2 className="flex items-center gap-2 text-lg font-black text-slate-900">
                                        Add pages
                                        {pages.length > 0 && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">{pages.length}</span>}
                                    </h2>
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                                        <input type="checkbox" checked={autoCut} onChange={(e) => setAutoCut(e.target.checked)} className="h-4 w-4 accent-blue-600" />
                                        Auto-cut new pages
                                    </label>
                                    {pages.length > 0 && (
                                        <button type="button" onClick={cutAll} className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 hover:text-blue-700">
                                            <Scissors className="h-3.5 w-3.5" /> Cut all
                                        </button>
                                    )}
                                </div>
                            </div>

                            {pages.length === 0 ? (
                                <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => inputRef.current?.click()}
                                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
                                    className="group flex min-h-55 cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-blue-200 bg-linear-to-br from-blue-50 via-white to-indigo-50 p-6 text-center outline-none transition duration-200 hover:border-blue-400 hover:bg-blue-50/70 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                >
                                    <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white text-blue-600 shadow-lg shadow-blue-100 ring-1 ring-slate-200 transition group-hover:bg-blue-600 group-hover:text-white">
                                        <Upload className="h-5 w-5" />
                                    </span>
                                    <p className="text-base font-black text-slate-800">Choose photos of your pages</p>
                                    <p className="mt-1 text-xs text-slate-500">Select multiple files, drag and drop, or paste from clipboard</p>
                                </div>
                            ) : (
                                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {pages.map((pg, i) => (
                                        <li
                                            key={pg.id}
                                            draggable
                                            onDragStart={() => setDragIndex(i)}
                                            onDragEnd={() => setDragIndex(null)}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (dragIndex !== null) move(dragIndex, i);
                                                setDragIndex(null);
                                            }}
                                            className={`rounded-2xl bg-white p-2 ring-1 transition ${dragIndex === i ? "opacity-40 ring-blue-400" : "ring-slate-200 shadow-sm"}`}
                                        >
                                            <div className="relative flex aspect-3/4 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                                                <img src={pg.current} alt={`Page ${i + 1}`} draggable={false} className="max-h-full max-w-full object-contain" />
                                                <span className="absolute left-2 top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-900 px-1.5 text-xs font-bold text-white">{i + 1}</span>
                                            </div>
                                            <div className="mt-2 flex items-center justify-between gap-1">
                                                <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} aria-label="Move earlier" title="Move earlier" className={iconBtn}>
                                                    <ArrowLeft className="h-4 w-4" />
                                                </button>
                                                <button type="button" onClick={() => move(i, i + 1)} disabled={i === pages.length - 1} aria-label="Move later" title="Move later" className={iconBtn}>
                                                    <ArrowRight className="h-4 w-4" />
                                                </button>
                                                <button type="button" onClick={() => rotate(pg)} aria-label="Rotate" title="Rotate 90°" className={iconBtn}>
                                                    <RotateCw className="h-4 w-4" />
                                                </button>
                                                <button type="button" onClick={() => cut(pg)} aria-label="Auto-cut" title="Auto-cut" className={iconBtn}>
                                                    <Scissors className="h-4 w-4" />
                                                </button>
                                                {pg.current !== pg.original && (
                                                    <button type="button" onClick={() => update(pg.id, { current: pg.original })} aria-label="Restore original" title="Restore original" className={iconBtn}>
                                                        <Undo2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                                <button type="button" onClick={() => remove(pg.id)} aria-label="Remove page" title="Remove" className={`${iconBtn} text-rose-600 hover:bg-rose-50 hover:text-rose-700`}>
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                    <li>
                                        <button
                                            type="button"
                                            onClick={() => inputRef.current?.click()}
                                            className="flex aspect-3/4 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-sm font-semibold text-slate-500 transition hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-700"
                                        >
                                            <Plus className="h-6 w-6" /> Add more
                                        </button>
                                    </li>
                                </ul>
                            )}
                            <input
                                ref={inputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(e) => {
                                    const files = Array.from(e.target.files ?? []);
                                    e.target.value = "";
                                    if (files.length) addFiles(files);
                                }}
                            />
                            {pages.length > 1 && <p className="mt-4 text-xs text-slate-500">Drag pages to reorder, or use the arrow controls. The final output follows this sequence.</p>}
                        </section>

                        <section className={`${card} p-5 sm:p-6`}>
                            <div className="mb-4 flex items-center gap-3">
                                <span className={stepNum}>2</span>
                                <h2 className="text-lg font-black text-slate-900">Scan style</h2>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {([
                                    ["color", "Colour"],
                                    ["gray", "Grey"],
                                    ["bw", "Black & white"],
                                    ["original", "Original"],
                                ] as [ScanMode, string][]).map(([m, label]) => (
                                    <button key={m} type="button" aria-pressed={scanMode === m} onClick={() => { setScanMode(m); changed(); }} className={chip(scanMode === m)}>
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* RIGHT */}
                    <aside className="space-y-4 lg:sticky lg:top-24">
                        <section className={`${card} p-5 sm:p-6`}>
                            <div className="mb-4 flex items-center gap-3">
                                <span className={stepNum}>3</span>
                                <h2 className="text-lg font-black text-slate-900">Save as</h2>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                {formatCards.map(({ value, title, desc, icon: Icon }) => {
                                    const active = format === value;
                                    return (
                                        <button
                                            key={value}
                                            type="button"
                                            aria-pressed={active}
                                            onClick={() => { setFormat(value); changed(); }}
                                            className={`rounded-2xl p-3 text-left transition ${active ? "bg-blue-50 ring-2 ring-blue-600 shadow-sm shadow-blue-100" : "bg-white ring-1 ring-slate-200 hover:ring-blue-300"}`}
                                        >
                                            <Icon className={`mb-2 h-5 w-5 ${active ? "text-blue-700" : "text-slate-500"}`} />
                                            <p className="text-sm font-bold text-slate-900">{title}</p>
                                            <p className="mt-0.5 text-[11px] leading-snug text-slate-500">{desc}</p>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-5 space-y-4">
                                {format !== "long" && (
                                    <p className="rounded-2xl bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                                        Every page is A4 (210 × 297 mm). Wide photos automatically use landscape.
                                    </p>
                                )}
                                {format === "long" && (
                                    <div>
                                        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Join pages</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {([["vertical", "Top to bottom"], ["horizontal", "Left to right"]] as ["vertical" | "horizontal", string][]).map(([v, label]) => (
                                                <button key={v} type="button" aria-pressed={direction === v} onClick={() => { setDirection(v); changed(); }} className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${direction === v ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"}`}>
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <label className="block">
                                    <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                        File size limit {format === "zip" ? "(each image)" : ""}
                                    </span>
                                    <select
                                        value={maxKb}
                                        onChange={(e) => { setMaxKb(parseInt(e.target.value)); changed(); }}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    >
                                        <option value={0}>No limit (best quality)</option>
                                        <option value={100}>Under 100 KB</option>
                                        <option value={200}>Under 200 KB</option>
                                        <option value={500}>Under 500 KB</option>
                                        <option value={1024}>Under 1 MB</option>
                                        <option value={2048}>Under 2 MB</option>
                                    </select>
                                </label>
                            </div>

                            <button
                                type="button"
                                disabled={!pages.length || busy}
                                onClick={create}
                                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none"
                            >
                                {busy ? (
                                    <><RefreshCw className="h-5 w-5 animate-spin" /> Working...</>
                                ) : (
                                    <><Sparkles className="h-5 w-5" /> Scan &amp; create {format === "pdf" ? "PDF" : format === "zip" ? "A4 images" : "image"}</>
                                )}
                            </button>

                            {result && (
                                <div className="mt-4 rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
                                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-emerald-800">
                                        Ready · {result.files.length} file{result.files.length > 1 ? "s" : ""}
                                    </p>
                                    <ul className="space-y-2">
                                        {result.files.map((f) => (
                                            <li key={f.filename} className="flex items-center gap-3 rounded-xl bg-white p-2.5 ring-1 ring-emerald-200">
                                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                                                    {f.filename.endsWith(".pdf") ? <FileText className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
                                                </span>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-bold text-slate-900">{f.filename}</p>
                                                    <p className="text-xs text-slate-500">{f.sizeKb >= 1024 ? `${(f.sizeKb / 1024).toFixed(2)} MB` : `${f.sizeKb} KB`}</p>
                                                </div>
                                                <button type="button" onClick={() => downloadOne(f)} aria-label={`Download ${f.filename}`} title="Download" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white transition hover:bg-slate-800">
                                                    <Download className="h-4 w-4" />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                    {result.note && <p className="mt-2 text-xs font-medium text-amber-700">{result.note}</p>}
                                    {result.files.length > 1 && (
                                        <button type="button" onClick={downloadAll} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800">
                                            <Download className="h-4 w-4" /> Download all {result.files.length} images
                                        </button>
                                    )}
                                </div>
                            )}

                            <p className="mt-3 text-center text-xs text-slate-500">Your photos stay on your device. Nothing is uploaded.</p>
                        </section>
                    </aside>
                </div>
            </main>
        </div>
    );
}
