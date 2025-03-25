let currentQuestionIndex = 0;
let userAnswers = [];
let score = 0;
let questions = [];

fetch('/get-questions')
    .then(response => response.json())
    .then(data => {
        questions = data;

        if (questions && questions.length > 0) {
            loadQuestion(currentQuestionIndex);
        } else {
            console.error("Error: Questions data is empty or undefined.");
        }
    })
    .catch(error => {
        console.error('Error fetching questions:', error);
    });

function loadQuestion(index) {
    if (questions && questions[index]) {
        const question = questions[index];
        document.getElementById("question").textContent = question.question;

        const optionsContainer = document.getElementById("options");
        optionsContainer.innerHTML = "";
        question.options.forEach((option, i) => {
            const optionButton = document.createElement("button");
            optionButton.textContent = option;
            optionButton.classList.add("button");
            optionButton.onclick = () => selectAnswer(i, optionButton);
            optionsContainer.appendChild(optionButton);
        });

        const svgContainer = document.getElementById("svg-container");
        svgContainer.innerHTML = `<img src="images/${question.svg}" alt="SVG">`;

        updateQuestionSelector();
        highlightCurrentQuestion();

        // Перевіряємо, чи це останнє питання
        if (currentQuestionIndex === questions.length - 1) {
            document.getElementById("next-button").style.display = "none";  // Приховуємо кнопку "Наступне питання" на останньому питанні
            document.getElementById("finish-button").style.display = "inline-block"; // Показуємо кнопку "Завершити тест"
        } else {
            document.getElementById("next-button").style.display = "inline-block"; // Показуємо кнопку "Наступне питання" на інших питаннях
            document.getElementById("finish-button").style.display = "inline-block"; // Кнопка "Завершити тест" завжди видима
        }
    } else {
        console.error("Error: Invalid question data at index:", index);
    }
}

function updateQuestionSelector() {
    const selector = document.getElementById("question-selector");
    selector.innerHTML = "";

    questions.forEach((_, i) => {
        const questionButton = document.createElement("button");
        questionButton.textContent = i + 1;
        questionButton.classList.add("button");
        questionButton.onclick = () => {
            currentQuestionIndex = i;
            loadQuestion(i);
        };
        selector.appendChild(questionButton);
    });
}

function highlightCurrentQuestion() {
    const questionButtons = document.querySelectorAll("#question-selector button");
    questionButtons.forEach(button => button.classList.remove("selected"));
    questionButtons[currentQuestionIndex].classList.add("selected");
}

function selectAnswer(answerIndex, optionButton) {
    const correctAnswer = questions[currentQuestionIndex].correct;
    userAnswers[currentQuestionIndex] = answerIndex;

    const optionButtons = document.querySelectorAll("#options button");
    optionButtons.forEach(button => {
        button.classList.remove("selected-answer");
    });

    optionButton.classList.add("selected-answer");

    // Підрахунок правильних відповідей
    if (answerIndex === correctAnswer) {
        score++;
    }
}

document.getElementById("next-button").onclick = () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion(currentQuestionIndex);
    }
};

document.getElementById("finish-button").onclick = () => {
    const resultContainer = document.getElementById("result");
    resultContainer.innerHTML = `Your result: ${score} out of ${questions.length} correct answers.`;

    document.getElementById("next-button").style.display = "none";
    document.getElementById("finish-button").style.display = "none";
    document.getElementById("repeat-button").style.display = "inline-block";  
};

document.getElementById("repeat-button").onclick = () => {
    // Обнулення результатів і початок нового тесту
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    
    // Скидання результатів
    const resultContainer = document.getElementById("result");
    resultContainer.innerHTML = '';

    // Завантаження першого питання
    loadQuestion(currentQuestionIndex);

    // Сховати кнопку повторного проходження і показати кнопки для тесту
    document.getElementById("repeat-button").style.display = "none";
    document.getElementById("next-button").style.display = "inline-block";
    document.getElementById("finish-button").style.display = "inline-block";
};
