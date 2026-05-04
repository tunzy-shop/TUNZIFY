import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { MediaCard } from "./MediaCard";
import type { MediaItem } from "@/lib/tmdb";

interface SectionRowProps {
  title: string;
  emoji?: string;
  items: MediaItem[];
  loading?: boolean;
  viewAllLink?: "/movies" | "/tv" | "/anime";
}

export function SectionRow({
  title,
  emoji,
  items,
  loading,
  viewAllLink,
}: SectionRowProps) {
  return (
    <section className="py-6 md:py-8">
      <div className="container-x">
        <div className="flex items-center justify-between mb-5">
          <h2 className="flex items-center gap-2.5 text-lg md:text-xl font-bold">
            <span className="block w-1 h-6 bg-gradient-gold rounded-full" />
            {emoji && <span>{emoji}</span>}
            {title}
          </h2>
          {viewAllLink && (
            <Link
              to={viewAllLink}
              className="flex items-center gap-1 text-xs font-semibold text-gold hover:underline"
            >
              View All <ChevronRight size={14} />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="skeleton aspect-[2/3] rounded-xl"
                  style={{ animationDelay: `${i * 0.07}s` }}
                />
              ))
            : items
                .slice(0, 18)
                .map((item, i) => <MediaCard key={item.id} item={item} index={i} />)}
        </div>
      </div>
    </section>
  );
}
