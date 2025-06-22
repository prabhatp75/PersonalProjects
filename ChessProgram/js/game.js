class Game {
    constructor() {
        this.board = new Board();
        this.ai = new ChessAI();
        this.currentPlayer = 'white';
        this.selectedPiece = null;
        this.gameStatus = 'playing'; // 'playing', 'check', 'checkmate', 'stalemate'
        this.soundManager = new SoundManager();
        
        this.initializeUI();
        this.setupEventListeners();
        this.updateUI();
    }

    initializeUI() {
        this.boardElement = document.getElementById('chessboard');
        this.playerTurnElement = document.getElementById('player-turn');
        this.gameStatusElement = document.getElementById('game-status');
        this.moveListElement = document.getElementById('move-list');
        this.evalBarElement = document.getElementById('eval-bar-inner');
        
        // Create squares
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'white' : 'black'}`;
                square.dataset.row = row;
                square.dataset.col = col;
                this.boardElement.appendChild(square);
            }
        }
    }

    setupEventListeners() {
        // Square click handler
        this.boardElement.addEventListener('click', (e) => {
            const square = e.target.closest('.square');
            if (!square) return;

            const row = parseInt(square.dataset.row);
            const col = parseInt(square.dataset.col);
            this.handleSquareClick(row, col);
        });

        // Control buttons
        document.getElementById('new-game').addEventListener('click', () => this.newGame());
        document.getElementById('undo-move').addEventListener('click', () => this.undoMove());
        document.getElementById('flip-board').addEventListener('click', () => this.flipBoard());
        
        // Difficulty selector
        document.getElementById('difficulty').addEventListener('change', (e) => {
            this.ai.setDifficulty(parseInt(e.target.value));
        });
    }

    handleSquareClick(row, col) {
        if (this.gameStatus === 'checkmate' || this.gameStatus === 'stalemate') return;
        if (this.currentPlayer === 'black') return; // AI's turn

        const piece = this.board.getPiece([row, col]);

        // If a piece is already selected
        if (this.selectedPiece) {
            // If clicking the same piece, deselect it
            if (piece === this.selectedPiece) {
                this.selectedPiece = null;
                this.clearHighlights();
                return;
            }

            // If clicking a valid move square
            if (this.selectedPiece.isValidMove([row, col], this.board.squares)) {
                this.makeMove(this.selectedPiece.position, [row, col]);
                this.selectedPiece = null;
                this.clearHighlights();
                return;
            }
        }

        // Select new piece if it's the player's color
        if (piece && piece.color === this.currentPlayer) {
            this.selectedPiece = piece;
            this.highlightValidMoves(piece);
        }
    }

    makeMove(from, to) {
        const [fromRow, fromCol] = from;
        const piece = this.board.getPiece(from);
        const targetPiece = this.board.getPiece(to);

        // Make the move
        this.board.movePiece(from, to);

        // Play sound
        if (targetPiece) {
            this.soundManager.playCapture();
        } else {
            this.soundManager.playMove();
        }

        // Update game state
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        this.updateGameStatus();
        this.updateUI();

        // If it's AI's turn
        if (this.currentPlayer === 'black' && this.gameStatus === 'playing') {
            setTimeout(() => this.makeAIMove(), 500);
        }
    }

    makeAIMove() {
        const move = this.ai.findBestMove(this.board, 'black');
        if (move) {
            this.makeMove(move.from, move.to);
        }
    }

    updateGameStatus() {
        const oppositeColor = this.currentPlayer;
        
        if (this.board.isCheckmate(oppositeColor)) {
            this.gameStatus = 'checkmate';
            this.soundManager.playCheck();
        } else if (this.board.isStalemate(oppositeColor)) {
            this.gameStatus = 'stalemate';
        } else if (this.board.isCheck(oppositeColor)) {
            this.gameStatus = 'check';
            this.soundManager.playCheck();
        } else {
            this.gameStatus = 'playing';
        }
    }

    updateUI() {
        // Update board display
        const squares = this.boardElement.children;
        for (let i = 0; i < 64; i++) {
            const row = Math.floor(i / 8);
            const col = i % 8;
            const piece = this.board.getPiece([row, col]);
            const square = squares[i];
            
            // Clear existing piece
            square.innerHTML = '';
            
            if (piece) {
                const img = document.createElement('img');
                img.src = `images/${piece.color}-${piece.type}.svg`;
                img.className = 'piece';
                square.appendChild(img);
            }
        }

        // Update status displays
        this.playerTurnElement.textContent = `${this.currentPlayer.charAt(0).toUpperCase() + 
            this.currentPlayer.slice(1)}'s Turn`;

        let statusText = '';
        if (this.gameStatus === 'checkmate') {
            const winner = this.currentPlayer === 'white' ? 'Black' : 'White';
            statusText = `Checkmate! ${winner} wins!`;
        } else if (this.gameStatus === 'stalemate') {
            statusText = 'Stalemate! Game is a draw.';
        } else if (this.gameStatus === 'check') {
            statusText = 'Check!';
        }
        this.gameStatusElement.textContent = statusText;

        // Update captured pieces
        this.updateCapturedPieces();

        // Update evaluation bar
        this.updateEvaluationBar();
    }

    updateCapturedPieces() {
        const whiteCaptured = document.getElementById('captured-white');
        const blackCaptured = document.getElementById('captured-black');
        
        whiteCaptured.innerHTML = '';
        blackCaptured.innerHTML = '';

        this.board.capturedPieces.white.forEach(piece => {
            const img = document.createElement('img');
            img.src = `images/white-${piece.type}.svg`;
            whiteCaptured.appendChild(img);
        });

        this.board.capturedPieces.black.forEach(piece => {
            const img = document.createElement('img');
            img.src = `images/black-${piece.type}.svg`;
            blackCaptured.appendChild(img);
        });
    }

    updateEvaluationBar() {
        const evaluation = this.ai.evaluatePosition(this.board);
        const percentage = 50 + (evaluation * 5); // 5% per point difference
        this.evalBarElement.style.height = `${Math.max(0, Math.min(100, percentage))}%`;
    }

    highlightValidMoves(piece) {
        this.clearHighlights();
        const validMoves = piece.getValidMoves(this.board.squares);
        
        const squares = this.boardElement.children;
        squares[piece.position[0] * 8 + piece.position[1]].classList.add('selected');
        
        validMoves.forEach(([row, col]) => {
            squares[row * 8 + col].classList.add('valid-move');
        });
    }

    clearHighlights() {
        const squares = this.boardElement.children;
        for (const square of squares) {
            square.classList.remove('selected', 'valid-move');
        }
    }

    newGame() {
        this.board = new Board();
        this.currentPlayer = 'white';
        this.selectedPiece = null;
        this.gameStatus = 'playing';
        this.clearHighlights();
        this.updateUI();
    }

    undoMove() {
        if (this.currentPlayer === 'black') {
            // Undo both AI and player moves
            this.board.undoLastMove();
            this.board.undoLastMove();
            this.currentPlayer = 'white';
        } else {
            // Undo just the last player move
            this.board.undoLastMove();
            this.currentPlayer = 'white';
        }
        
        this.updateGameStatus();
        this.updateUI();
    }

    flipBoard() {
        this.boardElement.style.transform = 
            this.boardElement.style.transform === 'rotate(180deg)' ? 
            'rotate(0deg)' : 'rotate(180deg)';
        
        const pieces = document.querySelectorAll('.piece');
        pieces.forEach(piece => {
            piece.style.transform = 
                piece.style.transform === 'rotate(180deg)' ? 
                'rotate(0deg)' : 'rotate(180deg)';
        });
    }
} 