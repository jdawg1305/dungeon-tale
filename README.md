
# Dungeon Tale

Dungeon Tale is a browser-based fantasy adventure game inspired by tabletop role-playing games. Create a character, choose a fantasy species, and embark on adventures in a story-driven game.

## Features

- **Character creation:** Choose a character name and fantasy species.
- **Species library:** Browse, search, and filter species by name, traits, and source.
- **Character artwork:** View species illustrations during character creation.
- **Adventure content:** Organize adventure scenes, descriptions, choices, and artwork.
- **Story presentation:** Display narrative text in the game interface.
- **Save and load:** Save character information and settings in browser storage.
- **Customizable settings:** Adjust text speed, fonts, audio options, themes, and display preferences.
- **Fantasy interface:** Use a responsive interface with dark and light themes.

## Project Structure

```text
dungeon-tale/
├── index.html
├── game.js
├── adventures.js
├── species.js
├── style.css
├── README.md
├── README_original.md
├── img/
│   ├── species/
│   └── adventures/
│       └── skyhorn/
│           └── source-assets/
└── update/
```

## Main Files

- `index.html` — Main HTML page that loads the game.
- `game.js` — Game logic, menus, character creation, settings, and story presentation.
- `adventures.js` — Adventure-related content and scene data, where implemented.
- `species.js` — Fantasy species data used during character creation.
- `style.css` — Game layout, themes, buttons, cards, and responsive styling.
- `img/species/` — Species artwork.
- `img/adventures/` — Adventure illustrations and local artwork.
- `README.md` — Current project documentation.
- `README_original.md` — Backup of the original README.
- `update/` — Update files; inspect before using or committing them.

## Getting Started

### Requirements

- Visual Studio Code
- A modern web browser
- The VS Code Live Server extension, or another local web server

### Run the Game

1. Open the `dungeon-tale` folder in Visual Studio Code.
2. Check that the game files and image folders are in their expected locations.
3. Open `index.html`.
4. Right-click the file and select **Open with Live Server**.
5. Play the game in your browser.

## Character Creation

The character creation interface lets players enter a name and select a fantasy species. Species information is maintained in `species.js`.

Depending on the available species data, the interface can display species names, sources, descriptions, traits, and artwork.

## Adventure Content

Adventure data and artwork are organized separately from the main game engine to make the project easier to maintain.

The `adventures.js` file is intended for adventure information and scene data. Adventure illustrations are stored under `img/adventures/`, organized into folders for individual adventures.

The Skyhorn Lighthouse artwork is located in:

```text
img/adventures/skyhorn/source-assets/
```

For an adventure to appear and function in the game, the relevant data must be connected to the game engine, and the image paths must match the actual files.

## Game Settings

Dungeon Tale includes configurable options for supported settings, such as:

- Text speed and reading preferences
- Font style and size
- Dark and light themes
- Audio levels
- Display modes and resolution
- Gameplay preferences

Available settings depend on the current implementation of `game.js`.

## Saving and Loading

The game uses browser storage for supported saved character information and settings. Saved data is stored in the browser used to play the game, so it may not automatically transfer to another browser or computer.

## Technologies

- HTML
- CSS
- JavaScript
- Browser local storage

## Version Control

The project uses Git for version control and GitHub for remote hosting.

Check your changes with:

```bash
git status
```

Stage and commit the README:

```bash
git add README.md
git commit -m "Update project documentation"
```

Push committed changes to GitHub:

```bash
git push origin main
```

## Development Notes

- Keep adventure content separate from core game logic where practical.
- Use relative paths for local images and scripts.
- Test the game in a browser after changing JavaScript or CSS.
- Check the browser developer console for errors if an adventure or image does not load.
- Avoid committing duplicate backups or temporary update files unless they are intentionally part of the project.