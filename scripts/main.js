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
    target: [],
    /**
     * Create function required by Phaser
     * draws everything we want on the screen
     * Sets up responsive actions
     */
    create: function () {

        gameWidth = this.sys.game.canvas.width;
        gameHeight = this.sys.game.canvas.height;

        let count = 0;
    
        for (let i = 20; i < gameWidth; i += 50) {
            for (let j = 50; j < gameHeight; j += 50) {
                this.target[count] = this.add.image(i, j, "star");
                this.target[count].angle = Math.floor(Math.random() * 90);
                this.target[count].setInteractive();
                this.target[count].visible = false;
                this.target[count].on('pointerdown', this.onObjectClicked(this.target[count]))
                this.target[count].time = 0;
                count++;
                

            }
        }

        //this will listen for a down event
        //on every object that is set interactive
        this.input.on('gameobjectdown', this.onObjectClicked);

        this.scoreText = this.add.text(gameWidth - 200, this.sys.game.canvas.height - 600, 'score:' + this.score, { margin: "100px", fontSize: '24pt' });

        //this.add.image(400, 300, 'bg');


        this.nameInput = this.add.dom(this.sys.game.canvas.width / 2, this.sys.game.canvas.height - 75).createFromCache("form");

        this.message = this.add.text(640, 250, "Hello, --", { fontSize: '24pt' }).setOrigin(0.5);
        this.correctText = this.add.text(240, 150, "", { fontSize: '24pt' }).setOrigin(0.5);

        this.returnKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.returnKey.on("down", event => {
            let name = this.nameInput.getChildByName("name");
            this.message.setText("Hello, " + name.value);
            var trueFalse = this.checkAnswer(name.value);
            if (trueFalse == true) {
                this.correctText.setText("Correct!");
                this.currentQuestionIndex = null;           
            
            }
            else {
                this.correctText.setText("Wrong!");
            }
            this.incrementScore(trueFalse);

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
        starToTurnOn = Math.floor(Math.random() * this.target.length);
        
        twinkle(this.target[starToTurnOn]);//call the star function
        for(let i=0;i<this.target.length;i++){
            if(this.target[i].visible === true){
               this.target[i].time+=1;
            }
            if(this.target[i].time> 100 ){
                this.target[i].setActive(false).setVisible(false);
            }
        }
        //check all stars, if they have been on for more than 3 seconds turn them off
        //timedEvent = this.time.addEvent({ delay: 1000, callback: onEvent, callbackScope: this, loop: true });
    },

    // TODO: Create a question answer type (int/boolean)
    // TODO: Create a question JS constructor
    questionList: [
        new Question("if(Elsas Sister == Ana)", true),
        new Question("if(Olafs favorite season == summer)", true),
        new Question("if(Hans loves Ana)", false),
        new Question("if(Sven == a donkey)", false), // He is a reindeer
        new Question("if(Kristoff sings Let It Go)", false),
        new Question("if(Elsa has blonde hair && Ana has red hair)", true),
        new Question("if(Elsa is 18 years old && Ana is 21 years old)", false), // Elsa: 21, Ana: 18
        new Question("if(Olaf has a nose && Olaf doesnt have eyebrows)", false), // Second part false
        new Question("if(There are 6 spirits && Elsa is the fifth spirit)", false), // First part false
        //add or questions, two true, first one true, second one true, both false
    ],

    score: 0,
    currentQuestionIndex: null,
    scoreText: null,
    correctText: null,

    incrementScore: function (answerResult) {
        if (answerResult === true){
            this.score+=1;
            this.scoreText.setText("Score: " + this.score);
        }
        console.log(this.score)
    },

    showQuestion: function () {
        var r1 = this.add.rectangle(this.sys.game.canvas.width / 2, this.sys.game.canvas.height / 2, 300, 200, 0x3c3c3f);
        //r1 is undefined


        // Randomizer for questions
        this.currentQuestionIndex = Math.floor(Math.random() * this.questionList.length);

        var text = this.add.text(
            
            this.sys.game.canvas.width / 2 - 100,
            this.sys.game.canvas.height / 2 - 75,
            this.questionList[this.currentQuestionIndex].text,
            {
                fontFamily: 'Courier New', color: '#ffffff', wordWrap: {
                    width: 200, useAdvancedWrap: true
                } 
            }
        );
    },

    // TODO: Parse an answer from this method
    checkAnswer: function(userAnswer)
    {
        console.log("Input text:");
        console.log(userAnswer);
        console.log("Correct Answer:");
        console.log(this.questionList[this.currentQuestionIndex].answer);

        let correctAnswer = this.questionList[this.currentQuestionIndex].answer;
        if (typeof correctAnswer === "boolean") {
            let userAnswerBoolean = true;
           
            if ((userAnswer.toUpperCase()) === ("FALSE")) {
                userAnswerBoolean = false;
            }
            returnVal = this.questionList[this.currentQuestionIndex].answer === userAnswerBoolean;
        }
        else if (typeof correctAnswer === "number") {
            returnVal = this.questionList[this.currentQuestionIndex].answer === parseInt(userAnswer);
        }
        console.log("Did the user get the right answer?")
        console.log(returnVal);
        return returnVal;
    },

    onObjectClicked: function (object) {
        return function() {
            // Disable the stars
            object.setActive(false).setVisible(false);
            // Pop up the question
            this.scene.showQuestion();
        };
    },

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

function Question (text, answer) {
    this.text = text;
    this.answer = answer;
}

function twinkle(object){
   
  

        object.setActive(true).setVisible(true);
        
    
}


// Make the basic game with the config file
var game = new Phaser.Game(config);
