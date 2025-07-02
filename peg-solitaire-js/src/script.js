class PegSolitaire {
    constructor(type = 'pyramid') {
        this.currentBoard = type;
        this.board = [];
        this.selectedPeg = null;
        this.pegCount = 0;
        this.gameOver = false;
        this.boardConfigs = {
            pyramid: [
                [{ hasPeg: false }, { hasPeg: true }, { hasPeg: true }],
                [{ hasPeg: true }, { hasPeg: true }, { hasPeg: true }],
                [{ hasPeg: true }, { hasPeg: true }, { hasPeg: true }],
                [{ hasPeg: true }, { hasPeg: true }, { hasPeg: true }],
                [{ hasPeg: true }, { hasPeg: true }, { hasPeg: true }]
            ],
            star: [
                [{ hasPeg: false }, { hasPeg: true }, { hasPeg: false }],
                [{ hasPeg: true }, { hasPeg: true }, { hasPeg: true }],
                [{ hasPeg: false }, { hasPeg: true }, { hasPeg: false }],
                [{ hasPeg: true }, { hasPeg: true }, { hasPeg: true }],
                [{ hasPeg: false }, { hasPeg: true }, { hasPeg: false }]
            ]
        };
        this.initializeBoard();
        this.renderBoard();
    }

    initializeBoard() {
        if (this.currentBoard === 'pyramid') {
            this.initializePyramidBoard();
        } else if (this.currentBoard === 'star') {
            this.initializeStarBoard();
        }
        this.pegCount = this.countPegs();
        this.updateDisplay();
    }

    initializePyramidBoard() {
        this.board = this.boardConfigs.pyramid;
    }

    initializeStarBoard() {
        this.board = this.boardConfigs.star;
    }

    switchBoard(boardType) {
        this.currentBoard = boardType;
        this.initializeBoard();
    }

    renderBoard() {
        const boardElement = document.getElementById('gameBoard');
        boardElement.innerHTML = '';
        this.board.forEach((row, rowIndex) => {
            row.forEach((hole, colIndex) => {
                const holeElement = document.createElement('div');
                holeElement.className = 'hole';
                holeElement.dataset.row = rowIndex;
                holeElement.dataset.col = colIndex;

                if (hole.hasPeg) {
                    const pegElement = document.createElement('div');
                    pegElement.className = 'peg';
                    pegElement.draggable = true;
                    pegElement.dataset.row = rowIndex;
                    pegElement.dataset.col = colIndex;

                    pegElement.addEventListener('click', (e) => this.handlePegClick(e));
                    pegElement.addEventListener('dragstart', (e) => this.handleDragStart(e));
                    pegElement.addEventListener('dragend', (e) => this.handleDragEnd(e));

                    holeElement.appendChild(pegElement);
                }

                holeElement.addEventListener('click', (e) => this.handleHoleClick(e));
                holeElement.addEventListener('dragover', (e) => this.handleDragOver(e));
                holeElement.addEventListener('drop', (e) => this.handleDrop(e));

                boardElement.appendChild(holeElement);
            });
        });
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
        if (!this.board[toRow] || !this.board[toRow][toCol]) return false;
        if (this.board[toRow][toCol].hasPeg) return false;

        const rowDiff = toRow - fromRow;
        const colDiff = toCol - fromCol;

        let middleRow, middleCol;
        if (rowDiff === 0 && Math.abs(colDiff) === 2) {
            middleRow = fromRow;
            middleCol = fromCol + colDiff / 2;
        } else if (rowDiff === -2 && Math.abs(colDiff) === 2) {
            middleRow = fromRow - 1;
            middleCol = fromCol + colDiff / 2;
        } else if (rowDiff === 2 && Math.abs(colDiff) === 2) {
            middleRow = fromRow + 1;
            middleCol = fromCol + colDiff / 2;
        } else {
            return false;
        }

        if (
            middleRow < 0 || middleRow >= this.board.length ||
            middleCol < 0 || middleCol >= this.board[middleRow].length
        ) {
            return false;
        }

        return this.board[middleRow][middleCol].hasPeg;
    }

    makeMove(fromRow, fromCol, toRow, toCol) {
        const rowDiff = toRow - fromRow;
        const colDiff = toCol - fromCol;
        let middleRow, middleCol;
        if (rowDiff === 0 && Math.abs(colDiff) === 2) {
            middleRow = fromRow;
            middleCol = fromCol + colDiff / 2;
        } else if (rowDiff === -2 && Math.abs(colDiff) === 2) {
            middleRow = fromRow - 1;
            middleCol = fromCol + colDiff / 2;
        } else if (rowDiff === 2 && Math.abs(colDiff) === 2) {
            middleRow = fromRow + 1;
            middleCol = fromCol + colDiff / 2;
        }

        this.board[fromRow][fromCol].hasPeg = false;
        this.board[middleRow][middleCol].hasPeg = false;
        this.board[toRow][toCol].hasPeg = true;

        this.pegCount--;
        this.renderBoard();
        this.updateDisplay();
        this.checkGameStatus();
    }

    updateDisplay() {
        document.getElementById('pegCount').textContent = this.pegCount;
        document.getElementById('boardType').textContent = this.currentBoard.charAt(0).toUpperCase() + this.currentBoard.slice(1);
    }

    checkGameStatus() {
        if (this.pegCount === 1) {
            alert('🎉 Congratulations! You won!');
            this.gameOver = true;
        } else if (!this.hasValidMoves()) {
            alert(`😔 No more moves! Final score: ${this.pegCount} pegs remaining`);
            this.gameOver = true;
        }
    }

    hasValidMoves() {
        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board[row].length; col++) {
                if (this.board[row][col].hasPeg) {
                    for (let dRow of [0, -2, 2]) {
                        for (let dCol of [-2, 2]) {
                            if (dRow === 0 || Math.abs(dRow) === Math.abs(dCol)) {
                                const toRow = row + dRow;
                                const toCol = col + dCol;
                                if (this.isValidMove(row, col, toRow, toCol)) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    reset() {
        this.pegCount = 0;
        this.gameOver = false;
        this.selectedPeg = null;
        this.initializeBoard();
        this.renderBoard();
    }
}