
function Germ(x_, y_) {
    this.loc = createVector(x_, y_);
    this.size = 10;
    this.isUsable = true;


    this.display = () => {
        push();
        translate(this.loc.x, this.loc.y);
        fill('#00FF00');
        stroke(0);
        strokeWeight(this.size * 0.0002);
        circle(0, 0, this.size);
        pop();
    }
}

function ToiletRoll(x_, y_) {
    this.loc = createVector(x_, y_);
    this.size = 20;
    this.isUsable = false;

    this.display = () => {
        push();
        translate(this.loc.x, this.loc.y);
        fill(255);
        stroke(0);
        strokeWeight(this.size * 0.0002);
        circle(0, 0, this.size);
        pop();
    }
}

function ItemHandler() {
    this.gameRolls = [];
    this.gameGerms = [];

    this.update = function() {
        // survivors.forEach(surv => {
        //     if(survivors.x){

        //     }
        // });
    }

    this.spawnRolls = function(num) {
        for (let i = 0; i < num; i++) {
            this.gameRolls.push(new ToiletRoll(random(width), random(height)));
        }
    }

    this.displayRolls = function() {
        this.gameRolls.forEach(roll => {
            roll.display();
        });
    }

    this.spawnGerms = (num) => {
        for (let i = 0; i < num; i++) {
            this.gameGerms.push(new Germ(random(width), random(height)));   
        }
    }

    this.displayGerms = () => {
        this.gameGerms.forEach(germ =>{
            germ.display();
        });
    }
}