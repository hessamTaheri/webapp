function initHrrTest() {
  const DataHrr = [
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/HRR-1.jpg", options: ["<i class='fas fa-square'></i>", "<i class='fas fa-circle'></i>", "<i class='fas fa-star'></i>", "<i class='fas fa-times'></i>"], correct: "<i class='fas fa-square'></i>", correctText: "مربع" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/HRR-2.jpg", options: ["<i class='fas fa-star'></i>", "<i class='fas fa-caret-up'></i>", "<i class='fas fa-circle'></i>", "<i class='fas fa-times'></i>"], correct: "<i class='fas fa-star'></i>", correctText: "ستاره" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/HRR-3.jpg", options: ["<i class='fas fa-caret-up'></i>", "<i class='fas fa-square'></i>", "<i class='fas fa-star'></i>", "<i class='fas fa-times'></i>"], correct: "<i class='fas fa-caret-up'></i>", correctText: "مثلث" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/HRR-4.jpg", options: ["<i class='fas fa-circle'></i>", "<i class='fas fa-square'></i>", "<i class='fas fa-star'></i>", "<i class='fas fa-times'></i>"], correct: "<i class='fas fa-circle'></i>", correctText: "دایره" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/HRR-5.jpg", options: ["<i class='fas fa-star'></i>", "<i class='fas fa-caret-up'></i>", "<i class='fas fa-square'></i>", "<i class='fas fa-times'></i>"], correct: "<i class='fas fa-star'></i>", correctText: "ستاره" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/HRR-6.jpg", options: ["<i class='fas fa-square'></i>", "<i class='fas fa-circle'></i>", "<i class='fas fa-caret-up'></i>", "<i class='fas fa-times'></i>"], correct: "<i class='fas fa-square'></i>", correctText: "مربع" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/HRR-7.jpg", options: ["<i class='fas fa-caret-up'></i>", "<i class='fas fa-star'></i>", "<i class='fas fa-circle'></i>", "<i class='fas fa-times'></i>"], correct: "<i class='fas fa-caret-up'></i>", correctText: "مثلث" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/HRR-8.jpg", options: ["<i class='fas fa-circle'></i>", "<i class='fas fa-square'></i>", "<i class='fas fa-star'></i>", "<i class='fas fa-times'></i>"], correct: "<i class='fas fa-circle'></i>", correctText: "دایره" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/HRR-9.jpg", options: ["<i class='fas fa-star'></i>", "<i class='fas fa-caret-up'></i>", "<i class='fas fa-square'></i>", "<i class='fas fa-times'></i>"], correct: "<i class='fas fa-star'></i>", correctText: "ستاره" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/HRR-10.jpg", options: ["<i class='fas fa-square'></i>", "<i class='fas fa-circle'></i>", "<i class='fas fa-caret-up'></i>", "<i class='fas fa-times'></i>"], correct: "<i class='fas fa-square'></i>", correctText: "مربع" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/HRR-11.jpg", options: ["<i class='fas fa-circle'></i>", "<i class='fas fa-star'></i>", "<i class='fas fa-caret-up'></i>", "<i class='fas fa-times'></i>"], correct: "<i class='fas fa-circle'></i>", correctText: "دایره" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/HRR-12.jpg", options: ["<i class='fas fa-caret-up'></i>", "<i class='fas fa-square'></i>", "<i class='fas fa-star'></i>", "<i class='fas fa-times'></i>"], correct: "<i class='fas fa-caret-up'></i>", correctText: "مثلث" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/HRR-13.jpg", options: ["<i class='fas fa-star'></i>", "<i class='fas fa-circle'></i>", "<i class='fas fa-square'></i>", "<i class='fas fa-times'></i>"], correct: "<i class='fas fa-star'></i>", correctText: "ستاره" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/HRR-14.jpg", options: ["<i class='fas fa-square'></i>", "<i class='fas fa-caret-up'></i>", "<i class='fas fa-circle'></i>", "<i class='fas fa-times'></i>"], correct: "<i class='fas fa-square'></i>", correctText: "مربع" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/HRR-15.jpg", options: ["<i class='fas fa-circle'></i>", "<i class='fas fa-star'></i>", "<i class='fas fa-caret-up'></i>", "<i class='fas fa-times'></i>"], correct: "<i class='fas fa-circle'></i>", correctText: "دایره" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/HRR-16.jpg", options: ["<i class='fas fa-caret-up'></i>", "<i class='fas fa-square'></i>", "<i class='fas fa-star'></i>", "<i class='fas fa-times'></i>"], correct: "<i class='fas fa-caret-up'></i>", correctText: "مثلث" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/HRR-17.jpg", options: ["<i class='fas fa-star'></i>", "<i class='fas fa-circle'></i>", "<i class='fas fa-square'></i>", "<i class='fas fa-times'></i>"], correct: "<i class='fas fa-star'></i>", correctText: "ستاره" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/HRR-18.jpg", options: ["<i class='fas fa-square'></i>", "<i class='fas fa-caret-up'></i>", "<i class='fas fa-circle'></i>", "<i class='fas fa-times'></i>"], correct: "<i class='fas fa-square'></i>", correctText: "مربع" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/HRR-19.jpg", options: ["<i class='fas fa-circle'></i>", "<i class='fas fa-star'></i>", "<i class='fas fa-caret-up'></i>", "<i class='fas fa-times'></i>"], correct: "<i class='fas fa-circle'></i>", correctText: "دایره" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/HRR-20.jpg", options: ["<i class='fas fa-caret-up'></i>", "<i class='fas fa-square'></i>", "<i class='fas fa-star'></i>", "<i class='fas fa-times'></i>"], correct: "<i class='fas fa-caret-up'></i>", correctText: "مثلث" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/HRR-21.jpg", options: ["<i class='fas fa-star'></i>", "<i class='fas fa-circle'></i>", "<i class='fas fa-square'></i>", "<i class='fas fa-times'></i>"], correct: "<i class='fas fa-star'></i>", correctText: "ستاره" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/HRR-22.jpg", options: ["<i class='fas fa-square'></i>", "<i class='fas fa-caret-up'></i>", "<i class='fas fa-circle'></i>", "<i class='fas fa-times'></i>"], correct: "<i class='fas fa-square'></i>", correctText: "مربع" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/HRR-23.jpg", options: ["<i class='fas fa-circle'></i>", "<i class='fas fa-star'></i>", "<i class='fas fa-caret-up'></i>", "<i class='fas fa-times'></i>"], correct: "<i class='fas fa-circle'></i>", correctText: "دایره" },
    { image: "https://www.koorrangi.ir/wp-content/uploads/2023/07/HRR-24.jpg", options: ["<i class='fas fa-caret-up'></i>", "<i class='fas fa-square'></i>", "<i class='fas fa-star'></i>", "<i class='fas fa-times'></i>"], correct: "<i class='fas fa-caret-up'></i>", correctText: "مثلث" }
  ];
  let currentQuizeHrr = 0;
  let scoreHrr = 0;
  const quizHrr = document.getElementById('quiz-hrr');
  const progressbarnumberHrr = document.getElementById('progressbarnumber-hrr');
  const childbarHrr = document.getElementById('childbar-hrr');
  const imageHrr = document.getElementById('mamad-hrr');
  const questionHrr = document.querySelector('#quiz-hrr h3');
  const answersHrr = document.querySelectorAll('#quiz-hrr .answer');
  const btnNextHrr = document.getElementById('btn-next-hrr');
  const btnResetHrr = document.getElementById('btn-reset-hrr');
  function loadQuizeHrr() {
    if (currentQuizeHrr >= DataHrr.length) {
      questionHrr.style.display = "none";
      answersHrr.forEach(answer => answer.parentElement.style.display = "none");
      btnNextHrr.style.display = "none";
      btnResetHrr.style.display = "block";
      imageHrr.src = "";
      progressbarnumberHrr.textContent = `امتیاز شما: ${scoreHrr} از ${DataHrr.length}`;
      return;
    }
    const currentData = DataHrr[currentQuizeHrr];
    imageHrr.src = currentData.image;
    document.getElementById('option1-hrr').innerHTML = currentData.options[0];
    document.getElementById('option2-hrr').innerHTML = currentData.options[1];
    document.getElementById('option3-hrr').innerHTML = currentData.options[2];
    document.getElementById('option4-hrr').innerHTML = currentData.options[3];
    answersHrr.forEach(answer => answer.checked = false);
    progressbarnumberHrr.textContent = `سوال ${currentQuizeHrr + 1} از ${DataHrr.length}`;
    childbarHrr.style.width = `${((currentQuizeHrr + 1) / DataHrr.length) * 100}%`;
    document.getElementById('nowShowPic-hrr').style.display = "block";
    btnNextHrr.style.display = "block";
  }
  function nowShowPicHrr() {
    document.getElementById('nowShowPic-hrr').style.display = "block";
  }
  btnNextHrr.addEventListener('click', () => {
    const selectedAnswer = document.querySelector('input[name="answer-hrr"]:checked');
    if (!selectedAnswer) {
      alert('لطفاً یک گزینه را انتخاب کنید.');
      return;
    }
    const answerText = document.querySelector(`label[for="${selectedAnswer.id}"]`).innerHTML;
    if (answerText === DataHrr[currentQuizeHrr].correct) {
      scoreHrr++;
    }
    currentQuizeHrr++;
    loadQuizeHrr();
  });
  btnResetHrr.addEventListener('click', () => {
    currentQuizeHrr = 0;
    scoreHrr = 0;
    questionHrr.style.display = "block";
    answersHrr.forEach(answer => answer.parentElement.style.display = "block");
    btnResetHrr.style.display = "none";
    loadQuizeHrr();
  });
  loadQuizeHrr();
}