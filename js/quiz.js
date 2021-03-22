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
function numToPx(num) {
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

        this.context.fillStyle = 'aliceblue';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    setSize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        // this.context.fillStyle = 'aliceblue';
        // this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    setZIndex(index) {
        this.canvas.style.zIndex = index;
    }

    drawChara(imageType) {
        this.context.fillStyle = 'alicebule';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        var chara = new Image();
        chara.src = imageType == 'question' ? 'images/question/' + selectRandom(IMG_QUSET)   + '.jpg'
                  : imageType == 'correct'  ? 'images/correct/'  + selectRandom(IMG_CORRECT) + '.jpg'
                  : imageType == 'mistake'  ? 'images/mistake/'  + selectRandom(IMG_MISTAKE) + '.jpg'
                  : imageType == 'prize'    ? 'images/prize/'    + selectRandom(IMG_PRIZE)   + '.jpg'
                  : 'images/title/' + selectRandom(IMG_TITLE) + '.jpg';
        
        chara.onload = () => {
            if ((this.canvas.width / chara.naturalWidth) < (this.canvas.height / chara.naturalHeight)) {
                var width  = this.canvas.width;
                var height = width * chara.naturalHeight / chara.naturalWidth;
            } else {
                var height = this.canvas.height;
                var width  = height * chara.naturalWidth / chara.naturalHeight;
            }
            var left = this.canvas.width / 2 - width / 2;
            this.context.drawImage(chara, left, 0, width, height);
        }
    }
}

class IdentifiedControl {
    constructor(elementId) {
        this.id = elementId;
        this.ctrl = document.getElementById(elementId);
    }

    hide() {
        this.ctrl.style.display = 'none';
    }

    show() {
        this.ctrl.style.display = 'block';
    }

    setSize(top, left, width, height) {
        if (top    != null) this.ctrl.style.top    = numToPx(top);
        if (left   != null) this.ctrl.style.left   = numToPx(left);
        if (width  != null) this.ctrl.style.width  = numToPx(width);
        if (height != null) this.ctrl.style.height = numToPx(height);
    }

    setFontSize(fontSize) {
        this.ctrl.style.fontSize = numToPx(fontSize);
    }

    setZIndex(index) {
        this.ctrl.style.zIndex = index;
    }

    setCaption(text) {
        this.ctrl.innerHTML = text;
    }

    setClickEvent(func) {
        $('#' + this.id).off('click');
        $('#' + this.id).on('click', function () {
            func();
        });
    }
}

class Button extends IdentifiedControl {
    /*
    constructor(buttonId) {
        this.id = buttonId;
        this.button = document.getElementById(buttonId);
    }

    hide() {
        this.button.style.display = 'none';
    }

    show() {
        this.button.style.display = 'block';
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
    */
}

class Label extends IdentifiedControl {
    /*
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
    */
}

class UI {
    constructor() {
        this.message = new Label('message');
        this.canvas  = new Canvas('canvas');
        this.options = Array(6);
        for (let i = 0; i < 6; i++) {
            this.options[i] = new Button('option' + (i + 1).toString());
        }
        this.toNext = new Button('to-next');
        this.toTitle = new Button('to-title');
        this.quizer = new QuizManager();
    }

    adjustDisplay() {
        var topSpace = document.getElementById('top-space');
        var width = Math.min(topSpace.clientWidth, 1600);
        topSpace.style.height = numToPx(width * 0.2);

        this.message.setFontSize(width / 10);
        this.canvas.setSize(width, width * 0.5);
        
        var margin = width * 0.04;
        var buttonHeight = width * 0.15;
        var buttonWidth  = (width - margin * 4) / 3;
        for (let i = 0; i < 6; i++) {
            var row = Math.floor(i / 3);
            this.options[i].setSize((buttonHeight + margin) * row,
                                    margin * (i % 3 + 1) + (buttonWidth * (i % 3)),
                                    buttonWidth, buttonHeight);
            this.options[i].setFontSize(width * 0.05);
        }

        this.toNext.setSize(0, width / 4, width / 2, width * 0.2);
        this.toNext.setFontSize(width * 0.05);

        var buttonSpace = document.getElementById('button-space');
        buttonSpace.style.marginTop = numToPx(margin);
        buttonSpace.style.height = numToPx((buttonHeight + margin) * 2);

        this.toTitle.setFontSize(width * 0.05);
        this.toTitle.setSize(null, 0, width, width * 0.2);
    }
    

    changeLayer(front, isButtonHide = false) {
        if (front == 'quiz') {
            for (let i = 0; i < 6; i++) {
                this.options[i].show();
            }
            this.toNext.hide();
        } else {
            isButtonHide ? this.toNext.hide() : this.toNext.show();
            for (let i = 0; i < 6; i++) {
                this.options[i].hide();
            }
        }
    }

    createTitle() {
        this.quizer.init();
        this.toNext.setCaption('クイズをはじめる');
        this.message.setCaption('単位クイズ！いえーい！！');
        this.canvas.drawChara('title');
        this.changeLayer('info');
    }
  
    createQuestion() {
        this.canvas.drawChara('question');
        this.quizer.next();
        var question = this.quizer.getQuestion();
        this.message.setCaption(question.quizText);
        for (let i = 0; i < 6; i++) {
            this.options[i].setCaption(question.options[i]);
        }
        this.changeLayer('quiz');
    }

    createResult(index) {
        var result = this.quizer.ask(index);
        switch (result) {
        case 'correct':
            this.message.setCaption('せいかーい！');
            this.canvas.drawChara('correct');
            this.toNext.setCaption('つぎの問題');
            this.changeLayer('info');
            break;
        case 'clear':
            this.message.setCaption('クリア！おめでとう！！');
            this.canvas.drawChara('prize');
            this.changeLayer('info', true);
            break;
        default:
            this.message.setCaption('ざんねん...。');
            this.canvas.drawChara('mistake');
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
    $(window).resize(function() {
        // ui.adjustDisplay();
    });
    ui.run();
}
