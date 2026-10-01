# Dungeon Tale

## Description

**Dungeon Tale** is a browser-based fantasy adventure game inspired by Dungeons & Dragons. Players create their own character by choosing a name and selecting a fantasy species. After creating a character, the player begins an adventure and can save their character for later.

The game is designed as an interactive story experience with customizable text, audio, display, and gameplay settings.

## Features

* Create a custom character
* Enter a character name
* Choose from a large selection of fantasy species
* Search for species by name or traits
* Filter species by their source
* View species artwork, descriptions, and traits
* Save character information in the browser
* Load a previously saved character
* Interactive story text
* Adjustable text speed
* Auto-forward settings
* Skip text options
* Multiple font styles and font sizes
* Dark and light themes
* High-contrast text option
* Adjustable audio settings
* Fullscreen, windowed, and borderless display modes
* Multiple resolution options
* Graphics quality settings
* Keyboard controls for advancing text
* Resettable game settings

## Character Creation

When starting a new game, players enter their character's name and choose a species. The game provides a searchable list of species cards containing artwork, the species name, its source, a description, and its traits.

Players can filter the available species by source or search for a specific species or trait.

After selecting a character name and species, the player can begin the adventure.

## Species

The game contains a large collection of fantasy species from different D&D sources. Each species contains information such as:

* Name
* Source
* Description
* Traits
* Character artwork

The species information is stored separately in `species.js`, allowing the character creation system to load and display the available species.

## Game Settings

Dungeon Tale includes several categories of settings.

### Text & Reading

* Text speed
* Auto-forward delay
* Skip mode
* Stop skipping at choices
* Font style
* Font size
* High-contrast text

### Audio

* Master volume
* Music volume
* Sound effects volume
* Voice volume
* Mute when the game window loses focus

### Display

* Dark or light theme
* Windowed, fullscreen, or borderless mode
* Resolution selection
* Graphics quality
* Language selection

### Gameplay

* Automatic save backup
* Text advancement key
* Controller vibration

These settings are stored in the browser so that the player's preferences can be reused.

## Saving and Loading

Dungeon Tale uses the browser's local storage to save character information and game settings. The main menu displays the **Load game** option when a saved character is available.

The game stores the character's name, species, source, and species ID when a character is created.

## How to Run

Dungeon Tale is a web-based game using HTML, CSS, and JavaScript.

The main files are:

```text
index.html
game.js
species.js
style.css
```

`index.html` loads the stylesheet and JavaScript files needed to run the game.

### Running in VS Code

1. Open the project folder in VS Code.
2. Make sure all game files are in the correct folders.
3. Open `index.html`.
4. Run the page using a local web server such as the **Live Server** extension in VS Code.
5. Open the game in your browser.

## Technologies Used

* HTML
* CSS
* JavaScript
* Browser Local Storage
* Google Fonts

## Project Structure

```text
Dungeon Tale/
│
├── index.html
├── game.js
├── species.js
├── style.css
│
└── img/
    └── species/
        └── species artwork
```

The visual design uses a fantasy-inspired interface with dark and light themes, customizable fonts, and responsive character-selection cards.

## Current Game Status

The current version includes the main menu, character creation system, species selection, saving/loading, settings, and the beginning of the adventure.

The adventure screen currently starts the player with a short introductory scene and displays the selected character's species artwork. The story engine can be expanded with additional scenes, dialogue, choices, and gameplay mechanics in the future.
