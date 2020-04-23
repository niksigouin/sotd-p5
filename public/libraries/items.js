
function Germ(id_, x_, y_) {
    this.id = id_;
    this.loc = createVector(x_, y_);
    this.size = 25;
    this.collected = false;
    this.isUsable = true;
  
  
    this.display = () => {
    //   push();
    //   translate(this.loc.x, this.loc.y);
    //   fill('#FFFFFF');
    //   stroke(0);
    //   strokeWeight(this.size * 0.0002);
    //   circle(0, 0, this.size);
    //   pop();
  
      push()
      translate(this.loc.x, this.loc.y);
      rotate(radians(-45));
      this.oneG();
      rotate(radians(112));
      this.oneG();
      pop()
      
      push()
      rectMode(CENTER);
      
      translate(this.loc.x, this.loc.y);
      rotate(radians(20));
      fill('#00FF00');
      rect(6, 0, this.size * 0.3, this.size * 0.2, 20);
      fill('#FF0000');
      noStroke();
      rect(6, 0, this.size * 0.2, this.size * 0.1, 20, 10);
      pop()
    }
    
    this.oneG = () => {
      push()
      rectMode(CENTER);
      fill('#00FF00');
      strokeWeight(1)
      rect(-3, 0, this.size * 0.3, this.size * 0.95, 20, 10)
      fill('#FF0000');
      noStroke();
      rect(-3, 0, this.size * 0.1, this.size * 0.8, 20, 10);
      pop()
    }
  }

function Roll(id_, x_, y_) {
    this.id = id_;
    this.loc = createVector(x_, y_);
    this.size = 30;
    this.collected = false;
    this.isUsable = false;
    this.numRings = 5;
  
  
    this.display = () => {
      push();
      translate(this.loc.x, this.loc.y);
      fill(255);
      stroke(0);
      strokeWeight(1);
      circle(0, 0, this.size); // MAIN
  
      // CENTER
      // noStroke()
      strokeWeight(0.5);
      fill('#964B00');
      circle(0, 0, this.size * 0.3);
      fill('#F2F2F2');
      strokeWeight(0.2);
      circle(0, 0, this.size * 0.2);
      
      strokeWeight(1);
      noFill();
      arc(0, 0, this.size*1.8, this.size, PI + HALF_PI, 6);
  
  
      for (let i = 1; i < this.numRings; i++) {
        push()
        noFill();
        stroke(0);
        strokeWeight(0.5);
        circle(0, 0, (this.size * 0.3) + 5 * i);
        pop()
      }
  
      pop();
    }
  }