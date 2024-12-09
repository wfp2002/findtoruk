let score = 10;
let targetsFound = 0;
let isDragging = false;
let startX, startY, initialX, initialY;
let startTime, timerInterval;
let numberOfTargets = 5;
let gamesPlayed = 1;
let totalTimeSpent = 0;
const maxGames = 5;

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
const finalScore = document.getElementById('final-score');
const finalTotalTime = document.getElementById('final-total-time');
const newGameButton = document.getElementById('new-game-button');
const tryAgainButton = document.getElementById('try-again-button');
const winText = document.getElementById('win-text');
const newGameContainer = document.getElementById('new-game-container');

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

    // Update static image based on the game number
    const staticImage = document.getElementById('static-image');

    if (gamesPlayed % 2 == 0) {
        staticImage.src = `static2.jpg`;
    } else {
        staticImage.src = `static1.jpg`;
    }
    //staticImage.src = `static${gamesPlayed}.jpg`;
    staticImage.style.display = 'block';

    // Remove background image if exists
    const backgroundImage = document.getElementById('background-image');
    if (backgroundImage) {
        backgroundImage.remove();
    }

    addTargets(numberOfTargets);
}

function addTargets(count) {
    // Remove existing targets
    document.querySelectorAll('.target').forEach(target => target.remove());

    // Add new targets within the 5000x5000px area
    for (let i = 0; i < count; i++) {
        const target = document.createElement('img');
        target.src = 'pb.png';
        target.className = 'target';
        target.style.top = `${Math.random() * (5000 - 250)}px`;
        target.style.left = `${Math.random() * (5000 - 50)}px`;
        target.addEventListener('click', onTargetClick);
        gameArea.appendChild(target);
    }
}

function onTargetClick(e) {
    e.stopPropagation();
    score++;
    targetsFound++;
    //e.target.style.display = 'none';
    e.target.src = 'pb-color.png';
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
        //finalTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (gamesPlayed < maxGames) {
            winMessage.style.display = 'block';
            newGameContainer.style.display = 'block';
            winText.innerHTML = `<div>You Win!</div><div>Your Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}</div>`;
        } else {
            winMessage.style.display = 'block';
            newGameContainer.style.display = 'none';
            winText.innerHTML = `<div style='font-size: 20px'>You Finished!<div>Score: ${score}</div><div>Your Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}</div><div>Total Time: ${totalTimeElement.textContent.split(': ')[1]}</div></div>`;
        }
    }
}

function loseGame() {
    clearInterval(timerInterval);
    loseMessage.style.display = 'block';
}

function startNewGame() {
    if (gamesPlayed < maxGames) {
        numberOfTargets++;
        gamesPlayed++;
        startGame();
    }
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
