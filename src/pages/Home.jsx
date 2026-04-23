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
    ...(data?.trendMovies || []),
    ...(data?.trendTv || []),
  ].slice(0, 8)

  return (
    <main className="home">
      <Hero items={heroItems} loading={loading} />
      <div className="home-sections">
        <SectionRow title="Trending Movies" emoji="🔥" items={data?.trendMovies || []} loading={loading} viewAllLink="/movies" />
        <SectionRow title="Trending TV Shows" emoji="📺" items={data?.trendTv || []} loading={loading} viewAllLink="/tv" />
        <SectionRow title="Now Playing" emoji="🎬" items={data?.nowPlaying || []} loading={loading} viewAllLink="/movies" />
        <SectionRow title="Action & Adventure" emoji="💥" items={data?.action || []} loading={loading} viewAllLink="/movies" />
        <SectionRow title="Popular Movies" emoji="⭐" items={data?.popular || []} loading={loading} viewAllLink="/movies" />
        <SectionRow title="Horror Movies" emoji="👻" items={data?.horror || []} loading={loading} viewAllLink="/movies" />
        <div className="section-divider"><span>🎌 ANIME & ASIAN</span></div>
        <SectionRow title="Anime" emoji="🎌" items={data?.anime || []} loading={loading} viewAllLink="/anime" />
        <SectionRow title="K-Drama" emoji="🇰🇷" items={data?.kdrama || []} loading={loading} viewAllLink="/tv" />
        <SectionRow title="Top Rated" emoji="🏆" items={data?.topRated || []} loading={loading} viewAllLink="/movies" />
      </div>
    </main>
  )
}