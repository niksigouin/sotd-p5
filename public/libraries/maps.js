function map0() {

    this.spawnZone = {
        x: 0,
        y: 0,
        width: 200,
        height: height
    }


    this.display = () => {
        push();
        fill("#cb4154");
        rect(this.spawnZone.x, this.spawnZone.y, this.spawnZone.width, this.spawnZone.height);
        pop();
    }
}

