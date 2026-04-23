const TMDB_KEY = '3df78af4e6449fd8905211ad16707439'
const TMDB = 'https://api.themoviedb.org/3'
const IMG = 'https://image.tmdb.org/t/p'
const FZ_BASE = 'https://apis.davidcyril.name.ng'

// ── IMAGE HELPERS ─────────────────────────────────────────────
export const poster = (path, size = 'w500') => path ? `${IMG}/${size}${path}` : null
export const backdrop = (path) => path ? `${IMG}/original${path}` : null

// ── TMDB FETCH ────────────────────────────────────────────────
async function tmdb(path) {
  try {
    const res = await fetch(`${TMDB}${path}${path.includes('?') ? '&' : '?'}api_key=${TMDB_KEY}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (e) {
    console.warn('[TMDB]', path, e.message)
    return null
  }
}

// ── FZ FETCH ──────────────────────────────────────────────────
async function fz(path) {
  try {
    const res = await fetch(`${FZ_BASE}${path}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (e) {
    console.warn('[FZ]', path, e.message)
    return null
  }
}

// ── MOVIES ────────────────────────────────────────────────────
export const movies = {
  trending: () => tmdb('/trending/movie/week'),
  popular: () => tmdb('/movie/popular'),
  topRated: () => tmdb('/movie/top_rated'),
  nowPlaying: () => tmdb('/movie/now_playing'),
  upcoming: () => tmdb('/movie/upcoming'),
  search: (q) => tmdb(`/search/movie?query=${encodeURIComponent(q)}`),
  detail: (id) => tmdb(`/movie/${id}?append_to_response=credits,videos,similar`),
  byGenre: (genreId, page = 1) => tmdb(`/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=${page}`),
}

// ── TV SHOWS ──────────────────────────────────────────────────
export const tv = {
  trending: () => tmdb('/trending/tv/week'),
  popular: () => tmdb('/tv/popular'),
  topRated: () => tmdb('/tv/top_rated'),
  onAir: () => tmdb('/tv/on_the_air'),
  search: (q) => tmdb(`/search/tv?query=${encodeURIComponent(q)}`),
  detail: (id) => tmdb(`/tv/${id}?append_to_response=credits,videos,similar`),
  byGenre: (genreId, page = 1) => tmdb(`/discover/tv?with_genres=${genreId}&sort_by=popularity.desc&page=${page}`),
}

// ── ANIME (TV with animation genre = 16) ─────────────────────
export const animeList = {
  trending: () => tmdb('/trending/tv/week?with_genres=16'),
  popular: () => tmdb('/discover/tv?with_genres=16&sort_by=popularity.desc'),
  topRated: () => tmdb('/discover/tv?with_genres=16&sort_by=vote_average.desc&vote_count.gte=1000'),
}

// ── MULTI SEARCH ─────────────────────────────────────────────
export const searchMulti = (q) => tmdb(`/search/multi?query=${encodeURIComponent(q)}`)

// ── GENRES ────────────────────────────────────────────────────
export const MOVIE_GENRES = {
  action: 28, adventure: 12, animation: 16, comedy: 35,
  crime: 80, documentary: 99, drama: 18, family: 10751,
  fantasy: 14, horror: 27, romance: 10749,
  scifi: 878, thriller: 53, war: 10752,
}

export const TV_GENRES = {
  action: 10759, animation: 16, comedy: 35, crime: 80,
  drama: 18, family: 10751, kids: 10762, mystery: 9648,
  reality: 10764, scifi: 10765, soap: 10766, talk: 10767,
}

// ── VIDSRC STREAMING URLS ────────────────────────────────────
export const streamUrl = {
  movie: (tmdbId) => `https://vidsrc.to/embed/movie/${tmdbId}`,
  tv: (tmdbId, season = 1, episode = 1) => `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`,
  // Backup sources
  movie2: (tmdbId) => `https://vidsrc.xyz/embed/movie?tmdb=${tmdbId}`,
  tv2: (tmdbId, season = 1, episode = 1) => `https://vidsrc.xyz/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`,
  movie3: (tmdbId) => `https://embed.su/embed/movie/${tmdbId}`,
}

// ── FZMOVIES DOWNLOAD ─────────────────────────────────────────
export const fzmovies = {
  search: (q, limit = 10) => fz(`/movies/fzmovies/search?q=${encodeURIComponent(q)}&limit=${limit}`),
  download: (url) => fz(`/movies/fzmovies/download?url=${encodeURIComponent(url)}`),
  info: (url) => fz(`/movies/fzmovies/info?url=${encodeURIComponent(url)}`),
  latest: (page = 1) => fz(`/movies/fzmovies/latest?page=${page}&limit=20`),
}

// ── NORMALIZE TMDB ITEM ───────────────────────────────────────
export function normalizeItem(raw, type = 'movie') {
  if (!raw) return null
  const isMovie = type === 'movie' || raw.media_type === 'movie' || raw.title
  return {
    id: raw.id,
    tmdbId: raw.id,
    title: raw.title || raw.name || 'Unknown',
    poster: poster(raw.poster_path),
    backdrop: backdrop(raw.backdrop_path),
    overview: raw.overview || '',
    rating: raw.vote_average ? raw.vote_average.toFixed(1) : null,
    year: (raw.release_date || raw.first_air_date || '').slice(0, 4),
    genres: raw.genres || raw.genre_ids || [],
    type: raw.media_type || (isMovie ? 'movie' : 'tv'),
    raw,
  }
}

// ── HOMEPAGE DATA ─────────────────────────────────────────────
export async function fetchHomepage() {
  const [
    trendMovies, trendTv, popular, nowPlaying,
    topRated, actionMovies, horrorMovies,
    nollywood, kdrama, anime
  ] = await Promise.allSettled([
    movies.trending(),
    tv.trending(),
    movies.popular(),
    movies.nowPlaying(),
    movies.topRated(),
    movies.byGenre(MOVIE_GENRES.action),
    movies.byGenre(MOVIE_GENRES.horror),
    tv.byGenre(TV_GENRES.drama),
    tmdb('/discover/tv?with_origin_country=KR&sort_by=popularity.desc'),
    animeList.popular(),
  ])

  const parse = (r, type = 'movie') => {
    if (r.status !== 'fulfilled' || !r.value) return []
    return (r.value.results || []).map(i => normalizeItem(i, type))
  }

  return {
    trendMovies: parse(trendMovies, 'movie'),
    trendTv: parse(trendTv, 'tv'),
    popular: parse(popular, 'movie'),
    nowPlaying: parse(nowPlaying, 'movie'),
    topRated: parse(topRated, 'movie'),
    action: parse(actionMovies, 'movie'),
    horror: parse(horrorMovies, 'movie'),
    nollywood: parse(nollywood, 'tv'),
    kdrama: parse(kdrama, 'tv'),
    anime: parse(anime, 'tv'),
  }
}