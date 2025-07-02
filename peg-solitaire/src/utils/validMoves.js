export function isValidMove(board, fromRow, fromCol, toRow, toCol, boardType) {
    // Check if destination is empty
    if (board[toRow][toCol] !== 0) return false;

    // Check if the move is valid based on the board type
    const rowDiff = toRow - fromRow;
    const colDiff = toCol - fromCol;

    let midRow, midCol;

    if (boardType === 'pyramid' || boardType === 'star') {
        // Valid moves for triangle boards
        if (Math.abs(rowDiff) === 2 && colDiff === 0) {
            // Vertical jump
            midRow = fromRow + rowDiff / 2;
            midCol = fromCol;
        } else if (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 2) {
            // Diagonal jump
            midRow = fromRow + rowDiff / 2;
            midCol = fromCol + colDiff / 2;
        } else if (rowDiff === 0 && Math.abs(colDiff) === 2) {
            // Horizontal jump
            midRow = fromRow;
            midCol = fromCol + colDiff / 2;
        } else {
            return false;
        }
    } else {
        // Valid moves for rectangular boards
        if (Math.abs(rowDiff) === 2 && colDiff === 0) {
            midRow = fromRow + rowDiff / 2;
            midCol = fromCol;
        } else if (Math.abs(colDiff) === 2 && rowDiff === 0) {
            midRow = fromRow;
            midCol = fromCol + colDiff / 2;
        } else {
            return false;
        }
    }

    // Check if the middle position exists and has a peg
    if (midRow < 0 || midRow >= board.length || midCol < 0 || midCol >= board[midRow].length) {
        return false;
    }

    return board[midRow][midCol] === 1;
}