let timerInterval;
let timeLeft;
let totalDuration;
let questions = [];

// Function to display a question
const displayQuestion = () => {
    const questionContainer = document.getElementById('question-container');
    // Select a random question from the array
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    questionContainer.textContent = randomQuestion;
}

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

// Function to start the timer
const startTimer = (duration) => {
    timeLeft = duration;
    timerInterval = setInterval(updateTimer, 1000);
};

// Fetch the timer data from the JSON file and start the timer
fetch('timer.json')
    .then(response => response.json())
    .then(data => {
        // Parse the start and end times
        const startTime = new Date(data.startTime);
        const endTime = new Date(data.endTime);

        // Calculate the total duration in seconds
        totalDuration = (endTime - startTime) / 1000;

        // Start the timer automatically
        startTimer(totalDuration);
    })
    .catch(error => {
        console.error('Error fetching the timer data:', error);
    });

// Fetch and parse the questions from the CSV file
fetch('questions.csv')
    .then(response => response.text())
    .then(csvText => {
        Papa.parse(csvText, {
            header: true,
            complete: function(results) {
                questions = results.data.map(row => row.Question);
            },
            error: function(error) {
                console.error('Error parsing CSV:', error);
            }
        });
    })
    .catch(error => {
        console.error('Error fetching the questions:', error);
    });

// Start button functionality
document.getElementById('start-button').addEventListener('click', () => {
    displayQuestion();
});
