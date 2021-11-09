// Basic setup for the game
let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
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

// Runs before the create function, preloads assets
function preload() {
    this.load.image('star', '../assets/star.png');
}

// Create all objects at the start of the game
function create() {
    this.target = this.add.image(game.config.width / 2, game.config.height / 2, "star");
    this.target.angle = 25;
    this.target.setInteractive();

    //this will listen for a down event 
    //on every object that is set interactive
    this.input.on('gameobjectdown', onObjectClicked);
}

// Runs on a refresh cycle, manages created objects
function update() {
    var x, y;
    if (game.input.mousePointer.isDown) {
        console.log("Someone clicked")
    }
}

function onObjectClicked(pointer, gameObject) {
    gameObject.angle+=10;
}
