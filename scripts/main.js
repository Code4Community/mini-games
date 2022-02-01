// https://labs.phaser.io/edit.html?src=src/scenes/scene%20injection%20map.js&v=3.55.2
var MyScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function MyScene() {
            //  Here we'll tailor the property injection map so that by default our Scene
            //  only gets 2 properties defined on it: 'makeStuff' and 'loader'.
            //  It will also have the property 'sys' which can never be redefined or removed.
            var config = {
                map: {
                    add: 'add',
                    load: 'load',
                    input: 'input'
                }
            };

            Phaser.Scene.call(this, config)
        },

    /**
     * Preload function required by Phaser
     * loads assets
     */
    preload: function () {
        this.load.image('star', '../assets/star.png');
        this.load.html("form", "../templates/form.html");
        this.load.image('bg', '../assets/space.jpeg');

    },

    /**
     * Create function required by Phaser
     * draws everything we want on the screen
     * Sets up responsive actions
     */
    create: function () {

        gameWidth = this.sys.game.canvas.width;
        gameHeight = this.sys.game.canvas.height;

        let count = 0;
        let target = [];

        for (let i = 20; i < gameWidth; i += 50) {
            for (let j = 50; j < gameHeight; j += 50) {
                target[count] = this.add.image(i, j, "star");
                target[count].angle = Math.floor(Math.random() * 90);
                target[count].setInteractive();
                target[count].visible = true;
                count++;

            }
        }

        //this will listen for a down event
        //on every object that is set interactive
        this.input.on('gameobjectdown', this.onObjectClicked);

        var scoreText;
        scoreText = this.add.text(gameWidth - 150, 10, 'score:' + this.score, { margin: "100px", fontSize: '24pt' });

        //this.add.image(400, 300, 'bg');


        this.nameInput = this.add.dom(this.sys.game.canvas.width / 2, this.sys.game.canvas.height - 75).createFromCache("form");

        this.message = this.add.text(640, 250, "Hello, --", { fontSize: '24pt' }).setOrigin(0.5);

        this.returnKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.returnKey.on("down", event => {
            let name = this.nameInput.getChildByName("name");
            this.message.setText("Hello, " + name.value);
            this.checkAnswer(name.value);
        });
    },

    /**
     * Update function required by Phaser
     * Runs repeatedly on a cycle
     */
    update: function () {
        var x, y;
        if (game.input.mousePointer.isDown) {
            x = game.input.mousePointer.x;
            y = game.input.mousePointer.y
            console.log(x, y);
        }
    },

    questionList: [
        {
            qInfo: "What is 2 + 2 ?",
            qAnswer: "4",

        },
        {
            qInfo: "What is 10 + 2 ?",
            qAnswer: "12",
        },
        {
            qInfo: "What is 13 + 2 ?",
            qAnswer: "15",
        }
    ],

    score: 0,
    currentQuestionIndex: 0,

    showQuestion: function () {
        var r1 = this.add.rectangle(this.sys.game.canvas.width / 2, this.sys.game.canvas.height / 2, 300, 200, 0x3c3c3f);
        //r1 is undefined

        this.currentQuestionIndex = parseInt(Math.random() * (this.questionList.length));
        console.log(this.currentQuestionIndex);
        console.log(this.questionList[this.currentQuestionIndex].qInfo);

        let randomIndex = Math.floor(Math.random() * this.questionList.length);

        var text = this.add.text(
            
            this.sys.game.canvas.width / 2 - 100,
            this.sys.game.canvas.height / 2 - 75,
            this.questionList[randomIndex].qInfo,
            {
                fontFamily: 'Courier New', color: '#ffffff', wordWrap: {
                    width: 500
                }
            }
        ).setOrigin(0);
    },

    checkAnswer: function(userAnswer)
    {
        console.log("Input text:");
        console.log(userAnswer);
        console.log("Correct Answer:");
        console.log(this.questionList[this.currentQuestionIndex].qAnswer);

        returnVal = this.questionList[this.currentQuestionIndex].qAnswer === userAnswer;
        console.log(returnVal);
        return returnVal;
    },

    onObjectClicked: function (object) {
        // Rotate the object
        object.angle += 10;
        // Pop up the question
        this.scene.showQuestion();
    }
});

// Phaser configuration object
let config = {
    type: Phaser.AUTO,
    parent: "game",
    width: 1280,
    height: 600,
    dom: {
        createContainer: true
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: false,
        },
    },
    scene: MyScene
};

// Make the basic game with the config file
var game = new Phaser.Game(config);
