class StarBoard {
    constructor() {
        this.board = [];
        this.initializeBoard();
    }

    initializeBoard() {
        const centerX = 250;
        const centerY = 250;
        const spacing = 60;

        this.board = [
            [{ hasPeg: true, x: centerX, y: centerY - spacing * 3 }],
            [{ hasPeg: true, x: centerX - spacing / 2, y: centerY - spacing * 2 },
             { hasPeg: true, x: centerX + spacing / 2, y: centerY - spacing * 2 }],
            [{ hasPeg: true, x: centerX - spacing * 2.5, y: centerY - spacing * 1.5 },
             { hasPeg: true, x: centerX - spacing, y: centerY - spacing },
             { hasPeg: false, x: centerX, y: centerY },
             { hasPeg: true, x: centerX + spacing, y: centerY - spacing },
             { hasPeg: true, x: centerX + spacing * 2.5, y: centerY - spacing * 1.5 }],
            [{ hasPeg: true, x: centerX - spacing * 3, y: centerY - spacing / 2 },
             { hasPeg: true, x: centerX - spacing * 2, y: centerY },
             { hasPeg: true, x: centerX - spacing, y: centerY },
             { hasPeg: true, x: centerX + spacing, y: centerY },
             { hasPeg: true, x: centerX + spacing * 2, y: centerY },
             { hasPeg: true, x: centerX + spacing * 3, y: centerY - spacing / 2 }],
            [{ hasPeg: true, x: centerX - spacing * 2.5, y: centerY + spacing / 2 },
             { hasPeg: true, x: centerX - spacing * 1.5, y: centerY + spacing },
             { hasPeg: true, x: centerX - spacing / 2, y: centerY + spacing },
             { hasPeg: true, x: centerX + spacing / 2, y: centerY + spacing },
             { hasPeg: true, x: centerX + spacing * 1.5, y: centerY + spacing },
             { hasPeg: true, x: centerX + spacing * 2.5, y: centerY + spacing / 2 }],
            [{ hasPeg: true, x: centerX - spacing * 2, y: centerY + spacing * 1.5 },
             { hasPeg: true, x: centerX - spacing, y: centerY + spacing * 2 },
             { hasPeg: true, x: centerX, y: centerY + spacing * 2 },
             { hasPeg: true, x: centerX + spacing, y: centerY + spacing * 2 },
             { hasPeg: true, x: centerX + spacing * 2, y: centerY + spacing * 1.5 }],
            [{ hasPeg: true, x: centerX - spacing * 1.5, y: centerY + spacing * 2.5 },
             { hasPeg: true, x: centerX + spacing * 1.5, y: centerY + spacing * 2.5 }],
            [{ hasPeg: true, x: centerX - spacing, y: centerY + spacing * 3 },
             { hasPeg: true, x: centerX + spacing, y: centerY + spacing * 3 }],
            [{ hasPeg: true, x: centerX, y: centerY + spacing * 3.5 }]
        ];
    }

    renderBoard() {
        // Implementation for rendering the star board goes here
    }
}

export default StarBoard;