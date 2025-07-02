# Peg Solitaire

## Overview
Peg Solitaire is a classic board game where the objective is to remove pegs from the board until only one peg remains. The game can be played on different board types, including a pyramid and a star layout.

## Project Structure
The project is organized as follows:

```
peg-solitaire
├── src
│   ├── index.js            # Entry point of the application
│   ├── pegSolitaire.js     # Main game logic and state management
│   ├── boards
│   │   ├── pyramidBoard.js # Pyramid board layout and behavior
│   │   └── starBoard.js    # Star board layout and behavior
│   └── utils
│       └── validMoves.js   # Functions for validating moves
├── package.json            # npm configuration file
└── README.md               # Project documentation
```

## Installation
To set up the project, clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd peg-solitaire
npm install
```

## Usage
To start the game, run the following command:

```bash
npm start
```

This will launch the game in your default web browser.

## Gameplay
1. Select a board type (Pyramid or Star).
2. Click on a peg to select it.
3. Click on an empty hole to move the peg.
4. The game ends when no valid moves are left or only one peg remains.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License.