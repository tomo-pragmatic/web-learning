const QUESTIONS = [
  ['mm', 'm', 0], ['m', 'mm', 5], ['cm', 'm', 1], ['m', 'cm', 4], ['mm', 'cm', 2], ['cm', 'mm', 3],
  ['L', 'dL', 3], ['dL', 'L', 2], ['L', 'mL', 5], ['mL', 'L', 0], ['mL', 'dL', 1], ['dL', 'mL', 4],
  ['kg', 'g', 5], ['g', 'kg', 0]
];

const IMG_QUSET = ['shirokuma1'];
const IMG_CORRECT = ['neko1'];
const IMG_MISTAKE = ['tokage1'];
const IMG_PRIZE = ['prize1'];

var quiz, info, quizCtx, infoCtx;
var options = Array(6);
var toNext, toTitle;
var message;
var drawTop, drawWidth, drawHeight;
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
  setMessage('単位クイズ！いえーい！');
  drawChara(infoCtx, 'images/title/title1.png');
  changeLayer('info');
}

function correctBehaviour() {
  if (quizIndex < 3) {
    setMessage('せいかーい！');
    drawChara(infoCtx, 'images/correct/' + selectRandom(IMG_CORRECT) + '.png');
    setButtonCaption('つぎの問題');
    changeLayer('info');
  } else {
    setMessage('クリア！おめでとう！！');
    drawChara(infoCtx, 'images/prize/' + selectRandom(IMG_PRIZE) + '.png');
    changeLayer('info', true);
  }
}

function mistakeBehaviour() {
  setMessage('ざんねん...。');
  drawChara(infoCtx, 'images/mistake/' + selectRandom(IMG_MISTAKE) + '.png');
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

function selectRandom(anyArray) {
  return anyArray[Math.floor(Math.random() * Math.floor(anyArray.length))];
}

function createQuiz() {
  q = selectRandom(QUESTIONS);
  setQuestion(q[0], q[1]);
  drawChara(quizCtx, 'images/question/' + selectRandom(IMG_QUSET) + '.png');
  setOptions(q[1], q[2]);
}

function drawChara(context, imagePath) {
  context.fillStyle = 'aliceblue';
  context.fillRect(0, 0, quiz.width, quiz.height);

  chara = new Image();
  chara.src = imagePath;
  chara.onload = () => {
    if ((drawWidth / chara.naturalWidth) < (drawHeight / chara.naturalHeight)) {
      width = drawWidth;
      height = width * chara.naturalHeight / chara.naturalWidth;
    } else {
      height = drawHeight;
      width = height * chara.naturalWidth / chara.naturalHeight;
    }
    top_pos = drawTop + drawHeight/2 - height/2;
    left_pos = drawWidth/2 - width/2;
    context.drawImage(chara, left_pos, top_pos, width, height);
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
  drawWidth = width;
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
  fontSize = width / 10;
  message.style.fontSize = numToPxString(fontSize);
  for (let i = 0; i < 6; i++) {
    options[i] = document.getElementById('option' + (i+1).toString());
  }
  toNext  = document.getElementById('to-next');
  toTitle = document.getElementById('to-title');

  drawTop = fontSize;
  const MARGIN_RATE = 0.04;
  const TOP_RATE = 0.6;
  drawHeight = height * TOP_RATE - drawTop;

  margin = width * MARGIN_RATE;
  buttonWidth = (width - margin * 4) / 3;
  buttonHeight = (height * (1 - TOP_RATE) - margin * 3) / 2;
  fontSize = width / 20;

  for (let i = 0; i < 6; i++) {
    coef = Math.floor(i/3);
    adjust(options[i],
           height * TOP_RATE + buttonHeight * coef + margin * (coef + 1),
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
