const CANVAS_QUIZ = 'canvas-quiz';
const CANVAS_INFO = 'canvas-info';

var quiz, info;

function changeLayer(front) {
  if (front == 'quiz') {
    quiz.style.zIndex = 1;
    info.style.zIndex = 0;
  } else {
    info.style.zIndex = 1;
    quiz.style.zIndex = 0;
  }
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
base = document.getElementById('base');
quiz = document.getElementById('canvas-quiz');
info = document.getElementById('canvas-info');

w = base.clientWidth;
quiz.width = w;
info.width = w;
quiz.height = w * 0.5;
info.height = w * 0.5;
base.style.height = ((w * 0.55).toString(10) + "px");

window.onload = function() { 
  $('#button-quiz').on('click', function() {
    // alert("quizクリックされました");
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

