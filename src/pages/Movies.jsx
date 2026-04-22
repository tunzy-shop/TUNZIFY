import { useEffect, useState } from 'react'
import SectionRow from '../components/SectionRow'
import { fzmovies, nkiri, streamx, mynetnaija, normalizeMovie } from '../utils/api'
import './ListPage.css'

export default function Movies() {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      fzmovies.latest(1, 16), nkiri.latest('international', 1, 16),
      streamx.latest(1, 16), mynetnaija.latest(1, 16),
    ]).then(([fz, nk, sx, mnj]) => {
      const p = (r, src) => {
        if (r.status !== 'fulfilled' || !r.value) return []
        const a = r.value.results || r.value.data || r.value.movies || r.value || []
        return Array.isArray(a) ? a.map(m => normalizeMovie(m, src)) : []
      }
      setData({ fzmovies: p(fz, 'fzmovies'), nkiri: p(nk, 'nkiri'), streamx: p(sx, 'streamx'), mynetnaija: p(mnj, 'mynetnaija') })
      setLoading(false)
    })
  }, [])

  return (
    <main className="list-page">
      <div className="container list-header">
        <h1>🎬 Movies</h1>
        <p>Stream and download from multiple sources</p>
      </div>
      <SectionRow title="FZMovies Latest" emoji="🎬" items={data.fzmovies || []} loading={loading} />
      <SectionRow title="Stream-X Latest" emoji="▶️" items={data.streamx || []} loading={loading} />
      <SectionRow title="Nkiri Latest" emoji="🎥" items={data.nkiri || []} loading={loading} />
      <SectionRow title="MyNetNaija Latest" emoji="🌍" items={data.mynetnaija || []} loading={loading} />
    </main>
  )
}
