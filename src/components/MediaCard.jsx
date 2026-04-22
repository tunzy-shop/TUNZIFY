import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, Play, Download } from 'lucide-react'
import { SOURCE_LABELS, SOURCE_COLORS } from '../utils/api'
import './MediaCard.css'

const FALLBACK = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450'%3E%3Crect width='300' height='450' fill='%230a1628'/%3E%3Ctext x='150' y='220' text-anchor='middle' fill='%231a3a6e' font-size='64'%3E🎬%3C/text%3E%3C/svg%3E`
const ANIME_FALLBACK = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450'%3E%3Crect width='300' height='450' fill='%230a1628'/%3E%3Ctext x='150' y='220' text-anchor='middle' fill='%231a3a6e' font-size='64'%3E🎌%3C/text%3E%3C/svg%3E`

export default function MediaCard({ item, style = {} }) {
  const [imgErr, setImgErr] = useState(false)
  if (!item) return null
  const { title, poster, rating, year, source, id } = item
  const isAnime = source === 'anime'
  const detailLink = isAnime ? `/anime/${id}` : `/movies/${source}/${id}`
  const score = rating ? (typeof rating === 'number' ? rating.toFixed(1) : rating) : null

  return (
    <div className="mcard fade-up" style={style}>
      <Link to={detailLink} className="mcard-poster-wrap">
        <img src={imgErr || !poster ? (isAnime ? ANIME_FALLBACK : FALLBACK) : poster} alt={title} onError={() => setImgErr(true)} loading="lazy" />
        <div className="mcard-overlay"><div className="mcard-play"><Play size={22} fill="white" /></div></div>
        {score && <div className="mcard-rating"><Star size={10} fill="#f59e0b" color="#f59e0b" /><span>{score}</span></div>}
        <span className={`mcard-source ${SOURCE_COLORS[source] || 'badge-fzmovies'}`}>{SOURCE_LABELS[source] || source}</span>
      </Link>
      <div className="mcard-body">
        <Link to={detailLink} className="mcard-title">{title}</Link>
        {year && <span className="mcard-year">{year}</span>}
        <div className="mcard-actions">
          <Link to={detailLink} className="mcard-btn stream"><Play size={11} fill="white" /> Stream</Link>
          <Link to={`${detailLink}?action=download`} className="mcard-btn download"><Download size={11} /> Download</Link>
        </div>
      </div>
    </div>
  )
}
