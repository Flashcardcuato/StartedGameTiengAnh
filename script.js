/* =========================================
   QUESTIONS
========================================= */

const questions = [
  {
    type: "choice",

    question: "The person was born in 1879. Which century was that year in?",

    hint: "Century = thế kỷ, một khoảng thời gian gồm 100 năm.",

    answers: ["17th", "18th", "19th", "20th"],

    correct: "19th",
  },

  {
    type: "choice",

    question: "Which country has Berlin as its capital city?",

    hint: "Capital city = thủ đô, thành phố chính thức của một quốc gia.",

    answers: ["Austria", "Germany", "Switzerland", "The Netherlands"],

    correct: "Germany",
  },

  {
    type: "choice",

    question: "Which city was once home to a famous Swiss Patent Office?",

    hint: "Patent = bằng sáng chế; Patent Office = cơ quan tiếp nhận và xử lý hồ sơ sáng chế.",

    answers: ["Zurich", "Geneva", "Bern", "Basel"],

    correct: "Bern",
  },

  {
    type: "choice",

    question:
      "Which year is often called the 'miracle year' in the history of physics?",

    hint: "Miracle year = 'năm kỳ diệu', một cách gọi không chính thức cho một năm có những đóng góp nổi bật.",

    answers: ["1899", "1905", "1915", "1921"],

    correct: "1905",
  },

  {
    type: "choice",

    question:
      "Which international award is given for outstanding achievements in science?",

    hint: "International award = giải thưởng quốc tế; outstanding achievements = những thành tựu nổi bật.",

    answers: ["Pulitzer", "Oscar", "Nobel", "Grammy"],

    correct: "Nobel",
  },

  {
    type: "choice",

    question: "Which branch of science studies matter, energy, and motion?",

    hint: "Matter = vật chất; energy = năng lượng; motion = chuyển động.",

    answers: ["Chemistry", "Biology", "Physics", "Geology"],

    correct: "Physics",
  },

  {
    type: "choice",

    question:
      "Which phenomenon involves light causing electrons to be released from a material?",

    hint: "Phenomenon = hiện tượng; electron = electron, hạt mang điện âm trong nguyên tử; material = vật liệu.",

    answers: [
      "Doppler effect",
      "Photoelectric effect",
      "Total internal reflection",
      "Refraction",
    ],

    correct: "Photoelectric effect",
  },

  {
    type: "choice",

    question:
      "Which formula represents the relationship between energy and mass?",

    hint: "Formula = công thức; energy = năng lượng; mass = khối lượng; relationship = mối quan hệ.",

    answers: ["F = ma", "V = IR", "E = mc²", "P = UI"],

    correct: "E = mc²",
  },

  {
    type: "choice",

    question:
      "Which theory explains the relationship between space, time, and motion?",

    hint: "Theory = lý thuyết; relativity = tính tương đối; space = không gian; motion = chuyển động.",

    answers: [
      "Theory of Evolution",
      "Theory of Relativity",
      "Cell Theory",
      "Atomic Theory",
    ],

    correct: "Theory of Relativity",
  },

  {
    type: "text",

    question:
      "Based on all the information, who do you think the mysterious scientist is?",

    hint: "Clue = manh mối; mysterious = bí ẩn; scientist = nhà khoa học.",

    correct: "Albert Einstein",
  },
];

/* =========================================
   GAME VARIABLES
========================================= */

let currentQuestion = 0;
let score = 0;
let answered = false;

/* =========================================
   AUDIO SYSTEM
   Web Audio API
========================================= */

let audioContext = null;
let masterGain = null;
let musicGain = null;
let musicEnabled = true;
let musicTimer = null;
let musicStep = 0;

/*
  Tạo AudioContext sau khi người dùng tương tác.
*/
function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.7;

    masterGain.connect(audioContext.destination);

    musicGain = audioContext.createGain();
    musicGain.gain.value = 10;

    musicGain.connect(masterGain);
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
}

/*
  Âm thanh click.
*/
function playClickSound() {
  initAudio();

  const now = audioContext.currentTime;

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sine";

  oscillator.frequency.setValueAtTime(500, now);
  oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.06);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.12, now + 0.01);

  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

  oscillator.connect(gain);
  gain.connect(masterGain);

  oscillator.start(now);
  oscillator.stop(now + 0.1);
}

/*
  Âm thanh trả lời đúng.
*/
function playCorrectSound() {
  initAudio();

  const now = audioContext.currentTime;

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sine";

  oscillator.frequency.setValueAtTime(520, now);
  oscillator.frequency.setValueAtTime(660, now + 0.1);
  oscillator.frequency.setValueAtTime(780, now + 0.2);

  gain.gain.setValueAtTime(0.0001, now);

  gain.gain.exponentialRampToValueAtTime(0.18, now + 0.03);

  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

  oscillator.connect(gain);
  gain.connect(masterGain);

  oscillator.start(now);
  oscillator.stop(now + 0.45);
}

/*
  Âm thanh trả lời sai.
*/
function playWrongSound() {
  initAudio();

  const now = audioContext.currentTime;

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sawtooth";

  oscillator.frequency.setValueAtTime(220, now);
  oscillator.frequency.exponentialRampToValueAtTime(120, now + 0.25);

  gain.gain.setValueAtTime(0.0001, now);

  gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);

  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

  oscillator.connect(gain);
  gain.connect(masterGain);

  oscillator.start(now);
  oscillator.stop(now + 0.3);
}

/*
  Âm thanh chuyển câu.
*/
function playNextSound() {
  initAudio();

  const now = audioContext.currentTime;

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "triangle";

  oscillator.frequency.setValueAtTime(400, now);
  oscillator.frequency.exponentialRampToValueAtTime(650, now + 0.12);

  gain.gain.setValueAtTime(0.0001, now);

  gain.gain.exponentialRampToValueAtTime(0.1, now + 0.02);

  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

  oscillator.connect(gain);
  gain.connect(masterGain);

  oscillator.start(now);
  oscillator.stop(now + 0.2);
}

/*
  Âm thanh hoàn thành quiz.
*/
function playCompleteSound() {
  initAudio();

  const now = audioContext.currentTime;

  const notes = [523.25, 659.25, 783.99, 1046.5];

  notes.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    const start = now + index * 0.15;

    oscillator.type = "sine";

    oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(0.0001, start);

    gain.gain.exponentialRampToValueAtTime(0.18, start + 0.03);

    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);
    oscillator.connect(gain);
    gain.connect(masterGain);

    oscillator.start(start);
    oscillator.stop(start + 0.4);
  });
}

/* =========================================
   BACKGROUND MUSIC
========================================= */

const musicNotes = [
  261.63, 329.63, 392.0, 329.63, 293.66, 349.23, 440.0, 349.23,
];

function playMusicNote() {
  if (!musicEnabled) {
    return;
  }

  initAudio();

  const now = audioContext.currentTime;

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sine";

  oscillator.frequency.value = musicNotes[musicStep % musicNotes.length];

  gain.gain.setValueAtTime(0.0001, now);

  gain.gain.exponentialRampToValueAtTime(0.035, now + 0.08);

  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

  oscillator.connect(gain);
  gain.connect(musicGain);

  oscillator.start(now);
  oscillator.stop(now + 0.7);

  musicStep++;
}

function startBackgroundMusic() {
  initAudio();

  if (musicTimer) {
    return;
  }

  musicStep = 0;

  playMusicNote();

  musicTimer = setInterval(() => {
    playMusicNote();
  }, 700);
}

function stopBackgroundMusic() {
  if (musicTimer) {
    clearInterval(musicTimer);
    musicTimer = null;
  }
}

function toggleMusic() {
  initAudio();

  musicEnabled = !musicEnabled;

  if (musicEnabled) {
    startBackgroundMusic();
  } else {
    stopBackgroundMusic();
  }

  updateMusicButton();
}

function updateMusicButton() {
  const button = document.getElementById("musicToggle");

  if (!button) {
    return;
  }

  button.textContent = musicEnabled ? "🔊 Music" : "🔇 Music";
}

/* =========================================
   SHUFFLE
========================================= */

function shuffle(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/* =========================================
   START
========================================= */

function startQuiz() {
  initAudio();

  playClickSound();

  startBackgroundMusic();

  document.getElementById("startScreen").style.display = "none";

  document.getElementById("quiz").style.display = "block";

  document.getElementById("result").style.display = "none";

  currentQuestion = 0;

  score = 0;

  answered = false;

  loadQuestion();
}

/* =========================================
   LOAD QUESTION
========================================= */

function loadQuestion() {
  answered = false;

  const q = questions[currentQuestion];

  document.getElementById("questionNumber").textContent =
    `Question ${currentQuestion + 1} / ${questions.length}`;

  document.getElementById("question").textContent = q.question;

  document.getElementById("hint").textContent = q.hint;

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  document.getElementById("progressBar").style.width = progress + "%";

  document.getElementById("progressText").textContent =
    `${currentQuestion + 1} / ${questions.length}`;

  document.getElementById("nextBtn").style.display = "none";

  const answersBox = document.getElementById("answers");

  /*
    Xóa toàn bộ đáp án và thông báo
    của câu hỏi trước.
  */
  answersBox.innerHTML = "";

  /* =====================================
     CHOICE
  ===================================== */

  if (q.type === "choice") {
    const shuffledAnswers = shuffle(q.answers);

    shuffledAnswers.forEach((answer) => {
      const button = document.createElement("button");

      button.className = "answer";

      button.textContent = answer;

      button.onclick = function () {
        playClickSound();

        chooseAnswer(answer, button);
      };

      answersBox.appendChild(button);
    });
  } else {
    /* =====================================
       TEXT
    ===================================== */

    const input = document.createElement("input");

    input.id = "textAnswer";

    input.className = "text-answer";

    input.type = "text";

    input.placeholder = "Type the scientist's name...";

    input.autocomplete = "off";

    const button = document.createElement("button");

    button.className = "answer";

    button.textContent = "Check Answer ✓";

    button.onclick = function () {
      playClickSound();

      checkTextAnswer();
    };

    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        playClickSound();

        checkTextAnswer();
      }
    });

    answersBox.appendChild(input);

    answersBox.appendChild(button);
  }
}

/* =========================================
   ANSWER MESSAGE
========================================= */

/*
  Hiện thông báo sai.
*/
function showWrongMessage() {
  /*
    Nếu đang có thông báo đúng
    thì xóa nó trước.
  */
  const correctMessage = document.querySelector(".correct-message");

  if (correctMessage) {
    correctMessage.remove();
  }

  let message = document.querySelector(".wrong-message");

  if (!message) {
    message = document.createElement("div");

    message.className = "wrong-message";

    document.getElementById("answers").appendChild(message);
  }

  message.textContent = "❌ Incorrect! Try again.";
}

/*
  Hiện thông báo đúng.

  Quan trọng:
  Khi người chơi trước đó trả lời sai,
  .wrong-message sẽ bị xóa hoàn toàn.
*/
function showCorrectMessage() {
  const wrongMessage = document.querySelector(".wrong-message");

  if (wrongMessage) {
    wrongMessage.remove();
  }

  let message = document.querySelector(".correct-message");

  if (!message) {
    message = document.createElement("div");

    message.className = "correct-message";

    document.getElementById("answers").appendChild(message);
  }

  message.textContent = "✓ Correct! Well done.";
}

/* =========================================
   MULTIPLE CHOICE
========================================= */

function chooseAnswer(answer, button) {
  if (answered) {
    return;
  }

  const q = questions[currentQuestion];

  /*
    ==============================
    ĐÚNG
    ==============================
  */

  if (answer === q.correct) {
    answered = true;

    score++;

    button.classList.add("correct");

    /*
      Xóa chữ đỏ + hiện chữ xanh.
    */
    showCorrectMessage();

    /*
      Phát âm thanh đúng.
    */
    playCorrectSound();

    /*
      Khóa toàn bộ đáp án.
    */
    const buttons = document.querySelectorAll(".answer");

    buttons.forEach((btn) => {
      btn.disabled = true;
    });

    showNextButton();
  } else {
    /*
      ==============================
      SAI
      ==============================
    */

    button.classList.add("wrong");

    button.disabled = true;

    /*
      Phát âm thanh sai.
    */
    playWrongSound();

    /*
      Hiện chữ đỏ.
    */
    showWrongMessage();
  }
}

/* =========================================
   TEXT ANSWER
========================================= */

function checkTextAnswer() {
  if (answered) {
    return;
  }

  const input = document.getElementById("textAnswer");

  const userAnswer = input.value.trim().toLowerCase();

  const correctAnswer = questions[currentQuestion].correct.toLowerCase();

  /*
    ==============================
    ĐÚNG
    ==============================
  */

  if (userAnswer === correctAnswer) {
    answered = true;

    score++;

    input.value = questions[currentQuestion].correct;

    input.disabled = true;

    input.style.borderColor = "#49f5bb";

    /*
      Xóa chữ đỏ + hiện chữ xanh.
    */
    showCorrectMessage();

    /*
      Âm thanh đúng.
    */
    playCorrectSound();

    const buttons = document.querySelectorAll("#answers button");

    buttons.forEach((button) => {
      button.disabled = true;
    });

    showNextButton();
  } else {
    /*
      ==============================
      SAI
      ==============================
    */

    playWrongSound();

    showWrongMessage();

    input.value = "";

    input.placeholder = "❌ Try again...";
  }
}

/* =========================================
   NEXT BUTTON
========================================= */

function showNextButton() {
  const nextButton = document.getElementById("nextBtn");

  nextButton.style.display = "block";

  if (currentQuestion === questions.length - 1) {
    nextButton.textContent = "✨ Reveal Mystery";
  }
}

/* =========================================
   NEXT QUESTION
========================================= */

function nextQuestion() {
  if (!answered) {
    return;
  }

  playNextSound();

  if (currentQuestion < questions.length - 1) {
    currentQuestion++;

    loadQuestion();
  } else {
    showResult();
  }
}

/* =========================================
   RESULT
========================================= */

function showResult() {
  stopBackgroundMusic();

  playCompleteSound();

  document.getElementById("quiz").style.display = "none";

  document.getElementById("result").style.display = "flex";

  document.getElementById("progressBar").style.width = "100%";

  document.getElementById("progressText").textContent = "10 / 10";

  document.getElementById("scoreText").textContent =
    `You solved all 10 questions! Score: ${score} / 10`;
}

/* =========================================
   RESTART
========================================= */

function restartQuiz() {
  playClickSound();

  stopBackgroundMusic();

  currentQuestion = 0;

  score = 0;

  answered = false;

  document.getElementById("result").style.display = "none";

  document.getElementById("quiz").style.display = "none";

  document.getElementById("startScreen").style.display = "flex";
}

/* =========================================
   MUSIC BUTTON
========================================= */

/*
  Tạo nút Music nếu index.html
  chưa có nút này.
*/
function createMusicButton() {
  if (document.getElementById("musicToggle")) {
    updateMusicButton();

    return;
  }

  const button = document.createElement("button");

  button.id = "musicToggle";

  button.type = "button";

  button.textContent = "🔊 Music";

  button.onclick = function () {
    playClickSound();

    toggleMusic();
  };

  /*
    Đặt nút ở góc trên bên phải.
  */
  button.style.position = "fixed";

  button.style.top = "20px";

  button.style.right = "20px";

  button.style.zIndex = "9999";

  button.style.padding = "10px 15px";

  button.style.border = "1px solid rgba(120,150,255,0.5)";

  button.style.borderRadius = "12px";

  button.style.background = "rgba(8,14,45,0.85)";

  button.style.color = "white";

  button.style.fontSize = "14px";

  button.style.fontWeight = "bold";

  button.style.cursor = "pointer";

  button.style.backdropFilter = "blur(8px)";

  document.body.appendChild(button);

  updateMusicButton();
}

/* =========================================
   INITIALIZE
========================================= */

document.addEventListener("DOMContentLoaded", function () {
  createMusicButton();
});
