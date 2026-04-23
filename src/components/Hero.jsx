import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Play, Download, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import './Hero.css'

export default function Hero({ items = [], loading }) {
  const [idx, setIdx] = useState(0)
  const [fading, setFading] = useState(false)
  const slides = items.filter(i => i?.backdrop).slice(0, 8)

  useEffect(() => {
    if (slides.length <= 1) return
    const t = setInterval(() => go('next'), 6000)
    return () => clearInterval(t)
  }, [slides.length, idx])

  const go = (dir) => {
    setFading(true)
    setTimeout(() => {
      setIdx(p => dir === 'next' ? (p + 1) % slides.length : (p - 1 + slides.length) % slides.length)
      setFading(false)
    }, 300)
  }

  if (loading) return (
    <div className="hero hero-loading">
      <div className="container hero-skeleton">
        <div className="skeleton" style={{ height: 14, width: 100, borderRadius: 20, marginBottom: 18 }} />
        <div className="skeleton" style={{ height: 56, width: '50%', borderRadius: 8, marginBottom: 14 }} />
        <div className="skeleton" style={{ height: 80, width: '65%', borderRadius: 8, marginBottom: 28 }} />
        <div style={{ display: 'flex', gap: 14 }}>
          <div className="skeleton" style={{ height: 48, width: 160, borderRadius: 40 }} />
          <div className="skeleton" style={{ height: 48, width: 150, borderRadius: 40 }} />
        </div>
      </div>
    </div>
  )

  if (!slides.length) return null
  const item = slides[idx]
  const watchLink = `/watch/${item.type || 'movie'}/${item.id}`

  return (
    <div className="hero">
      <div className={`hero-bg ${fading ? 'fade' : ''}`}>
        <img src={item.backdrop} alt="" className="hero-bg-img" />
        <div className="hero-vignette" />
      </div>

      <div className={`hero-content container ${fading ? 'fade' : ''}`}>
        <div className="hero-meta-row">
          <span className="hero-type-pill">
            {item.type === 'tv' ? '📺 SERIES' : '🎬 MOVIE'}
          </span>
          {item.rating && parseFloat(item.rating) > 0 && (
            <span className="hero-score">
              <Star size={12} fill="#f59e0b" color="#f59e0b" /> {item.rating}
            </span>
          )}
          {item.year && <span className="hero-year">{item.year}</span>}
        </div>

        <h1 className="hero-title">{item.title}</h1>

        {item.overview && (
          <p className="hero-overview">
            {item.overview.slice(0, 180)}{item.overview.length > 180 ? '…' : ''}
          </p>
        )}

        <div className="hero-actions">
          <Link to={watchLink} className="btn-stream hero-btn">
            <Play size={18} fill="white" /> Watch Now
          </Link>
          <Link to={`${watchLink}?download=true`} className="btn-download hero-btn">
            <Download size={16} /> Download
          </Link>
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button className="hero-arrow left" onClick={() => go('prev')}><ChevronLeft size={20} /></button>
          <button className="hero-arrow right" onClick={() => go('next')}><ChevronRight size={20} /></button>
          <div className="hero-dots">
            {slides.map((_, i) => (
              <button key={i} className={`hero-dot ${i === idx ? 'active' : ''}`}
                onClick={() => { setFading(true); setTimeout(() => { setIdx(i); setFading(false) }, 300) }} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}