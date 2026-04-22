import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Star, Tv } from 'lucide-react'
import { anime } from '../utils/api'
import './Detail.css'

export default function AnimeDetail() {
  const { id } = useParams()
  const [info, setInfo] = useState(null)
  const [episodes, setEpisodes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([anime.info(id), anime.episodes(id)]).then(([inf, eps]) => {
      if (inf.status === 'fulfilled' && inf.value) setInfo(inf.value.data || inf.value)
      if (eps.status === 'fulfilled' && eps.value) {
        const arr = eps.value.data || eps.value.episodes || eps.value || []
        setEpisodes(Array.isArray(arr) ? arr.slice(0, 50) : [])
      }
      setLoading(false)
    })
  }, [id])

  if (loading) return <div className="page-loader"><div className="loader" /></div>
  if (!info) return <div className="detail-error"><p>Anime not found.</p><Link to="/anime" className="btn-stream">← Back</Link></div>

  const title = info.title || info.title_english || 'Unknown'
  const poster = info.images?.jpg?.large_image_url || info.images?.jpg?.image_url

  return (
    <div className="detail-page">
      {poster && <div className="detail-backdrop"><img src={poster} alt="" /><div className="detail-backdrop-overlay" /></div>}
      <div className="container detail-wrap">
        <Link to="/anime" className="detail-back"><ArrowLeft size={15} /> Anime</Link>
        <div className="detail-layout">
          <div className="detail-poster-col">
            {poster ? <img src={poster} alt={title} className="detail-poster-img" /> : <div className="detail-poster-placeholder">🎌</div>}
          </div>
          <div className="detail-info-col">
            <h1 className="detail-title">{title}</h1>
            {info.title_english && info.title_english !== title && <p className="detail-alt-title">{info.title_english}</p>}
            <div className="detail-meta-row">
              {info.score && <span className="detail-score"><Star size={14} fill="#f59e0b" color="#f59e0b" />{info.score}</span>}
              {info.episodes && <span className="detail-chip"><Tv size={12} /> {info.episodes} eps</span>}
              {info.status && <span className={`detail-chip ${info.status === 'Currently Airing' ? 'chip-airing' : ''}`}>{info.status}</span>}
            </div>
            {info.genres?.length > 0 && <div className="detail-genres">{info.genres.map((g, i) => <span key={i} className="detail-genre-tag">{g.name || g}</span>)}</div>}
            {info.synopsis && <p className="detail-overview">{info.synopsis}</p>}
            {episodes.length > 0 && (
              <div className="eps-section">
                <h3 className="eps-title">Episodes ({episodes.length})</h3>
                <div className="eps-grid">
                  {episodes.map((ep, i) => (
                    <div key={ep.mal_id || i} className="ep-item">
                      <span className="ep-num">EP {ep.episode_id || ep.mal_id || i + 1}</span>
                      <span className="ep-name">{ep.title || `Episode ${i + 1}`}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
