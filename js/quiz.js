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
function toSize(num, unit='px') {
    if (typeof(num) != 'string')
        return (num.toString() + unit);
    else
        return num;
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
        this.Answer = {CORRECT: 0, MISTAKE: 1, CLEAR: 2}; // enum-like
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
        if (top    != null) this.ctrl.style.top    = toSize(top);
        if (left   != null) this.ctrl.style.left   = toSize(left);
        if (width  != null) this.ctrl.style.width  = toSize(width);
        if (height != null) this.ctrl.style.height = toSize(height);
    }

    setFontSize(fontSize) {
        this.ctrl.style.fontSize = toSize(fontSize);
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

class CharaImage{
    constructor(tagId) {
        this.id = tagId;
        this.image = document.getElementById(tagId);
        this.areaWidth = 0;
        this.areaHeight = 0;
    }

    setAreaSize(width, height) {
        this.areaWidth = width;
        this.areaHeight = height;
    }

    setSize() {
        if ((this.areaWidth / this.image.naturalWidth) < (this.areaHeight / this.image.naturalHeight)) {
            this.image.style.width = toSize(this.areaWidth);
            this.image.style.height = 'auto';
        } else {
            this.image.style.height = toSize(this.areaHeight);
            this.image.style.width = 'auto';
        }
    }

    drawChara(imageType) {
        this.image.src = imageType == 'question' ? 'images/question/' + selectRandom(IMG_QUSET)   + '.jpg'
                       : imageType == 'correct'  ? 'images/correct/'  + selectRandom(IMG_CORRECT) + '.jpg'
                       : imageType == 'mistake'  ? 'images/mistake/'  + selectRandom(IMG_MISTAKE) + '.jpg'
                       : imageType == 'prize'    ? 'images/prize/'    + selectRandom(IMG_PRIZE)   + '.jpg'
                       :                           'images/title/'    + selectRandom(IMG_TITLE)   + '.jpg';
        this.setSize();
    }
}

class UI {
    constructor() {
        this.message = new IdentifiedControl('message');
        this.image = new CharaImage('image');
        this.options = Array(6);
        for (let i = 0; i < 6; i++) {
            this.options[i] = new IdentifiedControl('option' + (i + 1).toString());
        }
        this.toNext = new IdentifiedControl('to-next');
        this.toTitle = new IdentifiedControl('to-title');
        this.quizer = new QuizManager();
    }

    adjustDisplay() {
        var topSpace = document.getElementById('top-space');
        var width = Math.min(topSpace.clientWidth, 1600);
        topSpace.style.height = toSize(width * 0.2);

        this.message.setFontSize(width / 10);
        this.image.setAreaSize(width, width * 0.5);
        this.image.setSize();
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
        buttonSpace.style.marginTop = toSize(margin);
        buttonSpace.style.height = toSize((buttonHeight + margin) * 2);

        var em = width * 0.05;
        this.toTitle.setFontSize(em);
        this.toTitle.setSize(null, em * 0.2, width - em * 0.4, width * 0.2);
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
        this.image.drawChara('title');
        this.changeLayer('info');
    }
  
    createQuestion() {
        this.image.drawChara('question');
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
            this.image.drawChara('correct');
            this.toNext.setCaption('つぎの問題');
            this.changeLayer('info');
            break;
        case 'clear':
            this.message.setCaption('クリア！おめでとう！！');
            this.image.drawChara('prize');
            this.changeLayer('info', true);
            break;
        default:
            this.message.setCaption('ざんねん...。');
            this.image.drawChara('mistake');
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
        ui.adjustDisplay();
    });
    ui.run();
}
