import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieById, getSimilarMovies } from "../api/omdb";
import MovieList from "../components/MovieList";

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    async function fetchMovie() {
      setStatus("Loading...");
      const data = await getMovieById(id);

      if (data.Response === "False") {
        setStatus(data.Error || "Movie not found.");
        setMovie(null);
        return;
      }

      setMovie(data);
      setStatus("");

      const similarMovies = await getSimilarMovies(data);
      setSimilar(similarMovies);
    }

    fetchMovie();
  }, [id]);

  if (status) {
    return <p className="status">{status}</p>;
  }

  const hasPoster = movie.Poster && movie.Poster !== "N/A";

  return (
    <div className="movie-details">
      <Link to="/" className="back-link">
        ← Back to search
      </Link>

      <div className="movie-details__content">
        {hasPoster ? (
          <img
            src={movie.Poster}
            alt={`${movie.Title} poster`}
            className="movie-details__poster"
          />
        ) : (
          <div className="movie-details__poster movie-details__poster--fallback">
            No Image
          </div>
        )}

        <div className="movie-details__info">
          <h1>{movie.Title} ({movie.Year})</h1>
          <p><strong>Genre:</strong> {movie.Genre}</p>
          <p><strong>Director:</strong> {movie.Director}</p>
          <p><strong>Actors:</strong> {movie.Actors}</p>
          <p><strong>Rating:</strong> {movie.imdbRating} / 10</p>
          <p className="movie-details__plot">{movie.Plot}</p>
        </div>
      </div>

      {similar.length > 0 && (
        <div className="similar-section">
          <h2 className="similar-section__title">Similar Movies</h2>
          <MovieList movies={similar} />
        </div>
      )}
    </div>
  );
}

export default MovieDetails;