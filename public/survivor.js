function Survivor(id_, name_, x_, y_, size_) {
    this.id = id_;
    this.name = name_;
    this.loc = createVector(x_, y_);
    this.size = size_;
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.attRange = this.size * 2.5;
    this.rot;
    // this.color = this.initColor;

    this.rolls = [];
    this.germs = [];

    this.update = () => {
        this.loc = createVector(mouseX, mouseY);
        this.loc.x = constrain(this.loc.x, 0, width);
        this.loc.y = constrain(this.loc.y, 0, height);
    };

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

    this.data = () => {
        return {
            id: this.id,
            name: this.name,
            loc: {
                x: this.loc.x,
                y: this.loc.y,
            },
            size: this.size
        };
    };
}