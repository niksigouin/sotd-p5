function Survivor(id_, name_, x_, y_, size_) {
    this.id = id_;
    this.name = name_;
    this.loc = createVector(x_, y_);
    this.size = size_;
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.attRange = this.size * 2.5;
    this.rot;
    this.dirForce = createVector(0, 0);
    this.initColor = '#9900FF'
    this.pColor = this.initColor;
    this.attack = false;
    this.isAttacked = false;
    this.attackRange = this.size * 3;
    this.rolls = [];
    this.germs = [];
    this.mass = 1;

    // HANDLES THE PLAYER INPUT AND CONVERTS IT INTO WORKABLE NUMBERS
    this.setDirForce = (force) => {
        force.normalize();
        force.mult(0.35);
        this.dirForce = force;
        // this.rot = this.dirForce.heading();
    }

    // CHECKS FOR PLAYER ON PLAYER COLLISION
    this.collidePlayer = (other) => {
        var dist = p5.Vector.dist(this.loc, createVector(other.x, other.y))
        if (dist < this.size / 2 + other.size / 2) {
            // this.dirForce.mult(-2);
            // this.dirForce.set(0,0);
            // this.acc.set(0, 0);
            // this.vel.mult(-3);
            return true;
        } else {
            return false;
        }
    }

    // BOUNCE METHOD FOR PLAYER ON PLAYER COLLISION
    this.bounce = (other) => {
        // this.acc.x *= -1;
        // this.acc.y *= -1;
        // this.vel.x *= -2;
        // this.vel.y *= -2;
        // this.vel.mult(-2);
        // this.dirForce.set(0,0);

        var dif = p5.Vector.sub(this.loc, other.loc);
        dif.normalize();
        var dot = dif.dot(this.vel) * -2;
        dif.mult(dot);
        this.vel.add(dif);
    }

    // FRICTION FORCE ON PLAYER
    this.applyFriction = () => {
        var friction = this.vel.copy();
        friction.normalize();
        var coeficient = -0.05;
        friction.mult(coeficient);
        this.acc.add(friction);


        this.vel.mult(0.98);
    }

    // MOUVEMENT
    this.update = () => {
        this.acc.add(this.dirForce);
        this.vel.add(this.acc);
        this.vel.limit(5.8);
        this.loc.add(this.vel);
        this.acc.mult(0);
        // console.log(this.vel)
        this.applyFriction();
        this.rot = this.vel.heading(); // PLAYER ROTATION

        // BOUNCE OFF SIDE WALLS
        if (this.loc.x - this.size / 2 <= 0 || this.loc.x + this.size / 2 >= width) {
            this.vel.x *= -2;
        }

        // BOUNCE OFF TOP/BTM WALLS
        if (this.loc.y - this.size / 2 <= 0 || this.loc.y + this.size / 2 >= height) {
            this.vel.y *= -2;
        }

        

        this.loc.x = constrain(this.loc.x, 0+this.size/2, width-this.size/2);
        this.loc.y = constrain(this.loc.y, 0+this.size/2, height-this.size/2);

        // // WHEN ATTACKED CAN'T MOVE
        // if (this.isAttacked) {
        //     this.acc.set(0, 0);
        //     this.vel.set(0, 0);
        // }

        // HANDLES WHEN PLAYER GETS ATTACKED
        this.stuned();
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

    // ATTACK METHOD
    this.sneeze = () => {
        if (this.hasGerms() && this.attack == false && !this.isAttacked) {
            this.germs.pop();
            this.attack = true;
            // console.log("SNEEZED", this.attack)
            var sneezeTime = setTimeout(() => {
                this.attack = false;
                // console.log("RELOADED", this.attack)
            }, 2000)
        }

        if (!this.hasGerms() && this.attack == false) {
            // console.log("NOT ENOUGH GERMS", this.attack)
        }
    }

    // DISPLAY METHOD FOR PLAYER MODEL
    this.display = () => {
        // DISPLAY ZONE OF INFECTION
        if (this.attack) {
            push();
            translate(this.loc.x, this.loc.y);
            fill(127, 255, 0, 100);
            noStroke();
            ellipse(0, 0, this.size * 3, this.size * 3);
            pop();
        }

        if (this.isAttacked) {
            this.pColor = '#FF0000'
        } else {
            this.pColor = this.initColor;
        }

        push();
        // colorMode(HSB, 360, 100, 100);
        translate(this.loc.x, this.loc.y);
        rotate(this.rot + radians(90)); // SETS CORRECT ORIENTATION 
        fill(this.pColor);
        stroke(0);
        strokeWeight(this.size * 0.05);
        ellipse(0, 0, this.size, this.size);
        fill(255);
        noStroke();
        rect((-this.size * 0.2) / 2, -this.size / 2, this.size * 0.2, this.size * 0.4);
        pop();


    };

    // CHECKS FOR SUFFICIENT GERM COUNT
    this.hasGerms = () => {
        if (this.germs.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    // MUFFLE PLAYER MOUVEMENTS
    this.stuned = () => {
        if (this.isAttacked) {
            // WHEN ATTACKED CAN'T MOVE
            this.acc.set(0, 0);
            this.vel.set(0, 0);
        }
    }

    // WHEN PLAYER IS ATTACKED DROP ROLLS
    this.dropRolls = () => {
        var dropAmount = Math.ceil(this.rolls.length / 3);

        socket.emit('drop rolls', {
            x: this.loc.x, 
            y: this.loc.y, 
            size: this.size,
            rolls: dropAmount
        });
        this.rolls.splice(0, dropAmount)
    }

    // CHECKS IF PLAYER IS ATTACKED BY AN OTHER PLAYER
    this.checkAttacked = (surv) => {
        var dist = p5.Vector.dist(this.loc, createVector(surv.x, surv.y))
        if (dist < this.size / 2 + surv.attackRange / 2 && surv.attack && this.isAttacked == false) {
            this.isAttacked = true;
            this.dropRolls();
            // this.stun()
            // AFTER 3 SECONDS, STOP IS ATTACKED
            console.log("Just got attacked")
            setTimeout(() => {
                this.isAttacked = false;

            }, 3000)
        }
    }

    // COLLECTION METHOD FOR COLLECTING ITEMS ON THE MAP
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

    // DEBUG PLAYER INFO DISPLAY
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

    // DATA OBJECT THAT RETURNS TO THE SERVER
    this.data = () => {
        return {
            id: this.id,
            name: this.name,
            loc: {
                x: this.loc.x,
                y: this.loc.y,
            },
            velx: this.vel.x,
            vely: this.vel.y,
            size: this.size,
            mass: this.mass,
            rolls: this.rolls.length,
            germs: this.germs.length,
            attack: this.attack,
            isAttacked: this.isAttacked,
            rot: this.rot,
            attackRange: this.attackRange
        };
    };
}