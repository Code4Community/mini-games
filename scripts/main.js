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
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};

// Make the basic game with the config file
var game = new Phaser.Game(config);

/**
 * Preload function required by Phaser
 * loads assets
 */
function preload() {
    this.load.image('star', '../assets/star.png');
    this.load.html("form", "../templates/form.html");
    this.load.image('bg', '../assets/space.jpeg');
}

/**
 * Create function required by Phaser
 * draws everything we want on the screen
 * Sets up responsive actions
 */
function create() {
    this.target = this.add.image(150, 150, "star");
    this.target.angle = 25;
    this.target.setInteractive();

    //this will listen for a down event
    //on every object that is set interactive
    this.input.on('gameobjectdown', onObjectClicked);

    var score = 4;
    var scoreText;
    scoreText = this.add.text(600, 50, 'score:' + score, { fontSize: '32px', fill: '#FFFFFF' });
    
    //this.add.image(400, 300, 'bg');

    var question1 = [
        "Disney Quiz:",
        "",
        "if (mickey's sister == Minnie)",
        "",
        "(User enter input)"
    ];

    this.time.addEvent({
        delay: 1500,
        callback: () => {
            var r1 = this.add.rectangle(400, 150, 300, 200, 0x3c3c3f);

            var text = this.add.text(300, 100, question1, {
                fontFamily: 'Arial', color: '#00ff00', wordWrap: {
                    width: 500
                }
            }).setOrigin(0);
        },
        loop: true
    })
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
}

/**
 * Update function required by Phaser
 * Runs repeatedly on a cycle
 */
function update() {
    var x, y;
    if (game.input.mousePointer.isDown) {
        x = game.input.mousePointer.x;
        y = game.input.mousePointer.y
        console.log(x, y);
    }
}

function onObjectClicked(pointer, gameObject) {
    gameObject.angle+=10;
}

function popUpQuestion() {

}
