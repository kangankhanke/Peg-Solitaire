# Peg Solitaire Game

## Overview
This project implements a Peg Solitaire game featuring two board types: pyramid and star. The game allows players to interact with the board by selecting and moving pegs according to the rules of Peg Solitaire.

## Files
- **src/script.js**: Contains the implementation of the `PegSolitaire` class, which manages the game logic for both pyramid and star board types. It includes methods for initializing the boards, rendering the game, handling user interactions (clicks and drags), validating moves, and updating the game status.
  
- **src/styles.css**: Contains the styles for the Peg Solitaire game, including the layout of the board, the appearance of pegs and holes, and any animations or transitions for user interactions.

- **index.html**: Serves as the main entry point for the application. It includes the structure of the game interface, such as the game board, buttons for selecting board types, and displays for the peg count and game status.

## How to Run the Game
1. Clone the repository to your local machine.
2. Open the `index.html` file in a web browser.
3. Select the desired board type (pyramid or star) and start playing!

## Game Rules
- The objective of Peg Solitaire is to remove pegs from the board by jumping over them with other pegs.
- A peg can jump over an adjacent peg into an empty hole directly on the opposite side.
- The game ends when no more valid moves are available or when only one peg remains on the board.

## Public Properties and Methods
### Properties
- **currentBoard**: A string indicating the current board type ('pyramid' or 'star').
- **board**: An array representing the current state of the board.
- **selectedPeg**: An object representing the currently selected peg.
- **pegCount**: A number indicating the current count of pegs on the board.
- **gameOver**: A boolean indicating whether the game has ended.
- **boardConfigs**: An object containing configuration details for each board type.

### Methods
- **constructor()**: Initializes the game, sets up the board, and renders it.
- **initializeBoard()**: Initializes the board based on the current board type.
- **initializePyramidBoard()**: Sets up the pyramid board layout.
- **initializeStarBoard()**: Sets up the star board layout.
- **switchBoard(boardType)**: Switches to a different board type and reinitializes the game.
- **renderBoard()**: Renders the current board state in the HTML.
- **handlePegClick(e)**: Handles peg selection when a peg is clicked.
- **handleHoleClick(e)**: Handles peg movement when a hole is clicked.
- **handleDragStart(e)**: Handles the start of a drag event for a peg.
- **handleDragEnd(e)**: Handles the end of a drag event for a peg.
- **handleDragOver(e)**: Handles drag over events for valid drop targets.
- **handleDrop(e)**: Handles the drop event for moving a peg.
- **clearValidDrops()**: Clears visual indicators for valid drop targets.
- **isValidMove(fromRow, fromCol, toRow, toCol)**: Validates if a move is legal.
- **makeMove(fromRow, fromCol, toRow, toCol)**: Executes a move and updates the board state.
- **updateDisplay()**: Updates the display of peg count and board name.
- **checkGameStatus()**: Checks if the game has been won or lost and updates the status display.
- **hasValidMoves()**: Checks if there are any valid moves left.
- **reset()**: Resets the game to its initial state.

## Additional Information
Feel free to modify the styles in `src/styles.css` to customize the appearance of the game. Enjoy playing Peg Solitaire!