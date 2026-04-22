import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import MediaCard from './MediaCard'
import './SectionRow.css'

export default function SectionRow({ title, emoji, items = [], viewAllLink, loading }) {
  return (
    <section className="srow">
      <div className="container">
        <div className="srow-header">
          <h2 className="srow-title">
            <span className="srow-bar" />
            {emoji && <span>{emoji}</span>}
            {title}
          </h2>
          {viewAllLink && (
            <Link to={viewAllLink} className="srow-viewall">View All <ChevronRight size={15} /></Link>
          )}
        </div>
        <div className="srow-grid">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="srow-skeleton skeleton" style={{ animationDelay: `${i * 0.07}s` }} />
              ))
            : items.slice(0, 20).map((item, i) => (
                <MediaCard key={item?.id || i} item={item} style={{ animationDelay: `${i * 0.05}s` }} />
              ))
          }
        </div>
      </div>
    </section>
