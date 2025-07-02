class PyramidBoard {
    constructor() {
        this.board = [];
        this.initializeBoard();
    }

    initializeBoard() {
        this.board = [
            [{ hasPeg: false }], // Row 0 - top hole empty
            [{ hasPeg: true }, { hasPeg: true }], // Row 1
            [{ hasPeg: true }, { hasPeg: true }, { hasPeg: true }], // Row 2
            [{ hasPeg: true }, { hasPeg: true }, { hasPeg: true }, { hasPeg: true }], // Row 3
            [{ hasPeg: true }, { hasPeg: true }, { hasPeg: true }, { hasPeg: true }, { hasPeg: true }] // Row 4
        ];
    }

    renderBoard() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';
        boardElement.style.position = 'relative';

        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board[row].length; col++) {
                const hole = this.board[row][col];
                const holeElement = document.createElement('div');
                holeElement.className = 'hole';
                holeElement.dataset.row = row;
                holeElement.dataset.col = col;

                if (hole.hasPeg) {
                    const pegElement = document.createElement('div');
                    pegElement.className = 'peg';
                    holeElement.appendChild(pegElement);
                }

                boardElement.appendChild(holeElement);
            }
        }
    }
}

export default PyramidBoard;