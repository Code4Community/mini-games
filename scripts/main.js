// https://labs.phaser.io/edit.html?src=src/scenes/scene%20injection%20map.js&v=3.55.2
var MyScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function MyScene ()
    {
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
    preload: function ()
    {
        this.load.image('star', '../assets/star.png');
        this.load.html("form", "../templates/form.html");
        this.load.image('bg', '../assets/space.jpeg');

        this.gameWidth = this.sys.game.canvas.width;
        this.gameHeight = this.sys.game.canvas.height;
    },

    /**
     * Create function required by Phaser
     * draws everything we want on the screen
     * Sets up responsive actions
     */
    create: function ()
    {
        target = this.add.image(150, 150, "star");
        target.angle = 25;
        target.setInteractive();

        //this will listen for a down event
        //on every object that is set interactive
        this.input.on('gameobjectdown', this.onObjectClicked);

        var score = 4;
        var scoreText;
        scoreText = this.add.text(this.sys.game.canvas.width-150, 50, 'score:' + score, { fontSize: '32px', fill: '#FFFFFF' });
        
        //this.add.image(400, 300, 'bg');

    
        this.nameInput = this.add.dom(640, 360).createFromCache("form");

        this.message = this.add.text(640, 250, "Hello, --", {
            color: "#FFFFFF",
            fontSize: 60,
            fontStyle: "bold"
        }).setOrigin(0.5);

        this.returnKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.returnKey.on("down", event => {
            let name = this.nameInput.getChildByName("name");
            if (name.value != "") {
                this.message.setText("Hello, " + name.value);
                name.value = "";
            }
        });
    },

    /**
     * Update function required by Phaser
     * Runs repeatedly on a cycle
     */
    update: function () 
    {
        var x, y;
        if (game.input.mousePointer.isDown) {
            x = game.input.mousePointer.x;
            y = game.input.mousePointer.y
            console.log(x, y);
        }
    },
    
    question: [
        "Disney Quiz:",
        "",
        "if (mickey's sister == Minnie)",
        "",
        "(User enter input)"
    ],
    
    showQuestion: function ()
    {
        var r1 = this.add.rectangle(this.sys.game.canvas.width/2, this.sys.game.canvas.height/2, 300, 200, 0x3c3c3f);

        var text = this.add.text(
            this.sys.game.canvas.width/2 -100,
            this.sys.game.canvas.height/2 - 75,
            this.question,
            {
                fontFamily: 'Arial', color: '#00ff00', wordWrap: {
                    width: 500
                }
            }
        ).setOrigin(0);
    },

    onObjectClicked: function(object) 
    {
        // Rotate the object
        object.angle+=10;
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
