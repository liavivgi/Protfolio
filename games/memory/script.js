document.addEventListener("DOMContentLoaded", () => {
    const cardsArray = [
        "🍎", "🍎", "🍌", "🍌", "🍒", "🍒", "🍇", "🍇", "🍉", "🍉", "🍓", "🍓"
    ];

    let shuffledCards = shuffleArray(cardsArray);
    let firstCard = null, secondCard = null;
    let lockBoard = false;
    let matchesFound = 0;
    let startTime = Date.now();
    
    const gameBoard = document.getElementById("game-board");
    const timerDisplay = document.getElementById("timer");
    
    shuffledCards.forEach(symbol => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.symbol = symbol;
        card.innerHTML = "❔"; // צד סגור של הקלף
        card.addEventListener("click", flipCard);
        gameBoard.appendChild(card);
    });
    
    function updateTimer() {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        timerDisplay.textContent = `⏳ זמן: ${elapsedTime} שניות`;
    }
    setInterval(updateTimer, 1000);
    
    function flipCard() {
        if (lockBoard || this === firstCard) return;
        this.innerHTML = this.dataset.symbol;
        this.classList.add("flipped");
        
        if (!firstCard) {
            firstCard = this;
            return;
        }

        secondCard = this;
        lockBoard = true;
        
        checkMatch();
    }
    
    function checkMatch() {
        if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            firstCard.removeEventListener("click", flipCard);
            secondCard.removeEventListener("click", flipCard);
            matchesFound++;
            if (matchesFound === cardsArray.length / 2) {
                setTimeout(() => alert(`🎉 ניצחת! כל הזוגות נמצאו תוך ${Math.floor((Date.now() - startTime) / 1000)} שניות!`), 500);
            }
            resetBoard();
        } else {
            setTimeout(() => {
                firstCard.innerHTML = "❔";
                secondCard.innerHTML = "❔";
                firstCard.classList.remove("flipped");
                secondCard.classList.remove("flipped");
                resetBoard();
            }, 1000);
        }
    }

    function resetBoard() {
        [firstCard, secondCard] = [null, null];
        lockBoard = false;
    }

    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }
});
