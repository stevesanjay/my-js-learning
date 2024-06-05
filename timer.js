let timerInterval;
let timeLeft;
let totalDuration;
let questionDisplayed = false; // Variable to track if a question is already displayed

// Hardcoded questions
const questions = [
    "What is the capital of France?",
    "What is 2 + 2?",
    "Who wrote 'To Kill a Mockingbird'?",
    "What is the largest planet in our solar system?"
];

// Function to display a question
const displayQuestion = () => {
    if (!questionDisplayed) {
        const questionContainer = document.getElementById('question-container');
        // Select a random question from the array
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        questionContainer.textContent = randomQuestion;
        questionDisplayed = true; // Set the flag to true to prevent multiple questions
    }
}

// Fetch the timer data from the JSON file
fetch('timer.json')
    .then(response => response.json())
    .then(data => {
        // Parse the start and end times
        const startTime = new Date(data.startTime);
        const endTime = new Date(data.endTime);

        // Calculate the total duration in seconds
        totalDuration = (endTime - startTime) / 1000;

        // Initialize the timeLeft variable
        timeLeft = totalDuration;

        // Function to update the timer display
        const updateTimer = () => {
            document.getElementById('timer').textContent = timeLeft;

            if (timeLeft > 0) {
                timeLeft--;
            } else {
                clearInterval(timerInterval);
                alert("Time's up!");
            }
        };

        // Start button functionality
        document.getElementById('start-button').addEventListener('click', () => {
            if (!timerInterval) {
                // Display a question when the timer starts
                displayQuestion();
                timerInterval = setInterval(updateTimer, 1000);
            }
        });

        // Stop button functionality
        document.getElementById('stop-button').addEventListener('click', () => {
            clearInterval(timerInterval);
            timerInterval = null;
            questionDisplayed = false; // Reset the flag when the timer is stopped
            document.getElementById('question-container').textContent = ''; // Clear the question
            timeLeft = totalDuration; // Reset the timer
            document.getElementById('timer').textContent = timeLeft; // Reset the timer display
        });
    })
    .catch(error => {
        console.error('Error fetching the timer data:', error);
    });
