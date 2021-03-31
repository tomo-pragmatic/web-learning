const IMG_TITLE   = ['sumi01'];
const IMG_QUSET   = ['neko01', 'peng01', 'siro01', 'toka01'];
const IMG_CORRECT = ['neko01', 'neko02', 'neko03', 'sumi01', 'tapi01', 'toka01',
                     'toka02', 'toka03', 'toka04', 'toka05', 'toka06', 'toka07',
                     'zaso01'];
const IMG_MISTAKE = ['hiyo01', 'peng01', 'peng02', 'toka01'];
const IMG_PRIZE   = ['mini01', 'mini02', 'peng01', 'sumi01', 'sumi02', 'sumi03',
                     'sumi04', 'toka01', 'toka02', 'toka03', 'toka04'];

const ImageType = {CORRECT: 0, INCORRECT: 1, CLEAR: 2, QUESTION: 3, TITLE: 4};

/* Utility functions */
function selectRandom(anyArray) {
    return anyArray[Math.floor(Math.random() * Math.floor(anyArray.length))];
}
/* ----------------- */

class CharaImage{
    constructor(tagId) {
        this.id = tagId;
        this.image = document.getElementById(tagId);
    }

    clearChara() {
        this.image.src = null;
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
        this.displayState = this.div.style.display;
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

    hide() {
        this.div.style.display = 'none';
    }

    show() {
        this.div.style.display = this.displayState;
    }
}

class UI {
    constructor() {
        this.message = document.getElementById('message');
        this.image = new CharaImage('image');
        this.startButtons = new ButtonArea('start-button-area');
        this.nextButton   = new ButtonArea('next-button-area');
        this.tenKeyArea = document.getElementById('ten-key-area');
        this.tenKey = new TenKey();
        this.quiz = new QuizManager(5, QuizType.ADDITION);
    }

    createUI() {
        var self = this;
        this.tenKey.create(this.tenKeyArea);
        this.tenKey.answerButton.addEventListener('click', () => {
            self.showResult(self.tenKey.getValue());
        });
        this.tenKey.hide();
        this.createNextButton();
        this.nextButton.hide();
        this.createStartButtons();
    }
    createStartButtons() {
        this.startButtons.clearChildren();
        var self = this;
        for (let i = 0; i < 5; i++) {
            var button = this.startButtons.appendButton();
            button.innerHTML = 'レベル' + (i + 1).toString();
            button.addEventListener('click', () => {
                self.quiz.initQuiz(i + 1);
                self.showQuestion();
            });
        }
    }
    createNextButton() {
        this.nextButton.clearChildren();
        var self = this;
        var button = this.nextButton.appendButton();
        button.innerHTML = 'つぎの問題';
        button.addEventListener('click', () => {
            self.showQuestion();
        });
    }

    showTitle() {
        this.nextButton.hide();
        this.tenKey.hide();
        this.quiz.initQuiz(1);
        this.message.innerHTML = 'ひきざんクイズ！';
        this.image.drawChara(ImageType.TITLE);
        this.startButtons.show();
    }
    
    showQuestion() {
        this.nextButton.hide();
        this.startButtons.hide();
        this.tenKey.clearValue();
        this.tenKey.show();
        this.image.drawChara(ImageType.QUESTION);
        var question = this.quiz.getNextQuestion();
        this.message.innerHTML = question.questionText;
    }

    showResult(answer) {
        var result = this.quiz.ask(answer);
        this.startButtons.hide();
        this.tenKey.hide();
        switch (result) {
            case Result.CORRECT:
                this.message.innerHTML = 'せいかーい！';
                this.image.drawChara(ImageType.CORRECT);
                this.nextButton.show();
                break;
            case Result.CLEAR:
                this.message.innerHTML = 'クリア！おめでとう！！';
                this.image.drawChara(ImageType.CLEAR);
                this.nextButton.hide();
                break;
            default:
                this.message.innerHTML = 'ざんねん...。';
                this.image.drawChara(ImageType.INCORRECT);
                this.nextButton.hide();
                break;
        }
    }

    setPersistentEvents() {
        var button = document.getElementById('to-title');
        var self = this;
        button.addEventListener('click', function() {
            self.showTitle();
        });
    }

    run() {
        this.createUI();
        this.showTitle();
        this.setPersistentEvents();
    }
}

window.onload = function() {
    var ui = new UI();
    ui.run();
}
