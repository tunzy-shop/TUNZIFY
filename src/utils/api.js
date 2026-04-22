const BASE = 'https://apis.davidcyril.name.ng'

async function get(path) {
  try {
    const res = await fetch(`${BASE}${path}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (e) {
    console.warn('[TUNZIFY API]', path, e.message)
    return null
  }
}

export const fzmovies = {
  search: (q, limit = 12) => get(`/movies/fzmovies/search?q=${encodeURIComponent(q)}&limit=${limit}`),
  latest: (page = 1, limit = 20) => get(`/movies/fzmovies/latest?page=${page}&limit=${limit}`),
  info: (url) => get(`/movies/fzmovies/info?url=${encodeURIComponent(url)}`),
  download: (url) => get(`/movies/fzmovies/download?url=${encodeURIComponent(url)}`),
}

export const nkiri = {
  search: (q, limit = 12) => get(`/movies/nkiri/search?q=${encodeURIComponent(q)}&limit=${limit}`),
  latest: (category = 'international', page = 1, limit = 20) => get(`/movies/latest?category=${category}&page=${page}&limit=${limit}`),
  info: (url) => get(`/movies/nkiri/info?url=${encodeURIComponent(url)}`),
  download: (url) => get(`/movies/nkiri/download?url=${encodeURIComponent(url)}`),
}

export const streamx = {
  search: (q, limit = 12) => get(`/movies/streamx/search?q=${encodeURIComponent(q)}&limit=${limit}`),
  latest: (page = 1, limit = 20) => get(`/movies/streamx/latest?page=${page}&limit=${limit}`),
  info: (url) => get(`/movies/streamx/info?url=${encodeURIComponent(url)}`),
}

export const flixzone = {
  home: () => get(`/movies/flixzone/home`),
  genre: (genre, page = 1) => get(`/movies/flixzone/genre?genre=${genre}&page=${page}`),
  info: (url) => get(`/movies/flixzone/info?url=${encodeURIComponent(url)}`),
}

export const mynetnaija = {
  search: (q, limit = 12) => get(`/movies/mynetnaija/search?q=${encodeURIComponent(q)}&limit=${limit}`),
  latest: (page = 1, limit = 20) => get(`/movies/mynetnaija/latest?page=${page}&limit=${limit}`),
  info: (url) => get(`/movies/mynetnaija/info?url=${encodeURIComponent(url)}`),
}

export const naijaprey = {
  search: (q, limit = 12) => get(`/movies/naijaprey/search?q=${encodeURIComponent(q)}&limit=${limit}`),
  latest: (page = 1, limit = 20) => get(`/movies/naijaprey/latest?page=${page}&limit=${limit}`),
  info: (url) => get(`/movies/naijaprey/info?url=${encodeURIComponent(url)}`),
}

export const anime = {
  search: (q, page = 1, limit = 20) => get(`/anime/search?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`),
  info: (id) => get(`/anime/info?id=${id}`),
  episodes: (id) => get(`/anime/episodes?id=${id}`),
  characters: (id) => get(`/anime/characters?id=${id}`),
  top: (page = 1) => get(`/anime/top?page=${page}`),
  trending: () => get(`/anime/trending`),
  airing: () => get(`/anime/airing`),
  season: () => get(`/anime/season`),
  schedule: () => get(`/anime/schedule`),
}

export function normalizeMovie(raw, source = 'fzmovies') {
  if (!raw) return null
  return {
    id: encodeURIComponent(raw.url || raw.link || raw.id || ''),
    title: raw.title || raw.name || 'Unknown',
    poster: raw.poster || raw.image || raw.cover || raw.thumbnail || null,
    year: raw.year || raw.release_year || null,
    rating: raw.rating || raw.score || null,
    overview: raw.description || raw.overview || raw.synopsis || '',
    genres: raw.genres || raw.genre || [],
    url: raw.url || raw.link || null,
    source,
    raw,
  }
}

export function normalizeAnime(raw) {
  if (!raw) return null
  const entry = raw.entry || raw
  return {
    id: entry.mal_id || entry.id || '',
    title: entry.title || entry.name || 'Unknown',
    poster: entry.images?.jpg?.large_image_url || entry.images?.jpg?.image_url || entry.image || null,
    year: entry.year || entry.aired?.prop?.from?.year || null,
    rating: entry.score || entry.rating || null,
    overview: entry.synopsis || entry.description || '',
    genres: entry.genres || [],
    episodes: entry.episodes || null,
    status: entry.status || null,
    source: 'anime',
    raw: entry,
  }
}

export async function fetchHomepage() {
  const [fzLatest, nkiriLatest, streamxLatest, flixHome, animeTop, animeTrending] =
    await Promise.allSettled([
      fzmovies.latest(1, 12),
      nkiri.latest('international', 1, 12),
      streamx.latest(1, 12),
      flixzone.home(),
      anime.top(1),
      anime.trending(),
    ])

  const parse = (r) => {
    if (r.status !== 'fulfilled' || !r.value) return []
    return r.value.results || r.value.data || r.value.movies || r.value.anime || r.value || []
  }

  return {
    fzmovies: parse(fzLatest).slice(0, 12).map(m => normalizeMovie(m, 'fzmovies')),
    nkiri: parse(nkiriLatest).slice(0, 12).map(m => normalizeMovie(m, 'nkiri')),
    streamx: parse(streamxLatest).slice(0, 12).map(m => normalizeMovie(m, 'streamx')),
    flixzone: parse(flixHome).slice(0, 12).map(m => normalizeMovie(m, 'flixzone')),
    animeTop: parse(animeTop).slice(0, 12).map(normalizeAnime),
    animeTrending: parse(animeTrending).slice(0, 12).map(normalizeAnime),
  }
}

export async function searchAll(q) {
  const [fz, nk, sx, mnj, animeRes] = await Promise.allSettled([
    fzmovies.search(q, 10),
    nkiri.search(q, 10),
    streamx.search(q, 10),
    mynetnaija.search(q, 10),
    anime.search(q, 1, 10),
  ])

  const parseMovies = (r, src) => {
    if (r.status !== 'fulfilled' || !r.value) return []
    const arr = r.value.results || r.value.data || r.value.movies || r.value || []
    return Array.isArray(arr) ? arr.map(m => normalizeMovie(m, src)) : []
  }
  const parseAnime = (r) => {
    if (r.status !== 'fulfilled' || !r.value) return []
    const arr = r.value.data || r.value.results || r.value || []
    return Array.isArray(arr) ? arr.map(normalizeAnime) : []
  }

  return {
    fzmovies: parseMovies(fz, 'fzmovies'),
    nkiri: parseMovies(nk, 'nkiri'),
    streamx: parseMovies(sx, 'streamx'),
    mynetnaija: parseMovies(mnj, 'mynetnaija'),
    anime: parseAnime(animeRes),
  }
}

export const SOURCE_LABELS = {
  fzmovies: 'FZMovies', nkiri: 'Nkiri', streamx: 'Stream-X',
  flixzone: 'FlixZone', mynetnaija: 'MyNetNaija', naijaprey: 'NaijaPrey', anime: 'Anime',
}

export const SOURCE_COLORS = {
  fzmovies: 'badge-fzmovies', nkiri: 'badge-nkiri', streamx: 'badge-streamx',
  flixzone: 'badge-flixzone', mynetnaija: 'badge-mynetnaija', anime: 'badge-anime',
}
