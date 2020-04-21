
function Germ(id_, x_, y_) {
    this.id = id_;
    this.loc = createVector(x_, y_);
    this.size = 10;
    this.collected = false;
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

function Roll(id_, x_, y_) {
    this.id = id_;
    this.loc = createVector(x_, y_);
    this.size = 20;
    this.collected = false;
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