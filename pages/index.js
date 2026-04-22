import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [activeNav, setActiveNav] = useState('home');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tRes, lRes] = await Promise.all([
          fetch('/api/movies?type=trending'),
          fetch('/api/movies?type=latest'),
        ]);
        setTrending(await tRes.json());
        setLatest(await lRes.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (trending.length === 0) return;
    const t = setInterval(() => setHeroIndex(p => (p + 1) % Math.min(6, trending.length)), 6000);
    return () => clearInterval(t);
  }, [trending.length]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const res = await fetch(`/api/movies?type=search&query=${encodeURIComponent(searchQuery)}`);
      setSearchResults(await res.json());
    } catch (e) { console.error(e); }
  };

  const clearSearch = () => { setSearchQuery(''); setSearchResults([]); setActiveNav('home'); };

  const goToMovie = (id) => router.push(`/movie/${id}`);

  const MovieCard = ({ movie }) => (
    <div className="movie-card" onClick={() => goToMovie(movie.id)}>
      <div className="movie-poster">
        {movie.poster
          ? <img src={movie.poster} alt={movie.title} loading="lazy" />
          : <div className="movie-poster-placeholder">No Image</div>
        }
        {movie.rating && <span className="badge-rating">★ {movie.rating}</span>}
        {movie.year && <span className="badge-year">{movie.year}</span>}
        <span className="badge-type">Movie</span>
        <div className="movie-overlay">
          <span className="play-icon">▶</span>
        </div>
      </div>
      <p className="movie-title">{movie.title}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="loading">
        <img src="/logo.jpg" alt="TUNZIFY" style={{height:"80px",width:"80px",objectFit:"contain",borderRadius:"12px"}} />
        <div className="spinner" />
      </div>
    );
  }

  const heroMovies = trending.slice(0, 6);
  const currentHero = heroMovies[heroIndex];

  return (
    <>
      {/* HEADER */}
      <header className="header">
        <div className="header-content">
          <a href="/">
            <img src="/logo.jpg" alt="TUNZIFY" style={{height:"38px",width:"38px",objectFit:"contain",borderRadius:"6px"}} />
          </a>
          <nav className="nav-links">
            <button className="nav-link" onClick={clearSearch}>Home</button>
            <button className="nav-link" onClick={clearSearch}>Trending</button>
            <button className="nav-link" onClick={clearSearch}>Latest</button>
          </nav>
          <form onSubmit={handleSearch} className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              type="text"
              placeholder="Search movies & shows..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      </header>

      {/* SEARCH RESULTS */}
      {searchResults.length > 0 ? (
        <main className="search-page">
          <button className="clear-btn" onClick={clearSearch}>← Back to Home</button>
          <h2 className="search-page-title">
            Results for <span>"{searchQuery}"</span>
          </h2>
          <div className="movie-grid">
            {searchResults.map(m => <MovieCard key={m.id} movie={m} />)}
          </div>
        </main>
      ) : (
        <>
          {/* HERO */}
          {heroMovies.length > 0 && (
            <div className="hero">
              {heroMovies.map((movie, idx) => (
                <div key={movie.id} className={`hero-slide${idx === heroIndex ? ' active' : ''}`}>
                  {movie.poster && <img src={movie.poster} alt={movie.title} />}
                  <div className="hero-overlay" />
                </div>
              ))}
              <div className="hero-content">
                <div className="hero-badge">🔥 Trending Now</div>
                <h1 className="hero-title">{currentHero?.title}</h1>
                <div className="hero-meta">
                  {currentHero?.year && <span className="hero-year">{currentHero.year}</span>}
                  {currentHero?.rating && <span className="hero-rating">★ {currentHero.rating}</span>}
                  {currentHero?.categories?.[0] && (
                    <span className="hero-genre">{currentHero.categories[0]}</span>
                  )}
                </div>
                {currentHero?.description && (
                  <p className="hero-desc">{currentHero.description}</p>
                )}
                <div className="hero-buttons">
                  <button className="btn-play" onClick={() => goToMovie(currentHero?.id)}>
                    ▶ More Info
                  </button>
                  <button className="btn-info" onClick={() => goToMovie(currentHero?.id)}>
                    ⊙ Watch Trailer
                  </button>
                </div>
              </div>
              <div className="hero-dots">
                {heroMovies.map((_, idx) => (
                  <button
                    key={idx}
                    className={`hero-dot${idx === heroIndex ? ' active' : ''}`}
                    onClick={() => setHeroIndex(idx)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* PAGE CONTENT */}
          <main className="page-content">
            {trending.length > 0 && (
              <section className="section">
                <div className="section-header">
                  <h2 className="section-title">Popular Series</h2>
                  <button className="section-more">More →</button>
                </div>
                <div className="scroll-row">
                  {trending.map(m => <MovieCard key={m.id} movie={m} />)}
                </div>
              </section>
            )}

            {latest.length > 0 && (
              <section className="section">
                <div className="section-header">
                  <h2 className="section-title">Latest Releases</h2>
                  <button className="section-more">More →</button>
                </div>
                <div className="scroll-row">
                  {latest.map(m => <MovieCard key={m.id} movie={m} />)}
                </div>
              </section>
            )}
          </main>

          <footer className="footer">
            © {new Date().getFullYear()} <span>TUNZIFY</span>. All rights reserved.
          </footer>
        </>
      )}

      {/* BOTTOM NAV - mobile */}
      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          <button
            className={`bottom-nav-item${activeNav === 'home' ? ' active' : ''}`}
            onClick={() => { clearSearch(); setActiveNav('home'); }}
          >
            <span className="bottom-nav-icon">⌂</span>
            Home
          </button>
          <button
            className={`bottom-nav-item${activeNav === 'search' ? ' active' : ''}`}
            onClick={() => setActiveNav('search')}
          >
            <span className="bottom-nav-icon">⌕</span>
            Search
          </button>
          <button
            className={`bottom-nav-item${activeNav === 'trending' ? ' active' : ''}`}
            onClick={() => setActiveNav('trending')}
          >
            <span className="bottom-nav-icon">↗</span>
            Trending
          </button>
          <button
            className={`bottom-nav-item${activeNav === 'downloads' ? ' active' : ''}`}
            onClick={() => setActiveNav('downloads')}
          >
            <span className="bottom-nav-icon">↓</span>
            Downloads
          </button>
        </div>
      </nav>
    </>
  );
}
