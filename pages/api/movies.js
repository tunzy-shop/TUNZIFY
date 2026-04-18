import axios from 'axios';

// Using DavidCyril API - FREE, no key needed
const API_BASE = 'https://apis.davidcyril.name.ng';

export default async function handler(req, res) {
  const { type, query, id, limit = 20 } = req.query;

  try {
    // Get trending movies
    if (type === 'trending') {
      const response = await axios.get(`${API_BASE}/movies/fzmovies/latest`, {
        params: { limit: 20 }
      });
      
      const movies = (response.data.results || []).map(m => ({
        id: m.slug,
        title: m.title,
        description: m.description,
        poster: m.poster,
        year: m.date?.split(' ')[0]
      }));
      
      return res.status(200).json(movies);
    }

    // Get latest movies
    if (type === 'latest') {
      const response = await axios.get(`${API_BASE}/movies/fzmovies/latest`, {
        params: { limit: 20 }
      });
      
      const movies = (response.data.results || []).map(m => ({
        id: m.slug,
        title: m.title,
        description: m.description,
        poster: m.poster
      }));
      
      return res.status(200).json(movies);
    }

    // Search movies
    if (type === 'search' && query) {
      const response = await axios.get(`${API_BASE}/movies/fzmovies/search`, {
        params: { q: query, limit: 20 }
      });
      
      const movies = (response.data.results || []).map(m => ({
        id: m.slug,
        title: m.title,
        description: m.description,
        poster: m.poster
      }));
      
      return res.status(200).json(movies);
    }

    // Get movie details
    if (type === 'details' && id) {
      const response = await axios.get(`${API_BASE}/movies/fzmovies/info`, {
        params: { slug: id }
      });
      
      return res.status(200).json(response.data);
    }

    // Get download links
    if (type === 'download' && id) {
      const response = await axios.get(`${API_BASE}/movies/fzmovies/download`, {
        params: { slug: id }
      });
      
      return res.status(200).json(response.data);
    }

    res.status(400).json({ error: 'Invalid request' });
  } catch (error) {
    console.error('API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
}
