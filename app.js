const { people, replay, diaryEntries, mediaPlan } = window.tripData;

const peopleGrid = document.querySelector("#people-grid");
const diaryList = document.querySelector("#diary-list");
const filters = document.querySelector("#filters");
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
let replayIndex = 0;

function renderPeople() {
  peopleGrid.innerHTML = people
    .map(
      (person) => `
        <article class="person-card">
          <span class="avatar">${person.initials}</span>
          <div>
            <strong>${person.name}</strong>
            <p>${person.role}</p>
          </div>
        </article>
      `
    )
    .join("");
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

function renderDiary() {
  const entries =
    selectedPerson === "All"
      ? diaryEntries
      : diaryEntries.filter((entry) => entry.people.includes(selectedPerson));

  diaryList.innerHTML = entries
    .map(
      (entry) => `
        <article class="diary-entry">
          <div class="entry-date">
            <span>${entry.date}</span>
            <small>${entry.time || "Memory note"}</small>
          </div>
          <div class="entry-body">
            <p class="eyebrow">${entry.place}</p>
            <h3>${entry.title}</h3>
            <p>${entry.narrative}</p>
            <details>
              <summary>Quick note</summary>
              <p>${entry.quickNotes}</p>
            </details>
            <div class="tag-row">
              ${entry.people.map((name) => `<span>${name}</span>`).join("")}
            </div>
            ${renderEntryMedia(entry.media)}
          </div>
        </article>
      `
    )
    .join("");
}

function renderEntryMedia(media) {
  if (!media.length) {
    return "";
  }

  return `
    <div class="entry-media">
      ${media
        .map(
          (item) => `
            <div class="media-placeholder">
              <span>${item.type}</span>
              <strong>${item.caption}</strong>
              <small>${item.src}</small>
            </div>
          `
        )
        .join("")}
    </div>
  `;
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

renderPeople();
renderFilters();
renderDiary();
renderReplay();
renderMediaPlan();
