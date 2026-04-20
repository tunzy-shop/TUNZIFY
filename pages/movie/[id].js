import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function MovieDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadLinks, setDownloadLinks] = useState([]);

  useEffect(() => {
    if (!id) return;
    const fetchMovie = async () => {
      try {
        const res = await fetch(`/api/movies?type=details&id=${id}`);
        const data = await res.json();
        setMovie(data);
        const dlRes = await fetch(`/api/movies?type=download&id=${id}`);
        const dlData = await dlRes.json();
        if (dlData.links) setDownloadLinks(dlData.links);
        else if (dlData.url) setDownloadLinks([{ quality: 'HD', url: dlData.url }]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <div className="loading">
        <img src="/logo.jpg" alt="TUNZIFY" style={{height:"80px",width:"80px",objectFit:"contain",borderRadius:"12px"}} />
        <div className="spinner" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="detail-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <p style={{ color: '#aaa', fontSize: 18 }}>Movie not found.</p>
        <button className="back-btn" style={{ position: 'static' }} onClick={() => router.push('/')}>← Go Home</button>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={() => router.back()}>← Back</button>

      {/* Backdrop */}
      <div className="detail-backdrop">
        {movie.poster
          ? <img src={movie.poster} alt={movie.title} />
          : <div style={{ width: '100%', height: '100%', background: '#1a1a1a' }} />
        }
        <div className="detail-backdrop-overlay" />
      </div>

      {/* Content */}
      <div className="detail-content">
        <div className="detail-poster">
          {movie.poster
            ? <img src={movie.poster} alt={movie.title} />
            : <div style={{ aspectRatio: '2/3', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: 13 }}>No Poster</div>
          }
        </div>

        <div className="detail-info">
          <h1 className="detail-title">{movie.title}</h1>
          <div className="detail-meta">
            {movie.year && <span className="detail-year">{movie.year}</span>}
            {movie.rating && <span className="detail-rating">★ {movie.rating} / 10</span>}
          </div>
          {movie.categories?.length > 0 && (
            <div className="detail-categories">
              {movie.categories.slice(0, 5).map((cat, i) => (
                <span key={i} className="category-tag">{cat}</span>
              ))}
            </div>
          )}
          <p className="detail-description">{movie.description || 'No description available.'}</p>

          <div className="download-section">
            <h3 className="download-title">📥 Download Options</h3>
            {downloadLinks.length > 0 ? (
              <div className="download-links">
                {downloadLinks.map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="download-btn">
                    ↓ {link.quality || 'Download'}
                  </a>
                ))}
              </div>
            ) : (
              <p style={{ color: '#555', fontSize: 14 }}>No download links available.</p>
            )}
          </div>
        </div>
      </div>

      <footer className="footer">
        © {new Date().getFullYear()} <span>TUNZIFY</span>. All rights reserved.
      </footer>
    </div>
  );
}
