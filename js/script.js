const CANVAS_QUIZ = 'canvas-quiz';
const CANVAS_INFO = 'canvas-info';

var quiz, info;
var option1, option2, option3, option4, option5, option6;
var toNext;

function changeLayer(front) {
  if (front == 'quiz') {
    quiz.style.zIndex = 1;
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
  
  option1.style.top = numToPxString(height * 0.6 + margin);
  option2.style.top = numToPxString(height * 0.6 + margin);
  option3.style.top = numToPxString(height * 0.6 + margin);
  option1.style.left = numToPxString(margin);
  option2.style.left = numToPxString(margin * 2 + buttonWidth);
  option3.style.left = numToPxString(margin * 3 + buttonWidth * 2);
  option1.style.width = numToPxString(buttonWidth);
  option2.style.width = numToPxString(buttonWidth);
  option3.style.width = numToPxString(buttonWidth);
  option1.style.height = numToPxString(buttonHeight);
  option2.style.height = numToPxString(buttonHeight);
  option3.style.height = numToPxString(buttonHeight);
  option4.style.top = numToPxString(height * 0.6 + buttonHeight + margin * 2);
  option5.style.top = numToPxString(height * 0.6 + buttonHeight + margin * 2);
  option6.style.top = numToPxString(height * 0.6 + buttonHeight + margin * 2);
  option4.style.left = numToPxString(margin);
  option5.style.left = numToPxString(margin * 2 + buttonWidth);
  option6.style.left = numToPxString(margin * 3 + buttonWidth * 2);
  option4.style.width = numToPxString(buttonWidth);
  option5.style.width = numToPxString(buttonWidth);
  option6.style.width = numToPxString(buttonWidth);
  option4.style.height = numToPxString(buttonHeight);
  option5.style.height = numToPxString(buttonHeight);
  option6.style.height = numToPxString(buttonHeight);
  toNext.style.top = numToPxString(height * 0.7 + margin);
  toNext.style.left = numToPxString(margin * 2 + buttonWidth);
  toNext.style.width = numToPxString(buttonWidth);
  toNext.style.height = numToPxString(buttonHeight);
}

function createQuiz(beforeUnit, afterUnit) {
  option1.innerHTML = '0.001 ' + afterUnit;
  option2.innerHTML = '0.01 ' + afterUnit;
  option3.innerHTML = '0.1 ' + afterUnit;
  option4.innerHTML = '10 ' + afterUnit;
  option5.innerHTML = '100 ' + afterUnit;
  option6.innerHTML = '1000 ' + afterUnit;
}

function drawText(canvas, text) {
  ctx = canvas.getContext('2d');
  ctx.fillStyle='#303030';
  ctx.font='60px "Yu Gothic"';
  ctx.textAlign='center';
  ctx.textBaseline='top';
  ctx.fillText(text, canvas.width/2, 0);
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
    drawText(quiz, '1dLは何Lかな？');
    changeLayer('quiz');
  });
  
  $('#button-info').on('click', function() {
    changeLayer('info');
    // alert("infoクリックされました");
  });
}

/*
container = document.getElementById(CONTAINER_ID);
canvas = document.getElementById(CANVAS_ID);
canvas.width = container.clientWidth;
canvas.height = canvas.width * 0.75;

cx = canvas.getContext('2d');

cx.fillStyle='#000';
cx.font='80px "Yu Gothic"';
// cx.textBaseline = 
cx.textAlign='center';
cx.textBaseline='top';
cx.fillText('1Lは何dLかな？', canvas.width/2, 0);

drawChara(cx, "images/sample2.png", 0, 0, canvas.width * 0.2);

createResult(canvas);
*/

