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
  document.getElementById("startScreen").style.display = "none";

  document.getElementById("quiz").style.display = "block";

  document.getElementById("result").style.display = "none";

  currentQuestion = 0;

  score = 0;

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
      checkTextAnswer();
    };

    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        checkTextAnswer();
      }
    });

    answersBox.appendChild(input);

    answersBox.appendChild(button);
  }
}

/* =========================================
   WRONG MESSAGE
========================================= */

function showWrongMessage() {
  let message = document.querySelector(".wrong-message");

  if (!message) {
    message = document.createElement("div");

    message.className = "wrong-message";

    document.getElementById("answers").appendChild(message);
  }

  message.textContent = "❌ Incorrect! Try again.";
}

/* =========================================
   MULTIPLE CHOICE
========================================= */

function chooseAnswer(answer, button) {
  if (answered) {
    return;
  }

  const q = questions[currentQuestion];

  if (answer === q.correct) {
    answered = true;

    score++;

    button.classList.add("correct");

    const buttons = document.querySelectorAll(".answer");

    buttons.forEach((btn) => {
      btn.disabled = true;
    });

    showNextButton();
  } else {
    button.classList.add("wrong");

    button.disabled = true;

    showWrongMessage();
  }
}

/* =========================================
   TEXT
========================================= */

function checkTextAnswer() {
  if (answered) {
    return;
  }

  const input = document.getElementById("textAnswer");

  const userAnswer = input.value.trim().toLowerCase();

  const correctAnswer = questions[currentQuestion].correct.toLowerCase();

  if (userAnswer === correctAnswer) {
    answered = true;

    score++;

    input.value = questions[currentQuestion].correct;

    input.disabled = true;

    input.style.borderColor = "#49f5bb";

    const buttons = document.querySelectorAll("#answers button");

    buttons.forEach((button) => {
      button.disabled = true;
    });

    showNextButton();
  } else {
    showWrongMessage();

    input.value = "";

    input.placeholder = "❌ Try again...";
  }
}

/* =========================================
   NEXT
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
  currentQuestion = 0;

  score = 0;

  answered = false;

  document.getElementById("result").style.display = "none";

  document.getElementById("quiz").style.display = "none";

  document.getElementById("startScreen").style.display = "flex";
}
