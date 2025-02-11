document.addEventListener("DOMContentLoaded", () => {
    const maze = document.getElementById("maze");
    const resultText = document.getElementById("result");
    const restartButton = document.getElementById("restart-button");
    const timerText = document.getElementById("timer");

    let playerPosition = { x: 0, y: 0 };
    let endPosition = { x: 9, y: 9 };
    let startTime;
    let timerInterval;

    const mazeGrid = [
        "S  X    X ",
        "XX X XXXX ",
        "   X     X",
        " X XXXXXX ",
        " X       X",
        " XXXX XX X",
        " X       X",
        " XXXX X XX",
        "        EX",
        "XXXXXXXXXX"
    ];

    function createMaze() {
        maze.innerHTML = "";
        for (let y = 0; y < mazeGrid.length; y++) {
            for (let x = 0; x < mazeGrid[y].length; x++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");

                if (mazeGrid[y][x] === "X") {
                    cell.classList.add("wall");
                } else if (mazeGrid[y][x] === "S") {
                    cell.classList.add("start");
                    playerPosition = { x, y };
                } else if (mazeGrid[y][x] === "E") {
                    cell.classList.add("end");
                    endPosition = { x, y };
                }

                cell.dataset.x = x;
                cell.dataset.y = y;
                maze.appendChild(cell);
            }
        }
        updatePlayerPosition();
    }

    function updatePlayerPosition() {
        document.querySelectorAll(".player").forEach(cell => cell.classList.remove("player"));
        const playerCell = document.querySelector(`.cell[data-x="${playerPosition.x}"][data-y="${playerPosition.y}"]`);
        playerCell.classList.add("player");
        playerCell.textContent = "🏃‍♂️";

        if (playerPosition.x === endPosition.x && playerPosition.y === endPosition.y) {
            clearInterval(timerInterval);
            const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
            resultText.textContent = `🎉 ניצחת! זמן: ${timeTaken} שניות!`;
            document.removeEventListener("keydown", movePlayer);
        }
    }

    function movePlayer(event) {
        const { x, y } = playerPosition;
        let newX = x, newY = y;

        if (event.key === "ArrowUp") newY--;
        if (event.key === "ArrowDown") newY++;
        if (event.key === "ArrowLeft") newX++;
        if (event.key === "ArrowRight") newX--;

        const targetCell = document.querySelector(`.cell[data-x="${newX}"][data-y="${newY}"]`);
        if (targetCell && !targetCell.classList.contains("wall")) {
            playerPosition = { x: newX, y: newY };
            updatePlayerPosition();
        }
    }

    function startTimer() {
        startTime = Date.now();
        timerInterval = setInterval(() => {
            const timeElapsed = ((Date.now() - startTime) / 1000).toFixed(2);
            timerText.textContent = `⏳ זמן: ${timeElapsed} שניות`;
        }, 100);
    }

    restartButton.addEventListener("click", () => {
        playerPosition = { x: 0, y: 0 };
        resultText.textContent = "";
        createMaze();
        startTimer();
        document.addEventListener("keydown", movePlayer);
    });

    createMaze();
    startTimer();
    document.addEventListener("keydown", movePlayer);
});
