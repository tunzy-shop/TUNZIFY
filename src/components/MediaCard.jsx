import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, Play, Download } from 'lucide-react'
import './MediaCard.css'

const FALLBACK = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450'%3E%3Crect width='300' height='450' fill='%230a1628'/%3E%3Ctext x='150' y='220' text-anchor='middle' fill='%231a3a6e' font-size='60'%3E🎬%3C/text%3E%3C/svg%3E`
const ANIME_FALLBACK = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450'%3E%3Crect width='300' height='450' fill='%230a1628'/%3E%3Ctext x='150' y='220' text-anchor='middle' fill='%231a3a6e' font-size='60'%3E🎌%3C/text%3E%3C/svg%3E`

export default function MediaCard({ item, style = {} }) {
  const [imgErr, setImgErr] = useState(false)
  if (!item) return null

  const { id, title, poster, rating, year, type } = item
  const isAnime = type === 'anime'
  const watchLink = `/watch/${type || 'movie'}/${id}`
  const fallback = isAnime ? ANIME_FALLBACK : FALLBACK

  return (
    <div className="mcard fade-up" style={style}>
      <Link to={watchLink} className="mcard-poster-wrap">
        <img
          src={imgErr || !poster ? fallback : poster}
          alt={title}
          onError={() => setImgErr(true)}
          loading="lazy"
        />
        <div className="mcard-overlay">
          <div className="mcard-play"><Play size={22} fill="white" /></div>
        </div>
        {rating && parseFloat(rating) > 0 && (
          <div className="mcard-rating">
            <Star size={10} fill="#f59e0b" color="#f59e0b" />
            <span>{rating}</span>
          </div>
        )}
        <span className={`mcard-type-badge ${type === 'tv' ? 'badge-tv' : type === 'anime' ? 'badge-anime-tag' : 'badge-movie'}`}>
          {type === 'tv' ? 'SERIES' : type === 'anime' ? 'ANIME' : 'MOVIE'}
        </span>
      </Link>

      <div className="mcard-body">
        <Link to={watchLink} className="mcard-title">{title}</Link>
        {year && <span className="mcard-year">{year}</span>}
        <div className="mcard-actions">
          <Link to={watchLink} className="mcard-btn stream">
            <Play size={11} fill="white" /> Stream
          </Link>
          <Link to={`${watchLink}?download=true`} className="mcard-btn download">
            <Download size={11} /> Download
          </Link>
        </div>
      </div>
    </div>
  )
}