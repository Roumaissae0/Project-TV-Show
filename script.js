const episodeCache = {};
let allShows = [];

function getEpisodeCode(episode) {
  const season = String(episode.season).padStart(2, "0");
  const number = String(episode.number).padStart(2, "0");
  return `S${season}E${number}`;
}

function renderEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  episodeList.forEach((episode) => {
    const card = document.createElement("section");
    const code = getEpisodeCode(episode);
    card.id = `episode-${code}`;
    card.innerHTML = `
      <h2>${episode.name} - ${code}</h2>
      <img src="${episode.image.medium}" alt="${episode.name}" />
      <div>${episode.summary}</div>
      <p><a href="${episode.url}" target="_blank">Watch on TVMaze</a></p>
    `;
    rootElem.appendChild(card);
  });

  const credit = document.createElement("p");
  credit.innerHTML = `Data originally from <a href="https://tvmaze.com/" target="_blank">TVMaze.com</a>`;
  rootElem.appendChild(credit);
}

function filterEpisodes(allEpisodes, searchTerm) {
  const term = searchTerm.toLowerCase();
  return allEpisodes.filter((episode) => {
    const inName = episode.name.toLowerCase().includes(term);
    const inSummary = episode.summary.toLowerCase().includes(term);
    return inName || inSummary;
  });
}

function createSearchUI(allEpisodes) {
  const controls = document.getElementById("controls");
  controls.innerHTML = "";

  const searchLabel = document.createElement("label");
  searchLabel.setAttribute("for", "search-input");
  searchLabel.textContent = "Search episodes: ";

  const searchInput = document.createElement("input");
  searchInput.type = "search";
  searchInput.id = "search-input";
  searchInput.placeholder = "e.g. winter";
  searchInput.setAttribute("aria-label", "Search episodes by name or summary");

  const countDisplay = document.createElement("p");
  countDisplay.id = "episode-count";
  countDisplay.setAttribute("aria-live", "polite");
  countDisplay.textContent = `Showing ${allEpisodes.length} of ${allEpisodes.length} episode(s)`;

  controls.appendChild(searchLabel);
  controls.appendChild(searchInput);
  controls.appendChild(countDisplay);

  searchInput.addEventListener("input", () => {
    const term = searchInput.value;
    const matched = term ? filterEpisodes(allEpisodes, term) : allEpisodes;
    renderEpisodes(matched);
    countDisplay.textContent = `Showing ${matched.length} of ${allEpisodes.length} episode(s)`;
  });
}

function createEpisodeSelector(allEpisodes) {
  const controls = document.getElementById("controls");

  const selectLabel = document.createElement("label");
  selectLabel.setAttribute("for", "episode-select");
  selectLabel.textContent = "Jump to episode: ";

  const select = document.createElement("select");
  select.id = "episode-select";
  select.setAttribute("aria-label", "Jump to a specific episode");

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "-- Select an episode --";
  select.appendChild(defaultOption);

  allEpisodes.forEach((episode) => {
    const code = getEpisodeCode(episode);
    const option = document.createElement("option");
    option.value = code;
    option.textContent = `${code} - ${episode.name}`;
    select.appendChild(option);
  });

  controls.appendChild(selectLabel);
  controls.appendChild(select);

  select.addEventListener("change", () => {
    const selectedCode = select.value;
    if (!selectedCode) return;
    const target = document.getElementById(`episode-${selectedCode}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
}

function showLoadingMessage() {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "<p>Loading episodes, please wait...</p>";
}

function showErrorMessage() {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "<p>Something went wrong loading the episodes. Please try refreshing the page.</p>";
}

async function fetchEpisodes(showId) {
  if (episodeCache[showId]) {
    return episodeCache[showId];
  }
  const response = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
  if (!response.ok) {
    throw new Error("Failed to fetch episodes");
  }
  const episodes = await response.json();
  episodeCache[showId] = episodes;
  return episodes;
}

async function fetchShows() {
  const response = await fetch("https://api.tvmaze.com/shows");
  if (!response.ok) {
    throw new Error("Failed to fetch shows");
  }
  return response.json();
}

function filterShows(shows, searchTerm) {
  const term = searchTerm.toLowerCase();
  return shows.filter((show) => {
    const inName = show.name.toLowerCase().includes(term);
    const inSummary = show.summary ? show.summary.toLowerCase().includes(term) : false;
    const inGenres = show.genres.some((genre) => genre.toLowerCase().includes(term));
    return inName || inSummary || inGenres;
  });
}

function renderShows(shows) {
  const showsListing = document.getElementById("shows-listing");
  const showCount = document.getElementById("show-count");
  showsListing.innerHTML = "";

  showCount.textContent = `Showing ${shows.length} of ${allShows.length} show(s)`;

  shows.forEach((show) => {
    const card = document.createElement("article");
    const image = show.image ? show.image.medium : "https://via.placeholder.com/210x295?text=No+Image";
    card.innerHTML = `
      <img src="${image}" alt="${show.name}" />
      <div>
        <h2><a href="#" class="show-link" data-show-id="${show.id}">${show.name}</a></h2>
        <p><strong>Genres:</strong> ${show.genres.join(", ") || "N/A"}</p>
        <p><strong>Status:</strong> ${show.status}</p>
        <p><strong>Rating:</strong> ${show.rating.average || "N/A"}</p>
        <p><strong>Runtime:</strong> ${show.runtime || "N/A"} mins</p>
        <div>${show.summary || "No summary available"}</div>
      </div>
    `;
    showsListing.appendChild(card);
  });

  document.querySelectorAll(".show-link").forEach((link) => {
    link.addEventListener("click", async (e) => {
      e.preventDefault();
      const showId = link.dataset.showId;
      showEpisodesView();
      showLoadingMessage();
      try {
        const episodes = await fetchEpisodes(showId);
        renderEpisodes(episodes);
        createSearchUI(episodes);
        createEpisodeSelector(episodes);
      } catch (error) {
        showErrorMessage();
      }
    });
  });
}

function showEpisodesView() {
  document.getElementById("shows-view").hidden = true;
  document.getElementById("episodes-view").hidden = false;
  document.getElementById("back-to-shows").hidden = false;
}

function showShowsView() {
  document.getElementById("shows-view").hidden = false;
  document.getElementById("episodes-view").hidden = true;
  document.getElementById("back-to-shows").hidden = true;
}

function createShowSelector(shows) {
  const select = document.getElementById("show-select");
  select.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "-- Select a show --";
  select.appendChild(defaultOption);

  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    if (!select.value) return;
    const target = document.querySelector(`[data-show-id="${select.value}"]`);
    if (target) target.closest("article").scrollIntoView({ behavior: "smooth" });
  });
}

async function setup() {
  document.getElementById("back-to-shows").hidden = true;
  document.getElementById("shows-listing").innerHTML = "<p>Loading shows, please wait...</p>";

  try {
    allShows = await fetchShows();

    const sortedShows = [...allShows].sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );

    allShows = sortedShows;
    renderShows(allShows);
    createShowSelector(allShows);

    document.getElementById("show-search").addEventListener("input", (e) => {
      const matched = e.target.value ? filterShows(allShows, e.target.value) : allShows;
      renderShows(matched);
      createShowSelector(matched);
    });

    document.getElementById("back-to-shows").addEventListener("click", (e) => {
      e.preventDefault();
      showShowsView();
    });

  } catch (error) {
    document.getElementById("shows-listing").innerHTML = "<p>Something went wrong loading the shows. Please try refreshing the page.</p>";
  }
}

window.onload = setup;
