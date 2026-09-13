import { useState } from "react";

function SearchBar({ onSearch }) {
  const [title, setTitle] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(title.trim());
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search for a movie..."
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchBar;