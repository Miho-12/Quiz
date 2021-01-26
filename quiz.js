//select all required elements
const start = document.getElementById("start");
const quiz = document.getElementById("quiz");
const question = document.getElementById("question");
const qImg = document.getElementById("qImg");
var choiceA = document.getElementById("A");
var choiceB = document.getElementById("B");
var choiceC = document.getElementById("C");
const counter = document.getElementById("counter");
const timeGauge = document.getElementById("timeGauge");
const progress = document.getElementById("progress");
const scoreDiv = document.getElementById("scoreContainer");
const help1 = document.getElementById("help1");
const help2 = document.getElementById("help2");
const hintbox = document.getElementById("hintbox");
const hintbox_front = document.getElementById("hintbox-front");
const hintbox_back = document.getElementById("hintbox-back");
const hintparent = document.getElementById("hintparent");
var help1counterTag = document.getElementById("help1counterTag");
const pause = document.getElementById("pause");

//create our questions
let questions = [
  {
    question:
      "Mennyi Oscar-díjat sikerült bezsebelnie a Gyűrűk Ura </br> harmadik, egyben legsikeresebb epizódjának?",
    imgSrc: "img/vagoisti.png",
    choiceA: "11",
    choiceB: "8",
    choiceC: "5",
    correct: "A",
    hint: "5-nél fixen több",
  },
  {
    question:
      "Hányszor startolt el a SpaceX egyik hordozórakétájának</br> első fokozata és szállt vissza ugyanarra a helyre,</br> amivel rekordot döntött?",
    imgSrc: "img/vagoisti.png",
    choiceA: "3",
    choiceB: "6",
    choiceC: "7",
    correct: "C",
    hint: "prímszám",
  },
  {
    question:
      "Ki énekli a népszerű 'Nem csak a húszéveseké a világ'</br> című nótát?",
    imgSrc: "img/vagoisti.png",
    choiceA: "Koós János",
    choiceB: "Poór Péter",
    choiceC: "Aradszky László",
    correct: "C",
    hint: "2017-ben elhunyt :(",
  },
  {
    question:
      "Instagramon a legutóbbi Berki Krisztián szponzoráció</br> tartalma?",
    imgSrc: "img/vagoisti.png",
    choiceA: "Sportfogadási tipp",
    choiceB: "Sampon",
    choiceC: "Kocsimosó",
    correct: "A",
    hint: "Nem biztos, hogy a tudományos akadémiával kapcsolatos",
  },
  {
    question:
      "Mekkora sebességgel halad a Föld körüli pályán a nemzetközi</br> űrállomás kerekítve?",
    imgSrc: "img/vagoisti.png",
    choiceA: "27500 km/h",
    choiceB: "8500 km/h",
    choiceC: "16500 km/h",
    correct: "A",
    hint: "Koszter Marcziika vezeti",
  },
  {
    question: "Milyen messze van ez az űrállomás a Föld felszín?",
    imgSrc: "img/vagoisti.png",
    choiceA: "103 km",
    choiceB: "940 km",
    choiceC: "408 km",
    correct: "C",
  },
  {
    question: "Melyik városban van a legtöbb metróállomás?",
    imgSrc: "img/vagoisti.png",
    choiceA: "Tokió",
    choiceB: "Sanghaj",
    choiceC: "New York",
    correct: "C",
    hint: "Kérj -1-et ha elakadsz",
  },
  {
    question: "Budapesti metróvonalak összesített hossza?",
    imgSrc: "img/vagoisti.png",
    choiceA: "38,2 km",
    choiceB: "26,3 km",
    choiceC: "47,8 km",
    correct: "A",
    hint: "!Nem mindig a középső a jó választás!",
  },
  {
    question: "Legkevesebb hány nyílból lehet kiszállni dartsban 301-ről?",
    imgSrc: "img/vagoisti.png",
    choiceA: "6",
    choiceB: "7",
    choiceC: "5",
    correct: "A",
    hint: "3 nyílból 180, utána marad 121.",
  },
  {
    question: "Mennyi idős Szellő István, méltán híres televíziós bemondó?",
    imgSrc: "img/vagoisti.png",
    choiceA: "53",
    choiceB: "59",
    choiceC: "64",
    correct: "A",
    hint: " Az ősz haj öregít",
  },
];

//create some variables + adding value to helpcounter

const lastQuestion = questions.length - 1;
let runningQuestion = 0;
let count = 0;
const questionTime = 60; // 60s
const gaugeWidth = 150; // 150 px
const gaugeUnit = gaugeWidth / questionTime;
let TIMER;
let score = 0;
let isRunning = true;
let help1counter = 12;
let helpTimeout;
let isEnd = false;

function waitTheFLip() {
  if (runningQuestion != 0) {
    setTimeout(function () {
      hintbox_back.innerHTML = questions[runningQuestion].hint;
    }, 250);
  }
}

//render a question
function renderQuestion() {
  let q = questions[runningQuestion];

  //flip back the hint card before the new question appears
  hintbox.classList.remove("hintflip");
  if (runningQuestion != 0) {
    waitTheFLip();
    if (hintbox_back.style.display === "flex") {
      flipTimeout();
    }
  } else {
    hintbox_front.style.display = "flex";
    hintbox_back.style.display = "none";
    hintbox_back.innerHTML = questions[runningQuestion].hint;
  }

  question.innerHTML = "<p>" + q.question + "</p>";
  qImg.innerHTML = "<img src=" + q.imgSrc + ">";
  choiceA.innerHTML = q.choiceA;
  choiceB.innerHTML = q.choiceB;
  choiceC.innerHTML = q.choiceC;
  choiceA.style.display = "inline-block";
  choiceB.style.display = "inline-block";
  choiceC.style.display = "inline-block";

  //Colour change for the clickable progress circles when the quiz is finished
  if (isEnd) {
    scoreDiv.style.display = "none";
    if (q.correct == "A") {
      choiceA.style.color = "green";
      choiceB.style.color = "red";
      choiceC.style.color = "red";
    }
    if (q.correct == "B") {
      choiceA.style.color = "red";
      choiceB.style.color = "green";
      choiceC.style.color = "red";
    }
    if (q.correct == "C") {
      choiceA.style.color = "red";
      choiceB.style.color = "red";
      choiceC.style.color = "green";
    }
  }
}

start.addEventListener("click", startQuiz);

//start quiz
function startQuiz() {
  var audio = new Audio("audio/joestet.mp3");
  audio.play();
  start.style.display = "none";
  renderQuestion();
  quiz.style.display = "block";
  help1counterTag.innerHTML = help1counter + " left";
  renderProgress();
  renderCounter();
  TIMER = setInterval(renderCounter, 1000); //1000ms = 1s
}

//render progress
function renderProgress() {
  for (let qIndex = 0; qIndex <= lastQuestion; qIndex++) {
    progress.innerHTML += "<div class = 'prog' id=" + qIndex + "></div>";
  }

  // isEnd === true --> red and green circles are clickable and indicating the correct answer with a colour change(in renderQuestion()),
  // so you can find out your mistakes
  var elems = document.querySelectorAll(".prog");
  for (const elem of elems) {
    elem.addEventListener("click", function (event) {
      console.log("clicked on" + elem.id + "");
      if (isEnd) {
        runningQuestion = elem.id;
        renderQuestion();
        runningQuestion = lastQuestion;
      }
    });
  }
}

//Counter render
function renderCounter() {
  if (isRunning === true) {
    if (count <= questionTime) {
      counter.innerHTML = count;
      timeGauge.style.width = count * gaugeUnit + "px";
      count++;
      counter.style.color = "black";
      if (count >= questionTime - 4) {
        counter.style.color = "red";
      } else {
        if (count >= questionTime - 19) {
          counter.style.color = "yellow";
        }
      }
    } else {
      answerIsWrong();
      count = 0;
      if (runningQuestion < lastQuestion) {
        runningQuestion++;
        renderQuestion();
      } else {
        //end the quiz then show the result
        clearInterval(TIMER);
        scoreRender();
      }
    }
  }
}

//checkAnswer
function checkAnswer(answer) {
  if (answer == questions[runningQuestion].correct) {
    //answer is correct
    score++;
    //progress circle color to green
    answerIsCorrect();
    //play a simple audio
    var audio = new Audio("audio/jovalasz.mp3");
    audio.play();
  } else {
    //answer is wrong
    //progress color to red
    answerIsWrong();
    var audio = new Audio("audio/wrong answer.mp3");
    audio.play();
  }
  //if the time is paused via the -1 hint, then break the pause and continue the counting of the time from 0
  StopHelpTimeOut();
  count = 0;
  if (runningQuestion < lastQuestion) {
    runningQuestion++;
    renderQuestion();
  } else {
    //end the quiz and show the result
    clearInterval(TIMER);
    scoreRender();
  }
}

//answer is correct
function answerIsCorrect() {
  document.getElementById(runningQuestion).style.backgroundColor = "#0f0";
}

//answer is false
function answerIsWrong() {
  document.getElementById(runningQuestion).style.backgroundColor = "#f00";
}

//score render
function scoreRender() {
  isEnd = true;
  var audio = new Audio("audio/score_neszegyellje.mp3");
  audio.play();
  scoreDiv.style.display = "block";

  //calculate the amount of questions answered correctly
  const scorePercent = Math.round((100 * score) / questions.length);

  //choose the image based on the scorePercentage
  let img =
    scorePercent >= 80
      ? "img/5.png"
      : scorePercent >= 60
      ? "img/4.png"
      : scorePercent >= 40
      ? "img/3.png"
      : scorePercent >= 20
      ? "img/2.png"
      : "img/1.png";

  scoreDiv.innerHTML = "<img src=" + img + ">";
  scoreDiv.innerHTML += "<p>" + scorePercent + "%</p>";
}

//helptimeout, if you take a hint, you have 10 seconds extra time
function HelpTimeOut() {
  helpTimeout = setTimeout(function () {
    isRunning = true;
  }, 10000);
}

//stop helptimeout to secure the case when the player choosing an answer in the timeout
function StopHelpTimeOut() {
  clearTimeout(helpTimeout);
  //otherwise isRunning keeps being false
  isRunning = true;
}

//getting help
help1.addEventListener("click", function () {
  if (isRunning === true) {
    if (help1counter > 0) {
      //decrease the number of hints
      help1counter--;
      help1counterTag.innerHTML = help1counter + " left";

      //stop the time
      isRunning = false;

      //randomly took one of the wrong answers away
      //could be more elegant, and hopefully will be
      var x = Math.floor(Math.random() * 2);
      var y = runningQuestion;
      if (questions[runningQuestion].correct == "A") {
        if (x === 0) {
          choiceB.style.display = "none";
        } else {
          choiceC.style.display = "none";
        }
      }
      if (questions[runningQuestion].correct == "B") {
        if (x === 0) {
          choiceA.style.display = "none";
        } else {
          choiceC.style.display = "none";
        }
      }
      if (questions[runningQuestion].correct == "C") {
        if (x === 0) {
          choiceA.style.display = "none";
        } else {
          choiceB.style.display = "none";
        }
      }
    }
    //wait 10 secs then run the time
    HelpTimeOut();
  }
});

function flipTimeout() {
  setTimeout(function () {
    if (hintbox_back.style.display === "none") {
      hintbox_back.style.display = "flex";
      hintbox_front.style.display = "none";
    } else {
      hintbox_back.style.display = "none";
      hintbox_front.style.display = "flex";
    }
  }, 250);
}

//getting help2 aka hintbox
help2.addEventListener("click", function () {
  hintbox.classList.add("hintflip");
  flipTimeout();
});

//for emergency
function pauseTimer() {
  if (isRunning === true) {
    isRunning = false;
    pause.innerHTML = "Resume";
  } else {
    isRunning = true;
    pause.innerHTML = "Pause";
  }
}
