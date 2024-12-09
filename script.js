let score = 10;
let targetsFound = 0;
let isDragging = false;
let startX, startY, initialX, initialY;
let startTime, timerInterval;
let numberOfTargets = 5;
let gamesPlayed = 1;
let totalTimeSpent = 0;

const scoreElement = document.getElementById('score');
const targetsLeftElement = document.getElementById('targets-left');
const gamesPlayedElement = document.getElementById('games-played');
const timerElement = document.getElementById('timer');
const totalTimeElement = document.getElementById('total-time');
const gameContainer = document.getElementById('game-container');
const gameArea = document.getElementById('game-area');
const startButton = document.getElementById('start-button');
const winMessage = document.getElementById('win-message');
const loseMessage = document.getElementById('lose-message');
const finalTime = document.getElementById('final-time');
const newGameButton = document.getElementById('new-game-button');
const tryAgainButton = document.getElementById('try-again-button');

function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
    if (score <= 0) {
        loseGame();
    }
}

function updateTargetsLeft() {
    targetsLeftElement.textContent = `Left: ${numberOfTargets - targetsFound}`;
}

function updateGamesPlayed() {
    gamesPlayedElement.textContent = `Games: ${gamesPlayed}`;
}

function updateTimer() {
    const now = new Date().getTime();
    const elapsedTime = now - startTime;
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    timerElement.textContent = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateTotalTime() {
    const minutes = Math.floor(totalTimeSpent / 60);
    const seconds = totalTimeSpent % 60;
    totalTimeElement.textContent = `TT Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startDrag(e) {
    isDragging = true;
    gameArea.style.cursor = 'grabbing';
    startX = e.pageX || e.touches[0].pageX;
    startY = e.pageY || e.touches[0].pageY;
    initialX = gameArea.offsetLeft;
    initialY = gameArea.offsetTop;
}

function stopDrag() {
    isDragging = false;
    gameArea.style.cursor = 'grab';
}

function drag(e) {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX || e.touches[0].pageX;
    const y = e.pageY || e.touches[0].pageY;
    const dx = x - startX;
    const dy = y - startY;
    const newLeft = initialX + dx;
    const newTop = initialY + dy;

    // Constrain movement within the bounds of the game container
    const maxLeft = 0;
    const maxTop = 0;
    const minLeft = gameContainer.offsetWidth - gameArea.offsetWidth;
    const minTop = gameContainer.offsetHeight - gameArea.offsetHeight;

    gameArea.style.left = `${Math.min(maxLeft, Math.max(minLeft, newLeft))}px`;
    gameArea.style.top = `${Math.min(maxTop, Math.max(minTop, newTop))}px`;
}

function startGame() {
    targetsFound = 0;
    updateScore();
    updateTargetsLeft();
    updateGamesPlayed();
    updateTotalTime();
    startTime = new Date().getTime();
    timerInterval = setInterval(updateTimer, 1000);
    startButton.style.display = 'none';
    winMessage.style.display = 'none';
    loseMessage.style.display = 'none';

    // Remove static image and add background image and targets
    const staticImage = document.getElementById('static-image');
    staticImage.style.display = 'none';

    const backgroundImage = document.createElement('img');
    //backgroundImage.src = 'https://via.placeholder.com/5000';
    backgroundImage.src = 'static.jpg';
    backgroundImage.id = 'background-image';
    backgroundImage.alt = 'Background';
    backgroundImage.style.width = '5000px';
    backgroundImage.style.height = '5000px';
    gameArea.appendChild(backgroundImage);

    addTargets(numberOfTargets);
}

function addTargets(count) {
    // Remove existing targets
    document.querySelectorAll('.target').forEach(target => target.remove());

    // Add new targets within the 5000x5000px area
    for (let i = 0; i < count; i++) {
        const target = document.createElement('img');
        //target.src = 'https://via.placeholder.com/50';
        target.src = 'pb.png';
        target.className = 'target';
        target.style.top = `${Math.random() * (5000 - 300)}px`;
        target.style.left = `${Math.random() * (5000 - 150)}px`;
        target.addEventListener('click', onTargetClick);
        gameArea.appendChild(target);
    }
}

function onTargetClick(e) {
    e.stopPropagation();
    score++;
    targetsFound++;
    e.target.style.display = 'none';
    updateScore();
    updateTargetsLeft();

    if (targetsFound === numberOfTargets) {
        clearInterval(timerInterval);
        const now = new Date().getTime();
        const elapsedTime = Math.floor((now - startTime) / 1000);
        totalTimeSpent += elapsedTime;
        updateTotalTime();

        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;
        finalTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        winMessage.style.display = 'block';
    }
}

function loseGame() {
    clearInterval(timerInterval);
    loseMessage.style.display = 'block';
}

function startNewGame() {
    numberOfTargets++;
    gamesPlayed++;
    startGame();
}

function tryAgain() {
    location.reload();
}

gameArea.addEventListener('mousedown', startDrag);
gameArea.addEventListener('touchstart', startDrag);

gameArea.addEventListener('mouseup', stopDrag);
gameArea.addEventListener('touchend', stopDrag);

gameArea.addEventListener('mousemove', drag);
gameArea.addEventListener('touchmove', drag);

gameArea.addEventListener('click', () => {
    score--;
    updateScore();
});

startButton.addEventListener('click', startGame);
newGameButton.addEventListener('click', startNewGame);
tryAgainButton.addEventListener('click', tryAgain);

// Initial score and games played update
updateScore();
updateTargetsLeft();
updateGamesPlayed();
updateTotalTime();
