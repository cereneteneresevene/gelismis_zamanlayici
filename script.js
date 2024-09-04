const timerForm = document.getElementById('timerForm');
const timersDiv = document.getElementById('timers');
let timerCount = 0;
let currentAudio = null; 

timerForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const days = parseInt(document.getElementById('days').value) || 0;
    const hours = parseInt(document.getElementById('hours').value) || 0;
    const minutes = parseInt(document.getElementById('minutes').value) || 0;
    const seconds = parseInt(document.getElementById('seconds').value) || 0;

    const totalSeconds = (days * 86400) + (hours * 3600) + (minutes * 60) + seconds;
    if (totalSeconds > 0) {
        createTimer(title, totalSeconds);
    }
});

function createTimer(title, totalSeconds) {
    timerCount++;
    const timerId = 'timer-' + timerCount;

    const timerDiv = document.createElement('div');
    timerDiv.classList.add('alert', 'alert-info', 'd-flex', 'justify-content-between', 'align-items-center');
    timerDiv.setAttribute('id', timerId);

    const timerContent = document.createElement('div');
    timerContent.classList.add('d-flex', 'align-items-center');
    timerDiv.appendChild(timerContent);

    const timerTitle = document.createElement('h5');
    timerTitle.innerText = title;
    timerContent.appendChild(timerTitle);

    const timerDisplay = document.createElement('div');
    timerDisplay.setAttribute('id', 'display-' + timerId);
    timerDisplay.classList.add('ml-3');
    timerContent.appendChild(timerDisplay);

    // Duraklat butonunu oluştur
    const pauseButton = document.createElement('button');
    pauseButton.innerText = 'Alarmın Sesini Sustur!';
    pauseButton.classList.add('btn', 'btn-warning', 'ml-2');
    pauseButton.addEventListener('click', function() {
        togglePauseSound();
    });

    // Sil butonunu oluştur
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Sil';
    deleteButton.classList.add('btn', 'btn-danger', 'ml-2');
    deleteButton.addEventListener('click', function() {
        deleteTimer(timerId);
    });

    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('d-flex', 'align-items-center');
    buttonDiv.appendChild(pauseButton);
    buttonDiv.appendChild(deleteButton);

    timerDiv.appendChild(buttonDiv);

    timersDiv.appendChild(timerDiv);
    const interval = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(interval);
            timerDiv.classList.replace('alert-info', 'alert-success');
            playSound(); // Ses çal
        } else {
            totalSeconds--;
            updateDisplay(timerId, totalSeconds);
        }
    }, 1000);

    timerDiv.dataset.intervalId = interval;
    timerDiv.dataset.totalSeconds = totalSeconds;
}

function updateDisplay(timerId, totalSeconds) {
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const display = document.getElementById('display-' + timerId);
    display.innerText = `${days}g ${hours}sa ${minutes}dk ${seconds}sn`;
}

function playSound() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0; 
    }
    currentAudio = new Audio('https://www.dropbox.com/scl/fi/xoxc8sbt8juu0uj2uyuyr/ses.wav?rlkey=pfx484434cf4afj1ys9c7wlxo&dl=1');
    currentAudio.loop = true; 
    currentAudio.play().catch(error => console.error("Audio playback failed:", error));
}

function stopSound() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0; 
    }
}

function togglePauseSound() {
    if (currentAudio) {
        if (currentAudio.paused) {
            currentAudio.play().catch(error => console.error("Audio playback failed:", error));
        } else {
            currentAudio.pause();
        }
    }
}

function deleteTimer(timerId) {
    const timerDiv = document.getElementById(timerId);
    if (timerDiv) {
        // Zamanlayıcıyı sil
        clearInterval(timerDiv.dataset.intervalId); 
        timerDiv.remove();

        // Ses çalınıyorsa durdur
        if (!document.querySelector('.alert-info')) {
            stopSound();
        }
    }
}
