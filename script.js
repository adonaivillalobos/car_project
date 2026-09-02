const API_KEY = "49cafa56";

// A curated list of featured movies for the homepage — since OMDb has no
// "browse all" endpoint, we fetch these specific titles by ID on load.
const FEATURED_IDS = [
  "tt3896198", // Guardians of the Galaxy Vol. 2
  "tt0468569", // The Dark Knight
  "tt1375666", // Inception
  "tt0111161", // The Shawshank Redemption
  "tt0110912", // Pulp Fiction
  "tt4154796", // Avengers: Endgame
  "tt0133093", // The Matrix
  "tt7286456", // Joker
  "tt6751668", // Parasite
  "tt0816692", // Interstellar
];

const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const status = document.getElementById("status");
const grid = document.getElementById("movie-grid");
const yearFilter = document.getElementById("filter-year");
const typeFilter = document.getElementById("filter-type");
const sortFilter = document.getElementById("filter-sort");

const filmIcon = `
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect x="15" y="15" width="70" height="70" rx="6" fill="none" stroke="#F2F1ED" stroke-width="4"/>
    <line x1="15" y1="35" x2="85" y2="35" stroke="#F2F1ED" stroke-width="4"/>
    <line x1="15" y1="65" x2="85" y2="65" stroke="#F2F1ED" stroke-width="4"/>
    <line x1="30" y1="15" x2="30" y2="35" stroke="#F2F1ED" stroke-width="4"/>
    <line x1="70" y1="15" x2="70" y2="35" stroke="#F2F1ED" stroke-width="4"/>
    <line x1="30" y1="65" x2="30" y2="85" stroke="#F2F1ED" stroke-width="4"/>
    <line x1="70" y1="65" x2="70" y2="85" stroke="#F2F1ED" stroke-width="4"/>
  </svg>
`;

// Renders a set number of placeholder cards while real data is loading
function renderSkeletons(count = 10) {
  grid.innerHTML = Array.from({ length: count })
    .map(
      () => `
        <article class="card card--skeleton">
          <div class="card__poster"></div>
          <div class="card__body">
            <div class="skeleton-line skeleton-line--title"></div>
            <div class="skeleton-line skeleton-line--year"></div>
          </div>
        </article>
      `
    )
    .join("");
}

function sortMovies(movies) {
  const sorted = [...movies].sort((a, b) => Number(a.Year) - Number(b.Year));
  return sortFilter.value === "oldest" ? sorted : sorted.reverse();
}

function renderMovies(movies) {
  const sorted = sortMovies(movies);

  grid.innerHTML = sorted
    .map((movie) => {
      const hasPoster = movie.Poster && movie.Poster !== "N/A";
      return `
        <article class="card">
          <div class="card__poster">
            ${
              hasPoster
                ? `<img src="${movie.Poster}" alt="${movie.Title} poster"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />`
                : ""
            }
            <div class="card__fallback" style="${hasPoster ? "" : "display:flex;"}">${filmIcon}</div>
          </div>
          <div class="card__body">
            <h3 class="card__title">${movie.Title}</h3>
            <div class="card__year">${movie.Year}</div>
          </div>
        </article>
      `;
    })
    .join("");
}

// Loads the curated featured list, fetching each movie by ID,
// then filters/sorts by the current nav controls before rendering.
async function loadFeaturedMovies() {
  status.textContent = "Loading featured movies…";
  renderSkeletons(FEATURED_IDS.length);

  try {
    const requests = FEATURED_IDS.map((id) =>
      fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`).then((res) => res.json())
    );
    let movies = await Promise.all(requests);
    movies = movies.filter((movie) => movie.Response !== "False");

    movies = applyFilters(movies);

    status.textContent = "Featured movies";
    renderMovies(movies);
  } catch (error) {
    status.textContent = "Couldn't load featured movies.";
    console.error(error);
  }
}

// Applies the Year and Type nav filters client-side, since the featured
// list is already fully fetched.
function applyFilters(movies) {
  const year = yearFilter.value.trim();
  const type = typeFilter.value;

  return movies.filter((movie) => {
    const matchesYear = !year || movie.Year.startsWith(year);
    const matchesType = !type || movie.Type === type;
    return matchesYear && matchesType;
  });
}

async function searchMovies(title) {
  status.textContent = "Searching…";
  renderSkeletons();

  const year = yearFilter.value.trim();
  const type = typeFilter.value;

  const params = new URLSearchParams({
    apikey: API_KEY,
    s: title,
  });
  if (year) params.set("y", year);
  if (type) params.set("type", type);

  try {
    const response = await fetch(`https://www.omdbapi.com/?${params.toString()}`);
    const data = await response.json();

    if (data.Response === "False") {
      status.textContent = data.Error || "No results found.";
      grid.innerHTML = "";
      return;
    }

    status.textContent = `${data.totalResults} results for "${title}"`;
    renderMovies(data.Search);
  } catch (error) {
    status.textContent = "Something went wrong. Please try again.";
    console.error(error);
  }
}

function handleSubmit(event) {
  event.preventDefault();
  const title = input.value.trim();
  if (title) {
    searchMovies(title);
  } else {
    loadFeaturedMovies();
  }
}

form.addEventListener("submit", handleSubmit);

// Re-run the current view (search or featured) whenever a filter changes
[yearFilter, typeFilter, sortFilter].forEach((el) => {
  el.addEventListener("change", () => {
    const title = input.value.trim();
    if (title) {
      searchMovies(title);
    } else {
      loadFeaturedMovies();
    }
  });
});

// Show the featured homepage list as soon as the page loads
loadFeaturedMovies();