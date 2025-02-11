document.addEventListener("DOMContentLoaded", () => {
    const categoryButtons = document.querySelectorAll(".category-btn");
    const quizContainer = document.getElementById("quiz-container");
    const questionElement = document.getElementById("question");
    const timerElement = document.getElementById("timer");
    const answerButtons = document.querySelectorAll(".answer-btn");
    const feedbackElement = document.getElementById("feedback");
    const nextButton = document.getElementById("next-button");

    let currentQuestionIndex = 0;
    let score = 0;
    let timer;
    let timeLeft = 10;
    let selectedCategory = "general";

    const questions = {
        general: [
            { question: "מה עיר הבירה של צרפת?", answers: ["ברלין", "פריז", "רומא", "לונדון"], correct: 1 },
            { question: "כמה יבשות יש בעולם?", answers: ["5", "6", "7", "8"], correct: 2 }
        ],
        science: [
            { question: "איזה כוכב קרוב ביותר לשמש?", answers: ["נוגה", "מאדים", "מרקורי", "צדק"], correct: 2 },
            { question: "כמה מולקולות מים יש בליטר?", answers: ["1 ביליון", "100 טריליון", "33 אוקטיליון", "6.02 × 10^23"], correct: 3 }
        ],
        sports: [
            { question: "איזו מדינה זכתה במונדיאל 2018?", answers: ["גרמניה", "ארגנטינה", "ברזיל", "צרפת"], correct: 3 },
            { question: "כמה שחקנים יש בקבוצת כדורסל?", answers: ["5", "6", "7", "11"], correct: 0 }
        ]
    };

    function startQuiz(category) {
        selectedCategory = category;
        document.getElementById("category-selection").classList.add("hidden");
        quizContainer.classList.remove("hidden");
        loadQuestion();
    }

    function startTimer() {
        timeLeft = 10;
        timerElement.textContent = `⏳ ${timeLeft} שניות`;
        timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = `⏳ ${timeLeft} שניות`;
            if (timeLeft === 0) {
                clearInterval(timer);
                feedbackElement.textContent = "⏰ נגמר הזמן!";
                disableAnswers();
            }
        }, 1000);
    }

    function loadQuestion() {
        clearInterval(timer);
        startTimer();

        let currentQuestion = questions[selectedCategory][currentQuestionIndex];
        questionElement.textContent = currentQuestion.question;
        feedbackElement.textContent = "";
        nextButton.classList.add("hidden");

        answerButtons.forEach((button, index) => {
            button.textContent = currentQuestion.answers[index];
            button.classList.remove("correct", "wrong");
            button.disabled = false;
            button.addEventListener("click", () => checkAnswer(index));
        });
    }

    function checkAnswer(selectedIndex) {
        clearInterval(timer);
        let correctIndex = questions[selectedCategory][currentQuestionIndex].correct;

        answerButtons.forEach((button, index) => {
            button.disabled = true;
            if (index === correctIndex) button.classList.add("correct");
            else if (index === selectedIndex) button.classList.add("wrong");
        });

        feedbackElement.textContent = selectedIndex === correctIndex ? "✅ תשובה נכונה!" : "❌ תשובה שגויה!";
        nextButton.classList.remove("hidden");
    }

    nextButton.addEventListener("click", () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions[selectedCategory].length) loadQuestion();
        else location.reload();
    });

    categoryButtons.forEach(button => button.addEventListener("click", () => startQuiz(button.dataset.category)));
});
