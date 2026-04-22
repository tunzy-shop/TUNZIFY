import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchAll } from '../utils/api'
import MediaCard from '../components/MediaCard'
import { Search } from 'lucide-react'
import './SearchPage.css'

export default function SearchPage() {
  const [sp] = useSearchParams()
  const q = sp.get('q') || ''
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState('fzmovies')

  useEffect(() => {
    if (!q) return
    setLoading(true)
    searchAll(q).then(r => { setResults(r); setLoading(false) })
  }, [q])

  const tabs = [
    { key: 'fzmovies', label: 'FZMovies' }, { key: 'nkiri', label: 'Nkiri' },
    { key: 'streamx', label: 'Stream-X' }, { key: 'mynetnaija', label: 'MyNetNaija' },
    { key: 'anime', label: 'Anime' },
  ]

  return (
    <main className="search-page">
      <div className="container">
        <div className="sp-header"><Search size={20} /><h1>Results for <span>"{q}"</span></h1></div>
        <div className="sp-tabs">
          {tabs.map(t => (
            <button key={t.key} className={`sp-tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
              {t.label}{!loading && results[t.key] && <span className="sp-count">{results[t.key].length}</span>}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="sp-grid">{Array.from({ length: 10 }).map((_, i) => <div key={i} className="skeleton" style={{ aspectRatio: '2/3', borderRadius: 10 }} />)}</div>
        ) : (results[tab] || []).length > 0 ? (
          <div className="sp-grid">{(results[tab] || []).map((item, i) => <MediaCard key={item.id || i} item={item} style={{ animationDelay: `${i * 0.04}s` }} />)}</div>
        ) : (
          <div className="sp-empty">{q ? `No results for "${q}" on ${tabs.find(t => t.key === tab)?.label}` : 'Type something to search'}</div>
        )}
      </div>
    </main>
  )
}
