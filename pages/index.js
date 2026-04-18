import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingRes, latestRes] = await Promise.all([
          fetch('/api/movies?type=trending'),
          fetch('/api/movies?type=latest')
        ]);
        const trendingData = await trendingRes.json();
        const latestData = await latestRes.json();
        setTrending(trendingData);
        setLatest(latestData);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (trending.length === 0) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % Math.min(5, trending.length));
    }, 5000);
    return () => clearInterval(interval);
  }, [trending.length]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    try {
      const res = await fetch(`/api/movies?type=search&query=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <a href="/" className="logo">TUNZYIFY</a>
          
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </form>
        </div>
      </div>

      {/* Hero Carousel */}
      {trending.length > 0 && !searchResults.length && (
        <div className="hero">
          {trending.slice(0, 5).map((movie, idx) => (
            <div
              key={movie.id}
              className="hero-slide"
              style={{ opacity: idx === carouselIndex ? 1 : 0 }}
            >
              <img src={movie.poster} alt={movie.title} />
              <div className="hero-overlay"></div>
            </div>
          ))}
          
          <div className="hero-content">
            <h2 className="hero-title">{trending[carouselIndex]?.title}</h2>
            <p className="hero-desc">{trending[carouselIndex]?.description?.substring(0, 100)}...</p>
            <div className="hero-buttons">
              <button 
                onClick={() => setCarouselIndex((prev) => (prev + 1) % Math.min(5, trending.length))}
                className="btn-primary"
              >
                Next
              </button>
              <button 
                onClick={() => router.push(`/movie/${trending[carouselIndex]?.id}`)}
                className="btn-secondary"
              >
                Watch Now
              </button>
            </div>
          </div>
          
          <div className="slide-dots">
            {trending.slice(0, 5).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCarouselIndex(idx)}
                className={`dot ${idx === carouselIndex ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container">
        {searchResults.length > 0 ? (
          <div className="section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 className="section-title">Search Results for "{searchQuery}"</h2>
              <button onClick={clearSearch} className="btn-secondary">Clear</button>
            </div>
            <div className="movie-grid">
              {searchResults.map((movie) => (
                <div
                  key={movie.id}
                  className="movie-card"
                  onClick={() => router.push(`/movie/${movie.id}`)}
                >
                  <div className="movie-poster">
                    {movie.poster ? (
                      <img src={movie.poster} alt={movie.title} />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </div>
                  <p className="movie-title">{movie.title}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Trending Section */}
            <div className="section">
              <h2 className="section-title">🔥 Trending Now</h2>
              <div className="movie-grid">
                {trending.map((movie) => (
                  <div
                    key={movie.id}
                    className="movie-card"
                    onClick={() => router.push(`/movie/${movie.id}`)}
                  >
                    <div className="movie-poster">
                      {movie.poster ? (
                        <img src={movie.poster} alt={movie.title} />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                    </div>
                    <p className="movie-title">{movie.title}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Latest Section */}
            <div className="section">
              <h2 className="section-title">🍿 Latest Movies</h2>
              <div className="movie-grid">
                {latest.map((movie) => (
                  <div
                    key={movie.id}
                    className="movie-card"
                    onClick={() => router.push(`/movie/${movie.id}`)}
                  >
                    <div className="movie-poster">
                      {movie.poster ? (
                        <img src={movie.poster} alt={movie.title} />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                    </div>
                    <p className="movie-title">{movie.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
