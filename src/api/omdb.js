const API_KEY = process.env.REACT_APP_OMDB_KEY;
const BASE_URL = "https://www.omdbapi.com/";

export async function searchMovies(title, { year, type } = {}) {
  const params = new URLSearchParams({ apikey: API_KEY, s: title });
  if (year) params.set("y", year);
  if (type) params.set("type", type);

  const res = await fetch(`${BASE_URL}?${params.toString()}`);
  return res.json();
}

export async function getMovieById(id) {
  const params = new URLSearchParams({ apikey: API_KEY, i: id, plot: "full" });
  const res = await fetch(`${BASE_URL}?${params.toString()}`);
  return res.json();
}

export const FEATURED_IDS = [
  "tt3896198",
  "tt0468569",
  "tt1375666",
  "tt0111161",
  "tt0110912",
  "tt4154796",
  "tt0133093",
  "tt7286456",
  "tt6751668",
  "tt0816692",
];

export async function getFeaturedMovies() {
  const requests = FEATURED_IDS.map((id) => getMovieById(id));
  const movies = await Promise.all(requests);
  return movies.filter((movie) => movie.Response !== "False");
}

export async function getSimilarMovies(movie, limit = 3) {
  const pool = await getFeaturedMovies();
  const currentGenres = movie.Genre.split(",").map((g) => g.trim());

  const matches = pool.filter((candidate) => {
    if (candidate.imdbID === movie.imdbID) return false;
    const candidateGenres = candidate.Genre.split(",").map((g) => g.trim());
    return candidateGenres.some((genre) => currentGenres.includes(genre));
  });

  return matches.slice(0, limit);
}