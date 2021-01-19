//select all elements
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
var help1counterTag = document.getElementById("help1counterTag");
const pause = document.getElementById("pause");

//create our questions
let questions = [
  {
    question:
      "Hány db elektor volt a különbség Joe Biden javára az idei elnökválasztás végén?",
    imgSrc: "img/vagoisti.png",
    choiceA: "66",
    choiceB: "58",
    choiceC: "74",
    correct: "C",
    hint:
      "nincs kedvem hinten agyalni, tessék a mo.: 74, a lényeg, hogy működik",
  },
  {
    question: "Mennyit ér a mai napon(dec24) 13:21 perckor az Apple részvény?",
    imgSrc: "img/vagoisti.png",
    choiceA: "116,58 USD",
    choiceB: "145,12 USD",
    choiceC: "130,6 USD",
    correct: "C",
    hint: "",
  },
  {
    question:
      "Mennyi Oscar-díjat sikerült bezsebelnie a Gyűrűk Ura harmadik, egyben legsikeresebb epizódjának?",
    imgSrc: "img/vagoisti.png",
    choiceA: "11",
    choiceB: "8",
    choiceC: "5",
    correct: "A",
    hint: "5-nél fixen több",
  },
  {
    question: "Melyik városban van a legtöbb metróállomás?",
    imgSrc: "img/vagoisti.png",
    choiceA: "Tokió",
    choiceB: "Sanghaj",
    choiceC: "New York",
    correct: "C",
  },
  {
    question: "Legkevesebb hány nyílból lehet kiszállni dartsban 301-ről?",
    imgSrc: "img/vagoisti.png",
    choiceA: "6",
    choiceB: "7",
    choiceC: "5",
    correct: "A",
  },
  {
    question: "Mészáros Lőrinc vagyona a 2019-es Forbes alapján?",
    imgSrc: "img/vagoisti.png",
    choiceA: "467 milliárd forint",
    choiceB: "677 milliárd forint",
    choiceC: "887 milliárd forint",
    correct: "A",
  },
];

//create some variables + adding value to helpcounters

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
var helpTimeout;
var isEnd = false;

//render a question
function renderQuestion() {
  let q = questions[runningQuestion];

  question.innerHTML = "<p>" + q.question + "</p>";
  qImg.innerHTML = "<img src=" + q.imgSrc + ">";
  choiceA.innerHTML = q.choiceA;
  choiceB.innerHTML = q.choiceB;
  choiceC.innerHTML = q.choiceC;
  choiceA.style.display = "inline-block";
  choiceB.style.display = "inline-block";
  choiceC.style.display = "inline-block";
  hintbox.style.display = "none";
  //ha vége van a tesztnek, de kíváncsiak a rossz, illetve jó megoldásaikra
  //lehetne külön fv-t írni rá, megteszem amikor kozmetikázom a jövőben
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

  //kattinthatóvá tesszük progress baron lévő kis köröket és ha vége a tesztnek, akkor átnyargalhatunk előbbi kérdésekhez megnézni, hogy mit rontottunk el
  //lehetne külön fv-be
  var elems = document.querySelectorAll(".prog");
  for (const elem of elems) {
    elem.addEventListener("click", function (event) {
      console.log("clicked on" + elem.id + "");
      if (lastQuestion) {
        runningQuestion = elem.id;
        renderQuestion();
        runningQuestion = lastQuestion;
      }
    });
  }
}

//counter render

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
        //end the quiz and show the result
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
    //progress color to green
    answerIsCorrect();
  } else {
    //answer is wrong
    //progress color to red
    answerIsWrong();
  }
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
  scoreDiv.style.display = "block";

  //calculate the amount of questions percent answered
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

//helptimeout
function HelpTimeOut() {
  helpTimeout = setTimeout(function () {
    isRunning = true;
  }, 3000);
}

//stop helptimeout to secure the case when the player press an answer in the timeout
function StopHelpTimeOut() {
  clearTimeout(helpTimeout);
  //otherwise isrunning keep being false
  isRunning = true;
}

//getting help
help1.addEventListener("click", function () {
  if (isRunning === true) {
    if (help1counter > 0) {
      help1counter--;
      help1counterTag.innerHTML = help1counter + " left";
      isRunning = false;
      //egyet levonunk a szamlalobol
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
    //wait 5 secs then run the time
    HelpTimeOut();
  } else {
    //isRunning = true;
  }
});

//getting help2 aka hintbox
help2.addEventListener("click", function () {
  if (isRunning === true) {
    isRunning = false;
    hintbox.style.display = "block";
    hintbox.innerHTML = "<p>" + questions[runningQuestion].hint + "</p>";
    //wait 3 secs then go on
    HelpTimeOut();
  } else {
    //isRunning = true;
  }
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
