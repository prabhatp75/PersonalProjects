document.addEventListener('DOMContentLoaded', () => {
    // Create game instance
    const game = new Game();

    // Initialize sound system
    game.soundManager;

    // Preload images
    const pieces = ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king'];
    const colors = ['white', 'black'];
    pieces.forEach(piece => {
        colors.forEach(color => {
            const img = new Image();
            img.src = `images/${color}-${piece}.svg`;
        });
    });
}); 