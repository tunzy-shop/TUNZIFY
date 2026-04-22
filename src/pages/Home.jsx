import { useEffect, useState } from 'react'
import Hero from '../components/Hero'
import SectionRow from '../components/SectionRow'
import { fetchHomepage } from '../utils/api'
import './Home.css'

export default function Home() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHomepage().then(d => { setData(d); setLoading(false) })
  }, [])

  const heroItems = [
    ...(data?.fzmovies || []),
    ...(data?.streamx || []),
    ...(data?.animeTrending || []),
  ].filter(Boolean).slice(0, 8)

  return (
    <main className="home">
      <Hero items={heroItems} loading={loading} />
      <div className="home-sections">
        <SectionRow title="Latest on FZMovies" emoji="🎬" items={data?.fzmovies || []} loading={loading} viewAllLink="/movies" />
        <SectionRow title="Stream-X Movies" emoji="▶️" items={data?.streamx || []} loading={loading} viewAllLink="/movies" />
        <SectionRow title="FlixZone Trending" emoji="🔥" items={data?.flixzone || []} loading={loading} viewAllLink="/movies" />
        <SectionRow title="Nkiri Movies" emoji="🎥" items={data?.nkiri || []} loading={loading} viewAllLink="/movies" />
        <div className="anime-divider"><span>🎌 ANIME ZONE</span></div>
        <SectionRow title="Trending Anime" emoji="📈" items={data?.animeTrending || []} loading={loading} viewAllLink="/anime" />
        <SectionRow title="Top Rated Anime" emoji="⭐" items={data?.animeTop || []} loading={loading} viewAllLink="/anime" />
      </div>
    </main>
  )
}
