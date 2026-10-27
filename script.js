
/* ==========================================
   1. CONTADOR ANIMADO DE LIKES
========================================== */
let likesCount = 12000;
const likesElement = document.getElementById("likes-counter");

function updateLikes() {
  if (!likesElement) return;

  likesCount += Math.floor(Math.random() * 15) + 5;
  likesElement.textContent = likesCount.toLocaleString("en-US");
}

setInterval(updateLikes, 2500);


/* ==========================================
   2. PARTÍCULAS ANIMADAS
========================================== */
const canvas = document.getElementById("particle-canvas");
const ctx = canvas?.getContext("2d");
const container = document.querySelector(".card-container");

let particles = [];

function resizeCanvas() {
  if (!canvas || !ctx || !container) return;

  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;

  particles = Array.from({ length: 50 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2.5 + 1,
    speedY: Math.random() * 0.8 + 0.3,
    speedX: (Math.random() - 0.5) * 0.5,
    color: Math.random() > 0.4 ? "#ff0033" : "#ffffff",
    alpha: Math.random() * 0.7 + 0.3
  }));
}

function animateParticles() {
  if (!canvas || !ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.y += p.speedY;
    p.x += p.speedX;

    if (p.y > canvas.height + 10) {
      p.y = -10;
      p.x = Math.random() * canvas.width;
    }

    if (p.x > canvas.width) p.x = 0;
    if (p.x < 0) p.x = canvas.width;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.alpha;
    ctx.shadowBlur = 8;
    ctx.shadowColor = p.color;
    ctx.fill();
  });

  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;

  requestAnimationFrame(animateParticles);
}

if (canvas && ctx) {
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  animateParticles();
}


/* ==========================================
   3. REPRODUCTOR DE MÚSICA
   Archivos locales: assets/0.mp3 y assets/1.mp3
========================================== */

const playlist = [
  {
    title: "酔いどれ知らず",
    artist: "【Kanaria】",
    src: "assets/0.mp3"
  },
  {
    title: "BLEACH",
    artist: "Romaji",
    src: "assets/1.mp3"
  }
];

let currentTrack = 0;

const audio = new Audio();
audio.preload = "metadata";

const playBtn = document.getElementById("play-btn");
const playIcon = document.getElementById("play-icon");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

const titleEl = document.getElementById("song-title");
const artistEl = document.getElementById("song-artist");

const progressBar = document.getElementById("progress-bar");
const progressContainer = document.getElementById("progress-container");

function updatePlayIcon(playing) {
  if (!playIcon) return;

  playIcon.innerHTML = playing
    ? '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>'
    : '<path d="M8 5v14l11-7z"/>';

  if (playBtn) {
    playBtn.title = playing ? "Pausar" : "Reproducir";
  }
}

function loadTrack(index) {
  currentTrack = (index + playlist.length) % playlist.length;

  const track = playlist[currentTrack];

  titleEl.textContent = track.title;
  artistEl.textContent = track.artist;

  audio.src = track.src;
  audio.load();

  if (progressBar) {
    progressBar.style.width = "0%";
  }
}

async function playTrack() {
  try {
    await audio.play();
  } catch (error) {
    console.error("No se pudo reproducir el audio:", audio.src, error);
    updatePlayIcon(false);
  }
}

function pauseTrack() {
  audio.pause();
}

if (playBtn) {
  playBtn.addEventListener("click", () => {
    if (audio.paused) {
      playTrack();
    } else {
      pauseTrack();
    }
  });
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    const wasPlaying = !audio.paused;

    loadTrack(currentTrack - 1);

    if (wasPlaying) playTrack();
  });
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    const wasPlaying = !audio.paused;

    loadTrack(currentTrack + 1);

    if (wasPlaying) playTrack();
  });
}

audio.addEventListener("play", () => updatePlayIcon(true));
audio.addEventListener("pause", () => updatePlayIcon(false));

audio.addEventListener("timeupdate", () => {
  if (audio.duration && progressBar) {
    const percentage = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = percentage + "%";
  }
});

audio.addEventListener("ended", () => {
  loadTrack(currentTrack + 1);
  playTrack();
});

audio.addEventListener("error", () => {
  console.error(
    "Error cargando la canción. Revisa la ruta y el nombre:",
    audio.src,
    audio.error
  );
});

if (progressContainer) {
  progressContainer.addEventListener("click", event => {
    if (!audio.duration) return;

    const rect = progressContainer.getBoundingClientRect();
    const percentage = Math.max(
      0,
      Math.min(1, (event.clientX - rect.left) / rect.width)
    );

    audio.currentTime = percentage * audio.duration;
  });
}

loadTrack(0);
