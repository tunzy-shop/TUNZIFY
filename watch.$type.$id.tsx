import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Play,
  Download,
  Star,
  Tv as TvIcon,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import {
  movies,
  tv,
  streamUrl,
  normalizeItem,
  type MediaItem,
  type MediaType,
} from "@/lib/tmdb";

interface WatchSearch {
  download?: boolean;
}

export const Route = createFileRoute("/watch/$type/$id")({
  validateSearch: (search: Record<string, unknown>): WatchSearch => ({
    download: search.download === true || search.download === "true",
  }),
  head: () => ({
    meta: [
      { title: "Watch — TUNZIFY" },
      { name: "description", content: "Stream now on TUNZIFY." },
    ],
  }),
  component: WatchPage,
});

function WatchPage() {
  const { type, id } = Route.useParams();
  const { download } = Route.useSearch();

  const isTv = type === "tv" || type === "anime";
  const [item, setItem] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"stream" | "download">(download ? "download" : "stream");
  const [activeSource, setActiveSource] = useState(0);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);

  const sources = isTv
    ? [
        { label: "Source 1", url: streamUrl.tv(id, season, episode) },
        { label: "Source 2", url: streamUrl.tv2(id, season, episode) },
      ]
    : [
        { label: "Source 1", url: streamUrl.movie(id) },
        { label: "Source 2", url: streamUrl.movie2(id) },
        { label: "Source 3", url: streamUrl.movie3(id) },
      ];

  useEffect(() => {
    setLoading(true);
    const api = isTv ? tv.detail(id) : movies.detail(id);
    api.then((data: any) => {
      if (data) setItem(normalizeItem(data, isTv ? "tv" : "movie"));
      setLoading(false);
    });
  }, [id, isTv]);

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="h-12 w-12 border-4 border-border border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-center px-4">
        <div>
          <AlertCircle size={48} className="mx-auto text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">Content not found</p>
          <Link
            to="/"
            className="mt-6 inline-block px-5 py-2.5 rounded-full bg-gradient-gold text-accent-foreground font-semibold shadow-gold"
          >
            Go home
          </Link>
        </div>
      </div>
    );
  }

  const seasons =
    item.raw?.seasons?.filter((s: any) => s.season_number > 0) || [];
  const similar = item.raw?.similar?.results || [];

  return (
    <div className="relative">
      {item.backdrop && (
        <div className="absolute inset-x-0 top-0 h-[420px] -z-10 overflow-hidden">
          <img src={item.backdrop} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background" />
        </div>
      )}

      <div className="container-x pt-8 pb-16">
        <Link
          to={isTv ? "/tv" : "/movies"}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold transition mb-6"
        >
          <ArrowLeft size={15} /> Back
        </Link>

        {tab === "stream" && (
          <div className="mb-8">
            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-border bg-black shadow-elevated">
              <iframe
                key={`${sources[activeSource].url}-${season}-${episode}`}
                src={sources[activeSource].url}
                allowFullScreen
                allow="autoplay; fullscreen; picture-in-picture"
                className="w-full h-full"
                title={item.title}
              />
            </div>

            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <span className="text-xs font-semibold text-muted-foreground mr-1">
                Source:
              </span>
              {sources.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSource(i)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    activeSource === i
                      ? "bg-gradient-blue text-primary-foreground shadow-blue"
                      : "bg-surface border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {isTv && seasons.length > 0 && (
              <div className="mt-6 space-y-4 p-4 rounded-xl bg-surface border border-border">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">
                    SEASON
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {seasons.map((s: any) => (
                      <button
                        key={s.season_number}
                        onClick={() => {
                          setSeason(s.season_number);
                          setEpisode(1);
                        }}
                        className={`min-w-10 px-2 py-1.5 rounded-lg text-xs font-semibold ${
                          season === s.season_number
                            ? "bg-gradient-gold text-accent-foreground"
                            : "bg-secondary text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        S{s.season_number}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">
                    EPISODE
                  </p>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                    {Array.from({
                      length:
                        seasons.find((s: any) => s.season_number === season)
                          ?.episode_count || 12,
                    }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setEpisode(i + 1)}
                        className={`min-w-10 px-2 py-1.5 rounded-lg text-xs font-semibold ${
                          episode === i + 1
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-[220px_1fr] gap-6 md:gap-8">
          {item.poster && (
            <img
              src={item.poster}
              alt={item.title}
              className="w-40 md:w-full rounded-xl border border-border shadow-elevated mx-auto md:mx-0"
            />
          )}

          <div>
            <h1 className="text-3xl md:text-4xl font-black mb-3">{item.title}</h1>
            <div className="flex items-center gap-3 mb-4 flex-wrap text-sm">
              {item.rating && parseFloat(item.rating) > 0 && (
                <span className="flex items-center gap-1 text-gold font-semibold">
                  <Star size={14} fill="currentColor" /> {item.rating}
                </span>
              )}
              {item.year && (
                <span className="px-2 py-0.5 rounded bg-secondary text-xs">
                  {item.year}
                </span>
              )}
              {item.raw?.runtime && (
                <span className="px-2 py-0.5 rounded bg-secondary text-xs">
                  {item.raw.runtime} min
                </span>
              )}
              {isTv && item.raw?.number_of_seasons && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-secondary text-xs">
                  <TvIcon size={12} /> {item.raw.number_of_seasons} Seasons
                </span>
              )}
            </div>

            {item.raw?.genres?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {item.raw.genres.map((g: any) => (
                  <span
                    key={g.id}
                    className="text-xs px-2.5 py-1 rounded-full border border-gold/30 text-gold"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {item.overview && (
              <p className="text-muted-foreground leading-relaxed mb-5">
                {item.overview}
              </p>
            )}

            <div className="flex items-center gap-2 mb-6 border-b border-border">
              <button
                onClick={() => setTab("stream")}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
                  tab === "stream"
                    ? "text-gold border-gold"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                <Play size={14} /> Stream
              </button>
              <button
                onClick={() => setTab("download")}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
                  tab === "download"
                    ? "text-gold border-gold"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                <Download size={14} /> Download
              </button>
            </div>

            {tab === "download" && (
              <div className="p-5 rounded-xl bg-surface border border-border">
                <p className="text-sm text-muted-foreground mb-3">
                  Search for downloadable copies on external providers:
                </p>
                <a
                  href={`https://fzmovies.ng/search/?q=${encodeURIComponent(item.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-gold text-accent-foreground font-semibold shadow-gold"
                >
                  <ExternalLink size={15} /> Search FZMovies
                </a>
              </div>
            )}
          </div>
        </div>

        {similar.length > 0 && (
          <div className="mt-12">
            <h3 className="flex items-center gap-2 text-xl font-bold mb-5">
              <span className="block w-1 h-6 bg-gradient-gold rounded-full" />
              More Like This
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {similar.slice(0, 12).map((s: any) => {
                const targetType: MediaType = isTv ? "tv" : "movie";
                return (
                  <Link
                    key={s.id}
                    to="/watch/$type/$id"
                    params={{ type: targetType, id: String(s.id) }}
                    className="group"
                  >
                    {s.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w300${s.poster_path}`}
                        alt={s.title || s.name}
                        className="w-full aspect-[2/3] object-cover rounded-lg border border-border group-hover:border-gold transition"
                      />
                    ) : (
                      <div className="w-full aspect-[2/3] rounded-lg bg-surface grid place-items-center text-3xl border border-border">
                        🎬
                      </div>
                    )}
                    <p className="text-xs mt-2 line-clamp-1 group-hover:text-gold transition">
                      {s.title || s.name}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
