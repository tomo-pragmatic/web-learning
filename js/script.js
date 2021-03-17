const CANVAS_QUIZ = 'canvas-quiz';
const CANVAS_INFO = 'canvas-info';

var quiz, info;
var option1, option2, option3, option4, option5, option6;
var toNext;
var question;

function changeLayer(front) {
  if (front == 'quiz') {
    quiz.style.zIndex = 1;
    question.style.zIndex = 2;
    option1.style.zIndex = 2;
    option2.style.zIndex = 2;
    option3.style.zIndex = 2;
    option4.style.zIndex = 2;
    option5.style.zIndex = 2;
    option6.style.zIndex = 2;
    info.style.zIndex = 0;
    toNext.style.zIndex = 0;
  } else {
    info.style.zIndex = 1;
    toNext.style.zIndex = 2;
    quiz.style.zIndex = 0;
    question.style.zIndex = 0;
    option1.style.zIndex = 0;
    option2.style.zIndex = 0;
    option3.style.zIndex = 0;
    option4.style.zIndex = 0;
    option5.style.zIndex = 0;
    option6.style.zIndex = 0;
  }
}


function numToPxString(num) {
  return (num.toString() + 'px');
}

function adjust(element, top, left, width, height, fontSize) {
  element.style.top = numToPxString(top);
  element.style.left = numToPxString(left);
  element.style.width = numToPxString(width);
  element.style.height = numToPxString(height);
  element.style.fontSize = numToPxString(fontSize);
}

function arrange() {
  base = document.getElementById('base');
  quiz = document.getElementById('canvas-quiz');
  info = document.getElementById('canvas-info');

  width = Math.min(base.clientWidth, 600);
  quiz.width = width;
  info.width = width;

  height = width * 1.0;
  base.style.height = numToPxString(height * 1.1);
  quiz.height = height;
  info.height = height;

  cxq = quiz.getContext('2d');
  cxq.fillStyle = 'aliceblue';
  cxq.fillRect(0, 0, quiz.width, quiz.height);
  cxi = info.getContext('2d');
  cxi.fillStyle = 'aliceblue';
  cxi.fillRect(0, 0, info.width, info.height);

  question = document.getElementById('question');
  question.innerHTML = '1Lは何dLかな？';
  question.style.top = 0;
  question.style.width = numToPxString(quiz.width);
  question.style.left = 0;
  question.style.fontSize = numToPxString(width/10);

  option1 = document.getElementById('option1');
  option2 = document.getElementById('option2');
  option3 = document.getElementById('option3');
  option4 = document.getElementById('option4');
  option5 = document.getElementById('option5');
  option6 = document.getElementById('option6');
  toNext  = document.getElementById('to-next');

  const MARGIN_RATE = 0.02;
  margin = width * MARGIN_RATE;
  buttonWidth = (width - margin * 4) / 3;
  buttonHeight = (height * 0.4 - margin * 3) / 2;
  fontSize = width / 15;

  adjust(option1, height * 0.6 + buttonHeight * 0 + margin * 1, margin * 1 + buttonWidth * 0, buttonWidth, buttonHeight, fontSize);
  adjust(option2, height * 0.6 + buttonHeight * 0 + margin * 1, margin * 2 + buttonWidth * 1, buttonWidth, buttonHeight, fontSize);
  adjust(option3, height * 0.6 + buttonHeight * 0 + margin * 1, margin * 3 + buttonWidth * 2, buttonWidth, buttonHeight, fontSize);
  adjust(option4, height * 0.6 + buttonHeight * 1 + margin * 2, margin * 1 + buttonWidth * 0, buttonWidth, buttonHeight, fontSize);
  adjust(option5, height * 0.6 + buttonHeight * 1 + margin * 2, margin * 2 + buttonWidth * 1, buttonWidth, buttonHeight, fontSize);
  adjust(option6, height * 0.6 + buttonHeight * 1 + margin * 2, margin * 3 + buttonWidth * 2, buttonWidth, buttonHeight, fontSize);
  adjust(toNext, height * 0.7 + margin, width / 4, width / 2, buttonHeight, fontSize);
  
}

function createQuiz(beforeUnit, afterUnit) {
  option1.innerHTML = '0.001 ' + afterUnit;
  option2.innerHTML = '0.01 ' + afterUnit;
  option3.innerHTML = '0.1 ' + afterUnit;
  option4.innerHTML = '10 ' + afterUnit;
  option5.innerHTML = '100 ' + afterUnit;
  option6.innerHTML = '1000 ' + afterUnit;
}

function drawChara(context, imagePath, x, y, width) {
  chara = new Image();
  chara.src = imagePath;
  chara.onload = () => {
    height = width * chara.naturalHeight / chara.naturalWidth;
    context.drawImage(chara, x, y, width, height);
  }
}

function createResult() {
  const p = document.getElementById("canvas");
  const cnv = document.createElement("canvas");
  // cnv.classList.add("class-name");
  cnv.setAttribute("width", p.width/2);
  cnv.setAttribute("height", p.height/2);
  cnv.style.zIndex = 1;
  cnv.style.position = 'absolute';
  cnv.style.padding = 0;
  const x = cnv.getContext('2d');
  x.fillStyle = '#000';
  x.fillRect(0, 0, cnv.width, cnv.height);
  p.appendChild(cnv);
  p.style.zIndex = 0;
  // x.fillText("ABC", 100, 0);
}

/* initialize at page load. */
arrange();

window.onload = function() { 
  $('#button-quiz').on('click', function() {
    // alert("quizクリックされました");
    createQuiz('L','mL');
    changeLayer('quiz');
  });
  
  $('#button-info').on('click', function() {
    changeLayer('info');
    // alert("infoクリックされました");
  });
}

