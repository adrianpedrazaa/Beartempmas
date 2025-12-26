const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const bgMusic = document.getElementById("bgMusic");
const message = document.getElementById("message"); 

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

function playAnimation() {
  if (document.body.classList.contains("Trigger") || document.body.classList.contains("Active")) {
    return;
  }

  
  document.body.classList.add("Trigger");

  
  setTimeout(() => {
    document.body.classList.remove("Trigger");
    document.body.classList.add("Active");
    
    
    if (message) message.classList.add("show");
    
  }, 1000); 
}

function setupRecognition() {
  if (!SpeechRecognition) return null;

  const r = new SpeechRecognition();
  r.continuous = true;
  r.interimResults = true; 
  r.lang = "en-US";

  r.onstart = () => {
    listening = true;
    console.log("Listening started...");
  };

  r.onend = () => {
    listening = false;
    console.log("Listening stopped. Restarting...");
    if (recognition) recognition.start();
  };

  r.onerror = (e) => {
    console.error("Speech recognition error", e.error);
  };

  r.onresult = (event) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    
    if (containsSophie(transcript)) {
      playAnimation();
    }
  };

  return r;
}

function startListening() {
  if (!SpeechRecognition) {
    alert("Speech Recognition not supported in this browser.");
    return;
  }

  if (!recognition) recognition = setupRecognition();

  if (!listening) {
    try {
      recognition.start();
    } catch (err) {
      console.log("Already started or blocked");
    }
  }
}

document.addEventListener("click", () => {
  startListening();
  if (bgMusic) {
    bgMusic.volume = 0.3;
    bgMusic.play().catch(e => console.log("Audio play failed:", e));
  }
}, { once: true });