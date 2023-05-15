class Level3 extends Phaser.Scene{
    constructor() {
        super('Level3')
    }
    
    preload() {
        this.load.image('basketball', 'assets/Basketball.png');
    }

    create(data) {
        this.matter.world.setBounds();  
        this.startTime = data.end;
        let total = 3;      
        let hit1 = false;
        let hit2 = false;
        let hit3 = false;

        let graphics = this.add.graphics();
        graphics.fillStyle(0x000000);
        let a = this.add.graphics().fillEllipse(1759, 550, 200, 100);
        let b = this.add.graphics().fillEllipse(426, 200, 200, 100);
        let c = this.add.graphics().fillEllipse(160, 1000, 200, 100);

        let barrier = this.matter.add.rectangle(1759, 550, 200 , 100, {isSensor: true, isStatic: true});
        barrier.gameObject = a;
        // barrier.gameObject = barrier;

        let barrier2 = this.matter.add.rectangle(426,200,200 ,100,  { isSensor: true, isStatic: true });
        barrier2.gameObject = b;

        let barrier3 = this.matter.add.rectangle(160,1000,200 ,100,  { isSensor: true, isStatic: true });
        barrier3.gameObject = c;

        // took this code from Phaser's examples
        let circle = this.matter.add.image(1000, 900, 'basketball', null, { chamfer: 16 });
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
                if (pair.bodyA.gameObject === barrier3.gameObject && pair.bodyB.gameObject === circle) {
                    if (!this.input.activePointer.isDown && hit3 == false) {
                        barrier3.gameObject.destroy();
                        // barrier3.destroy();
                        total--;
                        hit3 = true;
                        this.matter.body.setPosition(barrier3, -50, -50);
                    }    
                } 
                
            }
            
            if (total == 0) {
                let end = this.time.now;
                let elapsedTime = end - this.startTime;
                this.scene.start('Summary', {elapsedTime, end});
            }
        });
    }


}