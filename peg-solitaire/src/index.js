// This file serves as the entry point of the application. It initializes the game and sets up the necessary event listeners.

import PegSolitaire from './pegSolitaire.js';

document.addEventListener('DOMContentLoaded', () => {
    const game = new PegSolitaire();

    // Set up event listeners for buttons and board type selection
    document.getElementById('newGameBtn').addEventListener('click', () => game.createBoard());
    document.getElementById('resetBtn').addEventListener('click', () => game.resetGame());
    document.getElementById('undoBtn').addEventListener('click', () => game.undoMove());
    document.getElementById('redoBtn').addEventListener('click', () => game.redoMove());
    document.getElementById('startGameBtn').addEventListener('click', () => game.startGame());

    document.getElementById('boardType').addEventListener('change', (event) => {
        const boardType = event.target.value;
        game.switchBoard(boardType);
    });
});