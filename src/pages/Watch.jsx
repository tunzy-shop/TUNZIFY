import { useEffect, useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { ArrowLeft, Play, Download, Star, ExternalLink, Tv, AlertCircle } from 'lucide-react'
import { movies, tv, streamUrl, fzmovies, normalizeItem } from '../utils/api'
import './Watch.css'

export default function Watch() {
  const { type, id } = useParams()
  const [searchParams] = useSearchParams()
  const defaultTab = searchParams.get('download') === 'true' ? 'download' : 'stream'

  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(defaultTab)
  const [activeSource, setActiveSource] = useState(0)
  const [season, setSeason] = useState(1)
  const [episode, setEpisode] = useState(1)
  const [dlLinks, setDlLinks] = useState([])
  const [dlLoading, setDlLoading] = useState(false)
  const [playerError, setPlayerError] = useState(false)

  const isTv = type === 'tv' || type === 'anime'

  const sources = isTv ? [
    { label: 'VidSrc', url: streamUrl.tv(id, season, episode) },
    { label: 'VidSrc XYZ', url: streamUrl.tv2(id, season, episode) },
  ] : [
    { label: 'VidSrc', url: streamUrl.movie(id) },
    { label: 'VidSrc XYZ', url: streamUrl.movie2(id) },
    { label: 'EmbedSU', url: streamUrl.movie3(id) },
  ]

  useEffect(() => {
    const api = isTv ? tv.detail(id) : movies.detail(id)
    api.then(data => {
      if (data) setItem(normalizeItem(data, isTv ? 'tv' : 'movie'))
      setLoading(false)
    })
  }, [id, type])

  const fetchDownload = async () => {
    if (!item) return
    setDlLoading(true)
    const res = await fzmovies.search(item.title, 5)
    if (res?.results?.length || Array.isArray(res)) {
      const arr = res.results || res || []
      setDlLinks(arr.slice(0, 5))
    }
    setDlLoading(false)
  }

  useEffect(() => {
    if (tab === 'download' && dlLinks.length === 0) fetchDownload()
  }, [tab])

  if (loading) return <div className="page-loader"><div className="loader" /></div>
  if (!item) return (
    <div className="watch-error">
      <AlertCircle size={48} color="var(--silver-dim)" />
      <p>Content not found</p>
      <Link to="/" className="btn-stream">← Go Home</Link>
    </div>
  )

  const seasons = item.raw?.seasons?.filter(s => s.season_number > 0) || []

  return (
    <div className="watch-page">
      {/* Backdrop */}
      {item.backdrop && (
        <div className="watch-backdrop">
          <img src={item.backdrop} alt="" />
          <div className="watch-backdrop-overlay" />
        </div>
      )}

      <div className="container watch-wrap">
        <Link to={isTv ? '/tv' : '/movies'} className="watch-back">
          <ArrowLeft size={15} /> {isTv ? 'TV Shows' : 'Movies'}
        </Link>

        {/* Video Player */}
        {tab === 'stream' && (
          <div className="player-section">
            <div className="player-wrap">
              {playerError ? (
                <div className="player-error">
                  <AlertCircle size={40} />
                  <p>Player failed to load. Try another source below.</p>
                </div>
              ) : (
                <iframe
                  key={`${sources[activeSource].url}-${season}-${episode}`}
                  src={sources[activeSource].url}
                  allowFullScreen
                  allow="autoplay; fullscreen; picture-in-picture"
                  className="player-iframe"
                  onError={() => setPlayerError(true)}
                />
              )}
            </div>

            {/* Source switcher */}
            <div className="source-switcher">
              <span className="source-label">Source:</span>
              {sources.map((s, i) => (
                <button
                  key={i}
                  className={`source-btn ${activeSource === i ? 'active' : ''}`}
                  onClick={() => { setActiveSource(i); setPlayerError(false) }}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Season/Episode picker for TV */}
            {isTv && seasons.length > 0 && (
              <div className="ep-picker">
                <div className="ep-picker-row">
                  <label>Season:</label>
                  <div className="ep-btns">
                    {seasons.map(s => (
                      <button
                        key={s.season_number}
                        className={`ep-btn ${season === s.season_number ? 'active' : ''}`}
                        onClick={() => { setSeason(s.season_number); setEpisode(1) }}
                      >
                        S{s.season_number}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="ep-picker-row">
                  <label>Episode:</label>
                  <div className="ep-btns">
                    {Array.from({ length: seasons.find(s => s.season_number === season)?.episode_count || 12 }).map((_, i) => (
                      <button
                        key={i + 1}
                        className={`ep-btn ${episode === i + 1 ? 'active' : ''}`}
                        onClick={() => setEpisode(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Movie Info */}
        <div className="watch-layout">
          <div className="watch-poster-col">
            {item.poster && <img src={item.poster} alt={item.title} className="watch-poster" />}
          </div>

          <div className="watch-info-col">
            <h1 className="watch-title">{item.title}</h1>
            <div className="watch-meta">
              {item.rating && parseFloat(item.rating) > 0 && (
                <span className="watch-score"><Star size={14} fill="#f59e0b" color="#f59e0b" />{item.rating}</span>
              )}
              {item.year && <span className="watch-chip">{item.year}</span>}
              {item.raw?.runtime && <span className="watch-chip">{item.raw.runtime} min</span>}
              {isTv && item.raw?.number_of_seasons && (
                <span className="watch-chip"><Tv size={12} /> {item.raw.number_of_seasons} Seasons</span>
              )}
            </div>

            {item.raw?.genres?.length > 0 && (
              <div className="watch-genres">
                {item.raw.genres.map(g => (
                  <span key={g.id} className="watch-genre">{g.name}</span>
                ))}
              </div>
            )}

            {item.overview && <p className="watch-overview">{item.overview}</p>}

            {/* Tab Switcher */}
            <div className="watch-tabs">
              <button className={`watch-tab ${tab === 'stream' ? 'active' : ''}`} onClick={() => setTab('stream')}>
                <Play size={14} /> Stream
              </button>
              <button className={`watch-tab ${tab === 'download' ? 'active' : ''}`} onClick={() => setTab('download')}>
                <Download size={14} /> Download
              </button>
            </div>

            {/* Download section */}
            {tab === 'download' && (
              <div className="watch-download-section">
                {dlLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--silver-dim)' }}>
                    <div className="loader" style={{ width: 24, height: 24, borderWidth: 2 }} />
                    Searching download links...
                  </div>
                ) : dlLinks.length > 0 ? (
                  <div className="dl-list">
                    <p className="dl-hint">Select a result to get download link:</p>
                    {dlLinks.map((l, i) => (
                      <a
                        key={i}
                        href={l.url || l.link || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="dl-item"
                      >
                        <Download size={14} />
                        <span>{l.title || l.name || `Download Option ${i + 1}`}</span>
                        <ExternalLink size={12} style={{ marginLeft: 'auto' }} />
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="dl-empty">
                    <p>No download links found for this title.</p>
                    <a
                      href={`https://fzmovies.ng/search/?q=${encodeURIComponent(item.title)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-download"
                    >
                      <ExternalLink size={15} /> Search on FZMovies
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Similar */}
        {item.raw?.similar?.results?.length > 0 && (
          <div className="watch-similar">
            <h3 className="similar-title">More Like This</h3>
            <div className="similar-grid">
              {item.raw.similar.results.slice(0, 8).map(s => (
                <Link key={s.id} to={`/watch/${isTv ? 'tv' : 'movie'}/${s.id}`} className="similar-card">
                  {s.poster_path
                    ? <img src={`https://image.tmdb.org/t/p/w300${s.poster_path}`} alt={s.title || s.name} />
                    : <div className="similar-placeholder">🎬</div>
                  }
                  <span>{s.title || s.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}