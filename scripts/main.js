var config = {
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
  var game = new Phaser.Game(config);

  function preload() {
    this.load.image('star', '../assets/star.png');
  }

  // creates stars
  function create() {
    let stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 300, stepX: 70 }
    });
    console.log(game)
    console.log(game.input)
    console.log(game.input.star)   
    game.input.star.capture = true;
    // https://phaser.io/examples/v3/view/input/mouse/click-sprite
    // loops thourgh each star and for each star capture the mouse input. 
  }
  

  
  function update() {
    var x, y;
    if(game.input.mousePointer.isDown) {
        x = game.input.mousePointer.x;
        y = game.input.mousePointer.y;
        console.log(x, y);
        star.create() // create stars
    }
    

    // to make stars disappear: do stars.clear() or stars.disablebody(), I'm not sure what the difference is?

    // work on making stars disappear whenever someone clicks somewhere on the page

    if(this.input.on('pointerdown', () => console.log('click'))) {
      star.clear();
    }


    // function render() {

    //   game.debug.text("Left Button: " + game.input.activePointer.leftButton.isDown, 300, 132);
    //   game.debug.text("Middle Button: " + game.input.activePointer.middleButton.isDown, 300, 196);
    //   game.debug.text("Right Button: " + game.input.activePointer.rightButton.isDown, 300, 260);

    // }

    if(game.input.activePointer.leftButton.isDown == false){
      star.clear();
      console.log("dance");
    }



    // stars on the screen dissapper
    //star.clear();

  }
