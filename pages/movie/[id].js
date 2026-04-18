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
        
        // Get download links
        const downloadRes = await fetch(`/api/movies?type=download&id=${id}`);
        const downloadData = await downloadRes.json();
        if (downloadData.links) {
          setDownloadLinks(downloadData.links);
        } else if (downloadData.url) {
          setDownloadLinks([{ quality: 'HD', url: downloadData.url }]);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="detail-container">
        <button onClick={() => router.back()} className="back-btn">← Back</button>
        <div className="container" style={{ textAlign: 'center', padding: '60px' }}>
          <h2>Movie not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <button onClick={() => router.back()} className="back-btn">← Back to Home</button>
      
      <div className="movie-detail">
        <div className="detail-poster">
          {movie.poster ? (
            <img src={movie.poster} alt={movie.title} />
          ) : (
            <div className="no-image" style={{ aspectRatio: '2/3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              No Poster
            </div>
          )}
        </div>
        
        <div className="detail-info">
          <h1 className="detail-title">{movie.title}</h1>
          
          {movie.categories && (
            <div className="detail-categories">
              {movie.categories.slice(0, 5).map((cat, idx) => (
                <span key={idx} className="category-tag">{cat}</span>
              ))}
            </div>
          )}
          
          {movie.year && <p className="detail-date">📅 {movie.year}</p>}
          {movie.rating && <p className="detail-date">⭐ {movie.rating}/10</p>}
          
          <p className="detail-description">{movie.description || 'No description available.'}</p>
          
          <div className="download-section">
            <h3 className="download-title">📥 Download Options</h3>
            {downloadLinks.length > 0 ? (
              <div className="download-links">
                {downloadLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="download-btn"
                  >
                    Download {link.quality || 'Movie'}
                  </a>
                ))}
              </div>
            ) : (
              <p style={{ color: '#9CA3AF' }}>No download links available. Try searching on the home page.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
