// TMDB + streaming source helpers for TUNZIFY
const TMDB_KEY = "3df78af4e6449fd8905211ad16707439";
const TMDB = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p";

export type MediaType = "movie" | "tv" | "anime";

export interface MediaItem {
  id: number;
  title: string;
  poster: string | null;
  backdrop: string | null;
  overview: string;
  rating: string | null;
  year: string;
  type: MediaType;
  raw?: any;
}

export const poster = (path?: string | null, size = "w500") =>
  path ? `${IMG}/${size}${path}` : null;
export const backdrop = (path?: string | null) =>
  path ? `${IMG}/original${path}` : null;

export async function tmdb<T = any>(path: string): Promise<T | null> {
  try {
    const sep = path.includes("?") ? "&" : "?";
    const res = await fetch(`${TMDB}${path}${sep}api_key=${TMDB_KEY}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch (e) {
    console.warn("[TMDB]", path, (e as Error).message);
    return null;
  }
}

export const movies = {
  trending: () => tmdb("/trending/movie/week"),
  popular: () => tmdb("/movie/popular"),
  topRated: () => tmdb("/movie/top_rated"),
  nowPlaying: () => tmdb("/movie/now_playing"),
  upcoming: () => tmdb("/movie/upcoming"),
  search: (q: string) => tmdb(`/search/movie?query=${encodeURIComponent(q)}`),
  detail: (id: string | number) =>
    tmdb(`/movie/${id}?append_to_response=credits,videos,similar`),
  byGenre: (genreId: number, page = 1) =>
    tmdb(`/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=${page}`),
};

export const tv = {
  trending: () => tmdb("/trending/tv/week"),
  popular: () => tmdb("/tv/popular"),
  topRated: () => tmdb("/tv/top_rated"),
  onAir: () => tmdb("/tv/on_the_air"),
  search: (q: string) => tmdb(`/search/tv?query=${encodeURIComponent(q)}`),
  detail: (id: string | number) =>
    tmdb(`/tv/${id}?append_to_response=credits,videos,similar`),
  byGenre: (genreId: number, page = 1) =>
    tmdb(`/discover/tv?with_genres=${genreId}&sort_by=popularity.desc&page=${page}`),
};

export const animeList = {
  trending: () => tmdb("/trending/tv/week?with_genres=16"),
  popular: () => tmdb("/discover/tv?with_genres=16&sort_by=popularity.desc"),
  topRated: () =>
    tmdb("/discover/tv?with_genres=16&sort_by=vote_average.desc&vote_count.gte=1000"),
};

export const searchMulti = (q: string) =>
  tmdb(`/search/multi?query=${encodeURIComponent(q)}`);

export const MOVIE_GENRES = {
  action: 28, adventure: 12, animation: 16, comedy: 35, crime: 80,
  documentary: 99, drama: 18, family: 10751, fantasy: 14, horror: 27,
  romance: 10749, scifi: 878, thriller: 53, war: 10752,
};

export const TV_GENRES = {
  action: 10759, animation: 16, comedy: 35, crime: 80, drama: 18,
  family: 10751, kids: 10762, mystery: 9648, reality: 10764,
  scifi: 10765, soap: 10766, talk: 10767,
};

export const streamUrl = {
  movie: (id: string | number) => `https://vidsrc.to/embed/movie/${id}`,
  tv: (id: string | number, season = 1, episode = 1) =>
    `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`,
  movie2: (id: string | number) => `https://vidsrc.xyz/embed/movie?tmdb=${id}`,
  tv2: (id: string | number, season = 1, episode = 1) =>
    `https://vidsrc.xyz/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`,
  movie3: (id: string | number) => `https://embed.su/embed/movie/${id}`,
};

export function normalizeItem(raw: any, type: MediaType = "movie"): MediaItem | null {
  if (!raw) return null;
  const isMovie = type === "movie" || raw.media_type === "movie" || raw.title;
  return {
    id: raw.id,
    title: raw.title || raw.name || "Unknown",
    poster: poster(raw.poster_path),
    backdrop: backdrop(raw.backdrop_path),
    overview: raw.overview || "",
    rating: raw.vote_average ? raw.vote_average.toFixed(1) : null,
    year: (raw.release_date || raw.first_air_date || "").slice(0, 4),
    type: (raw.media_type as MediaType) || (isMovie ? "movie" : "tv"),
    raw,
  };
}

export async function fetchHomepage() {
  const [trendMovies, trendTv, popular, nowPlaying, topRated, action, horror, kdrama, anime] =
    await Promise.allSettled([
      movies.trending(),
      tv.trending(),
      movies.popular(),
      movies.nowPlaying(),
      movies.topRated(),
      movies.byGenre(MOVIE_GENRES.action),
      movies.byGenre(MOVIE_GENRES.horror),
      tmdb("/discover/tv?with_origin_country=KR&sort_by=popularity.desc"),
      animeList.popular(),
    ]);

  const parse = (r: PromiseSettledResult<any>, type: MediaType = "movie"): MediaItem[] => {
    if (r.status !== "fulfilled" || !r.value) return [];
    return (r.value.results || [])
      .map((i: any) => normalizeItem(i, type))
      .filter(Boolean) as MediaItem[];
  };

  return {
    trendMovies: parse(trendMovies, "movie"),
    trendTv: parse(trendTv, "tv"),
    popular: parse(popular, "movie"),
    nowPlaying: parse(nowPlaying, "movie"),
    topRated: parse(topRated, "movie"),
    action: parse(action, "movie"),
    horror: parse(horror, "movie"),
    kdrama: parse(kdrama, "tv"),
    anime: parse(anime, "tv"),
  };
}
