const IMG_TITLE   = ['sumi01'];
const IMG_QUSET   = ['neko01', 'peng01', 'siro01', 'toka01'];
const IMG_CORRECT = ['neko01', 'neko02', 'neko03', 'sumi01', 'tapi01', 'toka01',
                     'toka02', 'toka03', 'toka04', 'toka05', 'toka06', 'toka07',
                     'zaso01'];
const IMG_MISTAKE = ['hiyo01', 'peng01', 'peng02', 'toka01'];
const IMG_PRIZE   = ['mini01', 'mini02', 'peng01', 'sumi01', 'sumi02', 'sumi03',
                     'sumi04', 'toka01', 'toka02', 'toka03', 'toka04'];

const Result    = {CORRECT: 0, INCORRECT: 1, CLEAR: 2};
const ImageType = {CORRECT: 0, INCORRECT: 1, CLEAR: 2, QUESTION: 3, TITLE: 4};

/* Utility functions */
function selectRandom(anyArray) {
    return anyArray[Math.floor(Math.random() * Math.floor(anyArray.length))];
}
/* ----------------- */

class Question {
    constructor(index, level) {
        var [A_MAX, B_MAX] = (level == 1) ? [5,  5]
                           : (level == 2) ? [10, 10]
                           : (level == 3) ? [20, 10]
                           : (level == 4) ? [20, 20]
                           :                [50, 50];

        var a = Math.floor(Math.random() * A_MAX);
        var b = Math.floor(Math.random() * B_MAX);
        const OPTIONS = 10;

        this.quizText = 'もんだい' + index.toString() + '. '
                      + a.toString() + ' + ' + b.toString() + ' = ？';
        var ans = a + b;
        this.correctIndex = Math.floor(Math.random() * OPTIONS);
        if ((ans - this.correctIndex) < 0) {
            this.correctIndex = 0;
        }

        this.options = Array(10);
        for (let i = 0; i < OPTIONS; i++) {
            this.options[i] = (ans - (this.correctIndex - i)).toString();
        }
    }
}

class QuizManager {
    constructor() {
        this.QUIZ_NUM = 5;
        this.question = null;
        this.index = 0;
        this.level = 1;
    }
  
    init(level = 1) {
        this.index = 0;
        this.level = level;
    }

    next() {
        this.index++;
    }

    getQuestion() {
        this.question = new Question(this.index, this.level);
        return this.question;
    }

    ask(answer) {
        if (answer != this.question.correctIndex) {
            return Result.INCORRECT;
        } else {
            if (this.index < this.QUIZ_NUM) {
                return Result.CORRECT;
            } else {
                return Result.CLEAR;
            }
        }
    }
}

class CharaImage{
    constructor(tagId) {
        this.id = tagId;
        this.image = document.getElementById(tagId);
    }

    drawChara(imageType) {
        this.image.src = imageType == ImageType.CORRECT   ? 'images/correct/'  + selectRandom(IMG_CORRECT) + '.jpg'
                       : imageType == ImageType.INCORRECT ? 'images/mistake/'  + selectRandom(IMG_MISTAKE) + '.jpg'
                       : imageType == ImageType.CLEAR     ? 'images/prize/'    + selectRandom(IMG_PRIZE)   + '.jpg'
                       : imageType == ImageType.QUESTION  ? 'images/question/' + selectRandom(IMG_QUSET)   + '.jpg'
                       :                                    'images/title/'    + selectRandom(IMG_TITLE)   + '.jpg';
    }
}

class ButtonArea {
    constructor(id) {
        this.id = id;
        this.div = document.getElementById(this.id);
    }

    appendButton(classes) {
        var button = document.createElement('button');
        if (classes) {
            classes.split(' ').forEach(e => button.classList.add(e));
        }
        this.div.appendChild(button);
        return button;
    }

    clearChildren() {
        this.div.innerHTML = '';
    }
}

class UI {
    constructor() {
        this.message = document.getElementById('message');
        this.image = new CharaImage('image');
        this.buttonArea = new ButtonArea('button-area');
        this.quiz = new QuizManager();
    }

    createTitle() {
        this.quiz.init(1);
        this.message.innerHTML = 'たしざんクイズ！';
        this.image.drawChara(ImageType.TITLE);
        this.createStartButton(this);
    }
    createStartButton() {
        this.buttonArea.clearChildren();
        var self = this;
        
        for (let i = 0; i < 5; i++) {
            var button = this.buttonArea.appendButton('cute-button');
            button.innerHTML = 'レベル' + (i + 1).toString();
            button.addEventListener('click', function() {
                self.quiz.init(i + 1);
                self.createQuestion();
            });
        }
    }
  
    createQuestion() {
        this.image.drawChara(ImageType.QUESTION);
        this.quiz.next();
        var question = this.quiz.getQuestion();
        this.message.innerHTML = question.quizText;

        var self = this;
        this.buttonArea.clearChildren();
        for(let i = 0; i < question.options.length; i++) {
            var button = this.buttonArea.appendButton('cute-button option calc');
            button.innerHTML = question.options[i];
            button.addEventListener('click', function() {
                self.createResult(i);
            });
        }
    }

    createResult(index) {
        var result = this.quiz.ask(index);
        switch (result) {
        case Result.CORRECT:
            this.message.innerHTML = 'せいかーい！';
            this.image.drawChara(ImageType.CORRECT);
            this.createNextButton();
            break;
        case Result.CLEAR:
            this.message.innerHTML = 'クリア！おめでとう！！';
            this.image.drawChara(ImageType.CLEAR);
            this.buttonArea.clearChildren();
            break;
        default:
            this.message.innerHTML = 'ざんねん...。';
            this.image.drawChara(ImageType.INCORRECT);
            this.buttonArea.clearChildren();
            break;
        }
    }
    createNextButton() {
        this.buttonArea.clearChildren();
        var button = this.buttonArea.appendButton('cute-button');
        button.innerHTML = 'つぎの問題';
        var self = this;
        button.addEventListener('click', function() {
            self.createQuestion();
        });
    }

    setPersistentEvents() {
        var button = document.getElementById('to-title');
        var self = this;
        button.addEventListener('click', function() {
            self.createTitle();
        });
    }

    run() {
        this.setPersistentEvents();
        this.createTitle();
    }
}

window.onload = function() {
    var ui = new UI();
    ui.run();
}