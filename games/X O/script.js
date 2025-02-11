document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".cell");
    const statusText = document.getElementById("status");
    const resetButton = document.getElementById("reset");

    let currentPlayer = "X";
    let board = ["", "", "", "", "", "", "", "", ""];
    let gameActive = true;

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // שורות
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // עמודות
        [0, 4, 8], [2, 4, 6]             // אלכסונים
    ];

    function checkWinner() {
        for (let condition of winningConditions) {
            const [a, b, c] = condition;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                gameActive = false;
                statusText.textContent = `🎉 שחקן ${board[a]} ניצח! 🎉`;
                condition.forEach(index => cells[index].classList.add("winning-cell"));
                return;
            }
        }
        if (!board.includes("")) {
            gameActive = false;
            statusText.textContent = "🤝 תיקו!";
        }
    }

    function handleClick(event) {
        const index = event.target.dataset.index;
        if (board[index] !== "" || !gameActive) return;

        board[index] = currentPlayer;
        event.target.textContent = currentPlayer;
        event.target.style.transform = "scale(1.1)";
        setTimeout(() => event.target.style.transform = "scale(1)", 100);

        checkWinner();

        if (gameActive) {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            statusText.textContent = `תורו של שחקן ${currentPlayer}`;
        }
    }

    function resetGame() {
        board = ["", "", "", "", "", "", "", "", ""];
        gameActive = true;
        currentPlayer = "X";
        statusText.textContent = "תורו של שחקן X";
        cells.forEach(cell => {
            cell.textContent = "";
            cell.classList.remove("winning-cell");
        });
    }

    cells.forEach(cell => cell.addEventListener("click", handleClick));
    resetButton.addEventListener("click", resetGame);
});
