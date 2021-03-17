const QUESTIONS = [
  ['mm', 'm', 0], ['m', 'mm', 5], ['cm', 'm', 1], ['m', 'cm', 4], ['mm', 'cm', 2], ['cm', 'mm', 3],
  ['L', 'dL', 3], ['dL', 'L', 2], ['L', 'mL', 5], ['mL', 'L', 0], ['mL', 'dL', 1], ['dL', 'mL', 4],
  ['kg', 'g', 5], ['g', 'kg', 0]
];

var quiz, info, quizCtx, infoCtx;
var options = Array(6);
var toNext, toTitle;
var message;
var quizIndex = 0;

function changeLayer(front, isButtonHide = false) {
  if (front == 'quiz') {
    quiz.style.zIndex = 1;
    for (let i = 0; i < 6; i++) {
      options[i].style.zIndex = 2;
    }
    info.style.zIndex = 0;
    toNext.style.zIndex = 0;
  } else {
    info.style.zIndex = 1;
    toNext.style.zIndex = isButtonHide ? 0 : 2;
    quiz.style.zIndex = 0;
    for (let i = 0; i < 6; i++) {
      options[i].style.zIndex = 0;
    }
  }

  message.style.zIndex = 2;
}

function displayTitle() {
  setButtonCaption('クイズをはじめる');
  setMessage('めざせ！10問！');
  drawChara(infoCtx, 'images/title/title1.png');
  changeLayer('info');
}

function correctBehaviour() {
  if (quizIndex < 3) {
    setMessage('せいかーい！');
    drawChara(infoCtx, 'images/correct/neko1.png');
    setButtonCaption('つぎの問題');
    changeLayer('info');
  } else {
    setMessage('クリア！おめでとう！！');
    drawChara(infoCtx, 'images/prize/prize1.png');
    changeLayer('info', true);
  }
}

function mistakeBehaviour() {
  setMessage('ざんねん...。');
  drawChara(infoCtx, 'images/mistake/tokage1.png');
  changeLayer('info', true);
}

function setButtonCaption(text) {
  toNext.innerHTML = text;
}

function setMessage(text) {
  message.innerHTML = text;
}

function setQuestion(beforeUnit, afterUnit) {
  setMessage('1' + beforeUnit + 'は何' + afterUnit + 'かな？');
}

function setOptions(unit, correctIndex) {
  options[0].innerHTML = '0.001 ' + unit;
  options[1].innerHTML = '0.01 ' + unit;
  options[2].innerHTML = '0.1 ' + unit;
  options[3].innerHTML = '10 ' + unit;
  options[4].innerHTML = '100 ' + unit;
  options[5].innerHTML = '1000 ' + unit;

  for (let i = 0; i < 6; i++) {
    $('#' + options[i].id).off('click');
    if (i == correctIndex) {
      $('#' + options[i].id).on('click', function() {
        correctBehaviour();
      });
    } else {
      $('#' + options[i].id).on('click', function() {
        mistakeBehaviour();
      });
    }
  }
}

function createQuiz() {
  q = QUESTIONS[Math.floor(Math.random() * Math.floor(QUESTIONS.length))];
  setQuestion(q[0], q[1]);
  drawChara(quizCtx, 'images/question/shirokuma1.png');
  setOptions(q[1], q[2]);
}

function drawChara(context, imagePath) {
  context.fillStyle = 'aliceblue';
  context.fillRect(0, 0, quiz.width, quiz.height);

  width = 300;
  chara = new Image();
  chara.src = imagePath;
  chara.onload = () => {
    height = width * chara.naturalHeight / chara.naturalWidth;
    context.drawImage(chara, 100, 100, width, height);
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

function initialArrange() {
  base = document.getElementById('base');
  quiz = document.getElementById('canvas-quiz');
  info = document.getElementById('canvas-info');

  width = Math.min(base.clientWidth, 1600);
  quiz.width = width;
  info.width = width;

  height = width * 1.0;
  base.style.height = numToPxString(height * 1);
  quiz.height = height;
  info.height = height;

  quizCtx = quiz.getContext('2d');
  quizCtx.fillStyle = 'aliceblue';
  quizCtx.fillRect(0, 0, quiz.width, quiz.height);
  infoCtx = info.getContext('2d');
  infoCtx.fillStyle = 'aliceblue';
  infoCtx.fillRect(0, 0, info.width, info.height);

  message = document.getElementById('message');
  message.style.top = 0;
  message.style.width = numToPxString(quiz.width);
  message.style.left = 0;
  message.style.fontSize = numToPxString(width/10);
  for (let i = 0; i < 6; i++) {
    options[i] = document.getElementById('option' + (i+1).toString());
  }
  toNext  = document.getElementById('to-next');
  toTitle = document.getElementById('to-title');

  const MARGIN_RATE = 0.04;
  margin = width * MARGIN_RATE;
  buttonWidth = (width - margin * 4) / 3;
  buttonHeight = (height * 0.4 - margin * 3) / 2;
  fontSize = width / 20;

  for (let i = 0; i < 6; i++) {
    coef = Math.floor(i/3);
    adjust(options[i],
           height * 0.6 + buttonHeight * coef + margin * (coef + 1),
           margin * (i%3 + 1) + (buttonWidth * (i%3)),
           buttonWidth, buttonHeight, fontSize
      );
  }
  adjust(toNext,  height * 0.7 + margin, width / 4, width / 2, buttonHeight, fontSize);
  adjust(toTitle, height + margin * 5, quiz.style.left, quiz.width, buttonHeight, fontSize);
  
  displayTitle();
}

/* initialize at page load. */
initialArrange();

window.onload = function() { 
  $('#to-next').on('click', function() {
    quizIndex++;
    createQuiz();
    changeLayer('quiz');
  });

  $('#to-title').on('click', function() {
    quizIndex = 0;
    displayTitle();
  });
}
