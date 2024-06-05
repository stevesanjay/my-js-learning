const questions = [
    "What is the capital of France?",
    "What is the largest planet in our solar system?",
    "What is the smallest country in the world?",
    "What is the tallest mountain in the world?",
    "What is the fastest land animal?",
    "What is the most spoken language in the world?",
    "What is the longest river in the world?",
    "What is the deepest ocean?",
    "What is the currency of Japan?",
    "What is the primary ingredient in guacamole?"
];

let currentQuestionIndex = 0;

function displayQuestion() {
    if (currentQuestionIndex < questions.length) {
        document.getElementById("question").textContent = questions[currentQuestionIndex];
        currentQuestionIndex++;
    } else {
        document.getElementById("question").textContent = "No more questions!";
    }
}


