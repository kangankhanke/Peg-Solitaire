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
                this.undoBtn.addEventListener('click', () => {
                    if ((this.boardTypeSelect.value === 'pyramid' || this.boardTypeSelect.value === 'star') && this.customGame) {
                        this.customGame.undoMove();
                    } else {
                        this.undoMove();
                    }
                });
                this.redoBtn.addEventListener('click', () => {
                    if ((this.boardTypeSelect.value === 'pyramid' || this.boardTypeSelect.value === 'star') && this.customGame) {
                        this.customGame.redoMove();
                    } else {
                        this.redoMove();
                    }
                });
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
                        [1,1,1,1,1,1,1,1],
                        [1,1,1,0,1,1,1,1],
                        [1,1,1,1,1,1,1,1],
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
                    ],

                    
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
                // Hide setupMode for pyramid and star boards
                if (this.setupModeDiv) this.setupModeDiv.style.display = 'none';
                // Delegate pyramid and star to CustomBoardPegSolitaire
                if (boardType === 'pyramid' || boardType === 'star') {
                    if (this.customGame) {
                        this.customGame.switchBoard(boardType);
                    } else {
                        this.customGame = new CustomBoardPegSolitaire(boardType);
                    }
                    this.boardElement.style.display = 'none';
                    // Always show the custom board container
                    const customBoard = document.getElementById('board');
                    if (customBoard) customBoard.style.display = 'block';
                    return;
                } else {
                    // Hide custom boards if switching back to regular boards
                    const customBoard = document.getElementById('board');
                    if (customBoard) customBoard.style.display = 'none';
                    this.boardElement.style.display = 'grid';
                }
                
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
    const rows = this.board.length;

    this.boardElement.innerHTML = '';
    this.boardElement.style.display = 'grid';
    
    const cols = this.board[0].length;
    this.boardElement.style.gridTemplateColumns = `repeat(${cols}, 40px)`;
    this.boardElement.style.position = '';
    this.boardElement.style.width = '';
    this.boardElement.style.height = '';

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
                // Count current empty cells
                const emptyCount = this.countEmptyCells();
                
                if (this.board[row][col] === 1) {
                    // Can only remove a peg if there are no empty cells, or if this creates the only empty cell
                    if (emptyCount === 0) {
                        this.board[row][col] = 0;
                    }
                } else if (this.board[row][col] === 0) {
                    // Can only add a peg if this was the only empty cell
                    if (emptyCount === 1) {
                        this.board[row][col] = 1;
                    }
                }
                this.renderBoard();
                this.updateUI();
            }

            handleGameClick(row, col) {
                if (this.board[row][col] === 1) {
                    // Select a peg
                    this.clearSelection();
                    this.selectedCell = { row, col };
                    this.highlightValidMoves();
                    this.renderBoard();
                } else if (this.board[row][col] === 0 && this.selectedCell) {
                    // Try to move to empty cell
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
                // 4 directions for classic boards
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
                    const midRow = row + dRow / 2;
                    const midCol = col + dCol / 2;

                    if (this.isValidMove(row, col, newRow, newCol)) {
                        const targetCell = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`);
                        if (targetCell) {
                            targetCell.classList.add('valid-move');
                        }
                    }
                });
            }

            isValidMove(fromRow, fromCol, toRow, toCol) {
                // Check bounds
                if (
                    toRow < 0 || toRow >= this.board.length ||
                    toCol < 0 || toCol >= this.board[toRow].length
                ) {
                    return false;
                }
                // Check if target is empty
                if (this.board[toRow][toCol] !== 0) {
                    return false;
                }
                // Only allow moves where both row and col diffs are even (so mid cell is integer)
                const rowDiff = toRow - fromRow;
                const colDiff = toCol - fromCol;
                if (rowDiff % 2 !== 0 || colDiff % 2 !== 0) {
                    return false;
                }
                const midRow = fromRow + rowDiff / 2;
                const midCol = fromCol + colDiff / 2;
                // Check mid cell is in bounds and is a peg
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

                    // Save move for undo
                    this.moveHistory.push({
                        from: { row: fromRow, col: fromCol },
                        to: { row: toRow, col: toCol },
                        jumped: { row: midRow, col: midCol }
                    });

                    // Clear redo history when a new move is made
                    this.redoHistory = [];

                    // Execute move
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

                // Save the move to redo history
                this.redoHistory.push(lastMove);

                // Reverse the move
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

                // Save the move back to move history
                this.moveHistory.push(moveToRedo);

                // Execute the move again
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
                    this.gameStatusDiv.innerHTML = '<div class="win-message"> Congratulations! You managed to put the last peg in the initially empty hole 🎉</div>';
                } else if (!this.hasValidMoves()) {
                    this.gameState = 'lost';
                    this.gameStatusDiv.innerHTML = '<div style="background: linear-gradient(45deg, #ff6b6b, #ee5a24); color: white; padding: 15px; border-radius: 10px; margin-top: 10px;">No more moves available. Game over!</div>';
                }
            }

            countPegs() {
                return this.board.flat().filter(cell => cell === 1).length;
            }

            countEmptyCells() {
                return this.board.flat().filter(cell => cell === 0).length;
            }

            hasValidMoves() {
                // Efficiently check for any valid move for any peg
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
                if ((this.boardTypeSelect.value === 'pyramid' || this.boardTypeSelect.value === 'star') && this.customGame) {
                    this.undoBtn.disabled = this.customGame.moveHistory.length === 0;
                    this.redoBtn.disabled = this.customGame.redoHistory.length === 0;
                } else {
                    this.undoBtn.disabled = this.moveHistory.length === 0;
                    this.redoBtn.disabled = this.redoHistory.length === 0;
                }
            }
        }
     

class CustomBoardPegSolitaire {
    constructor(type = 'pyramid') {
        this.type = type;
        this.board = [];
        this.selectedPeg = null;
        this.pegCount = 0;
        this.gameOver = false;
        this.moveHistory = [];
        this.redoHistory = [];
        this.boardConfig = this.getBoardConfig(type);
        this.currentBoard = type;
        this.initializeBoard();
        this.renderBoard();
        this.updateDisplay();
    }

    getBoardConfig(type) {
        const configs = {
            pyramid: {
                name: 'Pyramid',
                initialPegs: 14,
                boardWidth: 480,
                boardHeight: 400
            },
            star: {
                name: 'Star',
                initialPegs: 12,
                boardWidth: 480,
                boardHeight: 400
            }
        };
        return configs[type] || configs.pyramid;
    }

    initializeBoard() {
        if (this.type === 'pyramid') {
            this.initializePyramidBoard();
        } else if (this.type === 'star') {
            this.initializeStarBoard();
        }
        this.pegCount = this.boardConfig.initialPegs;
    }

    initializePyramidBoard() {
        // Pyramid layout: 5 rows with top hole empty
        this.board = [
            [{ hasPeg: false, x: 240, y: 50 }], // Row 0 - top hole empty
            [{ hasPeg: true, x: 210, y: 120 }, { hasPeg: true, x: 270, y: 120 }], // Row 1
            [{ hasPeg: true, x: 180, y: 190 }, { hasPeg: true, x: 240, y: 190 }, { hasPeg: true, x: 300, y: 190 }], // Row 2
            [{ hasPeg: true, x: 150, y: 260 }, { hasPeg: true, x: 210, y: 260 }, { hasPeg: true, x: 270, y: 260 }, { hasPeg: true, x: 330, y: 260 }], // Row 3
            [{ hasPeg: true, x: 120, y: 330 }, { hasPeg: true, x: 180, y: 330 }, { hasPeg: true, x: 240, y: 330 }, { hasPeg: true, x: 300, y: 330 }, { hasPeg: true, x: 360, y: 330 }] // Row 4
        ];
    }

    initializeStarBoard() {
        // Star/cross layout: 13 holes in rows 1,4,3,4,1 with top hole empty
        const centerX = 240;
        const centerY = 200;
        const spacing = 50;
        this.board = [
            [{ hasPeg: false, x: centerX, y: centerY - spacing * 2 }],
            [{ hasPeg: true, x: centerX - spacing * 1.5, y: centerY - spacing },
             { hasPeg: true, x: centerX - spacing * 0.5, y: centerY - spacing },
             { hasPeg: true, x: centerX + spacing * 0.5, y: centerY - spacing },
             { hasPeg: true, x: centerX + spacing * 1.5, y: centerY - spacing }],
            [{ hasPeg: true, x: centerX - spacing, y: centerY },
            { hasPeg: true, x: centerX, y: centerY },
            { hasPeg: true, x: centerX + spacing, y: centerY }],
            [{ hasPeg: true, x: centerX - spacing * 1.5, y: centerY + spacing },
             { hasPeg: true, x: centerX - spacing * 0.5, y: centerY + spacing },
             { hasPeg: true, x: centerX + spacing * 0.5, y: centerY + spacing },
             { hasPeg: true, x: centerX + spacing * 1.5, y: centerY + spacing }],
            [{ hasPeg: true, x: centerX, y: centerY + spacing * 2 }]
        ];
    }

    switchBoard(boardType) {
        this.type = boardType;
        this.currentBoard = boardType;
        this.boardConfig = this.getBoardConfig(boardType);
        this.gameOver = false;
        this.selectedPeg = null;
        this.moveHistory = [];
        this.redoHistory = [];
        this.initializeBoard();
        this.renderBoard();
        this.updateDisplay();
    }

        renderBoard() {
            const boardElement = document.getElementById('board');
            const gameBoard = document.getElementById('gameBoard');
            
            // Show custom board, hide regular board
            boardElement.style.display = 'block';
            if (gameBoard) {
                gameBoard.style.display = 'none';
            }
            
            boardElement.innerHTML = '';
            boardElement.style.position = 'relative';
            
            boardElement.style.width = this.boardConfig.boardWidth + 'px';
            boardElement.style.height = this.boardConfig.boardHeight + 'px';

            for (let row = 0; row < this.board.length; row++) {
                for (let col = 0; col < this.board[row].length; col++) {
                    const hole = this.board[row][col];
                    const holeElement = document.createElement('div');
                    holeElement.className = 'hole';
                    holeElement.style.left = hole.x + 'px';
                    holeElement.style.top = hole.y + 'px';
                    holeElement.dataset.row = row;
                    holeElement.dataset.col = col;

                    if (hole.hasPeg) {
                        const pegElement = document.createElement('div');
                        pegElement.className = 'peg';
                        pegElement.draggable = true;
                        pegElement.dataset.row = row;
                        pegElement.dataset.col = col;
                        
                        pegElement.addEventListener('dragstart', (e) => this.handleDragStart(e));
                        pegElement.addEventListener('dragend', (e) => this.handleDragEnd(e));
                        pegElement.addEventListener('click', (e) => this.handlePegClick(e));
                        
                        holeElement.appendChild(pegElement);
                    }

                    holeElement.addEventListener('dragover', (e) => this.handleDragOver(e));
                    holeElement.addEventListener('drop', (e) => this.handleDrop(e));
                    holeElement.addEventListener('click', (e) => this.handleHoleClick(e));

                    boardElement.appendChild(holeElement);
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
            
            // Check if destination is empty
            if (this.board[toRow][toCol].hasPeg) return false;
            
            // Check if it's a valid jump
            const rowDiff = toRow - fromRow;
            const colDiff = toCol - fromCol;
            
            let middleRow, middleCol;
            
            if (this.type === 'star') {
                // Star board: explicit valid moves with their middle positions
                const validMoves = [
                    // Horizontal moves within same row
                    // Row 1: [1,0] to [1,2] through [1,1]
                    { from: [1,0], to: [1,2], middle: [1,1] },
                    { from: [1,2], to: [1,0], middle: [1,1] },
                    // Row 1: [1,1] to [1,3] through [1,2]
                    { from: [1,1], to: [1,3], middle: [1,2] },
                    { from: [1,3], to: [1,1], middle: [1,2] },
                    
                    // Row 2: [2,0] to [2,2] through [2,1]
                    { from: [2,0], to: [2,2], middle: [2,1] },
                    { from: [2,2], to: [2,0], middle: [2,1] },
                    
                    // Row 3: [3,0] to [3,2] through [3,1]
                    { from: [3,0], to: [3,2], middle: [3,1] },
                    { from: [3,2], to: [3,0], middle: [3,1] },
                    // Row 3: [3,1] to [3,3] through [3,2]
                    { from: [3,1], to: [3,3], middle: [3,2] },
                    { from: [3,3], to: [3,1], middle: [3,2] },
                    
                    // Diagonal moves
                    // Top to left center: [0,0] to [2,0] through [1,1]
                    { from: [0,0], to: [2,0], middle: [1,1] },
                    { from: [2,0], to: [0,0], middle: [1,1] },
                    // Top to right center: [0,0] to [2,2] through [1,2]
                    { from: [0,0], to: [2,2], middle: [1,2] },
                    { from: [2,2], to: [0,0], middle: [1,2] },
                    // Left center to bottom: [2,0] to [4,0] through [3,1]
                    { from: [2,0], to: [4,0], middle: [3,1] },
                    { from: [4,0], to: [2,0], middle: [3,1] },
                    // Right center to bottom: [2,2] to [4,0] through [3,2]
                    { from: [2,2], to: [4,0], middle: [3,2] },
                    { from: [4,0], to: [2,2], middle: [3,2] },
                    // Upper arm to lower arm diagonal moves
                    // Left upper to left lower: [1,1] to [3,0] through [2,0]
                    { from: [1,1], to: [3,0], middle: [2,0] },
                    { from: [3,0], to: [1,1], middle: [2,0] },
                    // Right upper to right lower: [1,2] to [3,3] through [2,2]
                    { from: [1,2], to: [3,3], middle: [2,2] },
                    { from: [3,3], to: [1,2], middle: [2,2] },
                    // Cross diagonal moves
                    // Left upper to right lower: [1,1] to [3,2] through [2,1]
                    { from: [1,1], to: [3,2], middle: [2,1] },
                    { from: [3,2], to: [1,1], middle: [2,1] },
                    // Right upper to left lower: [1,2] to [3,1] through [2,1]
                    { from: [1,2], to: [3,1], middle: [2,1] },
                    { from: [3,1], to: [1,2], middle: [2,1] }
                    
                ];
                
                // Find matching move
                const move = validMoves.find(m => 
                    m.from[0] === fromRow && m.from[1] === fromCol &&
                    m.to[0] === toRow && m.to[1] === toCol
                );
                
                if (!move) {
                    return false;
                }
                
                middleRow = move.middle[0];
                middleCol = move.middle[1];
            } else {
                // Pyramid board - standard calculation works fine
                if (Math.abs(rowDiff) === 2 && colDiff === 0) {
                    // Vertical jump
                    middleRow = fromRow + rowDiff / 2;
                    middleCol = fromCol;
                } else if (rowDiff === 0 && Math.abs(colDiff) === 2) {
                    // Horizontal jump (same row)
                    middleRow = fromRow;
                    middleCol = fromCol + colDiff / 2;
                } else if (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 2) {
                    // Diagonal jump
                    middleRow = fromRow + rowDiff / 2;
                    middleCol = fromCol + colDiff / 2;
                } else {
                    return false;
                }
            }
            
            // Check if middle position exists and has a peg
            if (middleRow < 0 || middleRow >= this.board.length || 
                middleCol < 0 || middleCol >= this.board[middleRow].length) {
                return false;
            }
            
            return this.board[middleRow][middleCol].hasPeg;
        }

        makeMove(fromRow, fromCol, toRow, toCol) {
            let middleRow, middleCol;
            
            if (this.type === 'star') {
                // Star board: use same explicit mapping as in isValidMove
                const validMoves = [
                    // Horizontal moves within same row
                    { from: [1,0], to: [1,2], middle: [1,1] },
                    { from: [1,2], to: [1,0], middle: [1,1] },
                    { from: [1,1], to: [1,3], middle: [1,2] },
                    { from: [1,3], to: [1,1], middle: [1,2] },
                    { from: [2,0], to: [2,2], middle: [2,1] },
                    { from: [2,2], to: [2,0], middle: [2,1] },
                    { from: [3,0], to: [3,2], middle: [3,1] },
                    { from: [3,2], to: [3,0], middle: [3,1] },
                    { from: [3,1], to: [3,3], middle: [3,2] },
                    { from: [3,3], to: [3,1], middle: [3,2] },
                    
                    // Diagonal moves
                    { from: [0,0], to: [2,0], middle: [1,1] },
                    { from: [2,0], to: [0,0], middle: [1,1] },
                    { from: [0,0], to: [2,2], middle: [1,2] },
                    { from: [2,2], to: [0,0], middle: [1,2] },
                    { from: [2,1], to: [4,0], middle: [3,1] },
                    { from: [4,0], to: [2,1], middle: [3,1] },
                    { from: [2,0], to: [4,0], middle: [3,0] },
                    { from: [4,0], to: [2,0], middle: [3,0] },
                    { from: [2,2], to: [4,0], middle: [3,2] },
                    { from: [4,0], to: [2,2], middle: [3,2] },
                    { from: [4,0], to: [2,0], middle: [3,1] },
                    { from: [2,0], to: [4,0], middle: [3,1] },
                    { from: [4,0], to: [2,2], middle: [3,1] },
                    { from: [2,2], to: [4,0], middle: [3,1] },
                    { from: [1,1], to: [3,0], middle: [2,0] },
                    { from: [3,0], to: [1,1], middle: [2,0] },
                    { from: [1,2], to: [3,3], middle: [2,2] },
                    { from: [3,3], to: [1,2], middle: [2,2] },
                    { from: [1,1], to: [3,2], middle: [2,1] },
                    { from: [3,2], to: [1,1], middle: [2,1] },
                    { from: [1,2], to: [3,1], middle: [2,1] },
                    { from: [3,1], to: [1,2], middle: [2,1] }
                ];
                
                const move = validMoves.find(m => 
                    m.from[0] === fromRow && m.from[1] === fromCol &&
                    m.to[0] === toRow && m.to[1] === toCol
                );
                
                if (move) {
                    middleRow = move.middle[0];
                    middleCol = move.middle[1];
                } else {
                    // Fallback to standard calculation if not found
                    const rowDiff = toRow - fromRow;
                    const colDiff = toCol - fromCol;
                    middleRow = fromRow + rowDiff / 2;
                    middleCol = fromCol + colDiff / 2;
                }
            } else {
                // Pyramid board: use standard calculation
                const rowDiff = toRow - fromRow;
                const colDiff = toCol - fromCol;
                middleRow = fromRow + rowDiff / 2;
                middleCol = fromCol + colDiff / 2;
            }
            
            // Save move for undo
            this.moveHistory.push({
                from: { row: fromRow, col: fromCol },
                to: { row: toRow, col: toCol },
                jumped: { row: middleRow, col: middleCol }
            });
            // Clear redo history when a new move is made
            this.redoHistory = [];
            // Remove peg from source
            this.board[fromRow][fromCol].hasPeg = false;
            // Remove jumped peg
            this.board[middleRow][middleCol].hasPeg = false;
            // Add peg to destination
            this.board[toRow][toCol].hasPeg = true;
            this.pegCount -= 1;
            this.renderBoard();
            this.updateDisplay();
            this.checkGameStatus();
        }

        undoMove() {
            if (this.moveHistory.length === 0) return;
            const lastMove = this.moveHistory.pop();
            const { from, to, jumped } = lastMove;
            // Save the move to redo history
            this.redoHistory.push(lastMove);
            // Reverse the move
            this.board[from.row][from.col].hasPeg = true;
            this.board[jumped.row][jumped.col].hasPeg = true;
            this.board[to.row][to.col].hasPeg = false;
            this.pegCount += 1;
            this.renderBoard();
            this.updateDisplay();
            document.getElementById('gameStatus').textContent = '';
            document.getElementById('gameStatus').className = 'game-status';
            this.gameOver = false;
        }

        redoMove() {
            if (this.redoHistory.length === 0) return;
            const moveToRedo = this.redoHistory.pop();
            const { from, to, jumped } = moveToRedo;
            // Save the move back to move history
            this.moveHistory.push(moveToRedo);
            // Execute the move again
            this.board[from.row][from.col].hasPeg = false;
            this.board[jumped.row][jumped.col].hasPeg = false;
            this.board[to.row][to.col].hasPeg = true;
            this.pegCount -= 1;
            this.renderBoard();
            this.updateDisplay();
            this.checkGameStatus();
        }

        updateDisplay() {
            document.getElementById('pegCount').textContent = this.pegCount;
            // Update board name for star board
            const boardNameElement = document.getElementById('boardName');
            if (boardNameElement) {
                boardNameElement.textContent = this.boardConfig.name;
            }
            // Update undo/redo button states
            const undoBtn = document.getElementById('undoBtn');
            const redoBtn = document.getElementById('redoBtn');
            if (undoBtn) undoBtn.disabled = this.moveHistory.length === 0;
            if (redoBtn) redoBtn.disabled = this.redoHistory.length === 0;
        }

        checkGameStatus() {
            const statusElement = document.getElementById('gameStatus');
            
            if (this.pegCount === 1) {
                statusElement.textContent = '🎉 Perfect! You won with only 1 peg remaining!';
                statusElement.className = 'game-status win';
                this.gameOver = true;
            } else if (!this.hasValidMoves()) {
                statusElement.textContent = `😔 No more moves! Final score: ${this.pegCount} pegs remaining`;
                statusElement.className = 'game-status lose';
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
                        // Check all possible moves from this position
                        for (let targetRow = 0; targetRow < this.board.length; targetRow++) {
                            for (let targetCol = 0; targetCol < this.board[targetRow].length; targetCol++) {
                                if (this.isValidMove(row, col, targetRow, targetCol)) {
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
            document.getElementById('gameStatus').textContent = '';
            document.getElementById('gameStatus').className = 'game-status';
        }
    }

    let game = new PegSolitaire();

    function selectBoard(boardType) {
        // Update button states
        document.querySelectorAll('.board-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // Switch to new board
        game.switchBoard(boardType);
    }

    function resetGame() {
        game.reset();
    }

//test 
