// PegSolitaire class: handles classic, rectangular, and triangle/star boards
class PegSolitaire {
    constructor() {
        this.board = [];
        this.selectedCell = null;
        this.gameState = 'setup'; // 'setup', 'playing', 'won', 'lost'
        this.moveHistory = [];
        this.redoHistory = [];
        this.pegCount = 0;
        this.moveCount = 0;
        this.initializeElements();
        this.setupEventListeners();
        this.createBoard();
    }

    initializeElements() {
        this.boardElement = document.getElementById('gameBoard');
        this.boardTypeSelect = document.getElementById('boardType');
        this.widthSelect = document.getElementById('boardWidth');
        this.heightSelect = document.getElementById('boardHeight');
        this.rectangularControls = document.getElementById('rectangularControls');
        this.setupModeDiv = document.getElementById('setupMode');
        this.newGameBtn = document.getElementById('newGameBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.undoBtn = document.getElementById('undoBtn');
        this.redoBtn = document.getElementById('redoBtn');
        this.startGameBtn = document.getElementById('startGameBtn');
        this.pegCountSpan = document.getElementById('pegCount');
        this.moveCountSpan = document.getElementById('moveCount');
        this.gameStatusDiv = document.getElementById('gameStatus');
    }

    setupEventListeners() {
        this.boardTypeSelect.addEventListener('change', () => {
            this.rectangularControls.style.display = 
                this.boardTypeSelect.value === 'rectangular' ? 'grid' : 'none';
            this.createBoard();
        });
        this.widthSelect.addEventListener('change', () => {
            if (this.boardTypeSelect.value === 'rectangular') {
                this.createBoard();
            }
        });
        this.heightSelect.addEventListener('change', () => {
            if (this.boardTypeSelect.value === 'rectangular') {
                this.createBoard();
            }
        });
        this.newGameBtn.addEventListener('click', () => this.createBoard());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.undoBtn.addEventListener('click', () => this.undoMove());
        this.redoBtn.addEventListener('click', () => this.redoMove());
        this.startGameBtn.addEventListener('click', () => this.startGame());
    }

    getBoardLayout(type) {
        const layouts = {
            classic: [
                [-1,-1,1,1,1,-1,-1],
                [-1,-1,1,1,1,-1,-1],
                [1,1,1,1,1,1,1],
                [1,1,1,0,1,1,1],
                [1,1,1,1,1,1,1],
                [-1,-1,1,1,1,-1,-1],
                [-1,-1,1,1,1,-1,-1]
            ],
            european: [
                [-1,-1,1,1,1,-1,-1],
                [-1,1,1,1,1,1,-1],
                [1,1,1,1,1,1,1],
                [1,1,1,0,1,1,1],
                [1,1,1,1,1,1,1],
                [-1,1,1,1,1,1,-1],
                [-1,-1,1,1,1,-1,-1]
            ],
            asymmetric: [
                [-1,-1,1,1,1,-1,-1,-1],
                [-1,-1,1,1,1,-1,-1,-1],
                [-1,-1,1,1,1,-1,-1,-1],
                [1,1,1,1,1,1,1,1,1],
                [1,1,1,0,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1],
                [-1,-1,1,1,1,-1,-1,-1],
                [-1,-1,1,1,1,-1,-1,-1]
            ],
            german: [
                [-1,-1,-1,1,1,1,-1,-1,-1],
                [-1,-1,-1,1,1,1,-1,-1,-1],
                [-1,-1,-1,1,1,1,-1,-1,-1],
                [1,1,1,1,1,1,1,1,1],
                [1,1,1,1,0,1,1,1,1],
                [1,1,1,1,1,1,1,1,1],
                [-1,-1,-1,1,1,1,-1,-1,-1],
                [-1,-1,-1,1,1,1,-1,-1,-1],
                [-1,-1,-1,1,1,1,-1,-1,-1]
            ]
        };
        if (type === 'rectangular') {
            const width = parseInt(this.widthSelect.value);
            const height = parseInt(this.heightSelect.value);
            const layout = [];
            for (let i = 0; i < height; i++) {
                const row = [];
                for (let j = 0; j < width; j++) {
                    row.push(1);
                }
                layout.push(row);
            }
            // Make center cell empty for rectangular boards
            const centerRow = Math.floor(height / 2);
            const centerCol = Math.floor(width / 2);
            layout[centerRow][centerCol] = 0;
            return layout;
        }
        return layouts[type] || layouts.classic;
    }

    createBoard() {
        const boardType = this.boardTypeSelect.value;
        const layout = this.getBoardLayout(boardType);
        this.board = layout.map(row => [...row]);
        this.gameState = 'setup';
        this.selectedCell = null;
        this.moveHistory = [];
        this.redoHistory = [];
        this.moveCount = 0;
        this.renderBoard();
        this.updateUI();
        this.showSetupMode();
        this.gameStatusDiv.innerHTML = '';
    }

    renderBoard() {
        const boardType = this.boardTypeSelect.value;
        const rows = this.board.length;
        this.boardElement.innerHTML = '';
        this.boardElement.style.display = 'grid';
        if (this.board[0]) {
            const cols = this.board[0].length;
            this.boardElement.style.gridTemplateColumns = `repeat(${cols}, 40px)`;
        }
        for (let row = 0; row < rows; row++) {
            const cols = this.board[row].length;
            for (let col = 0; col < cols; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                if (this.board[row][col] === -1) {
                    cell.classList.add('invisible');
                } else if (this.board[row][col] === 0) {
                    cell.classList.add('empty');
                } else if (this.board[row][col] === 1) {
                    cell.classList.add('peg');
                }
                if (this.board[row][col] !== -1) {
                    cell.addEventListener('click', (e) => this.handleCellClick(e));
                }
                this.boardElement.appendChild(cell);
            }
        }
    }

    handleCellClick(event) {
        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);
        if (this.gameState === 'setup') {
            this.handleSetupClick(row, col);
        } else if (this.gameState === 'playing') {
            this.handleGameClick(row, col);
        }
    }

    handleSetupClick(row, col) {
        const emptyCount = this.countEmptyCells();
        if (this.board[row][col] === 1) {
            if (emptyCount === 0) {
                this.board[row][col] = 0;
            }
        } else if (this.board[row][col] === 0) {
            if (emptyCount === 1) {
                this.board[row][col] = 1;
            }
        }
        this.renderBoard();
        this.updateUI();
    }

    handleGameClick(row, col) {
        if (this.board[row][col] === 1) {
            this.clearSelection();
            this.selectedCell = { row, col };
            this.highlightValidMoves();
            this.renderBoard();
        } else if (this.board[row][col] === 0 && this.selectedCell) {
            this.attemptMove(row, col);
        }
    }

    clearSelection() {
        this.selectedCell = null;
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.remove('selected', 'valid-move', 'invalid-move');
        });
    }

    getMoveDirections() {
        return [
            [-2, 0],   // up
            [2, 0],    // down
            [0, -2],   // left
            [0, 2]     // right
        ];
    }

    highlightValidMoves() {
        if (!this.selectedCell) return;
        const { row, col } = this.selectedCell;
        document.querySelector(`[data-row="${row}"][data-col="${col}"]`).classList.add('selected');
        const directions = this.getMoveDirections();
        directions.forEach(([dRow, dCol]) => {
            const newRow = row + dRow;
            const newCol = col + dCol;
            if (this.isValidMove(row, col, newRow, newCol)) {
                const targetCell = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`);
                if (targetCell) {
                    targetCell.classList.add('valid-move');
                }
            }
        });
    }

    isValidMove(fromRow, fromCol, toRow, toCol) {
        if (
            toRow < 0 || toRow >= this.board.length ||
            toCol < 0 || toCol >= this.board[toRow].length
        ) {
            return false;
        }
        if (this.board[toRow][toCol] !== 0) {
            return false;
        }
        const rowDiff = toRow - fromRow;
        const colDiff = toCol - fromCol;
        if (rowDiff % 2 !== 0 || colDiff % 2 !== 0) {
            return false;
        }
        const midRow = fromRow + rowDiff / 2;
        const midCol = fromCol + colDiff / 2;
        if (
            midRow < 0 || midRow >= this.board.length ||
            midCol < 0 || midCol >= this.board[midRow].length
        ) {
            return false;
        }
        return this.board[midRow][midCol] === 1;
    }

    attemptMove(toRow, toCol) {
        const { row: fromRow, col: fromCol } = this.selectedCell;
        if (this.isValidMove(fromRow, fromCol, toRow, toCol)) {
            const midRow = fromRow + (toRow - fromRow) / 2;
            const midCol = fromCol + (toCol - fromCol) / 2;
            this.moveHistory.push({
                from: { row: fromRow, col: fromCol },
                to: { row: toRow, col: toCol },
                jumped: { row: midRow, col: midCol }
            });
            this.redoHistory = [];
            this.board[fromRow][fromCol] = 0;
            this.board[midRow][midCol] = 0;
            this.board[toRow][toCol] = 1;
            this.moveCount++;
            this.clearSelection();
            this.renderBoard();
            this.updateUI();
            this.checkGameEnd();
        }
    }

    undoMove() {
        if (this.moveHistory.length === 0) return;
        const lastMove = this.moveHistory.pop();
        const { from, to, jumped } = lastMove;
        this.redoHistory.push(lastMove);
        this.board[from.row][from.col] = 1;
        this.board[jumped.row][jumped.col] = 1;
        this.board[to.row][to.col] = 0;
        this.moveCount--;
        this.clearSelection();
        this.renderBoard();
        this.updateUI();
        this.gameStatusDiv.innerHTML = '';
        this.gameState = 'playing';
    }

    redoMove() {
        if (this.redoHistory.length === 0) return;
        const moveToRedo = this.redoHistory.pop();
        const { from, to, jumped } = moveToRedo;
        this.moveHistory.push(moveToRedo);
        this.board[from.row][from.col] = 0;
        this.board[jumped.row][jumped.col] = 0;
        this.board[to.row][to.col] = 1;
        this.moveCount++;
        this.clearSelection();
        this.renderBoard();
        this.updateUI();
        this.checkGameEnd();
    }

    checkGameEnd() {
        this.pegCount = this.countPegs();
        if (this.pegCount === 1) {
            this.gameState = 'won';
            this.gameStatusDiv.innerHTML = '<div class="win-message">🎉 Congratulations! You won! 🎉</div>';
        } else if (!this.hasValidMoves()) {
            this.gameState = 'lost';
            this.gameStatusDiv.innerHTML = '<div style="background: linear-gradient(45deg, #ff6b6b, #ee5a24); color: white; padding: 15px; border-radius: 10px; margin-top: 10px;">😞 No more moves available. Try again!</div>';
        }
    }

    countPegs() {
        return this.board.flat().filter(cell => cell === 1).length;
    }

    countEmptyCells() {
        return this.board.flat().filter(cell => cell === 0).length;
    }

    hasValidMoves() {
        const directions = this.getMoveDirections();
        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board[row].length; col++) {
                if (this.board[row][col] === 1) {
                    for (const [dRow, dCol] of directions) {
                        const toRow = row + dRow;
                        const toCol = col + dCol;
                        if (this.isValidMove(row, col, toRow, toCol)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    showSetupMode() {
        this.setupModeDiv.style.display = 'block';
        this.resetBtn.disabled = true;
        this.undoBtn.disabled = true;
        this.redoBtn.disabled = true;
    }

    startGame() {
        const emptyCount = this.countEmptyCells();
        if (emptyCount !== 1) {
            alert('Please ensure exactly one cell is empty before starting the game!');
            return;
        }
        this.gameState = 'playing';
        this.setupModeDiv.style.display = 'none';
        this.resetBtn.disabled = false;
        this.updateUI();
    }

    resetGame() {
        this.createBoard();
    }

    updateUI() {
        this.pegCount = this.countPegs();
        this.pegCountSpan.textContent = this.pegCount;
        this.moveCountSpan.textContent = this.moveCount;
        this.undoBtn.disabled = this.moveHistory.length === 0;
        this.redoBtn.disabled = this.redoHistory.length === 0;
    }
}

export default PegSolitaire;
