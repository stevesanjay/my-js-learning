let timerInterval;
let timeLeft;
let totalDuration;
let questions = [];
let currentQuestionIndex = 0;

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

let mediaRecorder;
let audioChunks = [];

const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            mediaRecorder.addEventListener("dataavailable", event => {
                audioChunks.push(event.data);
            });
            document.getElementById("record-button").textContent = "Stop Recording";
            document.getElementById("recording-indicator").style.display = "inline-block";
        })
        .catch(error => console.error("Error starting recording: ", error));
};

const stopRecording = () => {
    mediaRecorder.stop();
    mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioDownloadLink = document.createElement("a");
        audioDownloadLink.href = audioUrl;
        audioDownloadLink.download = "recorded_audio.wav";
        audioDownloadLink.click();
        audioChunks = [];
        document.getElementById("record-button").textContent = "Record";
        document.getElementById("recording-indicator").style.display = "none";
    });
};

document.getElementById("record-button").addEventListener("click", () => {
    if (document.getElementById("record-button").textContent === "Record") {
        startRecording();
    } else {
        stopRecording();
    }
});
