const weddingDate = new Date("2026-11-01T20:00:00+05:30");

const countdown = () => {
  const now = new Date();
  const diff = weddingDate - now;

  if (diff <= 0) {
    document.getElementById("days").textContent = "00";
    document.getElementById("hours").textContent = "00";
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
};

setInterval(countdown, 1000);
countdown();

const revealOnScroll = () => {
  const reveals = document.querySelectorAll(".reveal");
  reveals.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      el.classList.add("visible");
    }
  });
};

window.addEventListener("scroll", revealOnScroll, { passive: true });
window.addEventListener("load", revealOnScroll);

const openBtn = document.getElementById("openBtn");
const loader = document.getElementById("loader");
const invitationBook = document.querySelector(".invitation-book");

if (openBtn && loader && invitationBook) {
  openBtn.addEventListener("click", () => {
    invitationBook.classList.add("open");
    setTimeout(() => {
      loader.classList.add("hidden");
    }, 500);
  });
}

const scratchCard = document.getElementById("scratchCard");
const canvas = document.getElementById("scratchCanvas");
const progressText = document.getElementById("scratchProgress");
const instruction = document.getElementById("scratchInstruction");

if (scratchCard && canvas && progressText && instruction) {
  const ctx = canvas.getContext("2d");
  const card = scratchCard;
  const scratchArea = { x: 0, y: 0, width: canvas.width, height: canvas.height };

  const resizeCanvas = () => {
    const rect = card.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(ratio, ratio);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(17, 22, 20, 0.95)";
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.globalCompositeOperation = "destination-out";
    scratchArea.width = rect.width;
    scratchArea.height = rect.height;
  };

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  let isDrawing = false;

  const erase = (x, y) => {
    const rect = canvas.getBoundingClientRect();
    const offsetX = x - rect.left;
    const offsetY = y - rect.top;

    if (offsetX < 0 || offsetY < 0 || offsetX > rect.width || offsetY > rect.height) {
      return;
    }

    ctx.beginPath();
    ctx.arc(offsetX, 0, 22, 0, Math.PI * 2);
    ctx.fill();

    const scratchX = offsetX;
    const scratchY = offsetY;

    ctx.beginPath();
    ctx.arc(scratchX, scratchY, 24, 0, Math.PI * 2);
    ctx.fill();

    const total = scratchArea.width * scratchArea.height;
    let cleared = 0;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
      if (imageData.data[i + 3] === 0) {
        cleared++;
      }
    }

    const revealPercent = Math.min((cleared / total) * 100, 100);
    progressText.textContent = `${Math.round(revealPercent)}% revealed`;

    if (revealPercent > 50) {
      instruction.style.opacity = "0";
      instruction.style.transition = "opacity 0.4s ease";
    }
  };

  canvas.addEventListener("pointerdown", (event) => {
    isDrawing = true;
    erase(event.clientX, event.clientY);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!isDrawing) return;
    erase(event.clientX, event.clientY);
  });

  canvas.addEventListener("pointerup", () => {
    isDrawing = false;
  });

  canvas.addEventListener("pointerleave", () => {
    isDrawing = false;
  });
}

const musicBtn = document.getElementById("musicBtn");
const audio = document.getElementById("bgAudio");

if (musicBtn && audio) {
  musicBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().catch(() => {
        console.log("Audio playback blocked until user interaction.");
      });
      musicBtn.textContent = "♫";
    } else {
      audio.pause();
      musicBtn.textContent = "♪";
    }
  });
}
