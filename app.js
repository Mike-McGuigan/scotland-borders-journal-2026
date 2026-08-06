const { people, replay, diaryEntries, mediaPlan } = window.tripData;

const peopleGrid = document.querySelector("#people-grid");
const diaryList = document.querySelector("#diary-list");
const filters = document.querySelector("#filters");
const tagFilters = document.querySelector("#tag-filters");
const mediaGrid = document.querySelector("#media-grid");
const replayKicker = document.querySelector("#replay-kicker");
const replayTitle = document.querySelector("#replay-title");
const replayMeta = document.querySelector("#replay-meta");
const replayNarrative = document.querySelector("#replay-narrative");
const replayTags = document.querySelector("#replay-tags");
const progressBar = document.querySelector("#progress-bar");
const prevStep = document.querySelector("#prev-step");
const nextStep = document.querySelector("#next-step");

let selectedPerson = "All";
let selectedTag = "All";
let replayIndex = 0;

function renderPeople() {
  peopleGrid.innerHTML = people
    .map(
      (person) => `
        <article class="person-card">
          ${renderAvatar(person)}
          <div>
            <strong>${person.name}</strong>
            <p>${person.role}</p>
          </div>
        </article>
      `
    )
    .join("");
}

function renderAvatar(person) {
  if (person.photo) {
    const src = escapeAttr(person.photo);
    const name = escapeAttr(person.name);
    return `<img class="avatar avatar-photo" src="${src}" alt="${name}">`;
  }

  return `<span class="avatar">${person.initials}</span>`;
}

function renderFilters() {
  const names = ["All", ...people.map((person) => person.name)];
  filters.innerHTML = names
    .map(
      (name) => `
        <button class="${name === selectedPerson ? "active" : ""}" type="button" data-filter="${name}">
          ${name}
        </button>
      `
    )
    .join("");

  filters.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      selectedPerson = button.dataset.filter;
      renderFilters();
      renderDiary();
    });
  });
}

function renderTagFilters() {
  const tags = [
    "All",
    ...new Set(diaryEntries.flatMap((entry) => entry.tags || []))
  ];

  tagFilters.innerHTML = tags
    .map(
      (tag) => `
        <button class="${tag === selectedTag ? "active" : ""}" type="button" data-tag="${tag}">
          ${tag}
        </button>
      `
    )
    .join("");

  tagFilters.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      selectedTag = button.dataset.tag;
      renderTagFilters();
      renderDiary();
    });
  });
}

function renderDiary() {
  const entries = diaryEntries.filter((entry) => {
    const personMatch =
      selectedPerson === "All" || entry.people.includes(selectedPerson);
    const tagMatch = selectedTag === "All" || (entry.tags || []).includes(selectedTag);
    return personMatch && tagMatch;
  });

  diaryList.innerHTML = entries.length
    ? entries
        .map(
          (entry) => `
        <article class="diary-entry ${entry.activity ? "has-activity" : ""}">
          <div class="entry-date">
            <span>${entry.date}</span>
            <small>${entry.time || "Memory note"}</small>
          </div>
          <div class="entry-body">
            <p class="eyebrow">${entry.place}</p>
            <h3>${entry.title}</h3>
            <p>${entry.narrative}</p>
            ${renderActivity(entry.activity)}
            <details>
              <summary>Quick note</summary>
              <p>${entry.quickNotes}</p>
            </details>
            <div class="tag-row people-tags">
              ${entry.people.map((name) => `<span>${name}</span>`).join("")}
            </div>
            <div class="tag-row entry-tags">
              ${(entry.tags || []).map((tag) => `<span>${tag}</span>`).join("")}
            </div>
            ${renderEntryMedia(entry.media)}
          </div>
        </article>
      `
        )
        .join("")
    : `<p class="empty-state">No diary items match those filters yet.</p>`;
}

function renderActivity(activity) {
  if (!activity) {
    return "";
  }

  return `
    <dl class="activity-summary">
      <div>
        <dt>Type</dt>
        <dd>${activity.type}</dd>
      </div>
      <div>
        <dt>Distance</dt>
        <dd>${activity.distanceKm} km</dd>
      </div>
      <div>
        <dt>Duration</dt>
        <dd>${activity.duration}</dd>
      </div>
      <div>
        <dt>Climb</dt>
        <dd>${activity.elevationGainM} m</dd>
      </div>
      <div>
        <dt>Source</dt>
        <dd><a href="${activity.file}">${activity.source}</a></dd>
      </div>
    </dl>
  `;
}

function renderEntryMedia(media) {
  if (!media.length) {
    return "";
  }

  return `
    <div class="entry-media">
      ${media.map((item) => renderMediaItem(item)).join("")}
    </div>
  `;
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderMediaItem(item) {
  const caption = escapeAttr(item.caption);
  const src = escapeAttr(item.src);

  if (item.type === "photo") {
    return `
      <figure class="media-item photo-item" role="button" tabindex="0" data-media-type="photo" data-media-src="${src}" data-media-caption="${caption}" aria-label="Open larger photo: ${caption}">
        <img src="${src}" alt="${caption}" loading="lazy">
        <figcaption>${caption}</figcaption>
      </figure>
    `;
  }

  if (item.type === "video") {
    return `
      <figure class="media-item video-item" data-media-type="video" data-media-src="${src}" data-media-caption="${caption}">
        <button class="media-expand" type="button" data-media-open aria-label="Open larger video">Open larger</button>
        <video src="${src}" controls preload="metadata"></video>
        <figcaption>${caption}</figcaption>
      </figure>
    `;
  }

  return `
    <div class="media-placeholder">
      <span>${item.type}</span>
      <strong>${caption}</strong>
      <small>${src}</small>
    </div>
  `;
}

function openMediaViewer(item) {
  const existing = document.querySelector(".media-viewer");
  if (existing) {
    existing.remove();
  }

  const viewer = document.createElement("div");
  viewer.className = "media-viewer";
  viewer.setAttribute("role", "dialog");
  viewer.setAttribute("aria-modal", "true");
  viewer.setAttribute("aria-label", item.caption);

  const mediaMarkup =
    item.type === "video"
      ? `<video src="${item.src}" controls autoplay></video>`
      : `<img src="${item.src}" alt="${item.caption}">`;

  viewer.innerHTML = `
    <div class="media-viewer-backdrop" data-media-close></div>
    <div class="media-viewer-panel">
      <button class="media-viewer-close" type="button" data-media-close aria-label="Close larger media">Close</button>
      <figure>
        ${mediaMarkup}
        <figcaption>${item.caption}</figcaption>
      </figure>
    </div>
  `;

  document.body.appendChild(viewer);
  document.body.classList.add("viewer-open");
  viewer.querySelector(".media-viewer-close").focus();
}

function closeMediaViewer() {
  const viewer = document.querySelector(".media-viewer");
  if (!viewer) {
    return;
  }

  viewer.remove();
  document.body.classList.remove("viewer-open");
}

function renderReplay() {
  const step = replay[replayIndex];
  replayKicker.textContent = step.chapter;
  replayTitle.textContent = step.title;
  replayMeta.textContent = `${step.date} | ${step.place}`;
  replayNarrative.textContent = step.narrative;
  replayTags.innerHTML = step.tags.map((tag) => `<span>${tag}</span>`).join("");
  progressBar.style.width = `${((replayIndex + 1) / replay.length) * 100}%`;
  prevStep.disabled = replayIndex === 0;
  nextStep.disabled = replayIndex === replay.length - 1;
}

function renderMediaPlan() {
  mediaGrid.innerHTML = mediaPlan
    .map(
      (item) => `
        <article class="media-card">
          <p class="eyebrow">${item.type}</p>
          <h3>${item.title}</h3>
          <p>${item.note}</p>
          <code>${item.file}</code>
        </article>
      `
    )
    .join("");
}

prevStep.addEventListener("click", () => {
  replayIndex = Math.max(0, replayIndex - 1);
  renderReplay();
});

nextStep.addEventListener("click", () => {
  replayIndex = Math.min(replay.length - 1, replayIndex + 1);
  renderReplay();
});

diaryList.addEventListener("click", (event) => {
  const opener = event.target.closest("[data-media-open], .photo-item");
  if (!opener || !diaryList.contains(opener)) {
    return;
  }

  const item = opener.closest("[data-media-src]");
  if (!item) {
    return;
  }

  openMediaViewer({
    type: item.dataset.mediaType,
    src: item.dataset.mediaSrc,
    caption: item.dataset.mediaCaption
  });
});

diaryList.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  const item = event.target.closest(".photo-item[data-media-src]");
  if (!item) {
    return;
  }

  event.preventDefault();
  openMediaViewer({
    type: item.dataset.mediaType,
    src: item.dataset.mediaSrc,
    caption: item.dataset.mediaCaption
  });
});

document.addEventListener("click", (event) => {
  if (event.target.closest("[data-media-close]")) {
    closeMediaViewer();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMediaViewer();
  }
});

renderPeople();
renderFilters();
renderTagFilters();
renderDiary();
renderReplay();
renderMediaPlan();
