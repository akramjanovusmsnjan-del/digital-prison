
const questions = [
  {
    tag: "01 — KIRISH XONASI",
    title: "Birinchi kod",
    text: "Men doim oldinga yuraman, lekin hech qachon ortga qaytmayman. Meni hech kim to‘xtata olmaydi. Men nima?",
    hint: "Har bir insonda bor. Uni ortga qaytarib bo‘lmaydi.",
    answers: ["vaqt", "vaqtni"],
    success: "Birinchi eshik ochildi. Tizim sizni tanidi."
  },
  {
    tag: "02 — MANTIQ XONASI",
    title: "Sirli ketma-ketlik",
    text: "Ketma-ketlikni davom ettiring: 2, 6, 12, 20, 30, ?",
    hint: "Sonlar orasidagi farqni tekshiring: 4, 6, 8, 10...",
    answers: ["42"],
    success: "Mantiqiy himoya buzildi. Keyingi xona ochildi."
  },
  {
    tag: "03 — MAXFIY ARXIV",
    title: "Harflar siri",
    text: "Agar A=1, B=2, C=3 ... Z=26 bo‘lsa, 3-1-20 qanday so‘z bo‘ladi?",
    hint: "Ingliz alifbosidan foydalaning. C, A, T.",
    answers: ["cat"],
    success: "Arxiv paroli topildi. Tizim xavfsizligi pasaydi."
  },
  {
    tag: "04 — XAVFSIZLIK XONASI",
    title: "Uchta kalit",
    text: "Uchta kalit bor: qizil, ko‘k va yashil. To‘g‘ri kalit qizil emas, yashil ham emas. Qaysi kalitni tanlaysiz?",
    hint: "Qizil va yashil chiqarib tashlangan.",
    answers: ["ko'k", "ko‘k", "kok", "blue"],
    success: "To‘g‘ri tanlov! Himoya tizimi o‘chirildi."
  },
  {
    tag: "05 — OXIRGI DARVOZA",
    title: "So‘nggi jumboq",
    text: "Bir xonada 3 ta chiroq bor. Tashqarida esa ularni boshqaradigan 3 ta kalit. Xonaga faqat bir marta kirishingiz mumkin. Qaysi kalit qaysi chiroqqa tegishli ekanini qanday aniqlaysiz?",
    hint: "Chiroq faqat yorug‘lik bermaydi, u qizishi ham mumkin.",
    answers: [
      "birinchi kalitni yoqib kutaman, keyin o'chiraman, ikkinchisini yoqaman va xonaga kiraman",
      "birinchi kalitni yoqib kutaman keyin ochiraman ikkinchisini yoqaman xonaga kiraman",
      "birinchi kalitni yoqaman keyin ochiraman ikkinchisini yoqaman",
      "bittasini yoqib kutaman ochiraman ikkinchisini yoqaman"
    ],
    success: "OXIRGI KOD QABUL QILINDI. QAMOQXONA ESHIGI OCHILMOQDA!"
  }
];

const screens = {
  welcome: document.getElementById("welcome"),
  game: document.getElementById("game"),
  ending: document.getElementById("ending")
};

let current = 0;
let mistakes = 0;
let hintsLeft = 2;
let player = "Mahbus";

const $ = id => document.getElementById(id);

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
}

function normalize(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[’‘`]/g, "'")
    .replace(/\s+/g, " ");
}

function startGame() {
  player = $("playerName").value.trim() || "Noma'lum mahbus";
  $("displayName").textContent = player.toUpperCase();
  current = 0;
  mistakes = 0;
  hintsLeft = 2;
  $("mistakes").textContent = mistakes;
  $("hintCount").textContent = "Ishoralar: " + hintsLeft;
  showScreen("game");
  renderRoom();
}

function renderRoom() {
  const q = questions[current];

  $("roomNumber").textContent =
    String(current + 1).padStart(2, "0") + " / 05";

  $("progressBar").style.width =
    ((current + 1) / questions.length * 100) + "%";

  $("roomTag").textContent = q.tag;
  $("questionTitle").textContent = q.title;
  $("questionText").textContent = q.text;

  $("answerInput").value = "";
  $("feedback").textContent = "";
  $("feedback").className = "feedback";

  $("hint").textContent = "";
  $("hint").classList.add("hidden");

  $("door").classList.remove("open");
  $("door").querySelector(".door-label").textContent = "SEALED";
  $("door").querySelector(".door-code").textContent = "ACCESS DENIED";
  $("door").querySelector(".door-light").style.background = "#ff3434";
  $("door").querySelector(".door-light").style.boxShadow =
    "0 0 15px #ff3434";

  $("systemMessage").textContent =
    "> " + q.tag + " yuklandi. Javobingizni kutmoqda.";

  $("answerInput").focus();
}

function showFeedback(message, type) {
  $("feedback").textContent = message;
  $("feedback").className = "feedback " + type;
}

function checkAnswer() {
  const value = normalize($("answerInput").value);

  if (!value) {
    showFeedback("Javobni kiriting!", "bad");
    return;
  }

  const q = questions[current];
  const correct = q.answers.some(answer => {
    const expected = normalize(answer);

    if (current === 4) {
      return value.includes("issi") &&
        (value.includes("kalit") || value.includes("chiroq"));
    }

    return value === expected;
  });

  if (correct) {
    showFeedback("✓ " + q.success, "good");

    $("door").querySelector(".door-label").textContent = "UNLOCKED";
    $("door").querySelector(".door-code").textContent = "ACCESS GRANTED";
    $("door").querySelector(".door-light").style.background = "#35ff85";
    $("door").querySelector(".door-light").style.boxShadow =
      "0 0 15px #35ff85";

    $("door").classList.add("open");
    $("systemMessage").textContent = "> MUVAFFAQIYATLI! Keyingi bosqich tayyorlanmoqda.";

    $("submitBtn").disabled = true;

    setTimeout(() => {
      $("submitBtn").disabled = false;
      current++;

      if (current >= questions.length) {
        finishGame();
      } else {
        renderRoom();
      }
    }, 1700);

  } else {
    mistakes++;
    $("mistakes").textContent = mistakes;
    showFeedback("✕ Noto‘g‘ri javob! Yana bir bor urinib ko‘ring.", "bad");
    $("systemMessage").textContent =
      "> XATO: Tizim himoyasi faollashdi. Xatolar: " + mistakes;
    $("answerInput").select();
  }
}

function useHint() {
  if (hintsLeft <= 0) {
    showFeedback("Ishoralar tugadi!", "bad");
    return;
  }

  hintsLeft--;
  $("hintCount").textContent = "Ishoralar: " + hintsLeft;
  $("hint").textContent = "💡 ISHORA: " + questions[current].hint;
  $("hint").classList.remove("hidden");
}

function finishGame() {
  showScreen("ending");
  $("finalMistakes").textContent = mistakes;

  let message = `Ajoyib, ${player}! Sen barcha 5 ta jumboqni yechding va raqamli qamoqxonadan chiqding. `;

  if (mistakes === 0) {
    message += "Bitta ham xato qilmading. Mukammal natija!";
  } else {
    message += `Sening xatolaring soni: ${mistakes}. Ammo taslim bo‘lmading!`;
  }

  $("endingText").textContent = message;
}

function createParticles() {
  const area = $("particles");

  for (let i = 0; i < 35; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = Math.random() * 100 + "%";
    p.style.animationDelay = Math.random() * 8 + "s";
    p.style.animationDuration = (5 + Math.random() * 8) + "s";
    area.appendChild(p);
  }
}

$("startBtn").addEventListener("click", startGame);
$("submitBtn").addEventListener("click", checkAnswer);
$("hintBtn").addEventListener("click", useHint);
$("restartBtn").addEventListener("click", () => {
  $("playerName").value = "";
  showScreen("welcome");
});

$("answerInput").addEventListener("keydown", event => {
  if (event.key === "Enter") checkAnswer();
});

$("playerName").addEventListener("keydown", event => {
  if (event.key === "Enter") startGame();
});

createParticles();
