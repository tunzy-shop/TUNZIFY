import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Hero } from "@/components/Hero";
import { SectionRow } from "@/components/SectionRow";
import { fetchHomepage } from "@/lib/tmdb";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TUNZIFY — Stream & Download Movies, Series & Anime" },
      {
        name: "description",
        content:
          "TUNZIFY brings you trending movies, top-rated series, anime and K-Drama in one premium streaming experience.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchHomepage>> | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomepage().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  const heroItems = [...(data?.trendMovies || []), ...(data?.trendTv || [])].slice(
    0,
    8,
  );

  return (
    <div className="-mt-16">
      <Hero items={heroItems} loading={loading} />
      <div className="space-y-2 pb-10">
        <SectionRow
          title="Trending Movies"
          emoji="🔥"
          items={data?.trendMovies || []}
          loading={loading}
          viewAllLink="/movies"
        />
        <SectionRow
          title="Trending TV Shows"
          emoji="📺"
          items={data?.trendTv || []}
          loading={loading}
          viewAllLink="/tv"
        />
        <SectionRow
          title="Now Playing"
          emoji="🎬"
          items={data?.nowPlaying || []}
          loading={loading}
          viewAllLink="/movies"
        />
        <SectionRow
          title="Action & Adventure"
          emoji="💥"
          items={data?.action || []}
          loading={loading}
          viewAllLink="/movies"
        />
        <SectionRow
          title="Popular"
          emoji="⭐"
          items={data?.popular || []}
          loading={loading}
          viewAllLink="/movies"
        />
        <SectionRow
          title="Horror"
          emoji="👻"
          items={data?.horror || []}
          loading={loading}
          viewAllLink="/movies"
        />

        <div className="container-x my-8">
          <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
          <p className="text-center text-xs tracking-[0.3em] text-gold mt-4 font-semibold">
            🎌 ANIME · ASIAN
          </p>
        </div>

        <SectionRow
          title="Anime"
          emoji="🎌"
          items={data?.anime || []}
          loading={loading}
          viewAllLink="/anime"
        />
        <SectionRow
          title="K-Drama"
          emoji="🇰🇷"
          items={data?.kdrama || []}
          loading={loading}
          viewAllLink="/tv"
        />
        <SectionRow
          title="Top Rated"
          emoji="🏆"
          items={data?.topRated || []}
          loading={loading}
          viewAllLink="/movies"
        />
      </div>
    </div>
  );
}
