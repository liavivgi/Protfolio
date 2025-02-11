document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("board");
    const boardSize = 8;
    let selectedPiece = null;
    let currentPlayer = "red";
    let redScore = 0;
    let blackScore = 0;

    // יצירת לוח ניקוד וכפתור התחלה מחדש
    const scoreBoard = document.createElement("div");
    scoreBoard.id = "score-board";
    scoreBoard.innerHTML = `
        <p>ניקוד אדום: <span id="red-score">0</span></p>
        <p>ניקוד שחור: <span id="black-score">0</span></p>
    `;
    document.body.appendChild(scoreBoard);

    const restartButton = document.createElement("button");
    restartButton.id = "restart-btn";
    restartButton.textContent = "🔄 התחל מחדש";
    restartButton.addEventListener("click", restartGame);
    scoreBoard.appendChild(restartButton);

    document.addEventListener("touchmove", (event) => {
    event.preventDefault();
}, { passive: false });


    function updateTurnIndicator() {
        document.getElementById("turn-indicator").textContent =
            currentPlayer === "red" ? "תור האדום" : "תור השחור";
    }

    function updateScore() {
        document.getElementById("red-score").textContent = redScore;
        document.getElementById("black-score").textContent = blackScore;
        checkWin();
    }

    function checkWin() {
        if (redScore >= 12 || blackScore >= 12) {
            setTimeout(() => {
                alert(currentPlayer === "red" ? "האדום ניצח!" : "השחור ניצח!");
                restartGame();
            }, 200);
        }
    }

    function createBoard() {
        board.innerHTML = "";
        redScore = 0;
        blackScore = 0;
        updateScore();

        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const square = document.createElement("div");
                square.classList.add("square");
                square.dataset.row = row;
                square.dataset.col = col;

                if ((row + col) % 2 === 1) {
                    square.classList.add("dark-square");

                    if (row < 3) {
                        createPiece(square, "red");
                    } else if (row > 4) {
                        createPiece(square, "black");
                    }
                }

                square.addEventListener("click", onSquareClick);
                board.appendChild(square);
            }
        }
        updateTurnIndicator();
    }

    function createPiece(square, color) {
        const piece = document.createElement("div");
        piece.classList.add("piece", color);
        piece.dataset.color = color;
        square.appendChild(piece);
    }

    function onSquareClick(event) {
        const square = event.currentTarget;
        const piece = square.querySelector(".piece");
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);

        if (piece && piece.dataset.color === currentPlayer) {
            selectedPiece = { element: piece, row, col };
            highlightMoves(selectedPiece);
        } else if (selectedPiece && square.classList.contains("highlight")) {
            performMove(selectedPiece, square, row, col);
            selectedPiece = null;
            clearHighlights();
        } else {
            selectedPiece = null;
            clearHighlights();
        }
    }

    function highlightMoves(pieceData) {
        clearHighlights();
        const { row, col, element } = pieceData;
        const directions = element.classList.contains("king") ? [-1, 1] : [currentPlayer === "red" ? 1 : -1];

        let hasCapture = false;
        directions.forEach(dir => {
            [[-1, dir], [1, dir]].forEach(([colOffset, rowOffset]) => {
                let newRow = row + rowOffset;
                let newCol = col + colOffset;
                let jumpRow = row + (rowOffset * 2);
                let jumpCol = col + (colOffset * 2);

                const targetSquare = document.querySelector(`[data-row='${newRow}'][data-col='${newCol}']`);
                const jumpSquare = document.querySelector(`[data-row='${jumpRow}'][data-col='${jumpCol}']`);

                if (targetSquare && targetSquare.querySelector(".piece") &&
                    targetSquare.querySelector(".piece").dataset.color !== currentPlayer &&
                    jumpSquare && !jumpSquare.querySelector(".piece")) {
                    jumpSquare.classList.add("highlight");
                    hasCapture = true;
                }
            });
        });

        if (!hasCapture) {
            directions.forEach(dir => {
                [[-1, dir], [1, dir]].forEach(([colOffset, rowOffset]) => {
                    let newRow = row + rowOffset;
                    let newCol = col + colOffset;
                    const targetSquare = document.querySelector(`[data-row='${newRow}'][data-col='${newCol}']`);
                    if (targetSquare && !targetSquare.querySelector(".piece")) {
                        targetSquare.classList.add("highlight");
                    }
                });
            });
        }
    }

    function performMove(pieceData, targetSquare, newRow, newCol) {
        const { element, row, col } = pieceData;
        targetSquare.appendChild(element);

        const midRow = (row + newRow) / 2;
        const midCol = (col + newCol) / 2;
        const middleSquare = document.querySelector(`[data-row='${midRow}'][data-col='${midCol}']`);

        if (middleSquare) {
            const middlePiece = middleSquare.querySelector(".piece");
            if (middlePiece && middlePiece.dataset.color !== currentPlayer) {
                middleSquare.removeChild(middlePiece);
                if (currentPlayer === "red") {
                    redScore++;
                } else {
                    blackScore++;
                }
                updateScore();
            }
        }

        checkKing(element, newRow);
        switchTurn();
    }

    function checkKing(piece, row) {
        if ((piece.dataset.color === "red" && row === 7) ||
            (piece.dataset.color === "black" && row === 0)) {
            piece.classList.add("king");
        }
    }

    function switchTurn() {
        currentPlayer = currentPlayer === "red" ? "black" : "red";
        updateTurnIndicator();
    }

    function clearHighlights() {
        const highlightedSquares = document.querySelectorAll(".highlight");
        highlightedSquares.forEach(square => square.classList.remove("highlight"));
    }

    function restartGame() {
        createBoard();
        updateTurnIndicator();
    }

    createBoard();
});