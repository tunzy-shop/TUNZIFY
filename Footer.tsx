import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="container-x py-12 flex flex-col items-center text-center gap-4">
        <Link to="/" className="text-2xl font-black tracking-tight">
          <span className="text-gold">T</span>
          <span className="text-foreground">UNZIFY</span>
        </Link>
        <p className="text-sm text-muted-foreground max-w-md">
          Stream &amp; download movies, series and anime — premium experience, zero cost.
        </p>
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link to="/movies" className="text-muted-foreground hover:text-gold transition">
            Movies
          </Link>
          <Link to="/tv" className="text-muted-foreground hover:text-gold transition">
            TV Shows
          </Link>
          <Link to="/anime" className="text-muted-foreground hover:text-gold transition">
            Anime
          </Link>
        </div>
        <p className="text-xs text-muted-foreground/70 mt-2">
          © {new Date().getFullYear()} TUNZIFY. Crafted with 💙 &amp; gold.
        </p>
      </div>
    </footer>
  );
}
