class ChessAI {
    constructor(difficulty = 1) {
        this.difficulty = difficulty;
        this.pieceValues = {
            'pawn': 1,
            'knight': 3,
            'bishop': 3,
            'rook': 5,
            'queen': 9,
            'king': 0
        };
    }

    setDifficulty(level) {
        this.difficulty = level;
    }

    evaluatePosition(board) {
        let score = 0;

        // Material evaluation
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board.squares[row][col];
                if (piece) {
                    const value = this.pieceValues[piece.type];
                    score += piece.color === 'white' ? value : -value;
                }
            }
        }

        // Position evaluation (simplified)
        const positionBonus = {
            'pawn': [
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
                [0.1, 0.1, 0.2, 0.3, 0.3, 0.2, 0.1, 0.1],
                [0.05, 0.05, 0.1, 0.25, 0.25, 0.1, 0.05, 0.05],
                [0, 0, 0, 0.2, 0.2, 0, 0, 0],
                [0.05, -0.05, -0.1, 0, 0, -0.1, -0.05, 0.05],
                [0.05, 0.1, 0.1, -0.2, -0.2, 0.1, 0.1, 0.05],
                [0, 0, 0, 0, 0, 0, 0, 0]
            ]
        };

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board.squares[row][col];
                if (piece && piece.type === 'pawn') {
                    const bonus = positionBonus.pawn[piece.color === 'white' ? row : 7 - row][col];
                    score += piece.color === 'white' ? bonus : -bonus;
                }
            }
        }

        return score;
    }

    findBestMove(board, color, depth = 0) {
        const maxDepth = this.difficulty * 2;
        
        const minimax = (board, depth, alpha, beta, isMaximizing) => {
            if (depth === 0) {
                return this.evaluatePosition(board);
            }

            const currentColor = isMaximizing ? 'white' : 'black';
            let bestValue = isMaximizing ? -Infinity : Infinity;
            
            // Get all possible moves
            const moves = [];
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    const piece = board.squares[row][col];
                    if (piece && piece.color === currentColor) {
                        const validMoves = piece.getValidMoves(board.squares);
                        for (const move of validMoves) {
                            moves.push({
                                piece: piece,
                                from: [row, col],
                                to: move
                            });
                        }
                    }
                }
            }

            // Randomize moves for variety in play
            moves.sort(() => Math.random() - 0.5);

            for (const move of moves) {
                // Make move
                const originalPiece = board.squares[move.to[0]][move.to[1]];
                board.squares[move.to[0]][move.to[1]] = move.piece;
                board.squares[move.from[0]][move.from[1]] = null;
                move.piece.position = move.to;

                // Recursive evaluation
                const value = minimax(board, depth - 1, alpha, beta, !isMaximizing);

                // Undo move
                board.squares[move.from[0]][move.from[1]] = move.piece;
                board.squares[move.to[0]][move.to[1]] = originalPiece;
                move.piece.position = move.from;

                if (isMaximizing) {
                    bestValue = Math.max(bestValue, value);
                    alpha = Math.max(alpha, bestValue);
                } else {
                    bestValue = Math.min(bestValue, value);
                    beta = Math.min(beta, bestValue);
                }

                if (beta <= alpha) break;
            }

            return bestValue;
        };

        // Find best move at root level
        let bestMove = null;
        let bestValue = color === 'white' ? -Infinity : Infinity;
        const moves = [];

        // Collect all possible moves
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board.squares[row][col];
                if (piece && piece.color === color) {
                    const validMoves = piece.getValidMoves(board.squares);
                    for (const move of validMoves) {
                        moves.push({
                            piece: piece,
                            from: [row, col],
                            to: move
                        });
                    }
                }
            }
        }

        // Randomize moves for variety
        moves.sort(() => Math.random() - 0.5);

        for (const move of moves) {
            // Make move
            const originalPiece = board.squares[move.to[0]][move.to[1]];
            board.squares[move.to[0]][move.to[1]] = move.piece;
            board.squares[move.from[0]][move.from[1]] = null;
            move.piece.position = move.to;

            // Evaluate position
            const value = minimax(
                board,
                maxDepth - 1,
                -Infinity,
                Infinity,
                color === 'black'
            );

            // Undo move
            board.squares[move.from[0]][move.from[1]] = move.piece;
            board.squares[move.to[0]][move.to[1]] = originalPiece;
            move.piece.position = move.from;

            // Update best move
            if (color === 'white' && value > bestValue) {
                bestValue = value;
                bestMove = move;
            } else if (color === 'black' && value < bestValue) {
                bestValue = value;
                bestMove = move;
            }
        }

        return bestMove;
    }
} 