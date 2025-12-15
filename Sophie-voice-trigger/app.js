const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const statusText = document.getElementById("statusText");
const heardText = document.getElementById("heardText");
const hintText = document.getElementById("hintText");
const orb = document.getElementById("orb");

// --- SpeechRecognition support (Chrome/Edge) ---
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = null;
let listening = false;


function containsSophie(phrase) {
  
  const clean = phrase
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  
  return /\bsophie\b/.test(clean);
}

function setStatus(text) {
  statusText.textContent = text;
}

function setHeard(text) {
  heardText.textContent = text || "—";
}

function playAnimation() {
  orb.classList.remove("play");
  
  void orb.offsetWidth;
  orb.classList.add("play");
}

function setupRecognition() {
  if (!SpeechRecognition) return null;

  const r = new SpeechRecognition();
  r.continuous = true;
  r.interimResults = true; 
  r.lang = "en-US";

  r.onstart = () => {
    listening = true;
    setStatus("Listening…");
    hintText.textContent = "Mic is on. Say “Sophie!”";
    startBtn.disabled = true;
    stopBtn.disabled = false;
  };

  r.onend = () => {
    listening = false;
    setStatus("Stopped");
    hintText.textContent = "";
    startBtn.disabled = false;
    stopBtn.disabled = true;
  };

  r.onerror = (e) => {
    setStatus(`Error: ${e.error}`);
    hintText.textContent =
      "If this keeps happening, run the site on https or localhost and allow mic permission.";
  };

  r.onresult = (event) => {
    
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    transcript = transcript.trim();
    if (transcript) setHeard(transcript);

    
    
    if (containsSophie(transcript)) {
      playAnimation();
    }
  };

  return r;
}

function startListening() {
  if (!SpeechRecognition) {
    setStatus("Unsupported");
    hintText.textContent =
      "SpeechRecognition isn’t supported in this browser. Try Chrome/Edge on desktop.";
    return;
  }

  if (!recognition) recognition = setupRecognition();

  try {
    recognition.start(); 
  } catch (err) {
    
    setStatus("Already listening (or blocked).");
  }
}

function stopListening() {
  if (recognition && listening) {
    recognition.stop();
  }
}


startBtn.addEventListener("click", startListening);
stopBtn.addEventListener("click", stopListening);


setStatus("Idle");
hintText.textContent =
  "Tip: Mic access usually requires https or localhost. Use a local server instead of opening the file directly.";
