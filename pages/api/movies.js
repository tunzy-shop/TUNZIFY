import axios from 'axios';

const API_BASE = 'https://apis.davidcyril.name.ng';

// Map raw API result to clean movie object
function mapMovie(m) {
  return {
    id: m.slug || m.id || m._id,
    title: m.title || m.name,
    description: m.description || m.plot || m.overview || '',
    poster: m.poster || m.image || m.cover || m.thumbnail || '',
    year: m.year || m.date?.split?.(' ')?.[0] || m.releaseDate?.split?.('-')?.[0] || '',
    rating: m.rating || m.imdbRating || '',
    categories: m.categories || m.genres || m.tags || [],
  };
}

export default async function handler(req, res) {
  const { type, query, id, limit = 20 } = req.query;

  try {
    // TRENDING
    if (type === 'trending') {
      let movies = [];

      // Try fzmovies trending first, fallback to latest
      const endpoints = [
        `${API_BASE}/movies/fzmovies/trending`,
        `${API_BASE}/movies/fzmovies/latest`,
        `${API_BASE}/movies/latest`,
      ];

      for (const url of endpoints) {
        try {
          const r = await axios.get(url, { params: { limit }, timeout: 8000 });
          const raw = r.data?.results || r.data?.movies || r.data?.data || r.data || [];
          if (Array.isArray(raw) && raw.length > 0) {
            movies = raw.map(mapMovie);
            break;
          }
        } catch {}
      }

      return res.status(200).json(movies);
    }

    // LATEST
    if (type === 'latest') {
      let movies = [];

      const endpoints = [
        `${API_BASE}/movies/fzmovies/latest`,
        `${API_BASE}/movies/latest`,
      ];

      for (const url of endpoints) {
        try {
          const r = await axios.get(url, { params: { limit }, timeout: 8000 });
          const raw = r.data?.results || r.data?.movies || r.data?.data || r.data || [];
          if (Array.isArray(raw) && raw.length > 0) {
            movies = raw.map(mapMovie);
            break;
          }
        } catch {}
      }

      return res.status(200).json(movies);
    }

    // SEARCH
    if (type === 'search' && query) {
      let movies = [];

      const endpoints = [
        { url: `${API_BASE}/movies/fzmovies/search`, params: { q: query, limit } },
        { url: `${API_BASE}/movies/search`, params: { query, limit } },
      ];

      for (const ep of endpoints) {
        try {
          const r = await axios.get(ep.url, { params: ep.params, timeout: 8000 });
          const raw = r.data?.results || r.data?.movies || r.data?.data || r.data || [];
          if (Array.isArray(raw) && raw.length > 0) {
            movies = raw.map(mapMovie);
            break;
          }
        } catch {}
      }

      return res.status(200).json(movies);
    }

    // DETAILS
    if (type === 'details' && id) {
      const endpoints = [
        { url: `${API_BASE}/movies/fzmovies/info`, params: { slug: id } },
        { url: `${API_BASE}/movies/fzmovies/details`, params: { slug: id } },
        { url: `${API_BASE}/movies/info`, params: { id } },
      ];

      for (const ep of endpoints) {
        try {
          const r = await axios.get(ep.url, { params: ep.params, timeout: 8000 });
          if (r.data && (r.data.title || r.data.name)) {
            return res.status(200).json(mapMovie(r.data));
          }
        } catch {}
      }

      return res.status(404).json({ error: 'Movie not found' });
    }

    // DOWNLOAD
    if (type === 'download' && id) {
      const endpoints = [
        { url: `${API_BASE}/movies/fzmovies/download`, params: { slug: id } },
        { url: `${API_BASE}/movies/download`, params: { id } },
      ];

      for (const ep of endpoints) {
        try {
          const r = await axios.get(ep.url, { params: ep.params, timeout: 8000 });
          if (r.data) return res.status(200).json(r.data);
        } catch {}
      }

      return res.status(200).json({ links: [] });
    }

    res.status(400).json({ error: 'Invalid request type' });
  } catch (error) {
    console.error('API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
