// TrianglePegSolitaire class: handles pyramid and star boards
class TrianglePegSolitaire {
    constructor(type = 'pyramid') {
        this.type = type;
        this.board = [];
        this.selectedPeg = null;
        this.pegCount = 0;
        this.gameOver = false;
        this.boardConfigs = {
            pyramid: {
                name: 'Pyramid',
                initialPegs: 14,
                boardWidth: 480,
                boardHeight: 400
            },
            star: {
                name: 'Star',
                initialPegs: 36,
                boardWidth: 480,
                boardHeight: 400
            }
        };
        this.currentBoard = type; // use the passed type
        this.initializeBoard();
        this.renderBoard();
        this.updateDisplay();
    }

    initializeBoard() {
        if (this.currentBoard === 'pyramid') {
            this.initializePyramidBoard();
        } else if (this.currentBoard === 'star') {
            this.initializeStarBoard();
        }
        this.pegCount = this.boardConfigs[this.currentBoard].initialPegs;
    }

    initializePyramidBoard() {
        // Pyramid layout: 5 rows with top hole empty
        this.board = [
            [{ hasPeg: false, x: 240, y: 50 }], // Row 0 - top hole empty
            [{ hasPeg: true, x: 210, y: 120 }, { hasPeg: true, x: 270, y: 120 }], // Row 1
            [{ hasPeg: true, x: 180, y: 190 }, { hasPeg: true, x: 240, y: 190 }, { hasPeg: true, x: 300, y: 190 }], // Row 2
            [{ hasPeg: true, x: 150, y: 260 }, { hasPeg: true, x: 210, y: 260 }, { hasPeg: true, x: 270, y: 260 }, { hasPeg: true, x: 330, y: 260 }], // Row 3
            [{ hasPeg: true, x: 120, y: 330 }, { hasPeg: true, x: 180, y: 330 }, { hasPeg: true, x: 240, y: 330 }, { hasPeg: true, x: 300, y: 330 }, { hasPeg: true, x: 360, y: 330 }]
        ];
    }

    initializeStarBoard() {
        // Star layout with 36 holes (all filled except center)
        this.board = [];
        const centerX = 250;
        const centerY = 250;
        const spacing = 60;
        const starPoints = [
            [{ hasPeg: true, x: centerX, y: centerY - spacing * 3 }],
            [{ hasPeg: true, x: centerX - spacing/2, y: centerY - spacing * 2 }, { hasPeg: true, x: centerX + spacing/2, y: centerY - spacing * 2 }],
            [{ hasPeg: true, x: centerX - spacing * 2.5, y: centerY - spacing * 1.5 }, { hasPeg: true, x: centerX - spacing, y: centerY - spacing }, { hasPeg: false, x: centerX, y: centerY }, { hasPeg: true, x: centerX + spacing, y: centerY - spacing }, { hasPeg: true, x: centerX + spacing * 2.5, y: centerY - spacing * 1.5 }],
            [{ hasPeg: true, x: centerX - spacing * 3, y: centerY - spacing/2 }, { hasPeg: true, x: centerX - spacing * 2, y: centerY }, { hasPeg: true, x: centerX - spacing, y: centerY }, { hasPeg: true, x: centerX + spacing, y: centerY }, { hasPeg: true, x: centerX + spacing * 2, y: centerY }, { hasPeg: true, x: centerX + spacing * 3, y: centerY - spacing/2 }],
            [{ hasPeg: true, x: centerX - spacing * 2.5, y: centerY + spacing/2 }, { hasPeg: true, x: centerX - spacing * 1.5, y: centerY + spacing }, { hasPeg: true, x: centerX - spacing/2, y: centerY + spacing }, { hasPeg: true, x: centerX + spacing/2, y: centerY + spacing }, { hasPeg: true, x: centerX + spacing * 1.5, y: centerY + spacing }, { hasPeg: true, x: centerX + spacing * 2.5, y: centerY + spacing/2 }],
            [{ hasPeg: true, x: centerX - spacing * 2, y: centerY + spacing * 1.5 }, { hasPeg: true, x: centerX - spacing, y: centerY + spacing * 2 }, { hasPeg: true, x: centerX, y: centerY + spacing * 2 }, { hasPeg: true, x: centerX + spacing, y: centerY + spacing * 2 }, { hasPeg: true, x: centerX + spacing * 2, y: centerY + spacing * 1.5 }],
            [{ hasPeg: true, x: centerX - spacing * 1.5, y: centerY + spacing * 2.5 }, { hasPeg: true, x: centerX + spacing * 1.5, y: centerY + spacing * 2.5 }],
            [{ hasPeg: true, x: centerX - spacing, y: centerY + spacing * 3 }, { hasPeg: true, x: centerX + spacing, y: centerY + spacing * 3 }],
            [{ hasPeg: true, x: centerX, y: centerY + spacing * 3.5 }]
        ];
        this.board = starPoints;
    }

    switchBoard(boardType) {
        this.currentBoard = boardType;
        this.gameOver = false;
        this.selectedPeg = null;
        this.initializeBoard();
        this.renderBoard();
        this.updateDisplay();
    }

    renderBoard() {
        const boardElement = document.getElementById('board');
        if (!boardElement) return;
        boardElement.innerHTML = '';
        boardElement.style.position = 'relative';
        const config = this.boardConfigs[this.currentBoard];
        boardElement.style.width = config.boardWidth + 'px';
        boardElement.style.height = config.boardHeight + 'px';
        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board[row].length; col++) {
                const cell = this.board[row][col];
                const hole = document.createElement('div');
                hole.className = 'hole';
                hole.style.position = 'absolute';
                hole.style.left = cell.x + 'px';
                hole.style.top = cell.y + 'px';
                hole.dataset.row = row;
                hole.dataset.col = col;
                if (!cell.hasPeg) {
                    hole.classList.add('empty');
                }
                hole.addEventListener('click', (e) => this.handleHoleClick(e));
                if (cell.hasPeg) {
                    const peg = document.createElement('div');
                    peg.className = 'peg';
                    peg.draggable = true;
                    peg.dataset.row = row;
                    peg.dataset.col = col;
                    peg.addEventListener('click', (e) => this.handlePegClick(e));
                    peg.addEventListener('dragstart', (e) => this.handleDragStart(e));
                    peg.addEventListener('dragend', (e) => this.handleDragEnd(e));
                    hole.appendChild(peg);
                }
                hole.addEventListener('dragover', (e) => this.handleDragOver(e));
                hole.addEventListener('drop', (e) => this.handleDrop(e));
                boardElement.appendChild(hole);
            }
        }
    }

    handlePegClick(e) {
        e.stopPropagation();
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        if (this.selectedPeg) {
            this.selectedPeg.classList.remove('selected');
        }
        this.selectedPeg = e.target;
        this.selectedPeg.classList.add('selected');
        this.selectedPeg.dataset.selectedRow = row;
        this.selectedPeg.dataset.selectedCol = col;
    }

    handleHoleClick(e) {
        if (this.selectedPeg && !e.target.querySelector('.peg')) {
            const fromRow = parseInt(this.selectedPeg.dataset.selectedRow);
            const fromCol = parseInt(this.selectedPeg.dataset.selectedCol);
            const toRow = parseInt(e.target.dataset.row);
            const toCol = parseInt(e.target.dataset.col);
            if (this.isValidMove(fromRow, fromCol, toRow, toCol)) {
                this.makeMove(fromRow, fromCol, toRow, toCol);
            }
            this.selectedPeg.classList.remove('selected');
            this.selectedPeg = null;
        }
    }

    handleDragStart(e) {
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        e.dataTransfer.setData('text/plain', `${row},${col}`);
        e.target.classList.add('dragging');
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        this.clearValidDrops();
    }

    handleDragOver(e) {
        e.preventDefault();
        const dragData = e.dataTransfer.getData('text/plain');
        if (dragData) {
            const [fromRow, fromCol] = dragData.split(',').map(Number);
            const toRow = parseInt(e.target.dataset.row);
            const toCol = parseInt(e.target.dataset.col);
            if (this.isValidMove(fromRow, fromCol, toRow, toCol)) {
                e.target.classList.add('valid-drop');
            } else {
                e.target.classList.remove('valid-drop');
            }
        }
    }

    handleDrop(e) {
        e.preventDefault();
        const dragData = e.dataTransfer.getData('text/plain');
        const [fromRow, fromCol] = dragData.split(',').map(Number);
        const toRow = parseInt(e.target.dataset.row);
        const toCol = parseInt(e.target.dataset.col);
        if (this.isValidMove(fromRow, fromCol, toRow, toCol)) {
            this.makeMove(fromRow, fromCol, toRow, toCol);
        }
        this.clearValidDrops();
    }

    clearValidDrops() {
        document.querySelectorAll('.valid-drop').forEach(hole => {
            hole.classList.remove('valid-drop');
        });
    }

    isValidMove(fromRow, fromCol, toRow, toCol) {
        if (this.gameOver) return false;
        if (this.board[toRow][toCol].hasPeg) return false;
        const rowDiff = toRow - fromRow;
        const colDiff = toCol - fromCol;
        let middleRow, middleCol;
        if (Math.abs(rowDiff) === 2 && colDiff === 0) {
            middleRow = fromRow + rowDiff / 2;
            middleCol = fromCol;
        } else if (Math.abs(colDiff) === 2 && rowDiff === 0) {
            middleRow = fromRow;
            middleCol = fromCol + colDiff / 2;
        } else if (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 2) {
            middleRow = fromRow + rowDiff / 2;
            middleCol = fromCol + colDiff / 2;
        } else {
            return false;
        }
        if (middleRow < 0 || middleRow >= this.board.length || middleCol < 0 || middleCol >= this.board[middleRow].length) {
            return false;
        }
        return this.board[middleRow][middleCol].hasPeg;
    }

    makeMove(fromRow, fromCol, toRow, toCol) {
        const rowDiff = toRow - fromRow;
        const colDiff = toCol - fromCol;
        const middleRow = fromRow + rowDiff / 2;
        const middleCol = fromCol + colDiff / 2;
        this.board[fromRow][fromCol].hasPeg = false;
        this.board[middleRow][middleCol].hasPeg = false;
        this.board[toRow][toCol].hasPeg = true;
        this.pegCount -= 1;
        this.renderBoard();
        this.updateDisplay();
        this.checkGameStatus();
    }

    updateDisplay() {
        const pegCountElem = document.getElementById('pegCount');
        if (pegCountElem) pegCountElem.textContent = this.pegCount;
        const boardNameElem = document.getElementById('boardName');
        if (boardNameElem) boardNameElem.textContent = this.boardConfigs[this.currentBoard].name;
    }

    checkGameStatus() {
        const statusElement = document.getElementById('gameStatus');
        if (this.pegCount === 1) {
            statusElement.textContent = '🎉 Congratulations! You won! 🎉';
            statusElement.className = 'game-status win-message';
            this.gameOver = true;
        } else if (!this.hasValidMoves()) {
            statusElement.textContent = '😞 No more moves available. Try again!';
            statusElement.className = 'game-status lose-message';
            this.gameOver = true;
        } else {
            statusElement.textContent = '';
            statusElement.className = 'game-status';
        }
    }

    hasValidMoves() {
        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board[row].length; col++) {
                if (this.board[row][col].hasPeg) {
                    // Try all 6 triangle directions
                    const directions = [
                        [0, -2], [0, 2], [-2, -2], [-2, 2], [2, -2], [2, 2]
                    ];
                    for (const [dRow, dCol] of directions) {
                        const toRow = row + dRow;
                        const toCol = col + dCol;
                        if (
                            toRow >= 0 && toRow < this.board.length &&
                            toCol >= 0 && toCol < (this.board[toRow] ? this.board[toRow].length : 0)
                        ) {
                            if (this.isValidMove(row, col, toRow, toCol)) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    reset() {
        this.gameOver = false;
        this.selectedPeg = null;
        this.initializeBoard();
        this.renderBoard();
        this.updateDisplay();
        const statusElement = document.getElementById('gameStatus');
        if (statusElement) {
            statusElement.textContent = '';
            statusElement.className = 'game-status';
        }
    }
}

export default TrianglePegSolitaire;
