function initIshiharaTest() {
  const DataIshihara = [
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/9-45-n-n.jpg", options: ["12", "8", "5", "هیچکدام"], correct: "12" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/17-42-protanS2M42-deutanS4M42.jpg", options: ["42", "24", "74", "هیچکدام"], correct: "42" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/2-74-n-n.jpg", options: ["74", "24", "47", "هیچکدام"], correct: "74" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/3-6-n-n.jpg", options: ["6", "8", "3", "هیچکدام"], correct: "6" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/4-29-n-n.jpg", options: ["29", "70", "20", "هیچکدام"], correct: "29" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/5-57-n-n.jpg", options: ["57", "35", "75", "هیچکدام"], correct: "57" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/6-5-n-n.jpg", options: ["5", "2", "8", "هیچکدام"], correct: "5" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/7-3-n-n.jpg", options: ["3", "5", "8", "هیچکدام"], correct: "3" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/8-15-n-n.jpg", options: ["15", "51", "17", "هیچکدام"], correct: "15" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/9-73-n-n.jpg", options: ["73", "37", "23", "هیچکدام"], correct: "73" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/10-45-n-n.jpg", options: ["45", "54", "25", "هیچکدام"], correct: "45" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/11-16-n-n.jpg", options: ["16", "61", "18", "هیچکدام"], correct: "16" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/12-97-n-n.jpg", options: ["97", "79", "17", "هیچکدام"], correct: "97" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/13-26-n-n.jpg", options: ["26", "62", "28", "هیچکدام"], correct: "26" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/14-42-n-n.jpg", options: ["42", "24", "74", "هیچکدام"], correct: "42" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/15-7-n-n.jpg", options: ["7", "4", "9", "هیچکدام"], correct: "7" }
  ];
  let currentQuizeIshihara = 0;
  let scoreIshihara = 0;
  const quizIshihara = document.getElementById('quiz-ishihara');
  const progressbarnumberIshihara = document.getElementById('progressbarnumber-ishihara');
  const childbarIshihara = document.getElementById('childbar-ishihara');
  const imageIshihara = document.getElementById('mamad-ishihara');
  const questionIshihara = document.querySelector('#quiz-ishihara h3');
  const answersIshihara = document.querySelectorAll('#quiz-ishihara .answer');
  const btnNextIshihara = document.getElementById('btn-next-ishihara');
  const btnResetIshihara = document.getElementById('btn-reset-ishihara');
  function loadQuizeIshihara() {
    if (currentQuizeIshihara >= DataIshihara.length) {
      questionIshihara.style.display = "none";
      answersIshihara.forEach(answer => answer.parentElement.style.display = "none");
      btnNextIshihara.style.display = "none";
      btnResetIshihara.style.display = "block";
      imageIshihara.src = "";
      progressbarnumberIshihara.textContent = `امتیاز شما: ${scoreIshihara} از ${DataIshihara.length}`;
      return;
    }
    const currentData = DataIshihara[currentQuizeIshihara];
    imageIshihara.src = currentData.image;
    document.getElementById('option1-ishihara').innerHTML = `<span>${currentData.options[0]}</span>`;
    document.getElementById('option2-ishihara').innerHTML = `<span>${currentData.options[1]}</span>`;
    document.getElementById('option3-ishihara').innerHTML = `<span>${currentData.options[2]}</span>`;
    document.getElementById('option4-ishihara').innerHTML = `<span>${currentData.options[3]}</span>`;
    answersIshihara.forEach(answer => answer.checked = false);
    progressbarnumberIshihara.textContent = `سوال ${currentQuizeIshihara + 1} از ${DataIshihara.length}`;
    childbarIshihara.style.width = `${((currentQuizeIshihara + 1) / DataIshihara.length) * 100}%`;
    document.getElementById('nowShowPic-ishihara').style.display = "block";
    btnNextIshihara.style.display = "block";
  }
  function nowShowPicIshihara() {
    document.getElementById('nowShowPic-ishihara').style.display = "block";
  }
  btnNextIshihara.addEventListener('click', () => {
    const selectedAnswer = document.querySelector('input[name="answer-ishihara"]:checked');
    if (!selectedAnswer) {
      alert('لطفاً یک گزینه را انتخاب کنید.');
      return;
    }
    const answerText = document.querySelector(`label[for="${selectedAnswer.id}"] span`).textContent;
    if (answerText === DataIshihara[currentQuizeIshihara].correct) {
      scoreIshihara++;
    }
    currentQuizeIshihara++;
    loadQuizeIshihara();
  });
  btnResetIshihara.addEventListener('click', () => {
    currentQuizeIshihara = 0;
    scoreIshihara = 0;
    questionIshihara.style.display = "block";
    answersIshihara.forEach(answer => answer.parentElement.style.display = "block");
    btnResetIshihara.style.display = "none";
    loadQuizeIshihara();
  });
  loadQuizeIshihara();
}