class Piece {
    constructor(color, position) {
        this.color = color;
        this.position = position;
        this.hasMoved = false;
        this.moves = [];
    }

    getValidMoves(board) {
        return [];
    }

    isValidMove(targetPosition, board) {
        const validMoves = this.getValidMoves(board);
        return validMoves.some(move => 
            move[0] === targetPosition[0] && move[1] === targetPosition[1]
        );
    }

    move(newPosition) {
        this.position = newPosition;
        this.hasMoved = true;
    }
}

class Pawn extends Piece {
    constructor(color, position) {
        super(color, position);
        this.type = 'pawn';
    }

    getValidMoves(board) {
        const moves = [];
        const direction = this.color === 'white' ? -1 : 1;
        const [row, col] = this.position;

        // Forward move
        if (board[row + direction]?.[col] === null) {
            moves.push([row + direction, col]);
            // Initial two-square move
            if (!this.hasMoved && board[row + 2 * direction]?.[col] === null) {
                moves.push([row + 2 * direction, col]);
            }
        }

        // Captures
        const captureSquares = [[row + direction, col - 1], [row + direction, col + 1]];
        for (const [r, c] of captureSquares) {
            if (board[r]?.[c]?.color !== this.color && board[r]?.[c] !== undefined) {
                moves.push([r, c]);
            }
        }

        return moves.filter(([r, c]) => r >= 0 && r < 8 && c >= 0 && c < 8);
    }
}

class Knight extends Piece {
    constructor(color, position) {
        super(color, position);
        this.type = 'knight';
    }

    getValidMoves(board) {
        const moves = [];
        const [row, col] = this.position;
        const knightMoves = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1]
        ];

        for (const [dRow, dCol] of knightMoves) {
            const newRow = row + dRow;
            const newCol = col + dCol;
            if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                if (!board[newRow][newCol] || board[newRow][newCol].color !== this.color) {
                    moves.push([newRow, newCol]);
                }
            }
        }

        return moves;
    }
}

class Bishop extends Piece {
    constructor(color, position) {
        super(color, position);
        this.type = 'bishop';
    }

    getValidMoves(board) {
        const moves = [];
        const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
        
        for (const [dRow, dCol] of directions) {
            let [row, col] = this.position;
            while (true) {
                row += dRow;
                col += dCol;
                if (row < 0 || row >= 8 || col < 0 || col >= 8) break;
                if (board[row][col]) {
                    if (board[row][col].color !== this.color) {
                        moves.push([row, col]);
                    }
                    break;
                }
                moves.push([row, col]);
            }
        }

        return moves;
    }
}

class Rook extends Piece {
    constructor(color, position) {
        super(color, position);
        this.type = 'rook';
    }

    getValidMoves(board) {
        const moves = [];
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        
        for (const [dRow, dCol] of directions) {
            let [row, col] = this.position;
            while (true) {
                row += dRow;
                col += dCol;
                if (row < 0 || row >= 8 || col < 0 || col >= 8) break;
                if (board[row][col]) {
                    if (board[row][col].color !== this.color) {
                        moves.push([row, col]);
                    }
                    break;
                }
                moves.push([row, col]);
            }
        }

        return moves;
    }
}

class Queen extends Piece {
    constructor(color, position) {
        super(color, position);
        this.type = 'queen';
    }

    getValidMoves(board) {
        const moves = [];
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];
        
        for (const [dRow, dCol] of directions) {
            let [row, col] = this.position;
            while (true) {
                row += dRow;
                col += dCol;
                if (row < 0 || row >= 8 || col < 0 || col >= 8) break;
                if (board[row][col]) {
                    if (board[row][col].color !== this.color) {
                        moves.push([row, col]);
                    }
                    break;
                }
                moves.push([row, col]);
            }
        }

        return moves;
    }
}

class King extends Piece {
    constructor(color, position) {
        super(color, position);
        this.type = 'king';
    }

    getValidMoves(board) {
        const moves = [];
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];
        
        const [row, col] = this.position;
        for (const [dRow, dCol] of directions) {
            const newRow = row + dRow;
            const newCol = col + dCol;
            if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                if (!board[newRow][newCol] || board[newRow][newCol].color !== this.color) {
                    moves.push([newRow, newCol]);
                }
            }
        }

        // Castling logic
        if (!this.hasMoved) {
            // Kingside castling
            if (board[row][7]?.type === 'rook' && !board[row][7].hasMoved &&
                !board[row][5] && !board[row][6]) {
                moves.push([row, 6]);
            }
            // Queenside castling
            if (board[row][0]?.type === 'rook' && !board[row][0].hasMoved &&
                !board[row][1] && !board[row][2] && !board[row][3]) {
                moves.push([row, 2]);
            }
        }

        return moves;
    }
} 