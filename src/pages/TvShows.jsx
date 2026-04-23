import { useEffect, useState } from 'react'
import SectionRow from '../components/SectionRow'
import { tv, normalizeItem, TV_GENRES, tmdb } from '../utils/api'
import './ListPage.css'

// need to export tmdb from api.js — add this line to api.js:
// export { tmdb }  ← already exported via fetchHomepage, but add named export

export default function TvShows() {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      tv.trending(), tv.popular(), tv.onAir(), tv.topRated(),
      fetch(`https://api.themoviedb.org/3/discover/tv?with_origin_country=KR&sort_by=popularity.desc&api_key=3df78af4e6449fd8905211ad16707439`).then(r => r.json()),
      fetch(`https://api.themoviedb.org/3/discover/tv?with_origin_country=NG&sort_by=popularity.desc&api_key=3df78af4e6449fd8905211ad16707439`).then(r => r.json()),
    ]).then(([tr, po, oa, tp, kd, ng]) => {
      const p = (r) => r.status === 'fulfilled' && r.value
        ? (r.value.results || []).map(i => normalizeItem(i, 'tv')) : []
      setData({ trending: p(tr), popular: p(po), onAir: p(oa), topRated: p(tp), kdrama: p(kd), nollywood: p(ng) })
      setLoading(false)
    })
  }, [])

  return (
    <main className="list-page">
      <div className="container list-header">
        <h1>📺 TV Shows</h1>
        <p>Stream the best series from around the world</p>
      </div>
      <SectionRow title="Trending" emoji="🔥" items={data.trending || []} loading={loading} />
      <SectionRow title="On Air Now" emoji="📡" items={data.onAir || []} loading={loading} />
      <SectionRow title="Popular" emoji="⭐" items={data.popular || []} loading={loading} />
      <SectionRow title="K-Drama" emoji="🇰🇷" items={data.kdrama || []} loading={loading} />
      <SectionRow title="Nollywood" emoji="🇳🇬" items={data.nollywood || []} loading={loading} />
      <SectionRow title="Top Rated" emoji="🏆" items={data.topRated || []} loading={loading} />
    </main>
  )
}