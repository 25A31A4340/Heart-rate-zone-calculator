/* ═══════════════════════════════════════════════
   Heart Rate Zone Calculator — script.js
   Theme : Slate Blue
   ═══════════════════════════════════════════════ */

/* ─────────────────────────────────────────────
   LIVE CLOCK
───────────────────────────────────────────── */
function tick() {
  const now = new Date();
  const pad = v => String(v).padStart(2, '0');
  document.getElementById('clock').textContent =
    pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
}
setInterval(tick, 1000);
tick();

/* ─────────────────────────────────────────────
   SIMULATED LIVE BPM COUNTER
───────────────────────────────────────────── */
let bpm = 72;
setInterval(() => {
  bpm = Math.max(65, Math.min(80, bpm + (Math.random() - 0.5) * 2));
  document.getElementById('live-bpm').textContent = Math.round(bpm);
}, 800);

/* ─────────────────────────────────────────────
   BLOOD-CELL PARTICLE SYSTEM
   Particles are slate-blue toned
───────────────────────────────────────────── */
const canvas = document.getElementById('particle-canvas');
const ctx    = canvas.getContext('2d');
let W, H;
let particles = [];

function resize() {
  W = canvas.width  = innerWidth;
  H = canvas.height = innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
  constructor() {
    /* Spawn near the heart centre */
    const angle  = Math.random() * Math.PI * 2;
    const radius = 30 + Math.random() * 60;
    this.x = W / 2 + Math.cos(angle) * radius;
    this.y = H / 2 + Math.sin(angle) * radius;

    /* Flow outward */
    const speed = 0.4 + Math.random() * 0.8;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;

    this.life    = 0;
    this.maxLife = 120 + Math.random() * 160;
    this.r       = 1.5 + Math.random() * 2;

    /* Slate-blue colour range */
    const cr = (50  + Math.random() * 40) | 0;
    const cg = (80  + Math.random() * 50) | 0;
    const cb = (180 + Math.random() * 60) | 0;
    this.colorBase = `rgba(${cr},${cg},${cb},`;
  }

  update() {
    this.x  += this.vx;
    this.y  += this.vy;
    this.vx *= 0.995;
    this.vy *= 0.995;
    this.life++;
  }

  draw() {
    const alpha = Math.sin((this.life / this.maxLife) * Math.PI) * 0.65;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.colorBase + alpha + ')';
    ctx.fill();
  }

  isDead() {
    return this.life >= this.maxLife;
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, W, H);

  if (Math.random() < 0.18) particles.push(new Particle());

  particles = particles.filter(p => !p.isDead());
  particles.forEach(p => { p.update(); p.draw(); });

  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ─────────────────────────────────────────────
   HEARTBEAT SOUND  (Web Audio API)
   The sound button is hidden on the homepage.
   Sound still plays on the first user click.
───────────────────────────────────────────── */
let audioCtx     = null;
let soundOn      = true;
let beatInterval = null;

function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

/* "Lub" — low sine sweep with warm distortion */
function lub(time, gain) {
  const osc  = audioCtx.createOscillator();
  const g    = audioCtx.createGain();
  const dist = audioCtx.createWaveShaper();

  const curve = new Float32Array(256);
  for (let i = 0; i < 256; i++) {
    const x = i * 2 / 256 - 1;
    curve[i] = x < 0 ? -Math.pow(-x, 0.7) : Math.pow(x, 0.7);
  }
  dist.curve = curve;

  osc.connect(dist);
  dist.connect(g);
  g.connect(audioCtx.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(80, time);
  osc.frequency.exponentialRampToValueAtTime(38, time + 0.12);

  g.gain.setValueAtTime(0, time);
  g.gain.linearRampToValueAtTime(gain, time + 0.015);
  g.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

  osc.start(time);
  osc.stop(time + 0.22);
}

/* "Dub" — shorter, slightly higher thud */
function dub(time, gain) {
  const osc = audioCtx.createOscillator();
  const g   = audioCtx.createGain();

  osc.connect(g);
  g.connect(audioCtx.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(100, time);
  osc.frequency.exponentialRampToValueAtTime(48, time + 0.09);

  g.gain.setValueAtTime(0, time);
  g.gain.linearRampToValueAtTime(gain * 0.65, time + 0.012);
  g.gain.exponentialRampToValueAtTime(0.001, time + 0.13);

  osc.start(time);
  osc.stop(time + 0.16);
}

/* Low-frequency body noise for realism */
function bodyNoise(time, duration, gain) {
  const bufLen = audioCtx.sampleRate * duration;
  const buf    = audioCtx.createBuffer(1, bufLen, audioCtx.sampleRate);
  const data   = buf.getChannelData(0);

  for (let i = 0; i < bufLen; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.4;
  }

  const src  = audioCtx.createBufferSource();
  const filt = audioCtx.createBiquadFilter();
  const g    = audioCtx.createGain();

  filt.type            = 'lowpass';
  filt.frequency.value = 90;

  src.buffer = buf;
  src.connect(filt);
  filt.connect(g);
  g.connect(audioCtx.destination);

  g.gain.setValueAtTime(0, time);
  g.gain.linearRampToValueAtTime(gain, time + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, time + duration);

  src.start(time);
  src.stop(time + duration);
}

/* Fire one complete lub-dub cycle */
function playHeartbeat() {
  if (!audioCtx || !soundOn) return;

  const t = audioCtx.currentTime + 0.01;
  lub(t, 0.55);
  bodyNoise(t, 0.20, 0.08);
  dub(t + 0.22, 0.55);
  bodyNoise(t + 0.22, 0.14, 0.06);

  /* Visual flash on corners */
  document.body.classList.add('beat');
  setTimeout(() => document.body.classList.remove('beat'), 200);
}

function startBeats() {
  if (beatInterval) return;
  playHeartbeat();
  beatInterval = setInterval(playHeartbeat, (60 / 72) * 1000); /* 72 BPM */
}

function stopBeats() {
  clearInterval(beatInterval);
  beatInterval = null;
}

/* Toggle — called by the hidden sound button */
function toggleSound() {
  initAudio();
  soundOn = !soundOn;

  document.getElementById('soundIcon').textContent  = soundOn ? '🔊' : '🔇';
  document.getElementById('soundLabel').textContent = soundOn ? 'Heartbeat On' : 'Heartbeat Off';

  soundOn ? startBeats() : stopBeats();
}

/* Auto-start on very first user interaction */
let audioStarted = false;

function firstInteraction() {
  if (audioStarted) return;
  audioStarted = true;
  initAudio();
  if (soundOn) startBeats();
  document.removeEventListener('click',   firstInteraction);
  document.removeEventListener('keydown', onKey);
}

function onKey(e) {
  firstInteraction();
  if (e.key === 'Enter') goToInput();
}

function goToInput() {
  window.location.href = "../Inputpage/input.html";
}

document.addEventListener('click',   firstInteraction);
document.addEventListener('keydown', onKey);