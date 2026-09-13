import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import MovieList from "../components/MovieList";
import { searchMovies, getFeaturedMovies } from "../api/omdb";

function Home() {
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState("Loading featured movies...");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    loadFeatured();
  }, []);

  async function loadFeatured() {
    setStatus("Loading featured movies...");
    const featured = await getFeaturedMovies();
    setStatus("Featured movies");
    setMovies(featured);
  }

  async function handleSearch(title) {
    if (!title) {
      loadFeatured();
      return;
    }

    setStatus("Searching...");
    const data = await searchMovies(title);

    if (data.Response === "False") {
      setStatus(data.Error || "No results found.");
      setMovies([]);
      return;
    }

    setStatus(`${data.totalResults} results for "${title}"`);
    setMovies(data.Search);
  }

  function sortedMovies() {
    const sorted = [...movies].sort(
      (a, b) => Number(a.Year) - Number(b.Year)
    );
    return sortOrder === "oldest" ? sorted : sorted.reverse();
  }

  return (
    <div className="home">
      <SearchBar onSearch={handleSearch} />

      <div className="controls">
        <label htmlFor="sort">Sort by year:</label>
        <select
          id="sort"
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      <p className="status">{status}</p>
      <MovieList movies={sortedMovies()} />
    </div>
  );
}

export default Home;