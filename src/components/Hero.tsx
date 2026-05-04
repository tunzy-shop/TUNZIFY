import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Play, Download, Star, ChevronLeft, ChevronRight } from "lucide-react";
import type { MediaItem } from "@/lib/tmdb";

interface HeroProps {
  items: MediaItem[];
  loading?: boolean;
}

export function Hero({ items, loading }: HeroProps) {
  const slides = items.filter((i) => i?.backdrop).slice(0, 6);
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => go("next"), 7000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length, idx]);

  const go = (dir: "next" | "prev") => {
    setFading(true);
    setTimeout(() => {
      setIdx((p) =>
        dir === "next"
          ? (p + 1) % slides.length
          : (p - 1 + slides.length) % slides.length,
      );
      setFading(false);
    }, 300);
  };

  if (loading) {
    return (
      <div className="relative h-[80vh] min-h-[520px] bg-gradient-hero">
        <div className="container-x pt-32 space-y-4">
          <div className="skeleton h-4 w-28 rounded-full" />
          <div className="skeleton h-14 w-2/3 rounded-lg" />
          <div className="skeleton h-20 w-3/4 rounded-lg" />
          <div className="flex gap-3 pt-4">
            <div className="skeleton h-12 w-40 rounded-full" />
            <div className="skeleton h-12 w-36 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!slides.length) return null;
  const item = slides[idx];

  return (
    <div className="relative h-[88vh] min-h-[560px] overflow-hidden">
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          fading ? "opacity-0" : "opacity-100"
        }`}
      >
        <img src={item.backdrop!} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
      </div>

      <div
        className={`relative h-full container-x flex flex-col justify-end pb-24 md:pb-32 max-w-3xl transition-all duration-500 ${
          fading ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
        }`}
      >
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="text-xs font-bold tracking-wider px-3 py-1 rounded-full bg-gradient-gold text-accent-foreground">
            {item.type === "tv" ? "SERIES" : "MOVIE"}
          </span>
          {item.rating && parseFloat(item.rating) > 0 && (
            <span className="flex items-center gap-1 text-sm font-semibold text-gold">
              <Star size={14} fill="currentColor" /> {item.rating}
            </span>
          )}
          {item.year && (
            <span className="text-sm text-muted-foreground">{item.year}</span>
          )}
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] mb-4 drop-shadow-lg">
          {item.title}
        </h1>

        {item.overview && (
          <p className="text-base md:text-lg text-muted-foreground line-clamp-3 mb-6 max-w-2xl">
            {item.overview}
          </p>
        )}

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            to="/watch/$type/$id"
            params={{ type: item.type, id: String(item.id) }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-gold text-accent-foreground font-bold shadow-gold hover:scale-[1.03] active:scale-[0.97] transition"
          >
            <Play size={18} fill="currentColor" /> Watch Now
          </Link>
          <Link
            to="/watch/$type/$id"
            params={{ type: item.type, id: String(item.id) }}
            search={{ download: true }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-surface/60 backdrop-blur text-foreground font-semibold hover:bg-secondary transition"
          >
            <Download size={16} /> Download
          </Link>
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={() => go("prev")}
            className="absolute top-1/2 -translate-y-1/2 left-3 md:left-6 h-10 w-10 grid place-items-center rounded-full glass border border-border hover:bg-primary hover:text-primary-foreground transition"
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => go("next")}
            className="absolute top-1/2 -translate-y-1/2 right-3 md:right-6 h-10 w-10 grid place-items-center rounded-full glass border border-border hover:bg-primary hover:text-primary-foreground transition"
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setFading(true);
                  setTimeout(() => {
                    setIdx(i);
                    setFading(false);
                  }, 300);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  i === idx ? "w-8 bg-gold" : "w-1.5 bg-foreground/30"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
