// Species data (name, source, description, traits, art id) comes from species.js

// ============================================================
// SAVE DATA
// ============================================================

const SAVE_VERSION = 2;
const SAVE_KEY = "dt-save";
const SETTINGS_KEY = "dt-settings";

// ============================================================
// DEFAULT SETTINGS
// ============================================================

const DEFAULTS = {
  theme: "dark",
  fontSize: 18,
  font: "Georgia, serif",
  contrast: false,

  textSpeed: 40,
  autoForward: 3,
  skip: "read",
  stopAtChoices: true,

  master: 80,
  bgm: 70,
  sfx: 80,
  voice: 80,
  muteBlur: true,

  displayMode: "windowed",
  resolution: "auto",
  quality: "medium",
  language: "English",

  cloudSync: true,
  advanceKey: "Space",
  vibration: true,
};

// ============================================================
// SETTINGS MENU DATA
// ============================================================

const SETTING_TABS = {
  "Text & Reading": [
    [
      "textSpeed",
      "Text speed",
      "range",
      [5, 100, 5],
      "100 = instant",
    ],

    [
      "autoForward",
      "Auto-forward delay (seconds)",
      "range",
      [1, 10, 1],
    ],

    [
      "skip",
      "Skip mode",
      "select",
      [
        ["read", "Read text only"],
        ["all", "All text"],
      ],
    ],

    [
      "stopAtChoices",
      "Stop skipping at choices",
      "toggle",
    ],

    [
      "font",
      "Font style",
      "select",
      [
        ["Georgia, serif", "Serif"],
        ["system-ui, sans-serif", "Sans-serif"],
        ["Verdana, sans-serif", "Easy-read"],
        ["Consolas, monospace", "Monospace"],
      ],
    ],

    [
      "fontSize",
      "Font size (px)",
      "range",
      [14, 28, 1],
    ],

    [
      "contrast",
      "High-contrast text box",
      "toggle",
    ],
  ],

  Audio: [
    [
      "master",
      "Master volume",
      "range",
      [0, 100, 5],
    ],

    [
      "bgm",
      "Music volume",
      "range",
      [0, 100, 5],
    ],

    [
      "sfx",
      "Sound effects volume",
      "range",
      [0, 100, 5],
    ],

    [
      "voice",
      "Voice volume",
      "range",
      [0, 100, 5],
    ],

    [
      "muteBlur",
      "Mute when window loses focus",
      "toggle",
    ],
  ],

  Display: [
    [
      "theme",
      "Page theme",
      "select",
      [
        ["dark", "Dark"],
        ["light", "Light"],
      ],
    ],

    [
      "displayMode",
      "Display mode",
      "select",
      [
        ["windowed", "Windowed"],
        ["fullscreen", "Full screen"],
        ["borderless", "Borderless"],
      ],
      "Browsers cannot remove the OS window frame. Borderless fills the browser page edge to edge.",
    ],

    [
      "resolution",
      "Resolution",
      "select",
      [
        ["auto", "Fit window"],
        ["1280x720", "1280 x 720"],
        ["1600x900", "1600 x 900"],
        ["1920x1080", "1920 x 1080"],
      ],
    ],

    [
      "quality",
      "Graphics quality",
      "select",
      [
        ["low", "Low"],
        ["medium", "Medium"],
        ["high", "High"],
      ],
    ],

    [
      "language",
      "Language",
      "select",
      [
        ["English", "English"],
      ],
    ],
  ],

  Gameplay: [
    [
      "cloudSync",
      "Auto-backup saves",
      "toggle",
    ],

    [
      "advanceKey",
      "Advance text key",
      "select",
      [
        ["Space", "Space"],
        ["Enter", "Enter"],
        ["ArrowRight", "Right arrow"],
      ],
    ],

    [
      "vibration",
      "Controller vibration",
      "toggle",
    ],
  ],
};

// ============================================================
// DOM HELPERS
// ============================================================

const $ = (selector, root = document) =>
  root.querySelector(selector);

const esc = (value) =>
  String(value).replace(/[&<>\"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[character]));

const read = (key) => {
  try {
    const raw = localStorage.getItem(key);

    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const write = (key, value) => {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );

    return true;
  } catch {
    return false;
  }
};

const removeSave = () => {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // Ignore storage errors.
  }
};

const screen = (html) => {
  $("#screen").innerHTML = html;
};

// ============================================================
// SPECIES HELPERS
// ============================================================

const artOf = (species) =>
  `img/species/${species.id}.webp`;

const getSpeciesById = (id) =>
  SPECIES.find((species) => species.id === id);

const getSpeciesSources = () =>
  [...new Set(
    SPECIES
      .map((species) => species.source)
      .filter(Boolean)
  )].sort();

// ============================================================
// SAVE SYSTEM
// ============================================================

/*
  New save format:

  {
    version: 2,
    name: "Character Name",
    speciesId: "species-id",
    scene: "intro"
  }

  The complete species object is NOT saved.

  The species database remains in species.js.
*/

function makeSave(name, species) {
  return {
    version: SAVE_VERSION,

    name:
      String(name)
        .trim()
        .slice(0, 30) ||
      "Adventurer",

    speciesId: species.id,

    scene: "intro",
    adventureId: null,
    flags: {},
  };
}

/*
  Supports both the new save format and the older format.

  Old format:

  {
    name: "...",
    species: "...",
    source: "...",
    id: "..."
  }

  New format:

  {
    version: 2,
    name: "...",
    speciesId: "...",
    scene: "intro"
  }
*/

function normalizeSave(save) {
  if (
    !save ||
    typeof save !== "object"
  ) {
    return null;
  }

  const speciesId =
    save.speciesId ||
    save.id;

  if (!speciesId) {
    return null;
  }

  const species =
    getSpeciesById(speciesId);

  if (!species) {
    return null;
  }

  const name =
    String(
      save.name ||
      "Adventurer"
    )
      .trim()
      .slice(0, 30) ||
    "Adventurer";

  return {
    version: SAVE_VERSION,
    name,
    speciesId: species.id,
    scene:
      String(
        save.scene ||
        "intro"
      ),
    adventureId:
      typeof save.adventureId === "string"
        ? save.adventureId
        : null,
    flags:
      save.flags && typeof save.flags === "object"
        ? save.flags
        : {},
  };
}

function getSave() {
  const rawSave =
    read(SAVE_KEY);

  if (!rawSave) {
    return null;
  }

  const save =
    normalizeSave(rawSave);

  /*
    If the save is invalid, remove it.
    This prevents the menu from displaying
    a broken Load Game button.
  */

  if (!save) {
    removeSave();
    return null;
  }

  /*
    Automatically migrate old saves
    into the new compact format.
  */

  const needsMigration =
    rawSave.version !== SAVE_VERSION ||
    rawSave.speciesId !== save.speciesId ||
    rawSave.scene !== save.scene;

  if (needsMigration) {
    write(SAVE_KEY, save);
  }

  return save;
}

// ============================================================
// SETTINGS
// ============================================================

let settings = {
  ...DEFAULTS,
  ...(read(SETTINGS_KEY) || {}),
};

function saveSettings() {
  write(
    SETTINGS_KEY,
    settings
  );
}

function applySettings() {
  const root =
    document.documentElement;

  const frame =
    $("#frame");

  if (!frame) {
    return;
  }

  // ----------------------------------------------------------
  // Theme
  // ----------------------------------------------------------

  root.dataset.theme =
    settings.theme;

  root.style.setProperty(
    "--fs",
    `${settings.fontSize}px`
  );

  root.style.setProperty(
    "--font",
    settings.font
  );

  document.body.classList.toggle(
    "contrast",
    !!settings.contrast
  );

  // ----------------------------------------------------------
  // Display mode
  // ----------------------------------------------------------

  frame.classList.toggle(
    "borderless",
    settings.displayMode === "borderless"
  );

  /*
    AUTO uses the entire browser viewport.

    Fixed resolutions are limited to the browser viewport
    so the game does not create an oversized page.
  */

  if (
    settings.resolution === "auto"
  ) {
    frame.style.width =
      "100vw";

    frame.style.height =
      "100vh";

    frame.style.maxWidth =
      "100vw";

    frame.style.maxHeight =
      "100vh";
  } else {
    const [
      width,
      height,
    ] =
      settings.resolution.split("x");

    frame.style.width =
      `min(${width}px, 100vw)`;

    frame.style.height =
      `min(${height}px, 100vh)`;

    frame.style.maxWidth =
      "100vw";

    frame.style.maxHeight =
      "100vh";
  }

  // ----------------------------------------------------------
  // Fullscreen
  // ----------------------------------------------------------

  if (
    settings.displayMode ===
      "fullscreen" &&
    !document.fullscreenElement
  ) {
    document.documentElement
      .requestFullscreen?.()
      .catch(() => {});
  }

  // ----------------------------------------------------------
  // Exit fullscreen
  // ----------------------------------------------------------

  if (
    settings.displayMode !==
      "fullscreen" &&
    document.fullscreenElement
  ) {
    document.exitFullscreen?.();
  }
}

// ============================================================
// MAIN MENU
// ============================================================

function menu() {
  const save =
    getSave();

  const hasSave =
    !!save;

  screen(`
    <div class="menu-screen">

      <h1>Dungeon Tale</h1>

      <p class="muted">
        An adventure awaits.
      </p>

      <nav class="menu">

        <button
          class="btn"
          id="new"
        >
          Create new character
        </button>

        ${
          hasSave
            ? `
              <button
                class="btn"
                id="load"
              >
                Load game
              </button>
            `
            : ""
        }

        <button
          class="btn"
          id="set"
        >
          Settings
        </button>

        <button
          class="btn"
          id="quit"
        >
          Leave game
        </button>

      </nav>

    </div>
  `);

  // ----------------------------------------------------------
  // New character
  // ----------------------------------------------------------

  $("#new").onclick =
    createCharacter;

  // ----------------------------------------------------------
  // Load game
  // ----------------------------------------------------------

  if (hasSave) {
    $("#load").onclick =
      () => startGame(save);
  }

  // ----------------------------------------------------------
  // Settings
  // ----------------------------------------------------------

  $("#set").onclick =
    () =>
      settingsScreen(
        Object.keys(
          SETTING_TABS
        )[0]
      );

  // ----------------------------------------------------------
  // Leave game
  // ----------------------------------------------------------

  $("#quit").onclick = () => {
    if (
      !confirm(
        "Leave the game?"
      )
    ) {
      return;
    }

    window.close();

    screen(`
      <div class="menu-screen">

        <h1>
          Farewell, adventurer.
        </h1>

        <p
          class="muted"
          style="text-align:center"
        >
          You can close this tab now.
        </p>

      </div>
    `);
  };
}

// ============================================================
// CHARACTER CREATION
// ============================================================

function createCharacter() {
  let sourceFilter = "All";
  let query = "";
  let selectedSpecies = null;

  const sources =
    getSpeciesSources();

  screen(`
    <div class="wide character-creation">

      <header class="creation-header">

        <div>
          <h2>
            Create Your Character
          </h2>

          <p class="muted">
            Choose your name and species.
          </p>
        </div>

      </header>

      <div class="row filters">

        <label>
          Name

          <input
            id="name"
            type="text"
            maxlength="30"
            autocomplete="off"
            placeholder="Enter character name"
          >
        </label>

        <label>
          Source

          <select id="src">

            <option value="All">
              All sources (${SPECIES.length})
            </option>

            ${sources
              .map(
                (source) => `
                  <option
                    value="${esc(source)}"
                  >
                    ${esc(source)}
                  </option>
                `
              )
              .join("")}

          </select>
        </label>

        <label>
          Search

          <input
            id="q"
            type="search"
            placeholder="Search species or traits"
            autocomplete="off"
          >
        </label>

      </div>

      <div class="picker">

        <section
          class="grid cards"
          id="grid"
          aria-label="Species selection"
        ></section>

        <aside
          class="box detail"
          id="sel"
        >
          <div class="detail-empty">

            <h3>
              Choose a species
            </h3>

            <p class="muted">
              Select a species to see its
              artwork, description, source,
              and traits.
            </p>

          </div>
        </aside>

      </div>

      <div class="row creation-actions">

        <button
          class="btn"
          id="ok"
          disabled
        >
          Begin adventure
        </button>

        <button
          class="btn"
          id="back"
        >
          Back
        </button>

      </div>

    </div>
  `);

  const nameInput =
    $("#name");

  const sourceInput =
    $("#src");

  const searchInput =
    $("#q");

  const grid =
    $("#grid");

  const detail =
    $("#sel");

  const beginButton =
    $("#ok");

  // ----------------------------------------------------------
  // Enable/disable Begin Adventure
  // ----------------------------------------------------------

  function updateBeginButton() {
    const hasName =
      nameInput.value
        .trim()
        .length > 0;

    beginButton.disabled =
      !(
        hasName &&
        selectedSpecies
      );
  }

  // ----------------------------------------------------------
  // Display selected species
  // ----------------------------------------------------------

  function showDetail() {
    if (!selectedSpecies) {
      detail.innerHTML = `
        <div class="detail-empty">

          <h3>
            Choose a species
          </h3>

          <p class="muted">
            Select a species to see
            its information.
          </p>

        </div>
      `;

      return;
    }

    detail.innerHTML = `
      <div class="species-detail">

        <img
          src="${artOf(selectedSpecies)}"
          alt="${esc(selectedSpecies.name)} artwork"
        >

        <h3>
          ${esc(selectedSpecies.name)}
        </h3>

        <p class="muted">
          ${esc(selectedSpecies.source)}
        </p>

        <p>
          ${esc(selectedSpecies.desc)}
        </p>

        <p>
          <strong>
            Traits:
          </strong>

          ${esc(selectedSpecies.traits)}
        </p>

      </div>
    `;
  }

  // ----------------------------------------------------------
  // Draw species cards
  // ----------------------------------------------------------

  function drawSpecies() {
    const search =
      query
        .trim()
        .toLowerCase();

    const shown =
      SPECIES.filter(
        (species) => {

          const matchesSource =
            sourceFilter === "All" ||
            species.source ===
              sourceFilter;

          const searchableText =
            (
              species.name +
              " " +
              species.traits +
              " " +
              species.source +
              " " +
              species.desc
            ).toLowerCase();

          const matchesSearch =
            !search ||
            searchableText.includes(
              search
            );

          return (
            matchesSource &&
            matchesSearch
          );
        }
      );

    if (!shown.length) {
      grid.innerHTML = `
        <div class="box">
          <h3>
            No species found
          </h3>

          <p class="muted">
            Try changing the source
            filter or search text.
          </p>
        </div>
      `;

      return;
    }

    grid.innerHTML =
      shown
        .map(
          (species) => {

            const selected =
              selectedSpecies &&
              selectedSpecies.id ===
                species.id;

            return `
              <button
                class="btn card ${
                  selected
                    ? "on"
                    : ""
                }"
                data-id="${esc(species.id)}"
                type="button"
              >

                <img
                  src="${artOf(species)}"
                  alt=""
                  loading="lazy"
                >

                <span class="cname">
                  ${esc(species.name)}
                </span>

                <span class="csrc">
                  ${esc(species.source)}
                </span>

                <span class="cdesc">
                  ${esc(species.desc)}
                </span>

              </button>
            `;
          }
        )
        .join("");
  }

  // ----------------------------------------------------------
  // Species selection
  // ----------------------------------------------------------

  grid.onclick = (event) => {
    const card =
      event.target.closest(
        "[data-id]"
      );

    if (!card) {
      return;
    }

    const species =
      getSpeciesById(
        card.dataset.id
      );

    if (!species) {
      return;
    }

    selectedSpecies =
      species;

    /*
      Only update card classes here.
      This avoids rebuilding the entire grid
      and keeps the user's scroll position.
    */

    grid
      .querySelectorAll(
        ".card"
      )
      .forEach(
        (currentCard) => {
          currentCard.classList.toggle(
            "on",
            currentCard === card
          );
        }
      );

    showDetail();

    updateBeginButton();
  };

  // ----------------------------------------------------------
  // Source filter
  // ----------------------------------------------------------

  sourceInput.onchange =
    (event) => {

      sourceFilter =
        event.target.value;

      drawSpecies();
    };

  // ----------------------------------------------------------
  // Search
  // ----------------------------------------------------------

  searchInput.oninput =
    (event) => {

      query =
        event.target.value;

      drawSpecies();
    };

  // ----------------------------------------------------------
  // Character name
  // ----------------------------------------------------------

  nameInput.oninput =
    updateBeginButton;

  // ----------------------------------------------------------
  // Back
  // ----------------------------------------------------------

  $("#back").onclick =
    menu;

  // ----------------------------------------------------------
  // Begin adventure
  // ----------------------------------------------------------

  beginButton.onclick =
    () => {

      if (!selectedSpecies) {
        return;
      }

      const save =
        makeSave(
          nameInput.value,
          selectedSpecies
        );

      const saved =
        write(
          SAVE_KEY,
          save
        );

      if (!saved) {
        alert(
          "The game could not save your character. " +
          "Your browser may have blocked local storage."
        );
      }

      startGame(save);
    };

  // Initial render
  drawSpecies();
  updateBeginButton();
}

// ============================================================
// GAME / STORY SCREEN
// ============================================================

// ============================================================
// ADVENTURE LIBRARY
// ============================================================

function getAdventureById(id) {
  return (Array.isArray(ADVENTURES) ? ADVENTURES : [])
    .find((adventure) => adventure.id === id);
}

function adventureLibrary(save) {
  save = normalizeSave(save);
  if (!save) {
    menu();
    return;
  }

  const adventures = Array.isArray(ADVENTURES) ? ADVENTURES : [];
  const cards = adventures.map((adventure) => {
    const image = adventure.cover
      ? `<img class="adventure-cover" src="${esc(adventure.cover)}" alt="${esc(adventure.title)} cover art" onerror="this.hidden=true">`
      : "";
    return `
      <article class="adventure-card">
        ${image}
        <div class="adventure-card-content">
          <p class="eyebrow">${esc(adventure.genre || "Fantasy adventure")}</p>
          <h3>${esc(adventure.title)}</h3>
          <p>${esc(adventure.summary || "A new adventure awaits.")}</p>
          <p class="muted adventure-meta">${esc(adventure.duration || "Interactive story")}</p>
          <button class="btn adventure-start" type="button" data-adventure="${esc(adventure.id)}">
            ${save.adventureId === adventure.id ? "Continue adventure" : "Choose adventure"}
          </button>
        </div>
      </article>`;
  }).join("");

  screen(`
    <div class="wide adventure-library">
      <header class="library-header">
        <div>
          <p class="eyebrow">Your next chapter</p>
          <h2>Choose an Adventure</h2>
          <p class="muted">Playing as <strong>${esc(save.name)}</strong> · ${esc((getSpeciesById(save.speciesId) || {}).name || "Adventurer")}</p>
        </div>
      </header>
      <section class="adventure-grid" aria-label="Available adventures">
        ${cards || '<p class="muted">No adventures have been added yet. Add an adventure to adventures.js.</p>'}
      </section>
      <div class="row library-actions">
        <button class="btn" id="library-character" type="button">Create another character</button>
        <button class="btn" id="library-menu" type="button">Main menu</button>
      </div>
    </div>
  `);

  document.querySelectorAll("[data-adventure]").forEach((button) => {
    button.onclick = () => {
      const adventure = getAdventureById(button.dataset.adventure);
      if (!adventure) return;
      const isContinuing = save.adventureId === adventure.id &&
        adventure.scenes && adventure.scenes[save.scene];
      save.adventureId = adventure.id;
      if (!isContinuing) save.scene = adventure.startScene;
      save.flags = save.flags || {};
      write(SAVE_KEY, save);
      startGame(save);
    };
  });

  $("#library-character").onclick = createCharacter;
  $("#library-menu").onclick = menu;
}

// ============================================================
// ADVENTURE / STORY SCREEN
// ============================================================

function startGame(save) {
  save = normalizeSave(save);
  if (!save) {
    menu();
    return;
  }

  const species = getSpeciesById(save.speciesId);
  if (!species) {
    alert("The saved species could not be found.");
    menu();
    return;
  }

  // Characters without an adventure are sent to the library first.
  if (!save.adventureId) {
    adventureLibrary(save);
    return;
  }

  const adventure = getAdventureById(save.adventureId);
  if (!adventure) {
    save.adventureId = null;
    save.scene = "intro";
    write(SAVE_KEY, save);
    adventureLibrary(save);
    return;
  }

  cleanupGameListeners();
  save.flags = save.flags || {};
  if (!adventure.scenes[save.scene]) save.scene = adventure.startScene;
  write(SAVE_KEY, save);

  const scene = adventure.scenes[save.scene];
  const portrait = species.id
    ? `<img class="portrait" src="${esc(artOf(species))}" alt="${esc(species.name)} artwork" onerror="this.hidden=true">`
    : "";
  const sceneImage = scene.image
    ? `<figure class="scene-figure"><img class="scene-image" src="${esc(scene.image)}" alt="${esc(scene.imageAlt || scene.title)}" onerror="this.hidden=true">${scene.imageCaption ? `<figcaption>${esc(scene.imageCaption)}</figcaption>` : ""}</figure>`
    : "";
  const paragraphs = (scene.text || []).map((paragraph) => `<p>${esc(paragraph)}</p>`).join("");
  const stats = scene.encounter
    ? `<aside class="encounter-panel"><h3>${esc(scene.encounter.name || "Encounter")}</h3><dl>${Object.entries(scene.encounter.stats || {}).map(([key, value]) => `<div><dt>${esc(key)}</dt><dd>${esc(value)}</dd></div>`).join("")}</dl>${scene.encounter.notes ? `<p class="muted">${esc(scene.encounter.notes)}</p>` : ""}</aside>`
    : "";

  screen(`
    <div class="wide game-screen adventure-play-screen">
      <header class="story-header">
        <div>
          <p class="eyebrow">${esc(adventure.title)}</p>
          <h2>${esc(scene.title || "Your Adventure")}</h2>
          <p class="muted">${esc(save.name)} · ${esc(species.name)}${scene.chapter ? ` · ${esc(scene.chapter)}` : ""}</p>
        </div>
        ${portrait}
      </header>
      ${sceneImage}
      <article class="box story-box adventure-story" id="text">${paragraphs}</article>
      ${stats}
      <section class="story-choices" aria-label="Story choices">
        ${(scene.choices || []).map((choice, index) => `<button class="btn choice-btn" type="button" data-choice="${index}">${esc(choice.label)}</button>`).join("")}
      </section>
      <div class="row story-actions">
        <button class="btn" id="story-library" type="button">Adventure library</button>
        <button class="btn" id="story-menu" type="button">Save and main menu</button>
      </div>
    </div>
  `);

  document.querySelectorAll("[data-choice]").forEach((button) => {
    button.onclick = () => {
      const choice = (scene.choices || [])[Number(button.dataset.choice)];
      if (!choice) return;
      if (choice.setFlag) save.flags[choice.setFlag] = true;
      if (choice.target === "__LIBRARY__") {
        save.scene = scene.id;
        write(SAVE_KEY, save);
        adventureLibrary(save);
        return;
      }
      if (choice.target === "__END__") {
        renderAdventureEnding(save, adventure, choice.endingText || "This adventure has ended.");
        return;
      }
      if (!adventure.scenes[choice.target]) {
        alert(`The scene "${choice.target}" is missing from adventures.js.`);
        return;
      }
      save.scene = choice.target;
      write(SAVE_KEY, save);
      startGame(save);
    };
  });

  $("#story-library").onclick = () => adventureLibrary(save);
  $("#story-menu").onclick = () => {
    write(SAVE_KEY, save);
    cleanupGameListeners();
    menu();
  };
}

function renderAdventureEnding(save, adventure, endingText) {
  cleanupGameListeners();
  screen(`
    <div class="menu-screen adventure-ending">
      <p class="eyebrow">${esc(adventure.title)}</p>
      <h2>Adventure Complete</h2>
      <p>${esc(endingText)}</p>
      <div class="row">
        <button class="btn" id="ending-library" type="button">Adventure library</button>
        <button class="btn" id="ending-menu" type="button">Main menu</button>
      </div>
    </div>
  `);
  $("#ending-library").onclick = () => adventureLibrary(save);
  $("#ending-menu").onclick = menu;
}

// ============================================================
// GAME CLEANUP
// ============================================================

let activeGameTimer = null;
let activeGameKeyHandler = null;

function cleanupGameListeners() {
  if (activeGameTimer) {
    clearInterval(
      activeGameTimer
    );

    activeGameTimer =
      null;
  }

  if (
    activeGameKeyHandler
  ) {
    document.removeEventListener(
      "keydown",
      activeGameKeyHandler
    );

    activeGameKeyHandler =
      null;
  }
}

// ============================================================
// SETTINGS SCREEN
// ============================================================

function settingsScreen(tab) {
  const settingsList =
    SETTING_TABS[tab];

  if (!settingsList) {
    tab =
      Object.keys(
        SETTING_TABS
      )[0];
  }

  const rows =
    SETTING_TABS[tab]
      .map(
        (
          [
            key,
            label,
            type,
            options,
            note,
          ]
        ) => {

          const value =
            settings[key];

          let control;

          // ------------------------------------------------
          // Range
          // ------------------------------------------------

          if (
            type ===
            "range"
          ) {

            control = `
              <div class="setting-control">

                <input
                  type="range"
                  data-k="${key}"
                  min="${options[0]}"
                  max="${options[1]}"
                  step="${options[2]}"
                  value="${value}"
                >

                <span class="muted">
                  ${value}
                </span>

              </div>
            `;

          // ------------------------------------------------
          // Toggle
          // ------------------------------------------------

          } else if (
            type ===
            "toggle"
          ) {

            control = `
              <input
                type="checkbox"
                data-k="${key}"
                ${
                  value
                    ? "checked"
                    : ""
                }
              >
            `;

          // ------------------------------------------------
          // Select
          // ------------------------------------------------

          } else {

            control = `
              <select
                data-k="${key}"
              >

                ${options
                  .map(
                    (
                      [
                        optionValue,
                        optionText,
                      ]
                    ) => `
                      <option
                        value="${esc(optionValue)}"
                        ${
                          optionValue ===
                          value
                            ? "selected"
                            : ""
                        }
                      >
                        ${esc(optionText)}
                      </option>
                    `
                  )
                  .join("")}

              </select>
            `;
          }

          return `
            <label
              class="setting"
            >

              <span>

                ${esc(label)}

                ${
                  note
                    ? `
                      <small>
                        ${esc(note)}
                      </small>
                    `
                    : ""
                }

              </span>

              ${control}

            </label>
          `;
        }
      )
      .join("");

  screen(`
    <div class="settings-screen">

      <h2>
        Settings
      </h2>

      <div class="chips">

        ${Object.keys(
          SETTING_TABS
        )
          .map(
            (settingTab) => `
              <button
                class="btn ${
                  settingTab ===
                  tab
                    ? "on"
                    : ""
                }"
                data-t="${esc(settingTab)}"
                type="button"
              >
                ${esc(settingTab)}
              </button>
            `
          )
          .join("")}

      </div>

      <section
        class="settings-list"
      >
        ${rows}
      </section>

      <div class="row">

        <button
          class="btn"
          id="back"
        >
          Back
        </button>

        <button
          class="btn"
          id="reset"
        >
          Reset to defaults
        </button>

      </div>

    </div>
  `);

  // ========================================================
  // SETTINGS TABS
  // ========================================================

  document
    .querySelectorAll(
      "[data-t]"
    )
    .forEach(
      (button) => {

        button.onclick =
          () => {

            settingsScreen(
              button.dataset.t
            );
          };
      }
    );

  // ========================================================
  // SETTINGS CONTROLS
  // ========================================================

  document
    .querySelectorAll(
      "[data-k]"
    )
    .forEach(
      (element) => {

        // --------------------------------------------------
        // Live update
        // --------------------------------------------------

        element.oninput =
          () => {

            const key =
              element.dataset.k;

            settings[key] =
              readSettingValue(
                element
              );

            /*
              Update the appearance immediately.
              This is especially useful for:
              - font size
              - font
              - theme
              - contrast
            */

            applySettings();

            /*
              Update displayed range number.
            */

            if (
              element.type ===
              "range"
            ) {

              const output =
                element.nextElementSibling;

              if (output) {
                output.textContent =
                  element.value;
              }
            }
          };

        // --------------------------------------------------
        // Save after change
        // --------------------------------------------------

        element.onchange =
          () => {

            const key =
              element.dataset.k;

            settings[key] =
              readSettingValue(
                element
              );

            saveSettings();

            applySettings();
          };
      }
    );

  // ========================================================
  // BACK
  // ========================================================

  $("#back").onclick =
    menu;

  // ========================================================
  // RESET
  // ========================================================

  $("#reset").onclick =
    () => {

      const confirmed =
        confirm(
          "Reset all settings to their defaults?"
        );

      if (!confirmed) {
        return;
      }

      settings =
        {
          ...DEFAULTS,
        };

      saveSettings();

      applySettings();

      settingsScreen(
        tab
      );
    };
}

// ============================================================
// READ SETTING VALUE
// ============================================================

function readSettingValue(
  element
) {
  if (
    element.type ===
    "checkbox"
  ) {
    return element.checked;
  }

  if (
    element.type ===
    "range"
  ) {
    return Number(
      element.value
    );
  }

  return element.value;
}

// ============================================================
// WINDOW FOCUS / AUDIO MUTE SUPPORT
// ============================================================

window.addEventListener(
  "blur",
  () => {

    if (
      settings.muteBlur
    ) {
      document.body.dataset.muted =
        "1";
    }
  }
);

window.addEventListener(
  "focus",
  () => {

    delete document.body
      .dataset
      .muted;
  }
);

// ============================================================
// FULLSCREEN CHANGE
// ============================================================

document.addEventListener(
  "fullscreenchange",
  () => {

    /*
      If the browser exits fullscreen manually,
      keep the setting from forcing fullscreen
      back immediately.
    */

    if (
      !document.fullscreenElement &&
      settings.displayMode ===
        "fullscreen"
    ) {
      settings.displayMode =
        "windowed";

      saveSettings();
    }
  }
);

// ============================================================
// START GAME
// ============================================================

applySettings();

menu();