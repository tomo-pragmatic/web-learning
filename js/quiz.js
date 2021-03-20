const QUESTIONS = [
  ['mm', 'm',  0], ['m',  'mm', 5], ['cm', 'm',  1], ['m',  'cm', 4],
  ['mm', 'cm', 2], ['cm', 'mm', 3], ['L',  'dL', 3], ['dL', 'L',  2],
  ['L',  'mL', 5], ['mL', 'L',  0], ['mL', 'dL', 1], ['dL', 'mL', 4],
  ['kg', 'g',  5], ['g',  'kg', 0]
];

const IMG_TITLE   = ['sumi01'];
const IMG_QUSET   = ['neko01', 'peng01', 'siro01', 'toka01'];
const IMG_CORRECT = ['neko01', 'neko02', 'neko03', 'sumi01', 'tapi01', 'toka01',
                     'toka02', 'toka03', 'toka04', 'toka05', 'toka06', 'toka07',
                     'zaso01'];
const IMG_MISTAKE = ['hiyo01', 'peng01', 'peng02', 'toka01'];
const IMG_PRIZE   = ['mini01', 'mini02', 'peng01', 'sumi01', 'sumi02', 'sumi03',
                     'sumi04', 'toka01', 'toka02', 'toka03', 'toka04'];

/* Utility functions */
function numToPxString(num) {
  return (num.toString() + 'px');
}

function selectRandom(anyArray) {
  return anyArray[Math.floor(Math.random() * Math.floor(anyArray.length))];
}
/* ----------------- */

class Question {
  constructor(index) {
    var res = selectRandom(QUESTIONS);
    this.quizText = '問' + index.toString() + '. '
                  + '1' + res[0] + 'は何' + res[1] + 'かな？';
    this.options = Array(6);
    this.options[0] = '0.001 ' + res[1];
    this.options[1] = '0.01 '  + res[1];
    this.options[2] = '0.1 '   + res[1];
    this.options[3] = '10 '    + res[1];
    this.options[4] = '100 '   + res[1];
    this.options[5] = '1000 '  + res[1];
    this.correctIndex = res[2];
  }
}

class QuizManager {
  constructor() {
    this.QUIZ_NUM = 5;
    this.question = null;
    this.index = 0;
  }
  
  init() {
    this.index = 0;
  }

  next() {
    this.index++;
  }

  getQuestion() {
    this.question = new Question(this.index);
    return this.question;
  }

  ask(answer) {
    if (answer != this.question.correctIndex) {
      return 'mistake';
    } else {
      if (this.index < this.QUIZ_NUM) {
        return 'correct';
      } else {
        return 'clear';
      }
    }
  }

}

class Canvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');
  }

  setSize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.context.fillStyle = 'aliceblue';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  setZIndex(index) {
    this.canvas.style.zIndex = index;
  }

  drawChara(imageType) {
    this.context.fillStyle = 'alicebule';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    var chara = new Image();
    chara.src = imageType == 'question' ? 'images/question/' + selectRandom(IMG_QUSET) + '.jpg'
              : imageType == 'correct'  ? 'images/correct/'  + selectRandom(IMG_CORRECT) + '.jpg'
              : imageType == 'mistake'  ? 'images/mistake/'  + selectRandom(IMG_MISTAKE) + '.jpg'
              : imageType == 'prize'    ? 'images/prize/'    + selectRandom(IMG_PRIZE) + '.jpg'
              : 'images/title/' + selectRandom(IMG_TITLE) + '.jpg';
    var drawTop    = this.canvas.width / 10; // need to modify.
    var drawHeight = this.canvas.width / 2; // need to modify.
    var drawWidth  = this.canvas.width;
    chara.onload = () => {
      if ((drawWidth / chara.naturalWidth) < (drawHeight / chara.naturalHeight)) {
        var width  = drawWidth;
        var height = width * chara.naturalHeight / chara.naturalWidth;
      } else {
        var height = drawHeight;
        var width  = height * chara.naturalWidth / chara.naturalHeight;
      }
      var top  = drawTop + drawHeight / 2 - height / 2;
      var left = drawWidth / 2 - width / 2;
      this.context.drawImage(chara, left, top, width, height);
    }
  }
}

class Button {
  constructor(buttonId) {
    this.id = buttonId;
    this.button = document.getElementById(buttonId);
  }

  setSize(top, left, width, height) {
    this.button.style.top = numToPxString(top);
    this.button.style.left = numToPxString(left);
    this.button.style.width = numToPxString(width);
    this.button.style.height = numToPxString(height);
  }

  setFontSize(fontSize) {
    this.button.style.fontSize = numToPxString(fontSize);
  }

  setZIndex(index) {
    this.button.style.zIndex = index;
  }

  setCaption(text) {
    this.button.innerHTML = text;
  }

  setClickEvent(func) {
    $('#' + this.id).off('click');
    $('#' + this.id).on('click', function () {
      func();
    });
  }
}

class Label {
  constructor(labelId) {
    this.label = document.getElementById(labelId);
  }

  setSize(top, left, width, height) {
    this.label.style.top = numToPxString(top);
    this.label.style.left = numToPxString(left);
    this.label.style.width = numToPxString(width);
    this.label.style.height = numToPxString(height);
  }

  setFontSize(fontSize) {
    this.label.style.fontSize = numToPxString(fontSize);
  }

  setZIndex(index) {
    this.label.style.zIndex = index;
  }

  setText(text) {
    this.label.innerHTML = text;
  }
}

class UI {
  constructor() {
    this.base = document.getElementById('base');
    this.quiz = new Canvas('canvas-quiz');
    this.info = new Canvas('canvas-info');
    this.message = new Label('message');
    this.options = Array(6);
    for (let i = 0; i < 6; i++) {
        this.options[i] = new Button('option' + (i + 1).toString());
    }
    this.toNext = new Button('to-next');
    this.toTitle = new Button('to-title');
    this.quizer = new QuizManager();
  }

  adjustDisplay() {
    var width = Math.min(this.base.clientWidth, 1600);
    var height = width * 1.0;
    var fontSize = width / 10;

    document.getElementById('top-space').style.height = numToPxString(width * 0.2);
    this.base.style.height = numToPxString(height);
    this.quiz.setSize(width, height);
    this.info.setSize(width, height);
    this.message.setSize(0, 0, width, fontSize);
    this.message.setFontSize(fontSize);

    const TOP_RATE = 0.6;
    var margin = width * 0.04;
    var buttonWidth = (width - margin * 4) / 3;
    var buttonHeight = (height * (1 - TOP_RATE) - margin * 3) / 2;
    var topOffset = height * TOP_RATE + margin;
    var buttonFontSize = width / 20;

    for (let i = 0; i < 6; i++) {
      var row = Math.floor(i / 3);
      this.options[i].setSize(topOffset + (buttonHeight + margin) * row,
                              margin * (i % 3 + 1) + (buttonWidth * (i % 3)),
                              buttonWidth,
                              buttonHeight);
      this.options[i].setFontSize(buttonFontSize);
    }

    this.toNext.setSize(height * 0.7 + margin, width / 4, width / 2, buttonHeight);
    this.toNext.setFontSize(buttonFontSize);

    this.toTitle.setSize(height + margin * 6, 0, width, buttonHeight);
    this.toTitle.setFontSize(buttonFontSize);
  }

  changeLayer(front, isButtonHide = false) {
    if (front == 'quiz') {
      this.quiz.setZIndex(1);
      for (let i = 0; i < 6; i++) {
        this.options[i].setZIndex(2);
      }
      this.info.setZIndex(0);
      this.toNext.setZIndex(0);
    } else {
      this.info.setZIndex(1);
      this.toNext.setZIndex(isButtonHide ? 0 : 2);
      this.quiz.setZIndex(0);
      for (let i = 0; i < 6; i++) {
        this.options[i].setZIndex(0);
      }
    }
    this.message.setZIndex(2);
  }

  createTitle() {
    this.quizer.init();
    this.toNext.setCaption('クイズをはじめる');
    this.message.setText('単位クイズ！いえーい！！');
    this.info.drawChara('title');
    this.changeLayer('info');
  }
  
  createQuestion() {
    this.quiz.drawChara('question');
    this.quizer.next();
    var question = this.quizer.getQuestion();
    this.message.setText(question.quizText);
    for (let i = 0; i < 6; i++) {
      this.options[i].setCaption(question.options[i]);
    }
    this.changeLayer('quiz');
  }

  createResult(index) {
    var result = this.quizer.ask(index);
    switch (result) {
      case 'correct':
        this.message.setText('せいかーい！');
        this.info.drawChara('correct');
        this.toNext.setCaption('つぎの問題');
        this.changeLayer('info');
        break;
      case 'clear':
        this.message.setText('クリア！おめでとう！！');
        this.info.drawChara('prize');
        this.changeLayer('info', true);
        break;
      default:
        this.message.setText('ざんねん...。');
        this.info.drawChara('mistake');
        this.changeLayer('info', true);
        break;
    }
  }

  setInitialEvents(self) {
    this.toNext.setClickEvent(function() {
      self.createQuestion();
    });

    this.toTitle.setClickEvent(function() {
      self.createTitle();
    });

    for (let i = 0; i < 6; i++) {
      this.options[i].setClickEvent(function() {
        self.createResult(i);
      });
    }
  }

  run() {
    this.adjustDisplay();
    this.setInitialEvents(this);
    this.createTitle();
  }
}

window.onload = function() {
  var ui = new UI();
  ui.run();
}
