# Dungeon Tale — Full Skyhorn Lighthouse Adventure Update

This build keeps the existing Dungeon Tale engine and integrates the full text of the Skyhorn Lighthouse adventure from the Word document supplied for this project. The adventure is divided into playable sections, with the source prose retained in each scene.

## Files
- `index.html` — loads the species data, adventure catalog, original game engine, and stylesheet.
- `game.js` — original Dungeon Tale engine extended with character-first adventure selection and scene navigation.
- `species.js` — original species database, unchanged.
- `style.css` — original game styles plus responsive adventure/story screens.
- `adventures.js` — complete adventure sections, reference sections, and navigation choices.
- `img/adventures/skyhorn/cover.jpg` — cover art supplied with the project.
- `img/adventures/skyhorn/source-assets/` — images extracted from the supplied Word document.
- `img/species/` — keep your original species artwork folder here.

## Install
1. Back up your current Dungeon Tale folder.
2. Copy the updated `index.html`, `game.js`, `style.css`, and `adventures.js` into the project.
3. Keep `species.js` and your existing `img/species/` artwork. Copy the supplied `img/adventures/` folder into your project.
4. Open `index.html` with VS Code Live Server.
5. Create or select a character, choose **The Secrets of Skyhorn Lighthouse**, and use **Continue** to move between sections.

## Notes
- The adventure data is arranged as readable sections; the original module is a tabletop adventure, so the game presents its text and GM encounter notes rather than automatically simulating every tabletop rule.
- Some original maps/illustrations are extracted into `source-assets`; exact image-to-scene placement may need manual adjustment after you preview the files.
- Browser local storage keeps the character, selected adventure, and current scene.
