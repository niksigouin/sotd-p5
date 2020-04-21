function Survivor(id_, name_, x_, y_, size_) {
    this.id = id_;
    this.name = name_;
    this.loc = createVector(x_, y_);
    this.size = size_;
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.attRange = this.size * 2.5;
    this.rot;
    this.dirForce = createVector(0,0);
    // this.color = this.initColor;

    this.rolls = [];
    this.germs = [];

    this.setDirForce = (force) => {
        force.normalize();
        force.mult(0.5);
        this.dirForce = force;
        // this.rot = this.dirForce.heading();
    }

    this.applyFriction = () => {
        var friction = this.vel.copy();
        friction.normalize();
        var coeficient = -0.05;
        friction.mult(coeficient);
        this.acc.add(friction);
    }

    this.update = () => {
        this.acc.add(this.dirForce);

        this.vel.add(this.acc);
        this.vel.limit(5);
        this.loc.add(this.vel);
        this.acc.mult(0);
        
        this.applyFriction();
        this.rot = this.vel.heading();
        this.loc.x = constrain(this.loc.x, 0, width);
        this.loc.y = constrain(this.loc.y, 0, height);
    };

    // GET INPUT FROM THE PLAYERS KEYBOARD
    this.getInput = () => {
        var force = createVector(0, 0);

        //CHECKS LEFT AND RIGHT FORCE
        if (keyIsDown(65)) { // A
            force.x = -1;
        } else if (keyIsDown(68)) { // D
            force.x = 1;
        } 
    
        // CHECKS UP AND DOWN FORCE
        if (keyIsDown(87)) { // W
            force.y = -1;
        } else if (keyIsDown(83)) { // S
            force.y = 1;
        } 
        
        survivor.setDirForce(force);
    }

    this.display = () => {
        push();
        colorMode(HSB, 360, 100, 100);
        translate(this.loc.x, this.loc.y);
        rotate(this.rot + radians(90)); // SETS CORRECT ORIENTATION 
        fill('#ff9900');
        stroke(0);
        strokeWeight(this.size * 0.05);
        ellipse(0, 0, this.size, this.size);
        fill(255);
        noStroke();
        rect((-this.size * 0.2) / 2, -this.size / 2, this.size * 0.2, this.size * 0.4);
        pop();
    };

    this.collect = (item) => {
        // CHECKS IF IN PROXIMITY
        var dist = p5.Vector.dist(this.loc, item.loc)
        if (dist < this.size / 2 + item.size / 2) {
            // CHECKS THE TYPE OF ITEM
            if (item instanceof Roll) {
                // CHECKS IF NOT ALREADY IN THE ARRAY
                if (!(this.rolls.filter(function (e) { return e.id === item.id; }).length > 0)) {
                    // ADDS THE ITEM TO THE ARRAY
                    this.rolls.push(item);
                }
                // CHECKS THE TYPE OF ITEM
            } else if (item instanceof Germ) {
                // CHECKS IF NOT ALREADY IN THE ARRAY
                if (!(this.germs.filter(function (e) { return e.id === item.id; }).length > 0)) {
                    // ADDS THE ITEM TO THE ARRAY
                    this.germs.push(item);
                }
            }
            return true;
        } else {
            return false;
        }
    }

    this.displayInfo = () => {
        push();
        translate(this.loc.x, this.loc.y);
        fill(0);
        textSize(15);
        textAlign(CENTER, BOTTOM);
        text("UID: " + this.id, 0, -this.size / 2);
        textAlign(CENTER, TOP);
        var items = "\nRolls: " + this.rolls.length +
            "\nGerms: " + this.germs.length;
        text(items, 0, this.size / 4);
        pop();
    }

    this.data = () => {
        return {
            id: this.id,
            name: this.name,
            loc: {
                x: this.loc.x,
                y: this.loc.y,
            },
            size: this.size,
            rolls: this.rolls.length,
            germs: this.germs.length
        };
    };
}