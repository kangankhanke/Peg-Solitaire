import PegSolitaire from './pegSolitaire.js';
import TrianglePegSolitaire from './trianglePegSolitaire.js';

// Main game instance (default: PegSolitaire)
let game;

function setupGame() {
    const boardTypeSelect = document.getElementById('boardType');
    const boardType = boardTypeSelect.value;
    if (boardType === 'pyramid' || boardType === 'star') {
        // For triangle/star, use #board, create if missing
        let boardDiv = document.getElementById('board');
        if (!boardDiv) {
            boardDiv = document.createElement('div');
            boardDiv.id = 'board';
            document.querySelector('.board').appendChild(boardDiv);
        }
        document.getElementById('gameBoard').style.display = 'none';
        boardDiv.style.display = '';
        // Clear boardDiv before rendering
        boardDiv.innerHTML = '';
        game = new TrianglePegSolitaire(boardType);
    } else {
        // For classic/rectangular, use #gameBoard
        let gameBoardDiv = document.getElementById('gameBoard');
        if (!gameBoardDiv) {
            gameBoardDiv = document.createElement('div');
            gameBoardDiv.id = 'gameBoard';
            document.querySelector('.board').appendChild(gameBoardDiv);
        }
        gameBoardDiv.style.display = '';
        const boardDiv = document.getElementById('board');
        if (boardDiv) boardDiv.style.display = 'none';
        game = new PegSolitaire();
        if (game.switchBoard) game.switchBoard(boardType);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupGame();
    document.getElementById('boardType').addEventListener('change', setupGame);
    document.getElementById('newGameBtn').addEventListener('click', setupGame);
});

function resetGame() {
    if (game.reset) game.reset();
}

// Expose to window for HTML event handlers
window.resetGame = resetGame;
