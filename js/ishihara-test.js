const ishiharaQuestions = [
  { 
    image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/1-12-12-12.jpg", 
    options: ["12", "24", "11", "هیچ کدام"], 
    correct: "12" 
  },
  { 
    image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/2-8-3-n.jpg", 
    options: ["3", "2", "8", "هیچ کدام"], 
    correct: "8" 
  },
  { 
    image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/3-29-70-n.jpg", 
    options: ["3", "29", "70", "هیچ کدام"], 
    correct: "29" 
  },
  { 
    image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/4-5-2-n.jpg", 
    options: ["4", "5", "2", "هیچ کدام"], 
    correct: "5" 
  },
  { 
    image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/5-3-5-n.jpg", 
    options: ["5", "3", "7", "هیچ کدام"], 
    correct: "3" 
  },
  { 
    image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/6-15-17-n.jpg", 
    options: ["15", "6", "17", "هیچ کدام"], 
    correct: "15" 
  },
  { 
    image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/7-74-21-n.jpg", 
    options: ["21", "7", "74", "هیچ کدام"], 
    correct: "74" 
  },
  { 
    image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/8-6-n-n.jpg", 
    options: ["8", "6", "12", "هیچ کدام"], 
    correct: "6" 
  },
  { 
    image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/9-45-n-n.jpg", 
    options: ["9", "32", "45", "هیچ کدام"], 
    correct: "45" 
  },
  { 
    image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/10-5-n-n.jpg", 
    options: ["22", "10", "5", "هیچ کدام"], 
    correct: "5" 
  },
  { 
    image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/11-7-n-n.jpg", 
    options: ["7", "11", "42", "هیچ کدام"], 
    correct: "7" 
  },
  { 
    image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/12-16-n-n.jpg", 
    options: ["16", "12", "86", "هیچ کدام"], 
    correct: "16" 
  },
  { 
    image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/13-73-n-n.jpg", 
    options: ["13", "73", "21", "هیچ کدام"], 
    correct: "73" 
  },
  { 
    image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/14-n-5-n.jpg", 
    options: ["14", "5", "34", "هیچ کدام"], 
    correct: "هیچ کدام" 
  },
  { 
    image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/15-n-45-n.jpg", 
    options: ["15", "66", "45", "هیچ کدام"], 
    correct: "هیچ کدام" 
  },
  { 
    image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/16-26-protanS6M26-deutanS2M26.jpg", 
    options: ["2", "6", "26", "هیچ کدام"], 
    correct: "26" 
  },
  { 
    image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/17-42-protanS2M42-deutanS4M42.jpg", 
    options: ["2", "4", "42", "هیچ کدام"], 
    correct: "42" 
  }
];

let currentIndexIshihara = 0;
let scoreIshihara = 0;
let userAnswers = new Array(ishiharaQuestions.length).fill(null); // برای ذخیره پاسخ‌های کاربر

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

// توابع هدایت
function funcNormal() { document.location.href = "https://www.koorrangi.ir/%d8%ac%d9%88%d8%a7%d8%a8-%d8%aa%d8%b3%d8%aa-%da%a9%d9%88%d8%b1%d8%b1%d9%86%da%af%db%8c1/"; }
function funcTotal() { document.location.href = "https://www.koorrangi.ir/%d8%ac%d9%88%d8%a7%d8%a8-%d8%aa%d8%b3%d8%aa-%da%a9%d9%88%d8%b1%d8%b1%d9%86%da%af%db%8c2/"; }
function funcProtanWeak() { document.location.href = "https://www.koorrangi.ir/%d8%ac%d9%88%d8%a7%d8%a8-%d8%aa%d8%b3%d8%aa-%da%a9%d9%88%d8%b1%d8%b1%d9%86%da%af%db%8c3/"; }
function funcProtanStrong() { document.location.href = "https://www.koorrangi.ir/%d8%ac%d9%88%d8%a7%d8%a8-%d8%aa%d8%b3%d8%aa-%da%a9%d9%88%d8%b1%d8%b1%d9%86%da%af%db%8c4/"; }
function funcDeutanWeak() { document.location.href = "https://www.koorrangi.ir/%d8%ac%d9%88%d8%a7%d8%a8-%d8%aa%d8%b3%d8%aa-%da%a9%d9%88%d8%b1%d8%b1%d9%86%da%af%db%8c5/"; }
function funcDeutanStrong() { document.location.href = "https://www.koorrangi.ir/%d8%ac%d9%88%d8%a7%d8%a8-%d8%aa%d8%b3%d8%aa-%da%a9%d9%88%d8%b1%d8%b1%d9%86%da%af%db%8c6/"; }
function funcDeutanProtanWeak() { document.location.href = "https://www.koorrangi.ir/%d8%ac%d9%88%d8%a7%d8%a8-%d8%aa%d8%b3%d8%aa-%da%a9%d9%88%d8%b4%d8%b1%d9%86%da%af%db%8c7/"; }
function funcDeutanProtan() { document.location.href = "https://www.koorrangi.ir/%d8%ac%d9%88%d8%a7%d8%a8-%d8%aa%d8%b3%d8%aa-%da%a9%d9%88%d8%b1%d8%b1%d9%86%da%af%db%8c8/"; }
function funcTetaranTritan() { document.location.href = "https://www.koorrangi.ir/%d8%ac%d9%88%d8%a7%d8%a8-%d8%aa%d8%b3%d8%aa-%da%a9%d9%88%d8%b1%d8%b1%d9%86%da%af%db%8c9/"; }

// تابع به‌روزرسانی نوار پیشرفت
function changeWidthBar(X) {
  const percentage = Math.round(((currentIndexIshihara + 1) / X.length) * 100);
  progressBarIshihara.style.width = `${percentage}%`;
  console.log('عرض نوار پیشرفت:', progressBarIshihara.style.width);
}

// تابع بارگذاری سوال
function loadQuestionIshihara() {
  const q = ishiharaQuestions[currentIndexIshihara];
  imgIshihara.src = q.image;
  optionsListIshihara.style.display = "none"; // مخفی کردن گزینه‌ها تا لود کامل تصویر
  nextBtnIshihara.style.display = "none";

  // نمایش گزینه‌ها بعد از لود کامل تصویر
  imgIshihara.onload = () => {
    optionsListIshihara.style.display = "block";
    q.options.forEach((opt, i) => {
      optionLabelsIshihara[i].textContent = opt;
    });
    // پاک کردن انتخاب قبلی
    document.querySelectorAll("input[name='answer-ishihara']").forEach(r => r.checked = false);
    // به‌روزرسانی نوار پیشرفت
    changeWidthBar(ishiharaQuestions);
    progressNumIshihara.textContent = `${currentIndexIshihara + 1} / ${ishiharaQuestions.length}`;
  };

  imgIshihara.onerror = () => {
    console.error('خطا در بارگذاری تصویر:', q.image);
    alert('خطا در بارگذاری تصویر سوال. لطفاً اتصال اینترنت را بررسی کنید.');
  };
}

// تابع بررسی پاسخ
function checkAnswerIshihara() {
  const q = ishiharaQuestions[currentIndexIshihara];
  const selected = document.querySelector("input[name='answer-ishihara']:checked");
  if (!selected) {
    alert("لطفاً یک گزینه انتخاب کنید");
    return;
  }
  const answer = document.querySelector(`label[for=${selected.id}]`).textContent;
  userAnswers[currentIndexIshihara] = answer;
  if (answer === q.correct) {
    scoreIshihara++;
  } else if (currentIndexIshihara === 0) {
    alert("پاسخ شما نادرست است! لطفاً دوباره تلاش کنید.");
  }
  nextBtnIshihara.style.display = "inline-block";
}

// تابع رفتن به سوال بعدی
function nextQuestionIshihara() {
  currentIndexIshihara++;
  if (currentIndexIshihara < ishiharaQuestions.length) {
    loadQuestionIshihara();
  } else {
    showResultIshihara();
  }
}

// تابع نمایش نتیجه
function showResultIshihara() {
  imgIshihara.style.display = "none";
  optionsListIshihara.style.display = "none";
  nextBtnIshihara.style.display = "none";
  resetBtnIshihara.style.display = "inline-block";
  progressNumIshihara.textContent = `امتیاز شما: ${scoreIshihara} از ${ishiharaQuestions.length}`;

  // منطق هدایت بر اساس امتیاز و پاسخ‌های خاص
  const totalQuestions = ishiharaQuestions.length;
  const correctRatio = scoreIshihara / totalQuestions;

  if (correctRatio >= 0.9) {
    // دید نرمال (90% یا بیشتر پاسخ‌های درست)
    funcNormal();
  } else if (correctRatio <= 0.3) {
    // کوررنگی کامل
    funcTotal();
  } else {
    // بررسی سوالات تشخیصی (14, 15, 16, 17)
    const q14Correct = userAnswers[13] === ishiharaQuestions[13].correct; // هیچ کدام
    const q15Correct = userAnswers[14] === ishiharaQuestions[14].correct; // هیچ کدام
    const q16Answer = userAnswers[15]; // پروتان: 6، دوتان: 2
    const q17Answer = userAnswers[16]; // پروتان: 2، دوتان: 4

    if (q14Correct && q15Correct) {
      // کوررنگی قرمز-سبز محتمل است
      if (q16Answer === "6" && q17Answer === "2") {
        funcProtanStrong(); // پروتان قوی
      } else if (q16Answer === "2" && q17Answer === "4") {
        funcDeutanStrong(); // دوتان قوی
      } else if (q16Answer === "6" || q17Answer === "2") {
        funcProtanWeak(); // پروتان ضعیف
      } else if (q16Answer === "2" || q17Answer === "4") {
        funcDeutanWeak(); // دوتان ضعیف
      } else if (q16Answer && q17Answer) {
        funcDeutanProtan(); // ترکیبی قوی
      } else {
        funcDeutanProtanWeak(); // ترکیبی ضعیف
      }
    } else {
      // اگر سوالات تشخیصی درست نباشند، احتمال تریتان یا نامشخص
      funcTetaranTritan();
    }
  }
}

// تابع ریست کوییز
function resetQuizIshihara() {
  currentIndexIshihara = 0;
  scoreIshihara = 0;
  userAnswers.fill(null);
  imgIshihara.style.display = "block";
  resetBtnIshihara.style.display = "none";
  loadQuestionIshihara();
}

// Event Listenerها
nextBtnIshihara.addEventListener("click", nextQuestionIshihara);
resetBtnIshihara.addEventListener("click", resetQuizIshihara);

document.querySelectorAll("input[name='answer-ishihara']").forEach(input => {
  input.addEventListener("change", checkAnswerIshihara);
});

// بررسی وجود المنت‌ها
if (!imgIshihara || !optionsListIshihara || !nextBtnIshihara || !resetBtnIshihara || !progressBarIshihara || !progressNumIshihara) {
  console.error('یکی از المنت‌های موردنیاز برای تست ایشی‌هारा یافت نشد.');
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.innerHTML = 'خطا: نمی‌توان تست ایشی‌هारा را بارگذاری کرد. لطفاً مطمئن شوید که ساختار HTML درست تنظیم شده است.';
  document.getElementById('tool-ishihara-test').appendChild(errorDiv);
  setTimeout(() => errorDiv.remove(), 10000);
  return;
}

// شروع کوییز
loadQuestionIshihara();