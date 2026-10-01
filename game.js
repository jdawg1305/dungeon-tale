// ---------- Species, grouped by source so the long list stays browsable ----------
const SPECIES = {
  "Player's Handbook": "Aasimar,Dragonborn,Dwarf,Elf,Gnome,Goliath,Halfling,Human,Orc,Tiefling",
  "Monsters of the Multiverse": "Aarakocra,Air Genasi,Bugbear,Centaur,Changeling,Deep Gnome,Duergar,Earth Genasi,Eladrin,Fairy,Firbolg,Fire Genasi,Githyanki,Githzerai,Goblin,Harengon,Hobgoblin,Kenku,Kobold,Lizardfolk,Minotaur,Satyr,Sea Elf,Shadar-kai,Tabaxi,Tortle,Triton,Water Genasi,Yuan-ti",
  "Ravenloft": "Dhampir,Hexblood,Lupin,Reborn",
  "Lorwyn": "Boggart,Faerie,Flamekin,Kithkin,Lorwyn Changeling,Lorwyn-Shadowmoor Elf,Rimekin",
  "Eberron": "Changeling,Kalashtar,Khoravar,Shifter,Warforged,Gargoyle,Gnoll,Harpy,Medusa,Worg,Dhakaani Ghaal'dar,Dhakaani Golin'dar,Dhakaani Guul'dar,Jhorgun'taal,Kalamer Landwalker,Ruinbound,Sahuagin",
  "Planes & Space": "Astral Elf,Autognome,Giff,Hadozee,Plasmoid,Thri-kreen,Kender,Owlin,Leonin,Loxodon,Simic Hybrid,Vedalken,Verdan,Duskling",
  "Legacy (2014)": "Half-Elf,Half-Orc,Feral Tiefling,Gith,Genasi,Yuan-ti Pureblood,Grung,Locathah",
  "Northlands": "Alfar,Baugsmidr Dwarf,Bearfolk,Beastkin,Fjord Dwarf,Giantkin,Ice Elf,Trollkin,Werekin",
  "Grim Hollow": "Accursed,Arisen,Disembodied,Downcast,Dreamer,Grudgel,Laneshi,Ogresh,Wechselkind,Wulven",
  "Other Third-Party": "Cervan,Corvum,Gallus,Hedge,Jerbeen,Luma,Mapach,Raptor,Strig,Vulpin,Darakhul,Erina,Quickstep,Ratatosk,Ravenfolk,Satarre,Shade,Shadow Goblin,Umbral Human,Geppettin,Mandrake,Dara,Nakudama,Manikin,Scourgeborne,Floral Dragonborn,Hobbit,Etherean,Geleton",
};

// ---------- Settings: defined as data so the menu builds itself ----------
const DEFAULTS = {
  theme: "dark", fontSize: 18, font: "Georgia, serif", contrast: false,
  textSpeed: 40, autoForward: 3, skip: "read", stopAtChoices: true,
  master: 80, bgm: 70, sfx: 80, voice: 80, muteBlur: true,
  displayMode: "windowed", resolution: "auto", quality: "medium", language: "English",
  cloudSync: true, advanceKey: "Space", vibration: true,
};
const SETTING_TABS = {
  "Text & Reading": [
    ["textSpeed", "Text speed", "range", [5, 100, 5], "100 = instant"],
    ["autoForward", "Auto-forward delay (seconds)", "range", [1, 10, 1]],
    ["skip", "Skip mode", "select", [["read", "Read text only"], ["all", "All text"]]],
    ["stopAtChoices", "Stop skipping at choices", "toggle"],
    ["font", "Font style", "select", [["Georgia, serif", "Serif"], ["system-ui, sans-serif", "Sans-serif"], ["Verdana, sans-serif", "Easy-read"], ["Consolas, monospace", "Monospace"]]],
    ["fontSize", "Font size (px)", "range", [14, 28, 1]],
    ["contrast", "High-contrast text box", "toggle"],
  ],
  "Audio": [
    ["master", "Master volume", "range", [0, 100, 5]],
    ["bgm", "Music volume", "range", [0, 100, 5]],
    ["sfx", "Sound effects volume", "range", [0, 100, 5]],
    ["voice", "Voice volume", "range", [0, 100, 5]],
    ["muteBlur", "Mute when window loses focus", "toggle"],
  ],
  "Display": [
    ["theme", "Page theme", "select", [["dark", "Dark"], ["light", "Light"]]],
    ["displayMode", "Display mode", "select", [["windowed", "Windowed"], ["fullscreen", "Full screen"], ["borderless", "Borderless"]], "Browsers can't remove the OS window frame, so borderless fills the page edge to edge."],
    ["resolution", "Resolution", "select", [["auto", "Fit window"], ["1280x720", "1280 x 720"], ["1600x900", "1600 x 900"], ["1920x1080", "1920 x 1080"]]],
    ["quality", "Graphics quality", "select", [["low", "Low"], ["medium", "Medium"], ["high", "High"]]],
    ["language", "Language", "select", [["English", "English"]]],
  ],
  "Gameplay": [
    ["cloudSync", "Auto-backup saves", "toggle"],
    ["advanceKey", "Advance text key", "select", [["Space", "Space"], ["Enter", "Enter"], ["ArrowRight", "Right arrow"]]],
    ["vibration", "Controller vibration", "toggle"],
  ],
};

// ---------- Helpers ----------
const $ = (s, r = document) => r.querySelector(s);
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const read = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage blocked */ } };
const screen = (html) => { $("#screen").innerHTML = html; };

let settings = { ...DEFAULTS, ...read("dt-settings") };

function applySettings() {
  const root = document.documentElement, frame = $("#frame");
  root.dataset.theme = settings.theme;
  root.style.setProperty("--fs", settings.fontSize + "px");
  root.style.setProperty("--font", settings.font);
  document.body.classList.toggle("contrast", settings.contrast);
  frame.classList.toggle("borderless", settings.displayMode === "borderless");
  if (settings.resolution === "auto") { frame.style.width = frame.style.height = "100%"; }
  else { const [w, h] = settings.resolution.split("x"); frame.style.width = w + "px"; frame.style.height = h + "px"; }
  if (settings.displayMode === "fullscreen" && !document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
  if (settings.displayMode !== "fullscreen" && document.fullscreenElement) document.exitFullscreen?.();
}

// ---------- Main menu ----------
function menu() {
  const hasSave = !!read("dt-save");
  screen(`<h1>Dungeon Tale</h1>
    <nav class="menu">
      <button class="btn" id="new">Create new character</button>
      ${hasSave ? '<button class="btn" id="load">Load game</button>' : ""}
      <button class="btn" id="set">Settings</button>
      <button class="btn" id="quit">Leave game</button>
    </nav>`);
  $("#new").onclick = createCharacter;
  if (hasSave) $("#load").onclick = () => startGame(read("dt-save"));
  $("#set").onclick = () => settingsScreen(Object.keys(SETTING_TABS)[0]);
  $("#quit").onclick = () => {
    if (!confirm("Leave the game?")) return;
    window.close(); // only works if the tab was opened by a script
    screen("<h1>Farewell, adventurer.</h1><p class='muted' style='text-align:center'>You can close this tab now.</p>");
  };
}

// ---------- Character creation ----------
function createCharacter() {
  let cat = "All", query = "", pick = null;
  screen(`<h2>Create your character</h2>
    <label>Name <input id="name" maxlength="30" autocomplete="off"></label>
    <div class="chips" id="cats"></div>
    <input id="q" type="search" placeholder="Search species" style="width:100%">
    <div class="grid" id="grid" style="margin-top:.8rem"></div>
    <p class="box" id="sel">Choose a species.</p>
    <div class="row"><button class="btn" id="ok" disabled>Begin adventure</button><button class="btn" id="back">Back</button></div>`);

  const all = Object.entries(SPECIES).flatMap(([c, list]) => list.split(",").map((n) => ({ n, c })));
  const ok = () => { $("#ok").disabled = !($("#name").value.trim() && pick); };

  function draw() {
    $("#cats").innerHTML = ["All", ...Object.keys(SPECIES)].map((c) => `<button class="btn ${c === cat ? "on" : ""}" data-c="${esc(c)}">${esc(c)}</button>`).join("");
    const shown = all.filter((s) => (cat === "All" || s.c === cat) && s.n.toLowerCase().includes(query));
    $("#grid").innerHTML = shown.map((s, i) => `<button class="btn ${pick && pick.n === s.n && pick.c === s.c ? "on" : ""}" data-i="${i}" title="${esc(s.c)}">${esc(s.n)}</button>`).join("") || '<p class="muted">No species match.</p>';
    $("#cats").onclick = (e) => { if (e.target.dataset.c) { cat = e.target.dataset.c; draw(); } };
    $("#grid").onclick = (e) => {
      if (e.target.dataset.i === undefined) return;
      pick = shown[+e.target.dataset.i];
      $("#sel").textContent = `${pick.n} (${pick.c})`;
      draw(); ok();
    };
  }
  $("#q").oninput = (e) => { query = e.target.value.toLowerCase(); draw(); };
  $("#name").oninput = ok;
  $("#back").onclick = menu;
  $("#ok").onclick = () => { const save = { name: $("#name").value.trim(), species: pick.n, source: pick.c }; write("dt-save", save); startGame(save); };
  draw();
}

// ---------- Placeholder game screen (plug your story engine in here) ----------
function startGame(save) {
  screen(`<h2>${esc(save.name)}</h2><p class="muted">${esc(save.species)} (${esc(save.source)})</p>
    <p class="box" id="text" style="min-height:6rem"></p>
    <div class="row"><button class="btn" id="back">Save and return to menu</button></div>`);
  const full = `You, ${save.name} the ${save.species}, step into the torchlit dark. Your story begins here.`;
  const out = $("#text"); let i = 0;
  const skip = () => { i = full.length; out.textContent = full; };
  const onKey = (e) => { if (e.code === settings.advanceKey) skip(); };
  document.addEventListener("keydown", onKey);
  out.onclick = skip;
  if (settings.textSpeed >= 100) skip();
  else {
    const timer = setInterval(() => { out.textContent = full.slice(0, ++i); if (i >= full.length) clearInterval(timer); }, 1000 / settings.textSpeed);
    $("#back").addEventListener("click", () => clearInterval(timer));
  }
  $("#back").addEventListener("click", () => { document.removeEventListener("keydown", onKey); menu(); });
}

// ---------- Settings ----------
function settingsScreen(tab) {
  const rows = SETTING_TABS[tab].map(([key, label, type, opts, note]) => {
    const v = settings[key];
    const ctl = type === "range" ? `<input type="range" data-k="${key}" min="${opts[0]}" max="${opts[1]}" step="${opts[2]}" value="${v}"><span class="muted">${v}</span>`
      : type === "toggle" ? `<input type="checkbox" data-k="${key}" ${v ? "checked" : ""}>`
      : `<select data-k="${key}">${opts.map(([val, text]) => `<option value="${esc(val)}" ${val === v ? "selected" : ""}>${esc(text)}</option>`).join("")}</select>`;
    return `<label class="setting"><span>${label}${note ? `<small>${note}</small>` : ""}</span>${ctl}</label>`;
  }).join("");
  screen(`<h2>Settings</h2>
    <div class="chips">${Object.keys(SETTING_TABS).map((t) => `<button class="btn ${t === tab ? "on" : ""}" data-t="${t}">${t}</button>`).join("")}</div>
    ${rows}
    <div class="row"><button class="btn" id="back">Back</button><button class="btn" id="reset">Reset to defaults</button></div>`);

  document.querySelectorAll("[data-t]").forEach((b) => (b.onclick = () => settingsScreen(b.dataset.t)));
  document.querySelectorAll("[data-k]").forEach((el) => {
    el.onchange = el.oninput = () => {
      const k = el.dataset.k;
      settings[k] = el.type === "checkbox" ? el.checked : el.type === "range" ? +el.value : el.value;
      if (el.type === "range") el.nextElementSibling.textContent = el.value;
      write("dt-settings", settings); applySettings();
    };
  });
  $("#back").onclick = menu;
  $("#reset").onclick = () => { settings = { ...DEFAULTS }; write("dt-settings", settings); applySettings(); settingsScreen(tab); };
}

// Audio isn't wired yet, but this is where "mute on focus loss" will hook in.
window.addEventListener("blur", () => { if (settings.muteBlur) document.body.dataset.muted = "1"; });
window.addEventListener("focus", () => delete document.body.dataset.muted);

applySettings();
menu();