import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SectionRow } from "@/components/SectionRow";
import { movies, normalizeItem, MOVIE_GENRES, type MediaItem } from "@/lib/tmdb";

export const Route = createFileRoute("/movies")({
  head: () => ({
    meta: [
      { title: "Movies — TUNZIFY" },
      {
        name: "description",
        content: "Stream and download the latest blockbuster movies on TUNZIFY.",
      },
    ],
  }),
  component: MoviesPage,
});

function MoviesPage() {
  const [data, setData] = useState<Record<string, MediaItem[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      movies.trending(),
      movies.nowPlaying(),
      movies.popular(),
      movies.topRated(),
      movies.byGenre(MOVIE_GENRES.action),
      movies.byGenre(MOVIE_GENRES.horror),
      movies.byGenre(MOVIE_GENRES.romance),
      movies.byGenre(MOVIE_GENRES.scifi),
    ]).then((results) => {
      const p = (r: PromiseSettledResult<any>): MediaItem[] =>
        r.status === "fulfilled" && r.value
          ? ((r.value.results || [])
              .map((i: any) => normalizeItem(i, "movie"))
              .filter(Boolean) as MediaItem[])
          : [];
      const [tr, np, po, tp, ac, ho, ro, sf] = results;
      setData({
        trending: p(tr),
        nowPlaying: p(np),
        popular: p(po),
        topRated: p(tp),
        action: p(ac),
        horror: p(ho),
        romance: p(ro),
        scifi: p(sf),
      });
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <PageHeader emoji="🎬" title="Movies" subtitle="Stream and download the latest movies" />
      <SectionRow title="Trending" emoji="🔥" items={data.trending || []} loading={loading} />
      <SectionRow title="Now Playing" emoji="🎬" items={data.nowPlaying || []} loading={loading} />
      <SectionRow title="Popular" emoji="⭐" items={data.popular || []} loading={loading} />
      <SectionRow title="Action" emoji="💥" items={data.action || []} loading={loading} />
      <SectionRow title="Horror" emoji="👻" items={data.horror || []} loading={loading} />
      <SectionRow title="Romance" emoji="💕" items={data.romance || []} loading={loading} />
      <SectionRow title="Sci-Fi" emoji="🚀" items={data.scifi || []} loading={loading} />
      <SectionRow title="Top Rated" emoji="🏆" items={data.topRated || []} loading={loading} />
    </div>
  );
}

export function PageHeader({
  emoji,
  title,
  subtitle,
}: {
  emoji: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="container-x pt-12 pb-4">
      <h1 className="text-4xl md:text-5xl font-black tracking-tight">
        <span className="mr-3">{emoji}</span>
        <span className="bg-gradient-gold bg-clip-text text-transparent">{title}</span>
      </h1>
      <p className="text-muted-foreground mt-2">{subtitle}</p>
    </div>
  );
}
