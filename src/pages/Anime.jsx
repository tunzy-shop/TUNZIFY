import { useEffect, useState } from 'react'
import SectionRow from '../components/SectionRow'
import { animeList, normalizeItem } from '../utils/api'
import './ListPage.css'

export default function Anime() {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      animeList.trending(),
      animeList.popular(),
      animeList.topRated(),
    ]).then(([tr, po, tp]) => {
      const p = (r) => r.status === 'fulfilled' && r.value
        ? (r.value.results || []).map(i => ({ ...normalizeItem(i, 'tv'), type: 'anime' })) : []
      setData({ trending: p(tr), popular: p(po), topRated: p(tp) })
      setLoading(false)
    })
  }, [])

  return (
    <main className="list-page">
      <div className="container list-header">
        <h1>🎌 Anime</h1>
        <p>Stream the best anime — dubbed and subbed</p>
      </div>
      <SectionRow title="Trending Anime" emoji="📈" items={data.trending || []} loading={loading} />
      <SectionRow title="Popular Anime" emoji="⭐" items={data.popular || []} loading={loading} />
      <SectionRow title="Top Rated" emoji="🏆" items={data.topRated || []} loading={loading} />
    </main>
  )
}