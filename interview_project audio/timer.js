let timerInterval;
let timeLeft;
let totalDuration;
let questions = [];
let currentQuestionIndex = 0;
let mediaRecorder;
let audioChunks = [];

// Function to display a question
const displayQuestion = () => {
    const questionContainer = document.getElementById('question-container');
    questionContainer.textContent = questions[currentQuestionIndex];
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
        const startTime = new Date(data.startTime);
        const endTime = new Date(data.endTime);
        totalDuration = (endTime - startTime) / 1000;
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
                displayQuestion();
            },
            error: function(error) {
                console.error('Error parsing CSV:', error);
            }
        });
    })
    .catch(error => {
        console.error('Error fetching the questions:', error);
    });

// Next button functionality
document.getElementById('next-button').addEventListener('click', () => {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }
});

// Prev button functionality
document.getElementById('prev-button').addEventListener('click', () => {
    // Previous button should always be disabled
});

// Start recording
const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            audioChunks = [];

            mediaRecorder.addEventListener("dataavailable", event => {
                audioChunks.push(event.data);
            });

            document.getElementById("start-record-button").disabled = true;
            document.getElementById("stop-record-button").disabled = false;
            document.getElementById("recording-indicator").style.display = "inline-block";
        })
        .catch(error => console.error("Error starting recording: ", error));
};

// Stop recording
const stopRecording = () => {
    mediaRecorder.stop();
    mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioDownloadLink = document.createElement("a");
        audioDownloadLink.href = audioUrl;
        audioDownloadLink.download = "recorded_audio.wav";
        audioDownloadLink.click();

        document.getElementById("start-record-button").disabled = false;
        document.getElementById("stop-record-button").disabled = true;
        document.getElementById("recording-indicator").style.display = "none";
    });
};

// Event listeners for recording buttons
document.getElementById("start-record-button").addEventListener("click", startRecording);
document.getElementById("stop-record-button").addEventListener("click", stopRecording);
