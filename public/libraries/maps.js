function map0() {

    this.debug = false;
  
    this.waitingZone = {
      x: 0,
      y: 0,
      w: 200,
      h: height
    }
  
    this.playArea = {
      x: this.waitingZone.w,
      y: 0,
      w: width - 200,
      h: height
    }
  
    this.spawns = [
      {
        id: 0,
        x: -425,
        y: -275
      },
      {
        id: 1,
        x: -225,
        y: -275
      },
      {
        id: 2,
        x: 0,
        y: -275
      },
      {
        id: 3,
        x: 200,
        y: -275
      },
      {
        id: 4,
        x: 400,
        y: -275
      },
      {
        id: 5,
        x: 400,
        y: -75
      },
      {
        id: 6,
        x: 400,
        y: 125
      },
      {
        id: 7,
        x: 400,
        y: 275
      },
  
    ]
  
    this.obstacles = [
      {
        id: 0,
        x: this.playArea.x + (this.playArea.w / 2) - 325,
        y: this.playArea.y + (this.playArea.h / 2) - 200,
        w: 200,
        h: 60
      },
      {
        id: 1,
        x: this.playArea.x + (this.playArea.w / 2) + 0,
        y: this.playArea.y + (this.playArea.h / 2)-200,
        w: 200,
        h: 60
      },
      {
        id: 2,
        x: this.playArea.x + (this.playArea.w / 2)+ 325,
        y: this.playArea.y + (this.playArea.h / 2)-200,
        w: 200,
        h: 60
      },
      {
        id: 3,
        x: this.playArea.x + (this.playArea.w / 2)-325,
        y: this.playArea.y + (this.playArea.h / 2)+50,
        w: 60,
        h: 200
      },
      {
        id: 4,
        x: this.playArea.x + (this.playArea.w / 2) + 0,
        y: this.playArea.y + (this.playArea.h / 2) + 50,
        w: 200,
        h: 60
      },
      {
        id: 5,
        x: this.playArea.x + (this.playArea.w / 2) + 325,
        y: this.playArea.y + (this.playArea.h / 2) + 50,
        w: 60,
        h: 200
      }
    ];
  
  
    this.display = () => {
      // WAITING ZONE
      push();
      fill("#cb4154");
      translate(this.waitingZone.x, this.waitingZone.y)
      rect(0, 0, this.waitingZone.w, this.waitingZone.h);
      pop();
  
      // PLAY AREA 
      push();
      fill('#F2F2F2');
      rect(this.playArea.x, this.playArea.y, this.playArea.w, this.playArea.h);
      pop();
  
  
      
      push();
      // display spawns
      translate(this.playArea.x + (this.playArea.w / 2), this.playArea.y + (this.playArea.h / 2));
      for (let i = 0; i < this.spawns.length; i++) {
        if (this.debug) {
          fill('#00BB00')
          circle(this.spawns[i].x, this.spawns[i].y, 30);
          fill(0);
  
  
          textSize(20);
          textAlign(CENTER, CENTER);
          text(this.spawns[i].id, this.spawns[i].x, this.spawns[i].y)
        }
  
      }
      pop();
      
      push();
      // display obstacles
      for (let i = 0; i < this.obstacles.length; i++) {
        push()
        fill(0, 0, 255, 100)
        rectMode(CENTER);
        rect(this.obstacles[i].x, this.obstacles[i].y, this.obstacles[i].w, this.obstacles[i].h);
  
        if (this.debug) {
          fill(0);
          textSize(20);
          textAlign(CENTER, CENTER);
          text(this.obstacles[i].id, this.obstacles[i].x, this.obstacles[i].y)
        }
  
        pop()
      }
      pop();
    }
  }