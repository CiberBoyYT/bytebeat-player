let audioCtx, scriptNode, t = 0, sampleRate = 8000;

function play() {
  if (audioCtx) return;
  sampleRate = parseInt(document.getElementById("sampleRate").value);
  audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: sampleRate });
  scriptNode = audioCtx.createScriptProcessor(1024, 1, 1);
  let formula = document.getElementById("formula").value;

  scriptNode.onaudioprocess = function (e) {
    let buffer = e.outputBuffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++, t++) {
      try {
        buffer[i] = ((eval(formula) & 255) / 128) - 1;
      } catch {
        buffer[i] = 0;
      }
    }
  };

  scriptNode.connect(audioCtx.destination);
}

function stop() {
  if (scriptNode) scriptNode.disconnect();
  if (audioCtx) audioCtx.close();
  audioCtx = null;
  t = 0;
}

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const particles = [];

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 4 + 1;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.size > 0.2) this.size -= 0.05;
  }

  draw() {
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((particle, index) => {
    particle.update();
    particle.draw();
    if (particle.size <= 0.2) particles.splice(index, 1);
  });

  while (particles.length < 100) {
    particles.push(new Particle());
  }

  requestAnimationFrame(animate);
}

animate();
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
