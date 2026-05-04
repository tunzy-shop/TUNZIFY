import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { MediaCard } from "@/components/MediaCard";
import { searchMulti, normalizeItem, type MediaItem, type MediaType } from "@/lib/tmdb";

interface SearchParams {
  q?: string;
}

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Search — TUNZIFY" },
      { name: "description", content: "Search movies, TV shows and anime on TUNZIFY." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q = "" } = Route.useSearch();
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | MediaType>("all");

  useEffect(() => {
    if (!q) {
      setResults([]);
      return;
    }
    setLoading(true);
    searchMulti(q).then((data: any) => {
      const arr: MediaItem[] = (data?.results || [])
        .filter(
          (i: any) =>
            i.media_type !== "person" && (i.poster_path || i.backdrop_path),
        )
        .map((i: any) => normalizeItem(i, (i.media_type as MediaType) || "movie"))
        .filter(Boolean) as MediaItem[];
      setResults(arr);
      setLoading(false);
    });
  }, [q]);

  const filtered = filter === "all" ? results : results.filter((r) => r.type === filter);

  return (
    <div className="container-x pt-12 pb-10">
      <div className="flex items-center gap-3 mb-6">
        <Search size={22} className="text-gold" />
        <h1 className="text-2xl md:text-3xl font-bold">
          Results for{" "}
          <span className="bg-gradient-gold bg-clip-text text-transparent">"{q}"</span>
        </h1>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {(["all", "movie", "tv"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
              filter === t
                ? "bg-gradient-gold text-accent-foreground shadow-gold"
                : "bg-surface border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "all"
              ? `All (${results.length})`
              : t === "movie"
                ? `Movies (${results.filter((r) => r.type === "movie").length})`
                : `TV (${results.filter((r) => r.type === "tv").length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="skeleton aspect-[2/3] rounded-xl" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((item, i) => (
            <MediaCard key={item.id} item={item} index={i} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-muted-foreground">
          {q ? (
            <>
              No results found for "<span className="text-gold">{q}</span>"
            </>
          ) : (
            <>
              Type something in the search bar to begin —{" "}
              <Link to="/" className="text-gold hover:underline">
                or browse the home page
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
