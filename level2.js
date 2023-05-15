class Level2 extends Phaser.Scene{
    constructor() {
        super('Level2')
    }
    
    preload() {
        this.load.image('basketball', 'assets/Basketball.png');
    }

    create(data) {
        let total = 2;
        let hit1 = false;
        let hit2 = false;
        
        this.startTime = data.end;
        console.log("this ", this.time.now);
        console.log("start2:", this.startTime);

        this.matter.world.setBounds();        

        let graphics = this.add.graphics();
        graphics.fillStyle(0x000000);
        let a = this.add.graphics().fillEllipse(1759, 550, 250, 100);
        let b = this.add.graphics().fillEllipse(426, 200, 250, 100);

        let barrier = this.matter.add.rectangle(1759, 550, 250 , 100, {isSensor: true, isStatic: true});
        barrier.gameObject = a;
        // barrier.gameObject = barrier;

        let barrier2 = this.matter.add.rectangle(426,200,250 ,100,  { isSensor: true, isStatic: true });
        barrier2.gameObject = b;

        // took this code from Phaser's examples
        let circle = this.matter.add.image(1500, 900, 'basketball', null, { chamfer: 16 });
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
                    if (!this.input.activePointer.isDown && hit1 == false) {
                        barrier.gameObject.destroy();
                        total--;
                        hit1 = true;
                        this.matter.body.setPosition(barrier, -50, -50);
                    }    
                } 
                if (pair.bodyA.gameObject === barrier2.gameObject && pair.bodyB.gameObject === circle) {
                    if (!this.input.activePointer.isDown && hit2 == false) {
                        barrier2.gameObject.destroy();
                        total--;
                        hit2 = true;
                        this.matter.body.setPosition(barrier2, -50, -50);
                    }    
                } 
            }

            if (total == 0) {
                let end = this.time.now;
                let elapsedTime = end - this.startTime;
                
                console.log('end2:', end);
                console.log('elapsedTime2:', elapsedTime);

                this.scene.start('Summary', {elapsedTime, end});
            }

        });

    }
}