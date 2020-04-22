function map0() {

    this.spawnZone = {
        x: 0,
        y: 0,
        width: 200,
        height: height
    }


    this.display = () => {
        // SPAWN
        push();
        fill("#cb4154");
        translate(this.spawnZone.x, this.spawnZone.y)
        rect(0, 0, this.spawnZone.width, this.spawnZone.height);
        pop();

        // MAIN 
        push();
        // translate(x, y)
        pop();
    }
}

