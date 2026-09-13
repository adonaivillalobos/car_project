import MovieCard from "./MovieCard";

function MovieList({ movies }) {
  if (!movies.length) {
    return <p className="status">No movies to show.</p>;
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard movie={movie} key={movie.imdbID} />
      ))}
    </div>
  );
}

export default MovieList;