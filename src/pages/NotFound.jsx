import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, textAlign: 'center', padding: '0 20px' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 120, fontWeight: 700, color: 'var(--blue-accent)', lineHeight: 1 }}>404</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--white)' }}>Page Not Found</h2>
      <p style={{ color: 'var(--silver-dim)', fontSize: 15, maxWidth: 380 }}>The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-stream">← Back to Home</Link>
    </div>
  )
}
