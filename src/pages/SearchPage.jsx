import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchMulti, normalizeItem } from '../utils/api'
import MediaCard from '../components/MediaCard'
import { Search } from 'lucide-react'
import './SearchPage.css'

export default function SearchPage() {
  const [sp] = useSearchParams()
  const q = sp.get('q') || ''
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!q) return
    setLoading(true)
    searchMulti(q).then(data => {
      const arr = (data?.results || [])
        .filter(i => i.media_type !== 'person' && (i.poster_path || i.backdrop_path))
        .map(i => normalizeItem(i, i.media_type || 'movie'))
      setResults(arr)
      setLoading(false)
    })
  }, [q])

  const filtered = filter === 'all' ? results : results.filter(r => r.type === filter)

  return (
    <main className="search-page">
      <div className="container">
        <div className="sp-header">
          <Search size={20} />
          <h1>Results for <span>"{q}"</span></h1>
        </div>

        <div className="sp-tabs">
          {['all', 'movie', 'tv'].map(t => (
            <button key={t} className={`sp-tab ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>
              {t === 'all' ? `All (${results.length})` : t === 'movie' ? `Movies (${results.filter(r => r.type === 'movie').length})` : `TV Shows (${results.filter(r => r.type === 'tv').length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="sp-grid">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ aspectRatio: '2/3', borderRadius: 10 }} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="sp-grid">
            {filtered.map((item, i) => (
              <MediaCard key={item.id} item={item} style={{ animationDelay: `${i * 0.04}s` }} />
            ))}
          </div>
        ) : (
          <div className="sp-empty">
            {q ? `No results found for "${q}"` : 'Type something to search'}
          </div>
        )}
      </div>
    </main>
  )
}