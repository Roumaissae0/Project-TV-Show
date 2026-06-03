//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
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

function formatEpisodeCode(season, number) {
  const s = String(season).padStart(2, "0");
  const e = String(number).padStart(2, "0");
  return `S${s}E${e}`;
}

function createEpisodeCard(episode) {
  const code = formatEpisodeCode(episode.season, episode.number);

  const article = document.createElement("article");
  article.className = "episode-card";

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
