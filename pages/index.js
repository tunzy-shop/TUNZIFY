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

  // Styles object - ALL colors included
  const styles = {
    container: {
      minHeight: '100vh',
      background: '#0A0A1A',
      fontFamily: 'Arial, sans-serif',
      paddingBottom: '20px'
    },
    header: {
      background: '#0A0A1A',
      borderBottom: '2px solid #1E3A5F',
      padding: '15px 20px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '15px'
    },
    logo: {
      fontSize: '28px',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #C0C0C0, #3B82F6)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
      textDecoration: 'none'
    },
    searchForm: {
      flex: 1,
      maxWidth: '350px'
    },
    searchInput: {
      width: '100%',
      padding: '12px 20px',
      background: '#1A1A2E',
      border: '1px solid #1E3A5F',
      borderRadius: '30px',
      color: 'white',
      fontSize: '14px',
      outline: 'none'
    },
    hero: {
      position: 'relative',
      height: '50vh',
      overflow: 'hidden'
    },
    heroSlide: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      transition: 'opacity 0.5s ease'
    },
    heroImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    heroOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(to top, #0A0A1A, rgba(0,0,0,0.5), transparent)'
    },
    heroContent: {
      position: 'absolute',
      bottom: '40px',
      left: 0,
      right: 0,
      textAlign: 'center',
      zIndex: 10,
      padding: '0 20px'
    },
    heroTitle: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '10px'
    },
    heroDesc: {
      color: '#C0C0C0',
      maxWidth: '500px',
      margin: '0 auto 20px',
      fontSize: '13px'
    },
    btnPrimary: {
      background: '#1E3A5F',
      color: 'white',
      padding: '10px 25px',
      borderRadius: '30px',
      border: 'none',
      fontWeight: 'bold',
      cursor: 'pointer',
      margin: '0 5px'
    },
    btnSecondary: {
      background: 'rgba(192, 192, 192, 0.15)',
      color: '#C0C0C0',
      padding: '10px 25px',
      borderRadius: '30px',
      border: '1px solid rgba(192, 192, 192, 0.2)',
      fontWeight: 'bold',
      cursor: 'pointer',
      margin: '0 5px'
    },
    mainContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px'
    },
    section: {
      padding: '40px 0'
    },
    sectionTitle: {
      fontSize: '22px',
      fontWeight: 'bold',
      color: '#E0E0E0',
      marginBottom: '20px',
      borderLeft: '4px solid #1E3A5F',
      paddingLeft: '15px'
    },
    movieGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
      gap: '20px'
    },
    movieCard: {
      cursor: 'pointer',
      transition: 'transform 0.3s'
    },
    moviePoster: {
      aspectRatio: '2/3',
      background: '#1A1A2E',
      borderRadius: '12px',
      overflow: 'hidden',
      marginBottom: '8px'
    },
    movieImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    movieTitle: {
      fontSize: '13px',
      fontWeight: '500',
      color: '#E0E0E0',
      textAlign: 'center'
    },
    loadingContainer: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0A0A1A',
      zIndex: 1000
    },
    spinner: {
      width: '50px',
      height: '50px',
      border: '4px solid #1E3A5F',
      borderTopColor: '#C0C0C0',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .movie-card:hover {
          transform: translateY(-5px);
        }
        input:focus {
          border-color: #3B82F6 !important;
        }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <a href="/" style={styles.logo}>TUNZYIFY</a>
          
          <form onSubmit={handleSearch} style={styles.searchForm}>
            <input
              type="text"
              placeholder="🔍 Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </form>
        </div>
      </div>

      {/* Hero Carousel */}
      {trending.length > 0 && searchResults.length === 0 && (
        <div style={styles.hero}>
          {trending.slice(0, 5).map((movie, idx) => (
            <div
              key={movie.id}
              style={{ ...styles.heroSlide, opacity: idx === carouselIndex ? 1 : 0 }}
            >
              {movie.poster && <img src={movie.poster} alt={movie.title} style={styles.heroImage} />}
              <div style={styles.heroOverlay}></div>
            </div>
          ))}
          
          <div style={styles.heroContent}>
            <h2 style={styles.heroTitle}>{trending[carouselIndex]?.title}</h2>
            <p style={styles.heroDesc}>{trending[carouselIndex]?.description?.substring(0, 100)}...</p>
            <div>
              <button 
                onClick={() => setCarouselIndex((prev) => (prev + 1) % Math.min(5, trending.length))}
                style={styles.btnPrimary}
              >
                Next
              </button>
              <button 
                onClick={() => router.push(`/movie/${trending[carouselIndex]?.id}`)}
                style={styles.btnSecondary}
              >
                Watch Now
              </button>
            </div>
          </div>
          
          {/* Dots */}
          <div style={{ position: 'absolute', bottom: '15px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '8px', zIndex: 10 }}>
            {trending.slice(0, 5).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCarouselIndex(idx)}
                style={{
                  width: idx === carouselIndex ? '30px' : '8px',
                  height: '8px',
                  borderRadius: idx === carouselIndex ? '4px' : '50%',
                  background: idx === carouselIndex ? '#3B82F6' : 'rgba(192, 192, 192, 0.4)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={styles.mainContent}>
        {searchResults.length > 0 ? (
          <div style={styles.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <h2 style={styles.sectionTitle}>🔍 Results for "{searchQuery}"</h2>
              <button onClick={clearSearch} style={styles.btnSecondary}>Clear Search</button>
            </div>
            <div style={styles.movieGrid}>
              {searchResults.map((movie) => (
                <div
                  key={movie.id}
                  className="movie-card"
                  style={styles.movieCard}
                  onClick={() => router.push(`/movie/${movie.id}`)}
                >
                  <div style={styles.moviePoster}>
                    {movie.poster ? (
                      <img src={movie.poster} alt={movie.title} style={styles.movieImage} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', fontSize: '12px' }}>
                        No Image
                      </div>
                    )}
                  </div>
                  <p style={styles.movieTitle}>{movie.title}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Trending Section */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>🔥 Trending Now</h2>
              <div style={styles.movieGrid}>
                {trending.map((movie) => (
                  <div
                    key={movie.id}
                    className="movie-card"
                    style={styles.movieCard}
                    onClick={() => router.push(`/movie/${movie.id}`)}
                  >
                    <div style={styles.moviePoster}>
                      {movie.poster ? (
                        <img src={movie.poster} alt={movie.title} style={styles.movieImage} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', fontSize: '12px' }}>
                          No Image
                        </div>
                      )}
                    </div>
                    <p style={styles.movieTitle}>{movie.title}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Latest Section */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>🍿 Latest Movies</h2>
              <div style={styles.movieGrid}>
                {latest.map((movie) => (
                  <div
                    key={movie.id}
                    className="movie-card"
                    style={styles.movieCard}
                    onClick={() => router.push(`/movie/${movie.id}`)}
                  >
                    <div style={styles.moviePoster}>
                      {movie.poster ? (
                        <img src={movie.poster} alt={movie.title} style={styles.movieImage} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', fontSize: '12px' }}>
                          No Image
                        </div>
                      )}
                    </div>
                    <p style={styles.movieTitle}>{movie.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}