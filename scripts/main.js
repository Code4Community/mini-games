// https://labs.phaser.io/edit.html?src=src/scenes/scene%20injection%20map.js&v=3.55.2
const MAX_DEGREES_TO_ROTATE_STAR =90;
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
        this.load.image('falseButton', '../assets/falseButton.png');
        this.load.image('trueButton', '../assets/trueButton.png');
        this.load.html("form", "../templates/form.html");
        this.load.image('bg', '../assets/space.jpeg');

    },
    
    /**
     * Create function required by Phaser
     * draws everything we want on the screen
     * Sets up responsive actions
     */
    create: function () {

        //set screen to size of window
        gameWidth = this.sys.game.canvas.width;
        gameHeight = this.sys.game.canvas.height;

        //create 2-D array of all stars to be displayed on the screen
        let count = 0;
        for (let i = 20; i < gameWidth; i += 50) {
            for (let j = 50; j < gameHeight; j += 50) {
                this.targets[count] = this.add.image(i, j, "star");
                this.targets[count].angle = Math.floor(Math.random() * MAX_DEGREES_TO_ROTATE_STAR);
                this.targets[count].setInteractive();
                this.targets[count].visible = false;
                this.targets[count].on('pointerdown', this.onObjectClicked(this.targets[count]))
                this.targets[count].time = 0;
                count++;
            }
        }

        //add a false button for T/F questions, set it interactive so you can click on it
        this.falseButton = this.add.image(gameWidth/2+100,gameHeight-100,"falseButton");
        this.falseButton.setInteractive();
        this.falseButton.visible = false;

         //add a true button for T/F questions, set it interactive so you can click on it
        this.trueButton = this.add.image(gameWidth/2-100,gameHeight-100,"trueButton");
        this.trueButton.setInteractive();
        this.trueButton.visible = false;

        //when you click on buttons, call method to handle the answer
        this.falseButton.on('pointerdown', this.onButtonClicked(false))
        this.trueButton.on('pointerdown', this.onButtonClicked(true))

        //this will listen for a down event
        //on every object that is set interactive
        this.input.on('gameobjectdown', this.onObjectClicked);
            
        //set-up game screen and text
        this.scoreText = this.add.text(gameWidth - 200, this.sys.game.canvas.height - 600, 'score:' + this.score, { margin: "100px", fontSize: '24pt' });

        this.nameInput = this.add.dom(this.sys.game.canvas.width / 2, this.sys.game.canvas.height - 75).createFromCache("form");
        this.nameInput.visible = false; //start the game without the text input hidden
        
        this.correctText = this.add.text(240, 150, "", { fontSize: '24pt' }).setOrigin(0.5);

        this.returnKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        //after user types in answer and presses enter, check their answer and handle it appropriatly 
        this.returnKey.on("down", event => {
            if ( this.checkAnswer(this.nameInput.getChildByName("name").value) ) {  
                this.handleCorrectAnswer();         
            }
            else {
                this.correctText.setText("Wrong!");
            }
        });
    },

    /**
     * Update function required by Phaser
     * Runs repeatedly on a cycle
     */
    update: function () {

        starToTurnOnIndex = Math.floor(Math.random() * this.targets.length);
        
        twinkle(this.targets[starToTurnOnIndex]);//call the star function

        //if the star is lit, add to its time, once it reaches a certain time remove the star from the screen
        for(let i = 0; i < this.targets.length; i++) {
            if(this.targets[i].visible === true){
               this.targets[i].time += 1;
            }
            if(this.targets[i].time > 100 ){
                this.targets[i].setActive(false).setVisible(false);
                this.targets[i].time = 0;
            }
        }
    },

    questionList: [
        
        //Frozen themed questions
        new Question("if(Elsas Sister == Ana)", true),
        new Question("if(Olafs favorite season == summer)", true),
        new Question("if(Hans loves Ana)", false),
        new Question("if(Sven == a donkey)", false), // He is a reindeer
        new Question("if(Kristoff sings Let It Go)", false),
        new Question("if(Elsa has blonde hair && Ana has red hair)", true),
        new Question("if(Elsa is 18 years old && Ana is 21 years old)", false), // Elsa: 21, Ana: 18
        new Question("if(Olaf has a nose && Olaf doesnt have eyebrows)", false), // Second part false
        new Question("if(There are 6 spirits && Elsa is the fifth spirit)", false), // First part false

        //Sports Themed questions
        new Question("LeBron James has won more NBA Championships than Michael Jordan", false),
        new Question("Tom Brady retired AND the Cincinnati Bengals won the Super Bowl", false),
        new Question("CJ Stroud is the starting quarterback for the Buckeyes OR the Cleveland Browns went to the Playoffs", true),
        new Question("Columbus has a football team in the NFL", false),
        new Question("Columbus has a hockey team in the NHL", true),
        new Question("IF the Columbus Blue Jackets win the Semi Finals, they go to the Super Bowl", false),
        new Question("If the Buckeyes score a touchdown, they will gain 6 points", true),

    ],
    //global variables
    score: 0,
    currentQuestionIndex: null,
    scoreText: null,
    correctText: null,
    text: null,
    r1: null,
    targets: [], 
    falseButton: null, 
    trueButton: null,
    isShowingQuestion: false,

    incrementScore: function () {
            this.score+=1;
            this.scoreText.setText("Score: " + this.score);
    },

    showQuestion: function () {
        if (!this.isShowingQuestion) {
            this.r1 = this.add.rectangle(this.sys.game.canvas.width / 2, this.sys.game.canvas.height / 2, 300, 200, 0x3c3c3f);

            // Randomizer for questions
            this.currentQuestionIndex = Math.floor(Math.random() * this.questionList.length);

            //add question text to screen
            this.text = this.add.text(
                
                this.sys.game.canvas.width / 2 - 100,
                this.sys.game.canvas.height / 2 - 75,
                this.questionList[this.currentQuestionIndex].text,
                {
                    fontFamily: 'Courier New', color: '#ffffff', wordWrap: {
                        width: 200, useAdvancedWrap: true
                    } 
                }
            );
            this.isShowingQuestion = true;

            //if it is a boolean answer buttons appear
             if( typeof this.questionList[this.currentQuestionIndex].answer === 'boolean') {
                this.trueButton.visible = true;
                this.falseButton.visible = true;
             }
            else{
                this.nameInput.visible = true; // otherwise show text input box
            }
        }
    },

    checkAnswer: function(userAnswer)
    {
        return this.questionList[this.currentQuestionIndex].answer === userAnswer;
    },

    handleCorrectAnswer: function(){
        this.correctText.setText("Correct!");
        this.nameInput.visible = false; //remove the text input box
        this.falseButton.visible = false; //remove the false button
        this.trueButton.visible = false; //remove the true button
        this.currentQuestionIndex = null;  //reset question index
        this.text.destroy(); //remove text box
        this.r1.destroy();   //remove box text sits on
        this.isShowingQuestion = false; //no longer showing the question
        this.incrementScore(); //add to the score as the user answered correctly
    },

    onObjectClicked: function (object) {
        return function() {
            // Disable the stars
            object.setActive(false).setVisible(false);
            // Pop up the question
            this.scene.showQuestion();
        };
    },

    onButtonClicked: function (booleanUserAnswer) {
        return function() {

            //if they get the answer correct handle it, otherwise output wrong
            if (this.scene.checkAnswer(booleanUserAnswer)) {  
                this.scene.handleCorrectAnswer();         
            }
            else {
                this.scene.correctText.setText("Wrong!");
            }
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

//class for the questions that pop up
function Question (text, answer) {
    this.text = text;
    this.answer = answer;
}

//turn a star on by setting it to active to make it clickable and visible
function twinkle(object){
        object.setActive(true).setVisible(true);  
}

// Make the basic game with the config file
var game = new Phaser.Game(config);
