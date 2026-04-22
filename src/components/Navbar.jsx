import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, Menu, X, Film, Tv, Home } from 'lucide-react'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMenuOpen(false); setSearchOpen(false) }, [location.pathname])

  const handleSearch = (e) => {
    e.preventDefault()
    if (q.trim()) { navigate(`/search?q=${encodeURIComponent(q.trim())}`); setQ(''); setSearchOpen(false) }
  }

  const links = [
    { to: '/', label: 'Home', icon: <Home size={15} /> },
    { to: '/movies', label: 'Movies', icon: <Film size={15} /> },
    { to: '/anime', label: 'Anime', icon: <Tv size={15} /> },
  ]

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-inner">
        <Link to="/" className="nav-logo"><span className="logo-accent">T</span>UNZIFY</Link>
        <ul className="nav-links">
          {links.map(({ to, label, icon }) => (
            <li key={to}>
              <Link to={to} className={`nav-link ${location.pathname === to ? 'active' : ''}`}>
                {icon}{label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="nav-right">
          <button className="nav-icon-btn" onClick={() => setSearchOpen(s => !s)}><Search size={19} /></button>
          <button className="nav-icon-btn mobile-only" onClick={() => setMenuOpen(s => !s)}>
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      <div className={`nav-search-bar ${searchOpen ? 'open' : ''}`}>
        <form onSubmit={handleSearch} className="nav-search-form container">
          <Search size={17} className="ns-icon" />
          <input autoFocus={searchOpen} type="text" placeholder="Search movies, anime..." value={q} onChange={e => setQ(e.target.value)} />
          <button type="submit" className="ns-btn">Search</button>
        </form>
      </div>

      <div className={`mobile-nav ${menuOpen ? 'open' : ''}`}>
        {links.map(({ to, label, icon }) => (
          <Link key={to} to={to} className={`mn-link ${location.pathname === to ? 'active' : ''}`}>
            {icon}{label}
          </Link>
        ))}
        <form onSubmit={handleSearch} className="mn-search">
          <Search size={15} />
          <input type="text" placeholder="Search..." value={q} onChange={e => setQ(e.target.value)} />
        </form>
      </div>
    </nav>
  )
}
