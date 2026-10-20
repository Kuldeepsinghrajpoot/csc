"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

type Slide = {
  id: string;
  alt: string;
  href: string;
  cta: string;
};

// Banner images live in /public/banners (desktop: <id>.webp, phone: <id>-mobile.webp)
const slides: Slide[] = [
  {
    id: "aadhaar-pan",
    alt: "Aadhaar and PAN services at your Common Service Centre",
    href: "#services",
    cta: "View identity services",
  },
  {
    id: "bills-recharge",
    alt: "Pay electricity bills, recharge mobile and use banking services",
    href: "#services",
    cta: "View payment services",
  },
  {
    id: "rail-insurance",
    alt: "Train ticket booking and insurance cover",
    href: "#services",
    cta: "View travel and insurance",
  },
  {
    id: "merge-tool",
    alt: "Free tool to merge front and back of a card into one image under 100 KB",
    href: "/mergeTwoImage",
    cta: "Open the merge tool",
  },
];

const AUTOPLAY_MS = 5500;

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovering, setHovering] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const count = slides.length;

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  // Respect "reduce motion": start paused
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing || hovering) return;
    const t = setTimeout(next, AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [index, playing, hovering, next]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) > 45) (dx < 0 ? next : prev)();
  };

  const arrow =
    "absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-lg ring-1 ring-black/5 transition hover:bg-white hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 md:flex";

  return (
    <section id="home" className="bg-white pb-6 pt-24 sm:pt-28 md:pb-10">
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Featured services"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
          }}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onFocus={() => setHovering(true)}
          onBlur={() => setHovering(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="group relative overflow-hidden rounded-2xl bg-slate-100 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.35)] ring-1 ring-slate-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:rounded-3xl"
        >
          <div
            className="flex transition-transform duration-700 ease-out motion-reduce:transition-none"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((s, i) => (
              <div
                key={s.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}`}
                aria-hidden={i !== index}
                className="relative aspect-[5/6] w-full shrink-0 md:aspect-[16/7]"
              >
                <picture>
                  <source media="(min-width: 768px)" srcSet={`/banners/${s.id}.webp`} />
                  <img
                    src={`/banners/${s.id}-mobile.webp`}
                    alt={s.alt}
                    width={1000}
                    height={1200}
                    loading={i === 0 ? "eager" : "lazy"}
                    fetchPriority={i === 0 ? "high" : "auto"}
                    draggable={false}
                    className="h-full w-full select-none object-cover object-left"
                  />
                </picture>
                <Link
                  href={s.href}
                  tabIndex={i === index ? 0 : -1}
                  className="absolute inset-0"
                  aria-label={s.cta}
                />
              </div>
            ))}
          </div>

          <button type="button" onClick={prev} aria-label="Previous banner" className={`${arrow} left-4`}>
            <ChevronLeft size={22} />
          </button>
          <button type="button" onClick={next} aria-label="Next banner" className={`${arrow} right-4`}>
            <ChevronRight size={22} />
          </button>

          {/* Dots + play/pause */}
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 rounded-full bg-slate-900/55 px-3 py-2 backdrop-blur">
            <div className="flex items-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Go to banner ${i + 1}`}
                  aria-current={i === index}
                  className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pause slideshow" : "Play slideshow"}
              className="text-white/90 transition hover:text-white"
            >
              {playing ? <Pause size={14} /> : <Play size={14} />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
