
function getEpisodeCode(episode) {
  const season = String(episode.season).padStart(2, "0");
  const number = String(episode.number).padStart(2, "0");
  return `S${season}E${number}`;

//You can edit ALL of the code here
let allEpisodes = [];
let searchInput;
let episodeSelect;
let matchCount;

function setup() {
  allEpisodes = getAllEpisodes();
  createControls();
  makePageForEpisodes(allEpisodes);
  updateMatchCount(allEpisodes.length);
 53f92b46ea029a8d3ed6c775b4de7f20fe94e4fb
}

function renderEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";



  const grid = document.createElement("div");
  grid.className = "episodes-grid";
 53f92b46ea029a8d3ed6c775b4de7f20fe94e4fb

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

function createControls() {
  const rootElem = document.getElementById("root");
  const controls = document.createElement("section");
  controls.className = "episode-controls";

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

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select an episode";
  episodeSelect.appendChild(defaultOption);

  allEpisodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${getEpisodeCode(episode)} - ${episode.name}`;
    episodeSelect.appendChild(option);
  });

  matchCount = document.createElement("p");
  matchCount.className = "match-count";

  const resetButton = document.createElement("button");
  resetButton.type = "button";
  resetButton.textContent = "Show all";
  resetButton.addEventListener("click", showAllEpisodes);

  controls.append(
    searchLabel,
    searchInput,
    selectLabel,
    episodeSelect,
    matchCount,
    resetButton
  );
  rootElem.before(controls);
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
 53f92b46ea029a8d3ed6c775b4de7f20fe94e4fb

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

async function fetchEpisodes() {
  const response = await fetch("https://api.tvmaze.com/shows/82/episodes");
  if (!response.ok) {
    throw new Error("Failed to fetch episodes");
  }
  return response.json();
}

async function setup() {
  showLoadingMessage();

  try {
    const allEpisodes = await fetchEpisodes();
    renderEpisodes(allEpisodes);
    createSearchUI(allEpisodes);
    createEpisodeSelector(allEpisodes);
  } catch (error) {
    showErrorMessage();
  }
}

window.onload = setup;