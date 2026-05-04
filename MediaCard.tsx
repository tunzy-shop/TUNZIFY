import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Star, Play, Download } from "lucide-react";
import type { MediaItem } from "@/lib/tmdb";

const FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450'%3E%3Crect width='300' height='450' fill='%23161e2e'/%3E%3Ctext x='150' y='230' text-anchor='middle' fill='%2338496b' font-size='56'%3E%F0%9F%8E%AC%3C/text%3E%3C/svg%3E";

interface MediaCardProps {
  item: MediaItem;
  index?: number;
}

export function MediaCard({ item, index = 0 }: MediaCardProps) {
  const [imgErr, setImgErr] = useState(false);
  if (!item) return null;

  const { id, title, poster, rating, year, type } = item;

  return (
    <div
      className="group fade-up"
      style={{ animationDelay: `${Math.min(index * 0.04, 0.4)}s` }}
    >
      <Link
        to="/watch/$type/$id"
        params={{ type, id: String(id) }}
        className="block relative aspect-[2/3] overflow-hidden rounded-xl bg-surface border border-border/50 shadow-elevated"
      >
        <img
          src={imgErr || !poster ? FALLBACK : poster}
          alt={title}
          loading="lazy"
          onError={() => setImgErr(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

        {/* Hover play button */}
        <div className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition">
          <div className="h-14 w-14 grid place-items-center rounded-full bg-gradient-gold shadow-gold scale-90 group-hover:scale-100 transition">
            <Play size={22} fill="currentColor" className="text-accent-foreground ml-0.5" />
          </div>
        </div>

        {/* Rating */}
        {rating && parseFloat(rating) > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full glass text-[11px] font-semibold text-gold border border-border">
            <Star size={10} fill="currentColor" />
            {rating}
          </div>
        )}

        {/* Type badge */}
        <span
          className={`absolute top-2 left-2 text-[10px] font-bold tracking-wider px-2 py-0.5 rounded ${
            type === "tv"
              ? "bg-primary/90 text-primary-foreground"
              : type === "anime"
                ? "bg-gradient-gold text-accent-foreground"
                : "bg-foreground/90 text-background"
          }`}
        >
          {type === "tv" ? "SERIES" : type === "anime" ? "ANIME" : "MOVIE"}
        </span>
      </Link>

      <div className="pt-3 px-1">
        <Link
          to="/watch/$type/$id"
          params={{ type, id: String(id) }}
          className="block font-semibold text-sm text-foreground hover:text-gold transition line-clamp-1"
        >
          {title}
        </Link>
        {year && <p className="text-xs text-muted-foreground mt-0.5">{year}</p>}
        <div className="flex items-center gap-1.5 mt-2">
          <Link
            to="/watch/$type/$id"
            params={{ type, id: String(id) }}
            className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 rounded-md bg-gradient-blue text-primary-foreground text-[11px] font-semibold hover:opacity-90 transition"
          >
            <Play size={10} fill="currentColor" /> Stream
          </Link>
          <Link
            to="/watch/$type/$id"
            params={{ type, id: String(id) }}
            search={{ download: true }}
            className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 rounded-md border border-border bg-surface text-foreground text-[11px] font-semibold hover:border-gold hover:text-gold transition"
          >
            <Download size={10} /> Get
          </Link>
        </div>
      </div>
    </div>
  );
}
