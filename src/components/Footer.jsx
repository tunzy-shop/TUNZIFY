import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <Link to="/" className="footer-logo"><span>T</span>UNZIFY</Link>
        <p className="footer-tagline">Stream &amp; Download Movies and Anime — Free</p>
        <div className="footer-links">
          <Link to="/movies">Movies</Link>
          <Link to="/anime">Anime</Link>
          <Link to="/search">Search</Link>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} TUNZIFY. All rights reserved.</p>
      </div>
    </footer>
  )
}
