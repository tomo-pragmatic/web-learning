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

function getParam(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
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
    constructor(quizType) {
        this.quizType = quizType;
        this.message = document.getElementById('message');
        this.image = new CharaImage('image');
        this.startButtons = new ButtonArea('start-button-area');
        this.nextButton = new ButtonArea('next-button-area');
        this.optionArea = new ButtonArea('option-area');
        this.quiz = new QuizManager(5, quizType);
    }

    createUI() {
        this.createNextButton();
        this.nextButton.hide();
        switch (this.quizType) {
            case QuizType.ADDITION:
            case QuizType.SUBSTRACTION:
                this.createStartButtonsWithLevels(5);
                break;
            case QuizType.UNIT_CONV:
                this.createStartButton();
                break;
        }
    }
    createStartButtonsWithLevels(levels) {
        this.startButtons.clearChildren();
        var self = this;
        for (let i = 0; i < levels; i++) {
            var button = this.startButtons.appendButton();
            button.innerHTML = 'レベル' + (i + 1).toString();
            button.addEventListener('click', () => {
                self.quiz.initQuiz(i + 1);
                self.showQuestion();
            });
        }
    }
    createStartButton() {
        this.startButtons.clearChildren();
        var self = this;
        var button = this.startButtons.appendButton();
        button.innerHTML = 'はじめる';
        button.addEventListener('click', () => {
            self.quiz.initQuiz(1);
            self.showQuestion();
        });
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
        this.optionArea.hide();
        this.quiz.initQuiz(1);
        this.message.innerHTML = this.quizType == QuizType.ADDITION     ? 'たしざんクイズ！'
                               : this.quizType == QuizType.SUBSTRACTION ? 'ひきざんクイズ！'
                               :                                          '単位クイズ！'
        this.image.drawChara(ImageType.TITLE);
        this.startButtons.show();
    }
    
    showQuestion() {
        var self = this;
        this.nextButton.hide();
        this.startButtons.hide();
        this.optionArea.clearChildren();
        var question = this.quiz.getNextQuestion();
        switch (this.quizType) {
            case QuizType.ADDITION:
            case QuizType.SUBSTRACTION:
                var tenKey = new TenKey();
                tenKey.create(this.optionArea.div);
                tenKey.answerButton.addEventListener('click', () => {
                    self.showResult(tenKey.getValue());
                });
                break;
            case QuizType.UNIT_CONV:
                for(let i = 0; i < question.options.length; i++) {
                    var button = this.optionArea.appendButton();
                    button.innerHTML = question.options[i];
                    button.addEventListener('click', function() {
                        self.showResult(question.options[i]);
                    });
                }
                break;
        }
        this.optionArea.show();
        this.image.drawChara(ImageType.QUESTION);
        this.message.innerHTML = question.questionText;
    }

    showResult(answer) {
        var result = this.quiz.ask(answer);
        this.startButtons.hide();
        this.optionArea.hide();
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
    var qt = getParam('qt');
    var quizType = qt == 'add'  ? QuizType.ADDITION
                 : qt == 'sub'  ? QuizType.SUBSTRACTION
                 : qt == 'unit' ? QuizType.UNIT_CONV
                 :                QuizType.ADDITION;
    var ui = new UI(quizType);
    ui.run();
}
