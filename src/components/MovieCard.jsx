import { Link } from "react-router-dom";
import { useState } from "react";

function MovieCard({ movie }) {
  const [imgError, setImgError] = useState(false);
  const hasPoster = movie.Poster && movie.Poster !== "N/A" && !imgError;

  return (
    <Link to={`/movie/${movie.imdbID}`} className="card">
      <div className="card__poster">
        {hasPoster ? (
          <img
            src={movie.Poster}
            alt={`${movie.Title} poster`}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="card__fallback">No Image</div>
        )}
      </div>
      <div className="card__body">
        <h3 className="card__title">{movie.Title}</h3>
        <div className="card__year">{movie.Year}</div>
      </div>
    </Link>
  );
}

export default MovieCard;