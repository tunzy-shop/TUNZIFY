import { useEffect, useState } from 'react'
import SectionRow from '../components/SectionRow'
import { movies, normalizeItem, MOVIE_GENRES } from '../utils/api'
import './ListPage.css'

export default function Movies() {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      movies.trending(), movies.nowPlaying(),
      movies.popular(), movies.topRated(),
      movies.byGenre(MOVIE_GENRES.action),
      movies.byGenre(MOVIE_GENRES.horror),
      movies.byGenre(MOVIE_GENRES.romance),
      movies.byGenre(MOVIE_GENRES.scifi),
    ]).then(([tr, np, po, tp, ac, ho, ro, sf]) => {
      const p = (r) => r.status === 'fulfilled' && r.value
        ? (r.value.results || []).map(i => normalizeItem(i, 'movie')) : []
      setData({ trending: p(tr), nowPlaying: p(np), popular: p(po), topRated: p(tp), action: p(ac), horror: p(ho), romance: p(ro), scifi: p(sf) })
      setLoading(false)
    })
  }, [])

  return (
    <main className="list-page">
      <div className="container list-header">
        <h1>🎬 Movies</h1>
        <p>Stream and download the latest movies</p>
      </div>
      <SectionRow title="Trending" emoji="🔥" items={data.trending || []} loading={loading} />
      <SectionRow title="Now Playing" emoji="🎬" items={data.nowPlaying || []} loading={loading} />
      <SectionRow title="Popular" emoji="⭐" items={data.popular || []} loading={loading} />
      <SectionRow title="Action" emoji="💥" items={data.action || []} loading={loading} />
      <SectionRow title="Horror" emoji="👻" items={data.horror || []} loading={loading} />
      <SectionRow title="Romance" emoji="💕" items={data.romance || []} loading={loading} />
      <SectionRow title="Sci-Fi" emoji="🚀" items={data.scifi || []} loading={loading} />
      <SectionRow title="Top Rated" emoji="🏆" items={data.topRated || []} loading={loading} />
    </main>
  )
}