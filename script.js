const words = [
  "cat", "dog", "sun", "moon", "tree", "book", "fish", "star", "rain", "wind", "fire", "snow", "lamp", "door", 
  "gold", "leaf", "mole", "rock", "milk", "king", "apple", "grape", "house", "plant", "river", "cloud", 
  "tiger", "music", "light", "ocean", "inventing", "printing", "management", "bigger", "void", "computer", 
  "engineering", "typing", "grapefruit", "video", "eye", "quit", "told", "bottom", "trunk", "eye", 
  "paragraph", "dealt", "album", "serves", "edited", "closing", "post", "rids", "white", "just", "feeling", 
  "build", "falls", "bet", "failing", "falling", "gaming", "typing", "coding", "stating", "saying", 
  "difficult", "receive", "achieve", "random", "bear", "experience", "nowadays", "oil", "ages", "lack", 
  "street", "kill", "bones", "hope", "wonders", "teaching", "supervise", "bully", "nepotism", "bully", "hat", 
  "box", "pen", "map", "cup", "key", "red", "game", "jump", "bird", "mouse", "water",  "table", "chair", 
  "green", "school", "animal", "", "flower", "bottle", "guitar", "piano", "bass", "orange", "planet", 
  "camera", "rabbit", "keyboard", "bicycle", "teacher", "student", "morning", "rainbow", "airport", "chicken", 
  "monster", "butterfly", "notebook", "hamburger", "chocolate", "pineapple", "adventure", "basketball", 
  "baseball", "volleyball", "swimming", "javascript", "football", "car", "bus", "sky", "sea", "bed", "egg", 
  "ice", "fox", "pig", "cow", "ant", "bee", "bag", "arm", "leg", "run", "hop", "sit", "head", "skull", "frog", 
  "lion", "duck", "goat", "ship", "boat", "road", "sand", "ball", "sock", "shoe", "hand", "face", "wall", 
  "beach", "bread", "candy", "grass", "smile", "pizza", "robot", "train", "truck", "phone", "clock", "brush", 
  "snake", "horse", "whale", "lemon", "dolphin", "forest", "island", "jungle", "rocket", "castle", "pencil",
  "jacket", , "mirror", "window", "wallet", "soccer", "summer", "winter", "purple", "silver", "yellow", 
  "banana", "cookie", "monkey", "airplane", "drawing", "reading", "dancing", "cooking", "running", "singing", 
  "teacher", "library", "village", "country", "evening", "sunshine", "popcorn", "bedroom", "kitchen", 
  "sandwich", "thunder", "elephant", "dinosaur", "mountain", "calendar", "hospital", "classroom", "umbrella", 
  "television", "spaceship", "waterfall", "backpack", "strawberry", "watermelon", "friendship", "playground", 
  "microphone", "earthquake"
];

// --- page elements ---
// receives a reference or can access <div> elements
const usernameScreen = document.getElementById("usernameScreen");
const usernameInput = document.getElementById("usernameInput");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const gameScreen = document.getElementById("gameScreen");
const playerNameEl = document.getElementById("playerName");

const mounds = document.querySelectorAll(".mound");
const wordInput = document.getElementById("wordInput");
const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const levelScreen = document.getElementById("levelScreen");
const levelNumberEl = document.getElementById("levelNumber");
const levelHintEl = document.getElementById("levelHint");
const livesEl = document.getElementById("lives");
const heartsEl = document.getElementById("hearts");
const timerFill = document.getElementById("timerFill");
const timerLabel = document.getElementById("timerLabel");
const messageEl = document.getElementById("message");
const gameEl = document.getElementById("game");
const wrapperEl = document.querySelector(".wrapper");
const scoreListEl = document.getElementById("scoreList");

const gameOverEl = document.getElementById("gameOver");
const finalScoreEl = document.getElementById("finalScore");
const playAgainBtn = document.getElementById("playAgainBtn");
const newPlayerBtn = document.getElementById("newPlayerBtn");

// ================= SOUND EFFECTS =================
// Every sound is made by the browser itself (Web Audio API), so no sound files are needed.
// Browsers only allow sound after the player has clicked something; the Start button takes care of that.
// variables for the sound effects, not yet assigned

let audioCtx = null;    // audio system that processes and play the data (the recording studio)
let masterGain = null;  // volume control
let noiseBuffer = null; // stores the sound data (recorded song), tigkupot sa sound
let soundOn = true;     // on ang sound daan unless idisable

function getAudio() { 
  
  // checks whether an audio system already exists, whether the browser supports it, and creates one if needed
  if (!audioCtx) {                                                // audioCtx - actual audio system, AudioCtx - constructor (blueprint)
    const AudioCtx = window.AudioContext || window.webkitAudioContext; // check which audio-system constructor is available
    if (!AudioCtx) return null; 
    audioCtx = new AudioCtx();                                         // creates audio system and stores it in audioCtx

    // a compressor stops the loud moments (the hammer hit) from distorting
    const compressor = audioCtx.createDynamicsCompressor(); // control sudden differences in sound volume
    masterGain = audioCtx.createGain();                     // creates GainNode, volume control
    masterGain.gain.value = soundOn ? 0.8 : 0;              // sets the volume level, if soundOn true, 0.8, if false, 0
    masterGain.connect(compressor);                         // connects masterGain to the compressor
    compressor.connect(audioCtx.destination);               // connects the compressor to the speakers

    // one second of random noise, reused for whooshes, crashes and glass crackles
    noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate, audioCtx.sampleRate); 
    //"1" for mono, one audio channel, every speaker plays the exact same sound, "2" for stereo, two independent channels: left and right
    // first "adioCtx.simpleRate" asks how many samples, second one asks how fast are the samples
 
    const data = noiseBuffer.getChannelData(0); // gets access to the samples inside noiseBuffer that u can modify, on channel 0 or first and only audio channel
    
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;  // give each sound samples a random value
    // "Math.random()" - js function that generates a random decimal number (0 up to, not including, 1)
  }
  if (audioCtx.state === "suspended") audioCtx.resume();  // if the audio system is paused, turn it back on
  // "===" means "exactly equal to"; "suspended" - pause, "running" - play
  
  return audioCtx; // returns to function again
}

// a musical beep or squeak; the pitch can slide from freq to freqEnd
function tone({ type = "sine", freq, freqEnd, start = 0, dur = 0.2, vol = 0.2, attack = 0.01, vibrato = 0 }) {
// "tone" - think of it as a custom sound-making machine; "sine" - shape of the sound wave - smooth, pure tone
// "start = 0" means start immediately; "attack" - fade in; "vibrato" - create a wobbling sound
// all in milliseconds

  const ctx = getAudio();             // get the game's audio system and store it in ctx
  if (!ctx || !soundOn) return;       // checks if there is an audio system and sound is turned on, if no, the function stops
  const t0 = ctx.currentTime + start; // when the sound should play

  const osc = ctx.createOscillator();           // creates a sound generator that produces a repeating sound wave
  const env = ctx.createGain();                 // "env" - envelope, controls how a sound's volume changes over time (e.g. fade in & out)
  osc.type = type;                                          // shape of the sound wave
  osc.frequency.setValueAtTime(freq, t0);                   // sets the frequency of a sound at a specific time
  if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, t0 + dur); // changes the sound's pitch smoothly from its starting   freq to freqEnd
  env.gain.setValueAtTime(0.0001, t0);                      // set initial volume to extremely quiet
  env.gain.exponentialRampToValueAtTime(vol, t0 + attack);  // gradually increases volume to target volume w/in attack
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);  // gradually decreases volume after dur
  osc.connect(env);                                         // connects oscillator to volume control
  env.connect(masterGain);                                  // connects indiv sound volume to main volume control

  if (vibrato) {                        // wobbles the pitch (used for the sad "waaah")
    const lfo = ctx.createOscillator(); // creates another oscilattor and stores it in "lfo" - low freq osc
    const depth = ctx.createGain();     // creates a GainNode that controls how much a pitch wobbles
    lfo.frequency.value = 6;            // sets the speed of vibrato to 6 Hz, meaning 6 cycles per second
    depth.gain.value = vibrato;         // sets how strong the pitch wobble will be or how far it moves ↑ & ↓
    lfo.connect(depth);                 // connects lfo to depth
    depth.connect(osc.frequency);       // connects vibrato effect to main sound's pitch
    lfo.start(t0);                      // start lfo at t0
    lfo.stop(t0 + dur + 0.05);          // stop after the sound has finished
  }

  osc.start(t0);              // starts the oscillator at t0
  osc.stop(t0 + dur + 0.05);  // stops the oscillator
}

// a burst of "static": whooshes, thuds, glass crackles
function noise({ start = 0, dur = 0.2, vol = 0.3, filter = "lowpass", freq = 1000, freqEnd, q = 1 }) { 
// "filter" changes the sound by reducing certain freq; "lowpass" makes the sound deeper or muffled
// "q" controls how strong certain freq/sound should be emphasized

  // same code as lines 89, 90, & 91
  // prepare audio system for playing noise
  const ctx = getAudio();
  if (!ctx || !soundOn) return;
  const t0 = ctx.currentTime + start;

  const src = ctx.createBufferSource();   // creates sound player
  src.buffer = noiseBuffer;               // where the sound is stored
  src.loop = true;                        // repeat the sound

  const f = ctx.createBiquadFilter();     // allows specific freq/noise to pass through
  f.type = filter;                        // refer to filter on line 120
  f.Q.value = q;                          
  f.frequency.setValueAtTime(freq, t0);   // sets starting frequency
  if (freqEnd) f.frequency.exponentialRampToValueAtTime(freqEnd, t0 + dur);   // smoothly changes the freq

  const env = ctx.createGain();                                 // creates volume controller for this sound
  env.gain.setValueAtTime(0.0001, t0);                          // same as line 98
  env.gain.exponentialRampToValueAtTime(vol, t0 + Math.min(0.01, dur / 3));   // quick fade-in
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);      // same as line 100, fade out

  src.connect(f);                       // connects sound player to filter
  f.connect(env);                       // connects filter to volume controller
  env.connect(masterGain);              // connects volume controller to main volume controller
  src.start(t0, Math.random() * 0.5);   // starts the noise at a specific time, using random starting point
  src.stop(t0 + dur + 0.05);            // sched for stopping the noise
}

// a rattling, rough "grrrr"
// same ra sa codes above
function growl({ start = 0, dur = 0.6, vol = 0.3, freq = 120 }) {
  const ctx = getAudio();
  if (!ctx || !soundOn) return;
  const t0 = ctx.currentTime + start;

  // the voice is switched on and off about 28 times a second, which makes it rattle
  const am = ctx.createGain(); 
  am.gain.value = 0.5;
  const lfo = ctx.createOscillator();
  const depth = ctx.createGain();
  lfo.frequency.value = 28;
  depth.gain.value = 0.5;
  lfo.connect(depth);
  depth.connect(am.gain);

  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.Q.value = 5;
  lp.frequency.setValueAtTime(1100, t0);
  lp.frequency.exponentialRampToValueAtTime(300, t0 + dur);

  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t0);
  env.gain.exponentialRampToValueAtTime(vol, t0 + 0.04);
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

  [["sawtooth", 1], ["square", 1.5]].forEach(([type, mult]) => {   // runs the code twice, for each value
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq * mult, t0);
    osc.frequency.exponentialRampToValueAtTime(freq * mult * 0.6, t0 + dur);
    osc.connect(am);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  });

  am.connect(lp);
  lp.connect(env);
  env.connect(masterGain);
  lfo.start(t0);
  lfo.stop(t0 + dur + 0.05);
}

// --- the actual sound effects ---

// the game starts: a quick happy "ta-da" run
function startSound() {
  [523, 659, 784, 1047].forEach((f, i) => {
    tone({ type: "triangle", freq: f, start: i * 0.08, dur: 0.18, vol: 0.14 });
  });
}

// a new mole pops out of its hole: a soft "boop"
function popSound() {
  tone({ type: "sine", freq: 300, freqEnd: 620, start: 0.15, dur: 0.09, vol: 0.1 });
}

// right answer: the mole squeaks "yay!" and a little sparkle plays
function happySound() {
  tone({ type: "triangle", freq: 650, freqEnd: 1000, start: 0, dur: 0.12, vol: 0.22 });
  tone({ type: "triangle", freq: 850, freqEnd: 1300, start: 0.11, dur: 0.14, vol: 0.22 });
  tone({ type: "triangle", freq: 1100, freqEnd: 1700, start: 0.23, dur: 0.2, vol: 0.22 });
  [1047, 1319, 1568, 2093].forEach((f, i) => {
    tone({ type: "sine", freq: f, start: 0.3 + i * 0.07, dur: 0.18, vol: 0.1 });
  });
}

// a short rising fanfare when the player reaches a new level (plays right after the happy sound)
function levelUpSound() {
  [523, 659, 784, 1047].forEach((f, i) => {
    tone({ type: "square", freq: f, start: 0.5 + i * 0.09, dur: 0.14, vol: 0.08 });
  });
}

// wrong answer or out of time: the mole screeches and growls angrily
function angrySound() {
  growl({ dur: 0.7, vol: 0.35, freq: 130 });
  tone({ type: "sawtooth", freq: 500, freqEnd: 1100, dur: 0.18, vol: 0.12 });
  tone({ type: "sawtooth", freq: 900, freqEnd: 400, start: 0.18, dur: 0.3, vol: 0.1, vibrato: 20 });
}

// the whole game over scene. The times (in seconds) match the animation in style.css:
// 0.76 = the hammer hits, 1.45 = the screen turns red, 1.7 = GAME OVER pops up
function gameOverSounds() {
  // 0.0  the mole pulls out the hammer: a "pop" and an angry mutter
  tone({ type: "sine", freq: 250, freqEnd: 700, dur: 0.12, vol: 0.18 });
  growl({ start: 0.1, dur: 0.55, vol: 0.2, freq: 95 });

  // 0.3  the hammer handle creaks as it is pulled back
  tone({ type: "sawtooth", freq: 160, freqEnd: 240, start: 0.3, dur: 0.25, vol: 0.05, vibrato: 10 });

  // 0.45 the swing: a whoosh that gets higher as the hammer comes closer
  noise({ start: 0.45, dur: 0.32, vol: 0.4, filter: "bandpass", freq: 250, freqEnd: 2800, q: 1.5 });

  // 0.76 IMPACT: a deep boom and a crash
  tone({ type: "sine", freq: 150, freqEnd: 30, start: 0.76, dur: 0.7, vol: 0.8, attack: 0.005 });
  noise({ start: 0.76, dur: 0.35, vol: 0.7, filter: "lowpass", freq: 3000, freqEnd: 150 });

  // 0.77 the glass cracks: a sharp snap, then crackling that spreads across the screen
  noise({ start: 0.77, dur: 0.1, vol: 0.5, filter: "highpass", freq: 2500 });
  for (let i = 0; i < 16; i++) {
    noise({
      start: 0.82 + i * 0.024 + Math.random() * 0.015,
      dur: 0.05,
      vol: 0.28 * (1 - i / 20),
      filter: "bandpass",
      freq: 2000 + Math.random() * 4000,
      q: 8
    });
  }

  // 0.95 little pieces of glass tinkle as they fall
  for (let i = 0; i < 8; i++) {
    tone({ type: "sine", freq: 2200 + Math.random() * 2400, start: 0.95 + i * 0.09 + Math.random() * 0.05, dur: 0.14, vol: 0.05 });
  }

  // 1.45 the hammer is pulled away and the screen turns red: a low, scary hum
  noise({ start: 1.45, dur: 0.3, vol: 0.18, filter: "bandpass", freq: 2000, freqEnd: 300, q: 1.5 });
  tone({ type: "sawtooth", freq: 58, freqEnd: 44, start: 1.45, dur: 1.4, vol: 0.12, attack: 0.3 });

  // 1.7  GAME OVER pops up: a heavy hit, then a sad "wah wah wah waaah"
  tone({ type: "sine", freq: 120, freqEnd: 50, start: 1.7, dur: 0.4, vol: 0.5 });
  noise({ start: 1.7, dur: 0.2, vol: 0.3, filter: "lowpass", freq: 1500, freqEnd: 200 });
  [[392, 1.75, 0.24], [370, 2.0, 0.24], [349, 2.25, 0.24], [330, 2.5, 0.9]].forEach(([f, s, d], i) => {
    tone({ type: "sawtooth", freq: f, start: s, dur: d, vol: 0.1, vibrato: i === 3 ? 8 : 0 });
  });
}

// --- game state ---
let playerName = "Player";
let score = 0;
let lives = 3;
let currentMound = null;
let currentWord = "";
let timeLimit = 3000;   // ms the mole stays up, shrinks as score increases
let timeLeft = 0;
let timerInterval = null;
let gameRunning = false;
let level = 1;          // current level, higher level = longer words
let levelTimeout = null; // timer of the "Level N" pop-up, so it can be cancelled on restart
let wordTime = 3000;    // ms for the CURRENT word (timeLimit + extra time for long words)

// --- levels ---
// each level only uses words whose length (number of letters) is inside its range
// the last level has no top limit, so it keeps using the longest words
const levelRanges = [
  { min: 1, max: 4 },     // level 1: short words (cat, moon, tree)
  { min: 5, max: 6 },     // level 2: medium words (apple, tiger, typing)
  { min: 7, max: 8 },     // level 3: long words (printing, computer)
  { min: 9, max: 99 }     // level 4 and up: very long words (management, engineering)
];
const wordsPerLevel = 10; // correct words needed to go up one level

function randomWord() {
  // use the range of the current level (level 5 and up keep using the last range)
  const range = levelRanges[Math.min(level, levelRanges.length) - 1];
  const levelWords = words.filter(w => w.length >= range.min && w.length <= range.max);

  // safety: if a level has no words, use the whole list
  const list = levelWords.length > 0 ? levelWords : words;
  return list[Math.floor(Math.random() * list.length)];
}

// shows the "Level N" screen, PAUSES the game for 1.8 seconds, then runs whatToDoNext (the game continues)
function showLevelScreen(whatToDoNext) {
  gameRunning = false;                 // Enter does nothing while the game is paused
  clearInterval(timerInterval);        // timer is stopped too
  levelNumberEl.textContent = "Level " + level;
  levelHintEl.textContent = level === 1 ? "Type the word before time runs out!" : "The words are longer now!";
  levelScreen.classList.remove("hidden");

  // restart the pop animation every time it shows
  const box = levelScreen.querySelector(".level-box");
  box.style.animation = "none";
  box.offsetWidth;                     // forces the browser to notice the change
  box.style.animation = "";

  clearTimeout(levelTimeout);
  levelTimeout = setTimeout(() => {
    levelScreen.classList.add("hidden");
    gameRunning = true;
    wordInput.focus();
    whatToDoNext();
  }, 1800);
}

function randomMound() {
  return mounds[Math.floor(Math.random() * mounds.length)];
}

function showLives() {
  livesEl.textContent = lives;
  // red hearts for the lives left, grey hearts for the lives lost
  heartsEl.innerHTML = "<span class='heart'>♥</span>".repeat(lives) + "<span class='heart lost'>♥</span>".repeat(Math.max(0, 3 - lives));
}

// Puts the word on the mole's sign. Longer words make the WHOLE mole a bit bigger (same shape,
// up to 1.4x) and the text is shrunk just enough to fit on the sign.
function fitWordOnSign(mound, word) {
  const label = mound.querySelector(".word-label");
  const mole = mound.querySelector(".mole");

  // bigger mole for longer words (higher levels): 1x up to 4 letters, then +0.1 per letter, max 1.8x
  // the holes are big now, so the word keeps its normal size instead of shrinking
  const scale = Math.min(1.8, Math.max(1, 1 + (word.length - 4) * 0.1));
  mole.style.setProperty("--s", scale.toFixed(2));

  // writes the selected word on the mole's sign
  label.textContent = word;
  let size = 18;
  label.style.fontSize = size + "px";

  // only if the sign is still wider than the hole (very long word, small window), the text shrinks a little
  const maxSign = mound.offsetWidth * 0.9 / scale;
  while (label.offsetWidth > maxSign && size > 12) {
    size--;
    label.style.fontSize = size + "px";
  }
}

function popMole() {
  currentMound = randomMound();
  currentWord = randomWord();

  fitWordOnSign(currentMound, currentWord);

  currentMound.classList.remove("attack");
  currentMound.classList.add("up");

  // longer words need more typing time: +0.15 seconds for every letter after the 4th
  wordTime = timeLimit + Math.max(0, currentWord.length - 4) * 150;

  timeLeft = wordTime;
  timerFill.style.width = "100%";
  timerFill.classList.remove("low");
  timerLabel.textContent = "Time: " + Math.ceil(wordTime / 1000);

  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 50);
  popSound();
}

function updateTimer() {
  timeLeft -= 50;
  const percent = Math.max(0, (timeLeft / wordTime) * 100);
  timerFill.style.width = percent + "%";
  timerFill.classList.toggle("low", percent < 35);
  timerLabel.textContent = "Time: " + Math.max(0, Math.ceil(timeLeft / 1000));

  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    moleHits();
  }
}

function moleHits() {
  clearInterval(timerInterval);
  gameRunning = false; // ignore Enter presses while the mole attacks
  lives--;
  showLives();
  angrySound();

  // mole jumps all the way out of the hole and whacks the player
  currentMound.classList.add("attack");
  gameEl.classList.add("shake", "flash");
  setTimeout(() => gameEl.classList.remove("shake", "flash"), 400);
  messageEl.textContent = "Ouch! The mole got you!";

  wordInput.value = "";

  // last life: the mole stays out of its hole, glares for a moment, then pulls out a hammer
  if (lives <= 0) {
    messageEl.textContent = "";
    setTimeout(endGame, 900);
    return;
  }

  setTimeout(() => {
    currentMound.classList.remove("up", "attack");
    currentMound.querySelector(".word-label").textContent = "";
    gameRunning = true;
    popMole();
  }, 600);
}

function moleCaught() {
  score++;
  scoreEl.textContent = score;
  messageEl.textContent = "Nice! Caught it!";
  happySound();

  let leveledUp = false;

  // level up after every 10 correct words (score 10 = level 2, score 20 = level 3, ...)
  const newLevel = Math.floor(score / wordsPerLevel) + 1;
  if (newLevel > level) {
    level = newLevel;
    levelEl.textContent = level;
    messageEl.textContent = "";
    levelUpSound();
    leveledUp = true;
  }

  clearInterval(timerInterval);
  currentMound.classList.remove("up");
  currentMound.querySelector(".word-label").textContent = "";
  wordInput.value = "";

  // slowly speed the game up, minimum 2 seconds
  timeLimit = Math.max(2000, timeLimit - 100);

  if (leveledUp) {
    showLevelScreen(popMole);   // pause and show "Level N", then the next mole comes out
  } else {
    popMole();
  }
}

function checkInput() {
  if (!gameRunning) return;

  if (wordInput.value.trim().toLowerCase() === currentWord.toLowerCase()) {
    moleCaught();
  } else {
    // wrong word submitted on Enter: costs a life right away
    moleHits();
  }
}

function startGame() {
  score = 0;
  lives = 3;
  level = 1;
  timeLimit = 3000;
  scoreEl.textContent = score;
  levelEl.textContent = level;
  showLives();
  messageEl.textContent = "";
  timerLabel.textContent = "Time: 3";
  gameRunning = true;
  gameOverEl.classList.add("hidden");
  levelScreen.classList.add("hidden");   // in case a restart happened during the "Level N" screen
  clearTimeout(levelTimeout);
  startSound();

  wordInput.disabled = false;
  wordInput.value = "";
  wordInput.focus();

  mounds.forEach(m => {
    m.classList.remove("up", "attack", "smash");
    m.querySelector(".word-label").textContent = "";
  });

  showLevelScreen(popMole);   // "Level 1" screen first, then the first mole comes out
}

function endGame() {
  gameRunning = false;
  clearTimeout(levelTimeout);
  clearInterval(timerInterval);
  wordInput.disabled = true;
  wordInput.value = "";
  timerFill.style.width = "0%";
  timerLabel.textContent = "Time: 0";
  messageEl.textContent = "";

  saveScore(playerName, score);
  renderScoreboard();

  // the hammer will smash the screen right where the angry mole is standing
  // (the hammer head lands in the middle of the mole, about 102px down from its top at normal size)
  const moleBox = currentMound.querySelector(".mole").getBoundingClientRect();
  gameOverEl.style.setProperty("--hx", (moleBox.left + moleBox.width / 2) + "px");
  gameOverEl.style.setProperty("--hy", (moleBox.top + moleBox.height * (102 / 140)) + "px");

  // hammer slam -> cracks -> game over screen (all animated in CSS)
  finalScoreEl.textContent = playerName + ", your score: " + score;
  gameOverEl.classList.remove("hidden");

  // the last mole pulls out its hammer and smashes the screen (the effects above are timed to its hit)
  currentMound.classList.add("smash");
  gameOverSounds();

  // it stays out of its hole while it swings; tidy up once the screen has dimmed
  // ("smash" stays on until the next game starts, so the paws can't pop back into view while the mole goes down)
  setTimeout(() => {
    mounds.forEach(m => {
      m.classList.remove("up", "attack");
      m.querySelector(".word-label").textContent = "";
    });
  }, 1700);

  // shake the whole game right when the hammer lands
  setTimeout(() => {
    wrapperEl.classList.add("shake");
    setTimeout(() => wrapperEl.classList.remove("shake"), 400);
  }, 760);
}

// --- Scoreboard (stored in the browser via localStorage) ---

function getScores() {
  const raw = localStorage.getItem("typeAMoleScores");
  return raw ? JSON.parse(raw) : [];
}

let myEntryId = null;   // id of the score the current player just made (used to highlight it on the scoreboard)

function saveScore(name, points) {
  const scores = getScores();
  myEntryId = Date.now();
  scores.push({ name, points, id: myEntryId });
  scores.sort((a, b) => b.points - a.points);
  const top = scores.slice(0, 10);   // keeps the best 10 players
  localStorage.setItem("typeAMoleScores", JSON.stringify(top));
}

function renderScoreboard() {
  const scores = getScores();
  scoreListEl.innerHTML = "";

  if (scores.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 3;
    td.className = "empty";
    td.textContent = "No scores yet";
    tr.appendChild(td);
    scoreListEl.appendChild(tr);
    return;
  }

  scores.forEach((entry, i) => {
    const tr = document.createElement("tr");
    // highlight the row of the player who just played (no highlight if they are not in the top 10)
    if (entry.id === myEntryId) tr.className = "me";

    [i + 1, entry.name, entry.points].forEach(value => {
      const td = document.createElement("td");
      td.textContent = value;
      tr.appendChild(td);
    });

    scoreListEl.appendChild(tr);
  });
}

// --- Star shape for the GAME OVER burst ---

function makeBurstShape() {
  const points = [];
  const spikes = 20;
  for (let i = 0; i < spikes * 2; i++) {
    const angle = (Math.PI * i) / spikes;
    const radius = i % 2 === 0 ? 50 : 39;   // long spike, short dip
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    points.push(x.toFixed(1) + "% " + y.toFixed(1) + "%");
  }
  document.documentElement.style.setProperty("--burst", "polygon(" + points.join(",") + ")");
}

// --- Flow: username entry -> game screen ---

function beginFromUsername() {
  const typedName = usernameInput.value.trim();
  playerName = typedName === "" ? "Player" : typedName;
  playerNameEl.textContent = playerName;

  usernameScreen.classList.add("hidden");
  gameScreen.classList.remove("off");

  startGame();
}

startBtn.addEventListener("click", beginFromUsername);

usernameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    beginFromUsername();
  }
});

restartBtn.addEventListener("click", startGame);

// Game over options
playAgainBtn.addEventListener("click", startGame);

newPlayerBtn.addEventListener("click", () => {
  gameOverEl.classList.add("hidden");
  gameScreen.classList.add("off");
  usernameScreen.classList.remove("hidden");
  usernameInput.value = "";
  usernameInput.focus();
});

wordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    checkInput();
  }
});

makeBurstShape();
renderScoreboard();
usernameInput.focus();

// --- sound on / off button ---
const muteBtn = document.getElementById("muteBtn");

muteBtn.addEventListener("click", () => {
  soundOn = !soundOn;
  muteBtn.textContent = soundOn ? "🔊" : "🔇";
  if (masterGain) masterGain.gain.value = soundOn ? 0.8 : 0;   // also silences sounds that are already playing
  if (!wordInput.disabled) wordInput.focus();
});