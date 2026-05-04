import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SectionRow } from "@/components/SectionRow";
import { tv, tmdb, normalizeItem, type MediaItem } from "@/lib/tmdb";
import { PageHeader } from "./movies";

export const Route = createFileRoute("/tv")({
  head: () => ({
    meta: [
      { title: "TV Shows — TUNZIFY" },
      {
        name: "description",
        content: "Stream the best series from around the world on TUNZIFY.",
      },
    ],
  }),
  component: TvPage,
});

function TvPage() {
  const [data, setData] = useState<Record<string, MediaItem[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      tv.trending(),
      tv.popular(),
      tv.onAir(),
      tv.topRated(),
      tmdb("/discover/tv?with_origin_country=KR&sort_by=popularity.desc"),
      tmdb("/discover/tv?with_origin_country=NG&sort_by=popularity.desc"),
    ]).then((results) => {
      const p = (r: PromiseSettledResult<any>): MediaItem[] =>
        r.status === "fulfilled" && r.value
          ? ((r.value.results || [])
              .map((i: any) => normalizeItem(i, "tv"))
              .filter(Boolean) as MediaItem[])
          : [];
      const [tr, po, oa, tp, kd, ng] = results;
      setData({
        trending: p(tr),
        popular: p(po),
        onAir: p(oa),
        topRated: p(tp),
        kdrama: p(kd),
        nollywood: p(ng),
      });
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <PageHeader emoji="📺" title="TV Shows" subtitle="The best series from around the world" />
      <SectionRow title="Trending" emoji="🔥" items={data.trending || []} loading={loading} />
      <SectionRow title="On Air Now" emoji="📡" items={data.onAir || []} loading={loading} />
      <SectionRow title="Popular" emoji="⭐" items={data.popular || []} loading={loading} />
      <SectionRow title="K-Drama" emoji="🇰🇷" items={data.kdrama || []} loading={loading} />
      <SectionRow title="Nollywood" emoji="🇳🇬" items={data.nollywood || []} loading={loading} />
      <SectionRow title="Top Rated" emoji="🏆" items={data.topRated || []} loading={loading} />
    </div>
  );
}
