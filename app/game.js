import { collidesWithPipe, createPipe } from './gameLogic.js';

const canvas = document.querySelector('#game-canvas');
const context = canvas.getContext('2d');
const scoreElement = document.querySelector('#score');
const highScoreElement = document.querySelector('#high-score');
const startPanel = document.querySelector('#start-panel');
const gameOverPanel = document.querySelector('#game-over-panel');
const gameOverTitle = document.querySelector('#game-over-title');
const gameOverCopy = document.querySelector('#game-over-copy');
const startButton = document.querySelector('#start-button');
const restartButton = document.querySelector('#restart-button');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const groundHeight = 62;
const player = { x: 205, y: 290, width: 86, height: 72, velocity: 0, frame: 1 };
const settings = { gravity: 0.42, flap: -8.7, pipeSpeed: 3.4, pipeWidth: 92, gap: 235 };
const assets = {
  background: loadImage('app/images/background.png'),
  octopus: [loadImage('app/images/octo1.png'), loadImage('app/images/octo2.png'), loadImage('app/images/octo3.png')],
  obstacle: loadImage('app/images/obstacle.png'),
};
const sounds = {
  swim: new Audio('app/audio/swim.wav'),
  die: new Audio('app/audio/die.wav'),
  score: new Audio('app/audio/score.wav'),
  highscore: new Audio('app/audio/highscore.wav'),
};

let pipes = [];
let score = 0;
let highScore = Number(localStorage.getItem('jetswim-high-score') || 0);
let gameState = 'ready';
let lastFrame = 0;
let backgroundOffset = 0;
highScoreElement.textContent = highScore;

function loadImage(source) {
  const image = new Image();
  image.src = source;
  return image;
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

function resetGame() {
  player.y = 290;
  player.velocity = 0;
  player.frame = 1;
  score = 0;
  pipes = [createPipe(760), createPipe(1210)];
  scoreElement.textContent = score;
}

function startGame() {
  resetGame();
  gameState = 'playing';
  startPanel.classList.add('is-hidden');
  gameOverPanel.classList.add('is-hidden');
  flap();
}

function flap() {
  if (gameState === 'ready' || gameState === 'over') {
    startGame();
    return;
  }
  if (gameState !== 'playing') return;
  player.velocity = settings.flap;
  player.frame = (player.frame + 1) % 3;
  playSound(sounds.swim);
}

function endGame() {
  if (gameState !== 'playing') return;
  gameState = 'over';
  playSound(sounds.die);
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('jetswim-high-score', highScore);
    highScoreElement.textContent = highScore;
    playSound(sounds.highscore);
    gameOverTitle.textContent = 'New best dive';
    gameOverCopy.textContent = `${score} points. The current is yours now.`;
  } else {
    gameOverTitle.textContent = 'Nice attempt';
    gameOverCopy.textContent = `You made it through ${score} gap${score === 1 ? '' : 's'}. Ready for another run?`;
  }
  gameOverPanel.classList.remove('is-hidden');
}

function update(delta) {
  if (gameState !== 'playing') return;
  const frameScale = Math.min(delta / 16.67, 2);
  player.velocity += settings.gravity * frameScale;
  player.y += player.velocity * frameScale;
  player.frame = Math.floor(Date.now() / 120) % 3;
  backgroundOffset = (backgroundOffset + settings.pipeSpeed * frameScale * 0.25) % WIDTH;

  pipes.forEach((pipe) => {
    pipe.x -= settings.pipeSpeed * frameScale;
    if (!pipe.scored && pipe.x + settings.pipeWidth < player.x) {
      pipe.scored = true;
      score += 1;
      scoreElement.textContent = score;
      playSound(sounds.score);
    }
  });
  if (pipes[0].x + settings.pipeWidth < 0) pipes.shift();
  if (pipes[pipes.length - 1].x < WIDTH - 360) pipes.push(createPipe(WIDTH + 80));

  const playerBox = { x: player.x + 16, y: player.y + 12, width: player.width - 28, height: player.height - 22 };
  const hitCeiling = playerBox.y < 0;
  const hitGround = playerBox.y + playerBox.height > HEIGHT - groundHeight;
  const hitPipe = pipes.some((pipe) => collidesWithPipe(playerBox, pipe, settings));
  if (hitCeiling || hitGround || hitPipe) endGame();
}

function draw() {
  const backgroundReady = assets.background.complete && assets.background.naturalWidth;
  if (backgroundReady) {
    context.drawImage(assets.background, -backgroundOffset, 0, WIDTH, HEIGHT);
    context.drawImage(assets.background, WIDTH - backgroundOffset, 0, WIDTH, HEIGHT);
  } else {
    context.fillStyle = '#0b526a';
    context.fillRect(0, 0, WIDTH, HEIGHT);
  }

  pipes.forEach((pipe) => {
    const obstacleReady = assets.obstacle.complete && assets.obstacle.naturalWidth;
    if (obstacleReady) {
      context.save();
      context.translate(pipe.x + settings.pipeWidth / 2, pipe.gapTop);
      context.rotate(Math.PI);
      context.drawImage(assets.obstacle, -settings.pipeWidth / 2, 0, settings.pipeWidth, pipe.gapTop);
      context.restore();
      const bottomHeight = HEIGHT - groundHeight - (pipe.gapTop + settings.gap);
      context.drawImage(assets.obstacle, pipe.x, pipe.gapTop + settings.gap, settings.pipeWidth, bottomHeight);
    } else {
      context.fillStyle = '#ff7766';
      context.fillRect(pipe.x, 0, settings.pipeWidth, pipe.gapTop);
      context.fillRect(pipe.x, pipe.gapTop + settings.gap, settings.pipeWidth, HEIGHT - groundHeight);
    }
  });

  const octopus = assets.octopus[player.frame];
  if (octopus.complete && octopus.naturalWidth) context.drawImage(octopus, player.x, player.y, player.width, player.height);
  else {
    context.fillStyle = '#ff7766';
    context.beginPath();
    context.arc(player.x + player.width / 2, player.y + player.height / 2, 30, 0, Math.PI * 2);
    context.fill();
  }
}

function gameLoop(timestamp) {
  const delta = lastFrame ? timestamp - lastFrame : 16.67;
  lastFrame = timestamp;
  update(delta);
  draw();
  requestAnimationFrame(gameLoop);
}

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
canvas.addEventListener('pointerdown', (event) => {
  event.preventDefault();
  flap();
});
document.addEventListener('keydown', (event) => {
  if (event.code === 'Space' || event.code === 'Enter') {
    event.preventDefault();
    flap();
  }
});

resetGame();
requestAnimationFrame(gameLoop);
