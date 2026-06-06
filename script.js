//You can edit ALL of the code here
const SHOWS_URL = "https://api.tvmaze.com/shows";
const DEFAULT_SHOW_ID = "82";

let allEpisodes = [];
let currentShowId = DEFAULT_SHOW_ID;
let showSelect;
let searchInput;
let episodeSelect;
let matchCount;
const fetchCache = {};

async function setup() {
  createControls();
  showLoadingMessage();

  try {
    const episodes = await fetchJson(getEpisodesUrl(DEFAULT_SHOW_ID));
    allEpisodes = episodes;
    populateEpisodeSelect(allEpisodes);
    makePageForEpisodes(allEpisodes);
    updateMatchCount(allEpisodes.length);
  } catch (error) {
    showErrorMessage("Could not load episodes. Please refresh the page.");
    console.error(error);
  }

  loadShows();
}

function createControls() {
  const rootElem = document.getElementById("root");
  const controls = document.createElement("section");
  controls.className = "episode-controls";

  const showLabel = document.createElement("label");
  showLabel.htmlFor = "show-select";
  showLabel.textContent = "Choose show";

  showSelect = document.createElement("select");
  showSelect.id = "show-select";
  showSelect.disabled = true;
  showSelect.addEventListener("change", handleShowSelect);

  const loadingOption = document.createElement("option");
  loadingOption.value = "";
  loadingOption.textContent = "Loading shows...";
  showSelect.appendChild(loadingOption);

  const searchLabel = document.createElement("label");
  searchLabel.htmlFor = "episode-search";
  searchLabel.textContent = "Search episodes";

  searchInput = document.createElement("input");
  searchInput.id = "episode-search";
  searchInput.type = "search";
  searchInput.placeholder = "Search by name or summary";
  searchInput.addEventListener("input", handleSearch);

  const selectLabel = document.createElement("label");
  selectLabel.htmlFor = "episode-select";
  selectLabel.textContent = "Jump to episode";

  episodeSelect = document.createElement("select");
  episodeSelect.id = "episode-select";
  episodeSelect.addEventListener("change", handleEpisodeSelect);

  matchCount = document.createElement("p");
  matchCount.className = "match-count";

  const resetButton = document.createElement("button");
  resetButton.type = "button";
  resetButton.textContent = "Show all";
  resetButton.addEventListener("click", showAllEpisodes);

  controls.append(
    showLabel,
    showSelect,
    searchLabel,
    searchInput,
    selectLabel,
    episodeSelect,
    matchCount,
    resetButton
  );
  rootElem.before(controls);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  const grid = document.createElement("div");
  grid.className = "episodes-grid";

  episodeList.forEach((episode) => {
    grid.appendChild(createEpisodeCard(episode));
  });

  rootElem.appendChild(grid);
}

function populateEpisodeSelect(episodes) {
  episodeSelect.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select an episode";
  episodeSelect.appendChild(defaultOption);

  episodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${getEpisodeCode(episode)} - ${episode.name}`;
    episodeSelect.appendChild(option);
  });
}

async function loadShows() {
  try {
    const shows = await fetchJson(SHOWS_URL);
    const sortedShows = [...shows].sort((firstShow, secondShow) =>
      firstShow.name.localeCompare(secondShow.name, undefined, {
        sensitivity: "base",
      })
    );

    populateShowSelect(sortedShows);
  } catch (error) {
    showSelect.innerHTML = "";
    const errorOption = document.createElement("option");
    errorOption.value = "";
    errorOption.textContent = "Could not load shows";
    showSelect.appendChild(errorOption);
    console.error(error);
  }
}

function populateShowSelect(shows) {
  showSelect.innerHTML = "";

  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showSelect.appendChild(option);
  });

  showSelect.value = currentShowId;
  showSelect.disabled = false;
}

async function handleShowSelect() {
  const selectedShowId = showSelect.value;

  if (!selectedShowId || selectedShowId === currentShowId) {
    return;
  }

  try {
    showSelect.disabled = true;
    const episodes = await fetchJson(getEpisodesUrl(selectedShowId));
    currentShowId = selectedShowId;
    allEpisodes = episodes;
    populateEpisodeSelect(allEpisodes);
    showAllEpisodes();
  } catch (error) {
    showSelect.value = currentShowId;
    console.error(error);
  } finally {
    showSelect.disabled = false;
  }
}

function getEpisodesUrl(showId) {
  return `${SHOWS_URL}/${showId}/episodes`;
}

async function fetchJson(url) {
  if (!fetchCache[url]) {
    fetchCache[url] = fetch(url).then((response) => {
      if (!response.ok) {
        throw new Error(`Could not fetch ${url}`);
      }

      return response.json();
    });
  }

  return fetchCache[url];
}

function showLoadingMessage() {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "<p>Loading episodes...</p>";
}

function showErrorMessage(message) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = `<p>${message}</p>`;
}

function handleSearch() {
  episodeSelect.value = "";
  const searchTerm = searchInput.value.trim().toLowerCase();
  const matchingEpisodes = allEpisodes.filter((episode) => {
    const name = episode.name.toLowerCase();
    const summary = getPlainText(episode.summary).toLowerCase();
    return name.includes(searchTerm) || summary.includes(searchTerm);
  });

  makePageForEpisodes(matchingEpisodes);
  updateMatchCount(matchingEpisodes.length);
}

function handleEpisodeSelect() {
  const selectedId = Number(episodeSelect.value);

  if (!selectedId) {
    showAllEpisodes();
    return;
  }

  searchInput.value = "";
  makePageForEpisodes(allEpisodes);
  updateMatchCount(allEpisodes.length);

  const selectedEpisode = document.getElementById(`episode-${selectedId}`);
  selectedEpisode?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showAllEpisodes() {
  searchInput.value = "";
  episodeSelect.value = "";
  makePageForEpisodes(allEpisodes);
  updateMatchCount(allEpisodes.length);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateMatchCount(count) {
  matchCount.textContent = `${count} episode${count === 1 ? "" : "s"} found`;
}

function formatEpisodeCode(season, number) {
  const s = String(season).padStart(2, "0");
  const e = String(number).padStart(2, "0");
  return `S${s}E${e}`;
}

function getEpisodeCode(episode) {
  return formatEpisodeCode(episode.season, episode.number);
}

function getPlainText(html) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html ?? "";
  return wrapper.textContent;
}

function createEpisodeCard(episode) {
  const code = getEpisodeCode(episode);

  const article = document.createElement("article");
  article.className = "episode-card";
  article.id = `episode-${episode.id}`;

  const img = document.createElement("img");
  img.src = episode.image?.medium ?? "";
  img.alt = `Scene from ${episode.name}`;
  img.loading = "lazy";

  const heading = document.createElement("h2");
  heading.textContent = `${code} - ${episode.name}`;

  const summary = document.createElement("div");
  summary.className = "episode-summary";
  summary.innerHTML = episode.summary ?? "<p>No summary available.</p>";

  const link = document.createElement("a");
  link.href = episode.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "View on TVmaze";

  article.append(img, heading, summary, link);
  return article;
}

window.onload = setup;
