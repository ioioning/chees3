// Змінна для відстеження поточного гравця
let currentTurn = 'white'; // Білі ходять першими

// Функція для перевірки, чи можна зробити хід
function isValidTurn(pieceColor) {
    if (pieceColor !== currentTurn) {
        //alert(`Зараз хід ${currentTurn === 'white' ? 'білих' : 'чорних'}!`);
        return false;
    }
    return true;
}

// Функція для перемикання черги ходу
function switchTurn() {
    currentTurn = currentTurn === 'white' ? 'black' : 'white';
}
        const board = document.getElementById('chessboard');
        const modal = document.getElementById('promotionModal');
        let promotionTargetCell = null;

        // Create chessboard cells
        for (let i = 0; i < 64; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;

            const row = Math.floor(i / 8);
            const col = i % 8;
            cell.dataset.color = (row + col) % 2 === 0 ? 'white' : 'black';

            board.appendChild(cell);
        }

        // Define chess pieces
        const pieces = [

		 { color: 'white', type: 'rook', position: 0 },
            { color: 'white', type: 'knight', position: 1 },
            { color: 'white', type: 'bishop', position: 2 },
            { color: 'white', type: 'queen', position: 4 },
            { color: 'white', type: 'king', position: 3 },
            { color: 'white', type: 'bishop', position: 5 },
            { color: 'white', type: 'knight', position: 6 },
            { color: 'white', type: 'rook', position: 7 },
            { color: 'white', type: 'pawn', position: 8 },
            { color: 'white', type: 'pawn', position: 9 },
            { color: 'white', type: 'pawn', position: 10 },
            { color: 'white', type: 'pawn', position: 11 },
            { color: 'white', type: 'pawn', position: 12 },
            { color: 'white', type: 'pawn', position: 13 },
            { color: 'white', type: 'pawn', position: 14 },
            { color: 'white', type: 'pawn', position: 15 },
            { color: 'black', type: 'rook', position: 56 },
            { color: 'black', type: 'knight', position: 57 },
            { color: 'black', type: 'bishop', position: 58 },
            { color: 'black', type: 'queen', position: 60 },
            { color: 'black', type: 'king', position: 59 },
            { color: 'black', type: 'bishop', position: 61 },
            { color: 'black', type: 'knight', position: 62 },
            { color: 'black', type: 'rook', position: 63 },
            { color: 'black', type: 'pawn', position: 48 },
            { color: 'black', type: 'pawn', position: 49 },
            { color: 'black', type: 'pawn', position: 50 },
            { color: 'black', type: 'pawn', position: 51 },
            { color: 'black', type: 'pawn', position: 52 },
            { color: 'black', type: 'pawn', position: 53 },
            { color: 'black', type: 'pawn', position: 54 },
            { color: 'black', type: 'pawn', position: 55 }
        ];

        // Place pieces on the board
        pieces.forEach(piece => {
            const pieceElement = document.createElement('img');
            pieceElement.classList.add('piece');
            pieceElement.draggable = true;
            pieceElement.src = `./images/${piece.color}_${piece.type}.png`;
          //  pieceElement.     = `./images/${piece.color}_${piece.type}.png`;
            pieceElement.alt = `${piece.color} ${piece.type}`;

            const targetCell = document.querySelector(`.cell[data-index="${piece.position}"]`);
            targetCell.appendChild(pieceElement);
        });

        // Helper to clear markers
        function clearMarkers() {
            document.querySelectorAll('.marker').forEach(marker => marker.remove());
        }

        // Helper to check if a cell is occupied
        function isOccupied(index) {
            const cell = document.querySelector(`.cell[data-index="${index}"]`);
            return cell && cell.querySelector('.piece');
        }

        // Calculate possible moves
        function getPossibleMoves(piece, position) {
            const moves = [];
            const row = Math.floor(position / 8);
            const col = position % 8;

            const directions = {
                pawn: piece.alt.includes('white') ? [[1, 0]] : [[-1, 0]],
                rook: [[1, 0], [-1, 0], [0, 1], [0, -1]],
                bishop: [[1, 1], [1, -1], [-1, 1], [-1, -1]],
                queen: [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]],
                knight: [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]],
                king: [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]
            };

            const moveRules = directions[piece.alt.split(' ')[1]] || [];

            moveRules.forEach(([dr, dc]) => {
                let newRow = row + dr;
                let newCol = col + dc;
                while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                    const newIndex = newRow * 8 + newCol;
                    if (isOccupied(newIndex)) {
                        if (document.querySelector(`.cell[data-index="${newIndex}"] .piece`).alt.split(' ')[0] !== piece.alt.split(' ')[0]) {
                            moves.push(newIndex); // Capture move
                        }
                        break; // Stop if a piece blocks the path
                    }
                    moves.push(newIndex);
                    if (piece.alt.split(' ')[1] === 'knight' || piece.alt.split(' ')[1] === 'king') break; // Single move for knight or king
                    newRow += dr;
                    newCol += dc;
                }
            });

            return moves;
        }

        // Highlight possible moves
        function highlightMoves(moves) {
            moves.forEach(move => {
                const targetCell = document.querySelector(`.cell[data-index="${move}"]`);
                if (targetCell) {
                    const marker = document.createElement('div');
                    marker.classList.add('marker');
                    targetCell.appendChild(marker);
                }
            });
        }

        // Drag-and-drop functionality
        board.addEventListener('dragstart', event => {
            if (event.target.classList.contains('piece')) {
                const fromIndex = event.target.parentNode.dataset.index;
                event.dataTransfer.setData('text/plain', fromIndex);

                const piece = event.target;
                const moves = getPossibleMoves(piece, parseInt(fromIndex));
                clearMarkers();
                highlightMoves(moves);
            }
        });

        board.addEventListener('dragover', event => {
            event.preventDefault();
            const targetCell = event.target.closest('.cell');
            if (targetCell) {
                targetCell.classList.add('highlight');
            }
        });

        board.addEventListener('dragleave', event => {
            const targetCell = event.target.closest('.cell');
            if (targetCell) {
                targetCell.classList.remove('highlight');
            }
        });

        board.addEventListener('drop', event => {
            event.preventDefault();
            const fromIndex = event.dataTransfer.getData('text/plain');
            const fromCell = document.querySelector(`.cell[data-index="${fromIndex}"]`);
            const targetCell = event.target.closest('.cell');

            if (fromCell && targetCell && fromCell !== targetCell) {
                const piece = fromCell.querySelector('.piece');
                if (piece) {
                    // Remove any existing piece in the target cell
			//TODO перевірити чи є фігура протилежного кольору
			//TODO якщо фігура того самого кольору відмінити ход
			if (!targetCell.querySelector('.marker').classList.contains('marker')) {
    return;
}

			// знайти колір фігури яку ми тримаємо
			const pieceColor = piece.alt.split(' ')[0]
        if (!isValidTurn(pieceColor)) return;
                    if (targetCell.firstChild) {
                        targetCell.removeChild(targetCell.firstChild);
                    }

			//TODO якщо хід не правильний то відмінити
			//якщо немає маркера не ходим
			// Функція для перемикання черги ходу




                    targetCell.appendChild(piece);
                    targetCell.classList.remove('highlight');

                    // Show modal if a pawn reaches the last row
			//TODO цей код працює тільки для білого пішака, треба зробити аналогічний код для чорного
                    if (piece.alt.includes('pawn') && (targetCell.dataset.index < 8 || targetCell.dataset.index > 55)) {
                        promotionTargetCell = targetCell;
                        showModal();
                    }
		// Після успішного ходу перемикаємо хід
        switchTurn();
                }
            }
            clearMarkers();
        });

        function showModal() {
            modal.style.display = 'flex';
        }

        function closeModal() {
            modal.style.display = 'none';
        }

        function promotePawn(newType) {
            if (promotionTargetCell) {
                const piece = promotionTargetCell.querySelector('.piece');
                if (piece) {
                    piece.src = `./images/white_${newType}.jpg`;
                    piece.alt = `white ${newType}`;
                }
            }
            closeModal();
        }
