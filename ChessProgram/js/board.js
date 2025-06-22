class Board {
    constructor() {
        this.squares = Array(8).fill(null).map(() => Array(8).fill(null));
        this.capturedPieces = {
            white: [],
            black: []
        };
        this.moveHistory = [];
        this.initializeBoard();
    }

    initializeBoard() {
        // Place pawns
        for (let i = 0; i < 8; i++) {
            this.squares[1][i] = new Pawn('black', [1, i]);
            this.squares[6][i] = new Pawn('white', [6, i]);
        }

        // Place other pieces
        const pieceOrder = [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook];
        for (let i = 0; i < 8; i++) {
            this.squares[0][i] = new pieceOrder[i]('black', [0, i]);
            this.squares[7][i] = new pieceOrder[i]('white', [7, i]);
        }
    }

    getPiece(position) {
        const [row, col] = position;
        return this.squares[row][col];
    }

    movePiece(from, to) {
        const [fromRow, fromCol] = from;
        const [toRow, toCol] = to;
        const piece = this.squares[fromRow][fromCol];
        const capturedPiece = this.squares[toRow][toCol];

        if (capturedPiece) {
            this.capturedPieces[capturedPiece.color].push(capturedPiece);
        }

        // Handle castling
        if (piece.type === 'king' && Math.abs(fromCol - toCol) === 2) {
            const isKingside = toCol > fromCol;
            const rookFromCol = isKingside ? 7 : 0;
            const rookToCol = isKingside ? 5 : 3;
            const rook = this.squares[fromRow][rookFromCol];
            
            this.squares[fromRow][rookFromCol] = null;
            this.squares[fromRow][rookToCol] = rook;
            rook.position = [fromRow, rookToCol];
            rook.hasMoved = true;
        }

        // Move the piece
        this.squares[toRow][toCol] = piece;
        this.squares[fromRow][fromCol] = null;
        piece.move([toRow, toCol]);

        // Record the move
        this.moveHistory.push({
            piece: piece,
            from: from,
            to: to,
            captured: capturedPiece,
            isCastling: piece.type === 'king' && Math.abs(fromCol - toCol) === 2
        });

        // Check for pawn promotion
        if (piece.type === 'pawn' && (toRow === 0 || toRow === 7)) {
            this.squares[toRow][toCol] = new Queen(piece.color, [toRow, toCol]);
        }
    }

    undoLastMove() {
        if (this.moveHistory.length === 0) return false;

        const lastMove = this.moveHistory.pop();
        const { piece, from, to, captured, isCastling } = lastMove;
        const [fromRow, fromCol] = from;
        const [toRow, toCol] = to;

        // Move piece back
        this.squares[fromRow][fromCol] = piece;
        this.squares[toRow][toCol] = captured;
        piece.position = from;
        piece.hasMoved = false;

        // Remove from captured pieces if there was a capture
        if (captured) {
            const index = this.capturedPieces[captured.color].indexOf(captured);
            if (index > -1) {
                this.capturedPieces[captured.color].splice(index, 1);
            }
        }

        // Handle undoing castling
        if (isCastling) {
            const isKingside = toCol > fromCol;
            const rookFromCol = isKingside ? 7 : 0;
            const rookToCol = isKingside ? 5 : 3;
            const rook = this.squares[fromRow][rookToCol];
            
            this.squares[fromRow][rookFromCol] = rook;
            this.squares[fromRow][rookToCol] = null;
            rook.position = [fromRow, rookFromCol];
            rook.hasMoved = false;
        }

        return true;
    }

    isCheck(color) {
        // Find the king
        let kingPosition;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.squares[row][col];
                if (piece?.type === 'king' && piece.color === color) {
                    kingPosition = [row, col];
                    break;
                }
            }
            if (kingPosition) break;
        }

        // Check if any opponent piece can capture the king
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.squares[row][col];
                if (piece && piece.color !== color) {
                    const validMoves = piece.getValidMoves(this.squares);
                    if (validMoves.some(move => 
                        move[0] === kingPosition[0] && move[1] === kingPosition[1]
                    )) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    isCheckmate(color) {
        if (!this.isCheck(color)) return false;

        // Check if any piece can make a move that gets out of check
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.squares[row][col];
                if (piece && piece.color === color) {
                    const validMoves = piece.getValidMoves(this.squares);
                    for (const move of validMoves) {
                        // Try the move
                        const originalPiece = this.squares[move[0]][move[1]];
                        this.squares[move[0]][move[1]] = piece;
                        this.squares[row][col] = null;
                        piece.position = move;

                        const stillInCheck = this.isCheck(color);

                        // Undo the move
                        this.squares[row][col] = piece;
                        this.squares[move[0]][move[1]] = originalPiece;
                        piece.position = [row, col];

                        if (!stillInCheck) return false;
                    }
                }
            }
        }
        return true;
    }

    isStalemate(color) {
        if (this.isCheck(color)) return false;

        // Check if any piece can make a legal move
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.squares[row][col];
                if (piece && piece.color === color) {
                    const validMoves = piece.getValidMoves(this.squares);
                    if (validMoves.length > 0) return false;
                }
            }
        }
        return true;
    }
} 