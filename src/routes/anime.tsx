import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SectionRow } from "@/components/SectionRow";
import { animeList, normalizeItem, type MediaItem } from "@/lib/tmdb";
import { PageHeader } from "./movies";

export const Route = createFileRoute("/anime")({
  head: () => ({
    meta: [
      { title: "Anime — TUNZIFY" },
      {
        name: "description",
        content: "Stream the best anime — dubbed and subbed — on TUNZIFY.",
      },
    ],
  }),
  component: AnimePage,
});

function AnimePage() {
  const [data, setData] = useState<Record<string, MediaItem[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      animeList.trending(),
      animeList.popular(),
      animeList.topRated(),
    ]).then((results) => {
      const p = (r: PromiseSettledResult<any>): MediaItem[] =>
        r.status === "fulfilled" && r.value
          ? ((r.value.results || [])
              .map((i: any) => {
                const item = normalizeItem(i, "tv");
                return item ? { ...item, type: "anime" as const } : null;
              })
              .filter(Boolean) as MediaItem[])
          : [];
      const [tr, po, tp] = results;
      setData({
        trending: p(tr),
        popular: p(po),
        topRated: p(tp),
      });
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <PageHeader emoji="🎌" title="Anime" subtitle="Dubbed, subbed and trending" />
      <SectionRow title="Trending Anime" emoji="📈" items={data.trending || []} loading={loading} />
      <SectionRow title="Popular Anime" emoji="⭐" items={data.popular || []} loading={loading} />
      <SectionRow title="Top Rated" emoji="🏆" items={data.topRated || []} loading={loading} />
    </div>
  );
}
