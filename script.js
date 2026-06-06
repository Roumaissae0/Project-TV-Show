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

  const img = document.createElement("img");
  img.src = episode.image?.medium ?? "";
  img.alt = `Scene from ${episode.name}`;
  img.loading = "lazy";

  const heading = document.createElement("h2");
  heading.textContent = `${code} – ${episode.name}`;

  const summary = document.createElement("div");
  summary.className = "episode-summary";
  summary.innerHTML = episode.summary ?? "<p>No summary available.</p>";

  const link = document.createElement("a");
  link.href = episode.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "View on TVmaze ↗";

  article.append(img, heading, summary, link);
  return article;
}

window.onload = setup;
