// introduction to the basketball game
// explain controls

// make an invisible wall before the goal
// wall will disappear once player has held the ball (in the last 10 seconds) & player has let go of pointer
// ball will reset once ball touches ground border/makes a goal

var glob = 0;

// input a basketball flying across the scene (if you have time)
class Intro extends Phaser.Scene{
    constructor() {
        super('Intro')
    }
    preload() {
        this.load.image('basketball', 'assets/Basketball.png');
    }
 
    create() {
        let basket = this.add.sprite(0,500, 'basketball');
        basket.setOrigin(0.5);

        basket.x = -50;
        this.tweens.add({
            targets: basket,
            x: this.cameras.main.centerX,
            y: 300,
            duration: 1000,
            ease: 'Sine',
            angle:360
        });

        // asked ChatGPT for this line of code
        // gave it the prompt:
        // "is there a command to center text on the screen?"
        let begin = this.add.text(this.cameras.main.centerX,this.cameras.main.centerY,'Who wants to play basketball???')
            .setFontFamily('Impact')
            .setFontSize(130)
            .setOrigin(0.5)
            .setAlpha(0);

        this.tweens.add({
           targets:  begin,
           alpha: 1,
           duration: 1000,
           ease: 'Bounce'
        });

        // let again = true;
        this.tweens.add({
            targets: this.cameras.main,
            alpha: 0, 
            delay: 3000,
            duration: 1000, 
            ease: 'Circ', 
            onComplete: () => {
                this.scene.start('Level1');
            }

        })
        
    }
}

// draw an arrow 
class Level1 extends Phaser.Scene{
    constructor() {
        super('Level1')
    }

    preload() {
        this.load.image('basketball', 'assets/Basketball.png');
        this.load.image('arrow', 'assets/arrow.png');
    }

    create(data) {
        // let again = data.again;
        // let deletion = 0;
        this.add.image(850,640,'arrow')
        .setScale(2)
        .setAngle(15);

        this.startTime = this.time.now;
        console.log("start:", this.startTime);


        this.matter.world.setBounds();        

        let graphics = this.add.graphics();
        graphics.fillStyle(0x000000);
        let a = graphics.fillEllipse(1600, 500, 300, 100);

        let barrier = this.matter.add.rectangle(1600, 500, 300, 100, {isSensor: true, isStatic: true});
        barrier.gameObject = a;
        // barrier.gameObject = barrier;

        // took this code from Phaser's examples
        let circle = this.matter.add.image(200, 900, 'basketball', null, { chamfer: 16 });
        circle.setBody({
        type: 'circle',
        radius: 64
        });
        circle.setBounce(0.9);

        this.matter.add.mouseSpring({ length: 1, stiffness: 0.6 });

        // got this code from ChatGPT and modified some bits
        // I gave it the prompt:
        // "when the basketball and the ellipse barriers touch, go to another scene"
        this.matter.world.on('collisionstart', (event) => {
            let pairs = event.pairs;
            for (let i = 0; i < pairs.length; i++) {
                let pair = pairs[i];
                if (pair.bodyA.gameObject === barrier.gameObject && pair.bodyB.gameObject === circle) {
                    if (!this.input.activePointer.isDown) {
                        barrier.gameObject.destroy();
                        let end = this.time.now;
                        let elapsedTime = end - this.startTime;
                        console.log('end:', end);
                        console.log('elapsedTime:', elapsedTime);

                        // learned this from ChatGPT
                        // I asked it how to pass it as a parameter
                        this.scene.start('Summary', {elapsedTime, end});
                        
                    }    
                } 
            }
        });

        this.add.text(100, 100, "Tap and hold the ball to move it.\nQuickly drag your mouse while letting go to throw the ball.\nRefresh page if ball disappears.")
        .setFontFamily('Impact')
        .setFontSize(56);

    }
}

class Summary extends Phaser.Scene{
    constructor() {
        super('Summary')
    }

    preload() {
        this.load.image('star','assets/star.png')
    }

    create(data) {
        // console.log(this.time.now);
        // got this from Phaser Labs
        this.emitter = this.add.particles(0,0, 'star', {
            scale: { min: 0.25, max: 0.5 },
            rotate: { start: 0, end: 360 },
            speed: { min: 20, max: 50 },
            lifespan: 6000,
            frequency: 100,
            gravityY: 90
        });      
        
        this.tweens.add({
            targets: this.emitter,
            particleX: 1920,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inout',
            duration: 1500
        });

        let elapsedTime = data.elapsedTime;
        let end = data.end;
        console.log(end);
        let sec = elapsedTime/1000;
        let  rounded = Math.floor(sec);
        let text = this.add.text(960, 540, `Time: ${rounded} seconds`, {
            fontSize: '96px',
            fill: '#ffffff', 
            fontFamily: 'Impact'
        });
        text.setOrigin(0.5);
        text.setAlpha(0);

        this.tweens.add({
            targets: text,
            alpha: 1, 
            duration: 1000, 
            ease: 'Bounce', 
        });

        this.tweens.add({
            targets: this.cameras.main,
            alpha: 0, 
            delay: 5000,
            duration: 1500, 
            ease: 'Circ', 
            onComplete: () => {
              if (glob == 0){
                glob = 1;
                this.scene.start('Level2', {end});
              } else if (glob == 1) {
                glob = 2;
                this.scene.start('Level3', {end});
              } else {
                glob = 0;
                this.scene.start('Outro', {end});
              }

            }
        });          
    }
}

class Outro extends Phaser.Scene{
    constructor() {
        super('Outro')
    }
    preload() {
        this.load.image('basket', 'assets/Basketball.png');
    }

    create(data) {
        let begin = this.add.text(this.cameras.main.centerX,this.cameras.main.centerY,`Thanks for playing!\nRefresh the page to play again.`)
            .setFontFamily('Impact')
            .setFontSize(96)
            .setOrigin(0.5)
            .setAlpha(0);

        this.tweens.add({
           targets:  begin,
           alpha: 1,
           duration: 3000,
           ease: 'Bounce'
        });
        let basket = this.add.sprite(1970,500, 'basketball');
        basket.setOrigin(0.5);

        // basket.x = -50;
        this.tweens.add({
            targets: basket,
            x: this.cameras.main.centerX,
            y: 300,
            duration: 1000,
            ease: 'Sine',
            angle:360
        });

    }

}

let config = ({
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080,
    },
    physics: {
        default: 'matter',
        matter: { debug: false }
    },
    backgroundColor: '#324F17',
    // Intro, Level1, Level2, Level3, Summary, Outro
    scene: [Intro, Level1, Level2, Level3, Summary, Outro],
});

let game = new Phaser.Game(config);
