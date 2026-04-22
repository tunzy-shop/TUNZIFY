import { useEffect, useState } from 'react'
import SectionRow from '../components/SectionRow'
import { anime, normalizeAnime } from '../utils/api'
import './ListPage.css'

export default function Anime() {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([anime.trending(), anime.top(1), anime.airing(), anime.season()]).then(([tr, tp, ai, se]) => {
      const p = (r) => {
        if (r.status !== 'fulfilled' || !r.value) return []
        const a = r.value.data || r.value.results || r.value || []
        return Array.isArray(a) ? a.map(normalizeAnime) : []
      }
      setData({ trending: p(tr), top: p(tp), airing: p(ai), season: p(se) })
      setLoading(false)
    })
  }, [])

  return (
    <main className="list-page">
      <div className="container list-header">
        <h1>🎌 Anime</h1>
        <p>Explore trending, top-rated, and currently airing anime</p>
      </div>
      <SectionRow title="Trending Now" emoji="📈" items={data.trending || []} loading={loading} />
      <SectionRow title="Top Rated" emoji="⭐" items={data.top || []} loading={loading} />
      <SectionRow title="Currently Airing" emoji="📺" items={data.airing || []} loading={loading} />
      <SectionRow title="This Season" emoji="🌸" items={data.season || []} loading={loading} />
    </main>
  )
}
