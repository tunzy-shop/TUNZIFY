import { useEffect, useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { Star, Download, Play, ArrowLeft, ExternalLink } from 'lucide-react'
import { fzmovies, nkiri, streamx, flixzone, mynetnaija, normalizeMovie } from '../utils/api'
import './Detail.css'

const sourceAPIs = { fzmovies, nkiri, streamx, flixzone, mynetnaija }

export default function MovieDetail() {
  const { source, id } = useParams()
  const [searchParams] = useSearchParams()
  const defaultTab = searchParams.get('action') === 'download' ? 'download' : 'stream'
  const [item, setItem] = useState(null)
  const [downloadLinks, setDownloadLinks] = useState([])
  const [streamLinks, setStreamLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [linksLoading, setLinksLoading] = useState(false)
  const [tab, setTab] = useState(defaultTab)
  const url = decodeURIComponent(id)

  useEffect(() => {
    const api = sourceAPIs[source]
    if (!api) { setLoading(false); return }
    api.info(url).then(data => {
      if (data) {
        setItem(normalizeMovie(data.movie || data.info || data, source))
        const links = data.download_links || data.downloads || data.links || []
        setDownloadLinks(Array.isArray(links) ? links : [])
        const slinks = data.stream_links || data.streams || []
        setStreamLinks(Array.isArray(slinks) ? slinks : [])
      }
      setLoading(false)
    })
  }, [source, id])

  const fetchDownload = async (linkUrl) => {
    setLinksLoading(true)
    try {
      const res = await fzmovies.download(linkUrl)
      if (res?.download_url || res?.link || res?.url) {
        window.open(res.download_url || res.link || res.url, '_blank')
      } else if (res?.links) setDownloadLinks(res.links)
    } catch (e) { console.error(e) }
    setLinksLoading(false)
  }

  if (loading) return <div className="page-loader"><div className="loader" /></div>
  if (!item) return <div className="detail-error"><p>Content not found.</p><Link to="/movies" className="btn-stream">← Back</Link></div>

  return (
    <div className="detail-page">
      {item.poster && <div className="detail-backdrop"><img src={item.poster} alt="" /><div className="detail-backdrop-overlay" /></div>}
      <div className="container detail-wrap">
        <Link to="/movies" className="detail-back"><ArrowLeft size={15} /> Movies</Link>
        <div className="detail-layout">
          <div className="detail-poster-col">
            {item.poster ? <img src={item.poster} alt={item.title} className="detail-poster-img" /> : <div className="detail-poster-placeholder">🎬</div>}
          </div>
          <div className="detail-info-col">
            <h1 className="detail-title">{item.title}</h1>
            <div className="detail-meta-row">
              {item.rating > 0 && <span className="detail-score"><Star size={14} fill="#f59e0b" color="#f59e0b" />{typeof item.rating === 'number' ? item.rating.toFixed(1) : item.rating}</span>}
              {item.year && <span className="detail-chip">{item.year}</span>}
            </div>
            {item.genres?.length > 0 && <div className="detail-genres">{item.genres.slice(0, 5).map((g, i) => <span key={i} className="detail-genre-tag">{typeof g === 'object' ? g.name : g}</span>)}</div>}
            {item.overview && <p className="detail-overview">{item.overview}</p>}
            <div className="detail-tabs">
              <button className={`detail-tab ${tab === 'stream' ? 'active' : ''}`} onClick={() => setTab('stream')}><Play size={14} /> Stream</button>
              <button className={`detail-tab ${tab === 'download' ? 'active' : ''}`} onClick={() => setTab('download')}><Download size={14} /> Download</button>
            </div>
            {tab === 'stream' && (
              <div className="detail-action-section">
                {streamLinks.length > 0 ? (
                  <div className="links-list">
                    {streamLinks.map((l, i) => <a key={i} href={l.url || l.link || l} target="_blank" rel="noreferrer" className="link-item stream-link"><Play size={14} />{l.quality || l.label || `Stream ${i + 1}`}<ExternalLink size={12} className="link-ext" /></a>)}
                  </div>
                ) : (
                  <div className="no-links-msg">
                    <p>Stream links are available on the source site.</p>
                    {item.url && <a href={item.url} target="_blank" rel="noreferrer" className="btn-stream"><ExternalLink size={15} /> Open Source</a>}
                  </div>
                )}
              </div>
            )}
            {tab === 'download' && (
              <div className="detail-action-section">
                {downloadLinks.length > 0 ? (
                  <div className="links-list">
                    {downloadLinks.map((l, i) => (
                      <button key={i} className="link-item download-link" onClick={() => fetchDownload(l.url || l.link || l)} disabled={linksLoading}>
                        <Download size={14} />{l.quality || l.label || l.size || `Download ${i + 1}`}
                        {linksLoading && <span className="link-loading">…</span>}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="no-links-msg">
                    <p>Click to fetch download links.</p>
                    {item.url && <button className="btn-download" onClick={() => fetchDownload(item.url)} disabled={linksLoading}><Download size={15} />{linksLoading ? 'Loading…' : 'Get Download Links'}</button>}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
