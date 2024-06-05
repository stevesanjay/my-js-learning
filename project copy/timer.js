let timerInterval;
let timeLeft;
let totalDuration;
let questions = [];
let currentQuestionIndex = 0;
let rightArrowClickCount = 0;

// Function to display the current question
const displayQuestion = () => {
    const questionContainer = document.getElementById('question-container');
    if (questions.length > 0) {
        questionContainer.textContent = questions[currentQuestionIndex];
        updateArrowButtonVisibility();
    }
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

// Function to update the visibility of arrow buttons
const updateArrowButtonVisibility = () => {
    const leftArrow = document.getElementById('left-arrow');
    leftArrow.classList.add('disabled');
    const rightArrow = document.getElementById('right-arrow');
    if (rightArrowClickCount < 4 && currentQuestionIndex < questions.length - 1) {
        rightArrow.classList.remove('disabled');
    } else {
        rightArrow.classList.add('disabled');
    }
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
                displayQuestion(); // Display the first question initially
            },
            error: function(error) {
                console.error('Error parsing CSV:', error);
            }
        });
    })
    .catch(error => {
        console.error('Error fetching the questions:', error);
    });

// Right arrow button functionality
document.getElementById('right-arrow').addEventListener('click', () => {
    if (!document.getElementById('right-arrow').classList.contains('disabled')) {
        if (questions.length > 0 && currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            rightArrowClickCount++;
            displayQuestion();
        }
    }
});

// Left arrow button functionality
document.getElementById('left-arrow').addEventListener('click', () => {
    // Left arrow should always be disabled
});
