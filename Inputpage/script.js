// ================= INPUT LOGIC =================
let knowsHR = false;

function chooseYes() {
    knowsHR = true;
    document.getElementById("hrrest").classList.remove("hidden");
}

function chooseNo() {
    knowsHR = false;
    document.getElementById("hrrest").classList.add("hidden");
    document.getElementById("hrrest").value = "";
}

function goToResult() {
    let age = document.getElementById("age").value;
    let hr = document.getElementById("hrrest").value;

    if (!age) {
        alert("Please enter age");
        return;
    }

    localStorage.setItem("age", age);
    localStorage.setItem("hrrest", knowsHR ? hr : "");

    // ✅ Redirect to result page
    window.location.href = "../Outputpage/result.html";
}

// ================= ECG SOUND (UNCHANGED) =================
window.addEventListener("load", () => {
    const sound = document.getElementById("ecgSound");

    // autoplay try
    sound.play().catch(() => {});

    // fallback click
    document.body.addEventListener("click", () => {
        sound.play();
    }, { once: true });
});


// ================= ULTRA REALISTIC ECG =================
const canvas = document.getElementById("ecgCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let baseline = canvas.height / 2;
let t = 0;
let speed = 1.8; // controls ECG speed only (not sound)

// Gaussian curve for smooth ECG
function gaussian(x, mean, width, height) {
    return height * Math.exp(-Math.pow(x - mean, 2) / (2 * width * width));
}

// Real ECG waveform (PQRST)
function ecgWave(x) {
    let cycleLength = 180;
    let phase = x % cycleLength;

    let y = 0;

    // P wave
    y += gaussian(phase, 25, 6, -8);

    // Q wave
    y += gaussian(phase, 60, 3, 10);

    // R wave (main spike)
    y += gaussian(phase, 65, 2, -90);

    // S wave
    y += gaussian(phase, 70, 3, 35);

    // T wave
    y += gaussian(phase, 110, 14, -22);

    // slight natural noise
    y += Math.sin(x * 0.03) * 2;

    return y;
}

function drawECG() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = "#ff2d2d";

    // glow base
    ctx.shadowColor = "#ff2d2d";

    let phase = t % 180;

    // 💓 glow pulse only visual (NOT linked to sound)
    if (phase > 63 && phase < 68) {
        ctx.shadowBlur = 28;
    } else {
        ctx.shadowBlur = 10;
    }

    for (let i = 0; i < canvas.width; i++) {
        let y = baseline + ecgWave(i + t);

        if (i === 0) ctx.moveTo(i, y);
        else ctx.lineTo(i, y);
    }

    ctx.stroke();

    t += speed;

    requestAnimationFrame(drawECG);
}

drawECG();


// ================= RESIZE FIX =================
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    baseline = canvas.height / 2;
});