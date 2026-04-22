import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Play, Download, Star, ChevronLeft, ChevronRight, Tv, Film } from 'lucide-react'
import { SOURCE_LABELS } from '../utils/api'
import './Hero.css'

export default function Hero({ items = [], loading }) {
  const [idx, setIdx] = useState(0)
  const [fading, setFading] = useState(false)
  const slides = items.slice(0, 6)

  useEffect(() => {
    if (slides.length <= 1) return
    const t = setInterval(() => go('next'), 7000)
    return () => clearInterval(t)
  }, [slides.length, idx])

  const go = (dir) => {
    setFading(true)
    setTimeout(() => {
      setIdx(p => dir === 'next' ? (p + 1) % slides.length : (p - 1 + slides.length) % slides.length)
      setFading(false)
    }, 320)
  }

  if (loading) return (
    <div className="hero hero-loading">
      <div className="hero-skeleton-content container">
        <div className="skeleton" style={{ height: 14, width: 80, borderRadius: 20, marginBottom: 20 }} />
        <div className="skeleton" style={{ height: 52, width: '55%', borderRadius: 8, marginBottom: 14 }} />
        <div className="skeleton" style={{ height: 14, width: '30%', borderRadius: 4, marginBottom: 10 }} />
        <div className="skeleton" style={{ height: 72, width: '65%', borderRadius: 8, marginBottom: 28 }} />
        <div style={{ display: 'flex', gap: 14 }}>
          <div className="skeleton" style={{ height: 46, width: 150, borderRadius: 40 }} />
          <div className="skeleton" style={{ height: 46, width: 140, borderRadius: 40 }} />
        </div>
      </div>
    </div>
  )

  if (!slides.length) return null
  const item = slides[idx]
  const isAnime = item.source === 'anime'
  const detailLink = isAnime ? `/anime/${item.id}` : `/movies/${item.source}/${item.id}`
  const score = item.rating ? (typeof item.rating === 'number' ? item.rating.toFixed(1) : item.rating) : null

  return (
    <div className="hero">
      <div className={`hero-bg ${fading ? 'fade' : ''}`}>
        {item.poster && <img src={item.poster} alt="" className="hero-bg-img" />}
        <div className="hero-vignette" />
      </div>

      <div className={`hero-content container ${fading ? 'fade' : ''}`}>
        <div className="hero-meta-row">
          <span className={`hero-source-badge ${isAnime ? 'badge-anime' : 'badge-fzmovies'}`}>
            {isAnime ? <Tv size={11} /> : <Film size={11} />}
            {SOURCE_LABELS[item.source] || item.source}
          </span>
          {score && <span className="hero-score"><Star size={12} fill="#f59e0b" color="#f59e0b" /> {score}</span>}
          {item.year && <span className="hero-year">{item.year}</span>}
        </div>

        <h1 className="hero-title">{item.title}</h1>

        {item.genres?.length > 0 && (
          <div className="hero-genres">
            {item.genres.slice(0, 3).map((g, i) => (
              <span key={i} className="hero-genre">{typeof g === 'object' ? g.name : g}</span>
            ))}
          </div>
        )}

        {item.overview && <p className="hero-overview">{item.overview.slice(0, 200)}{item.overview.length > 200 ? '…' : ''}</p>}

        <div className="hero-actions">
          <Link to={detailLink} className="btn-stream hero-btn"><Play size={17} fill="white" /> Stream Now</Link>
          <Link to={`${detailLink}?action=download`} className="btn-download hero-btn"><Download size={16} /> Download</Link>
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button className="hero-arrow left" onClick={() => go('prev')}><ChevronLeft size={20} /></button>
          <button className="hero-arrow right" onClick={() => go('next')}><ChevronRight size={20} /></button>
          <div className="hero-dots">
            {slides.map((_, i) => (
              <button key={i} className={`hero-dot ${i === idx ? 'active' : ''}`}
                onClick={() => { setFading(true); setTimeout(() => { setIdx(i); setFading(false) }, 320) }} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
