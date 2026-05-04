import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { Search, Menu, X, Film, Tv, Home, Sparkles } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      navigate({ to: "/search", search: { q: q.trim() } });
      setQ("");
      setSearchOpen(false);
    }
  };

  const links = [
    { to: "/", label: "Home", icon: <Home size={15} /> },
    { to: "/movies", label: "Movies", icon: <Film size={15} /> },
    { to: "/tv", label: "TV Shows", icon: <Tv size={15} /> },
    { to: "/anime", label: "Anime", icon: <Sparkles size={15} /> },
  ] as const;

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-elevated border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container-x flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-black tracking-tight">
          <span className="text-gold">T</span>
          <span className="text-foreground">UNZIFY</span>
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {links.map(({ to, label, icon }) => {
            const active = location.pathname === to;
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {icon}
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setSearchOpen((s) => !s)}
            className="h-9 w-9 grid place-items-center rounded-full hover:bg-secondary transition"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
          <button
            onClick={() => setMenuOpen((s) => !s)}
            className="md:hidden h-9 w-9 grid place-items-center rounded-full hover:bg-secondary transition"
            aria-label="Menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          searchOpen ? "max-h-20 border-t border-border" : "max-h-0"
        }`}
      >
        <form onSubmit={handleSearch} className="container-x flex items-center gap-2 py-3">
          <Search size={16} className="text-muted-foreground" />
          <input
            autoFocus={searchOpen}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search movies, shows, anime..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="px-4 py-1.5 text-xs font-semibold rounded-full bg-gradient-blue text-primary-foreground shadow-blue"
          >
            Search
          </button>
        </form>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-96 border-t border-border" : "max-h-0"
        }`}
      >
        <div className="container-x py-3 flex flex-col gap-1">
          {links.map(({ to, label, icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active ? "bg-primary/15 text-primary" : "hover:bg-secondary"
                }`}
              >
                {icon}
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
