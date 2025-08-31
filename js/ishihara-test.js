// js/ishihara-test.js

const ishiharaQuestions = [
  { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/1-12-12-12.jpg", options: ["12","8","5","هیچکدام"], correct: "12" },
  { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/17-42-protanS2M42-deutanS4M42.jpg", options: ["42","24","74","هیچکدام"], correct: "42" },
  { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/2-74-n-n.jpg", options: ["74","24","47","هیچکدام"], correct: "74" },
  { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/3-6-n-n.jpg", options: ["6","8","3","هیچکدام"], correct: "6" },
  { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/4-29-n-n.jpg", options: ["29","70","20","هیچکدام"], correct: "29" },
  { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/5-57-n-n.jpg", options: ["57","35","75","هیچکدام"], correct: "57" },
  { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/6-5-n-n.jpg", options: ["5","2","8","هیچکدام"], correct: "5" },
  { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/7-3-n-n.jpg", options: ["3","5","8","هیچکدام"], correct: "3" },
  { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/8-15-n-n.jpg", options: ["15","51","17","هیچکدام"], correct: "15" },
  { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/9-73-n-n.jpg", options: ["73","37","23","هیچکدام"], correct: "73" },
  { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/10-45-n-n.jpg", options: ["45","54","25","هیچکدام"], correct: "45" },
  { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/11-16-n-n.jpg", options: ["16","61","18","هیچکدام"], correct: "16" },
  { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/12-97-n-n.jpg", options: ["97","79","17","هیچکدام"], correct: "97" },
  { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/13-26-n-n.jpg", options: ["26","62","28","هیچکدام"], correct: "26" },
  { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/14-42-n-n.jpg", options: ["42","24","74","هیچکدام"], correct: "42" },
  { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/15-7-n-n.jpg", options: ["7","4","9","هیچکدام"], correct: "7" }
];

let currentIndexIshihara = 0;
let scoreIshihara = 0;

const imgIshihara = document.getElementById("mamad-ishihara");
const optionsListIshihara = document.getElementById("nowShowPic-ishihara");
const optionLabelsIshihara = [
  document.getElementById("option1-ishihara"),
  document.getElementById("option2-ishihara"),
  document.getElementById("option3-ishihara"),
  document.getElementById("option4-ishihara")
];
const nextBtnIshihara = document.getElementById("btn-next-ishihara");
const resetBtnIshihara = document.getElementById("btn-reset-ishihara");
const progressBarIshihara = document.getElementById("childbar-ishihara");
const progressNumIshihara = document.getElementById("progressbarnumber-ishihara");

function loadQuestionIshihara() {
  const q = ishiharaQuestions[currentIndexIshihara];
  imgIshihara.src = q.image;
  optionsListIshihara.style.display = "block";
  nextBtnIshihara.style.display = "none";

  q.options.forEach((opt, i) => {
    optionLabelsIshihara[i].textContent = opt;
  });

  // پاک کردن انتخاب قبلی
  document.querySelectorAll("input[name='answer-ishihara']").forEach(r => r.checked = false);

  // بروزرسانی نوار پیشرفت
  const progress = Math.round(((currentIndexIshihara+1) / ishiharaQuestions.length) * 100);
  progressBarIshihara.style.width = progress + "%";
  progressNumIshihara.textContent = `${currentIndexIshihara+1} / ${ishiharaQuestions.length}`;
}

function checkAnswerIshihara() {
  const q = ishiharaQuestions[currentIndexIshihara];
  const selected = document.querySelector("input[name='answer-ishihara']:checked");
  if (!selected) {
    alert("لطفاً یک گزینه انتخاب کنید");
    return;
  }
  const answer = document.querySelector(`label[for=${selected.id}]`).textContent;
  if (answer === q.correct) scoreIshihara++;
  nextBtnIshihara.style.display = "inline-block";
}

function nextQuestionIshihara() {
  currentIndexIshihara++;
  if (currentIndexIshihara < ishiharaQuestions.length) {
    loadQuestionIshihara();
  } else {
    showResultIshihara();
  }
}

function showResultIshihara() {
  imgIshihara.style.display = "none";
  optionsListIshihara.style.display = "none";
  nextBtnIshihara.style.display = "none";
  resetBtnIshihara.style.display = "inline-block";
  progressNumIshihara.textContent = `امتیاز شما: ${scoreIshihara} از ${ishiharaQuestions.length}`;
}

function resetQuizIshihara() {
  currentIndexIshihara = 0;
  scoreIshihara = 0;
  imgIshihara.style.display = "block";
  resetBtnIshihara.style.display = "none";
  loadQuestionIshihara();
}

nextBtnIshihara.addEventListener("click", nextQuestionIshihara);
resetBtnIshihara.addEventListener("click", resetQuizIshihara);

document.querySelectorAll("input[name='answer-ishihara']").forEach(input => {
  input.addEventListener("change", checkAnswerIshihara);
});

// شروع
loadQuestionIshihara();
