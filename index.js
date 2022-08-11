class Snake {
    static directions = [0,1,2,3]; // up, right, down, left
    static tendency = 50;
    static growthRate = 10;
    static colorAdjust = 50;
    constructor(startingX, startingY, id){
        this.x = startingX;
        this.y = startingY;
        this.id = id;
        this.length = SnakeGame.startingSnakeLength;
        this.currentDirection = Math.floor(Math.random()*4);
        this.lastDirection = this.currentDirection;
        this.positions = [[this.x, this.y]];
        this.tendency = 10;
        this.turns = 0;
        this.color = {
            red: Math.floor(Snake.colorAdjust+ Math.random()*(255-Snake.colorAdjust)),
            green: Math.floor(Snake.colorAdjust + Math.random()*(255-Snake.colorAdjust)),
            blue: Math.floor(Snake.colorAdjust + Math.random()*(255-Snake.colorAdjust)),
            alpha: .4
        }
    }
    initialize(){
        SnakeGame.getTile(this.x, this.y).classList.toggle('occupied');
        SnakeGame.getTile(this.x, this.y).style.backgroundColor = `rgba(${this.color.red}, ${this.color.green}, ${this.color.blue}, ${this.color.alpha})`;
        return this;
    }
    update(){
        //Randomly Decide If Moving In Another Direction Is Something We Want To Do Based on Tendency
        if(Math.floor(Math.random()*this.tendency) === 0){
            let newDirection = Math.floor(Math.random()*Snake.directions.length);
            while(newDirection === this.lastDirection){
                newDirection = Math.floor(Math.random()*Snake.directions.length);
            }
            this.lastDirection = this.currentDirection;
            this.currentDirection = newDirection;
            this.tendency = Snake.tendency;
        } else {
            this.tendency--;
        }

        //Figure Out If We Have Any Valid Moves, If So, Proceed; If Not, Kill;
        let validMove = this.checkValidMove(this.currentDirection);
        if(!validMove){
            let directions = Snake.directions.slice(0, Snake.directions.length);
            directions.splice(this.currentDirection, 1);
            shuffleInPlace(directions);
            while(directions.length > 0 && !validMove){
                this.currentDirection = directions[0];
                directions.splice(0,1);
                validMove = this.checkValidMove(this.currentDirection);
            }
            if(validMove){
                this.grow();
                this.move();
                this.adjustPosition();
                return;
            } else {
                this.positions.forEach(position=>{
                    let div = SnakeGame.getTile(position[0], position[1]);
                    div.classList.remove(`occupied`);
                    div.style.backgroundColor = null;
                })
                SnakeGame.setupForRemoval(this.id);
            }
        } else {
            this.grow();
            this.move();
            this.adjustPosition();
        }
    }
    adjustPosition(){
        //Remove the last element in the area, or add if the snake hasn't hit full length
        this.positions.unshift([this.x, this.y]);
        SnakeGame.getTile(this.x, this.y).classList.toggle('occupied');
        SnakeGame.getTile(this.x, this.y).style.backgroundColor = `rgba(${this.color.red}, ${this.color.green}, ${this.color.blue}, ${this.color.alpha})`;
        if (this.positions.length > this.length){
            let tail = this.positions.pop();
            SnakeGame.map.get(tail[0].toString()).get(tail[1].toString()).classList.toggle('occupied');
            SnakeGame.map.get(tail[0].toString()).get(tail[1].toString()).style.backgroundColor = null;
        }
        this.turns++;
    }
    grow(){
        if (this.turns > Snake.growthRate){
            this.length++;
            this.turns = 0;
        }
        //NOTE: Turns is incremented in adjustPosition() every update call.
    }
    move(){
        switch(this.currentDirection){
            case 0: {
                if(this.y - 1 < 0) {
                    this.y = SnakeGame.gridSize - 1;
                } else {this.y--;}
                break;
            }
            case 1: {
                if (this.x + 1 === SnakeGame.gridSize){
                    this.x = 0;
                } else {this.x++;}
                break;
            }
            case 2: {
                if (this.y + 1 === SnakeGame.gridSize){
                    this.y = 0;
                } else {this.y++;}
                break;
            }
            case 3: {
                if (this.x -1 < 0) {
                    this.x = SnakeGame.gridSize - 1;
                } else {this.x--;}
                break;
            }
        }
    }
    checkValidMove(direction){
        let nextX = this.x;
        let nextY = this.y;
        switch(direction){
            case 0:{
                nextY = (this.y-1 === -1 ? SnakeGame.gridSize-1 : this.y - 1);
                break;
            }
            case 1:{
                nextX = (this.x+1 === SnakeGame.gridSize ? 0 : this.x + 1);
                break;
            }
            case 2:{
                nextY = (this.y+1 === SnakeGame.gridSize ? 0 : this.y + 1);
                break;
            }
            case 3:{
                nextX = (this.x-1 === -1 ? SnakeGame.gridSize-1 : this.x -1);
                break;
            }
        }
        return !SnakeGame.getTile(nextX, nextY).classList.contains(`occupied`);
    }
}
class SnakeGame {
    static gridSize = 100;
    static startingSnakeLength = 3;
    static snakesToCreate = 0;
    static map = new Map();
    static removalMap = new Map();
    static snakes = [];
    static interval;
    static updateTimer = 250;
    //GRID FUNCTIONS
    static createGrid(){
        const background = document.querySelector(`#background`);
        for(let i = 0; i < SnakeGame.gridSize; i++){
            SnakeGame.map.set(i.toString(), new Map());
        }
        for(let i = 0; i < (SnakeGame.gridSize ** 2); i++){
            let div = document.createElement('div');
            div.classList.toggle(`item`);
            div.dataset.x = i%SnakeGame.gridSize;
            div.dataset.y = Math.floor(i/SnakeGame.gridSize);
            div.style.flex = `1 0 ${100/SnakeGame.gridSize}%`;
            background.appendChild(div);

            SnakeGame.map.get((i%SnakeGame.gridSize).toString()).set((Math.floor(i/SnakeGame.gridSize)).toString(), div);
        }
    }
    static getTile(x,y){
        if (!(typeof x === `string`)){x = x.toString()}
        if (!(typeof y === `string`)){y = y.toString()}
        return SnakeGame.map.get(x).get(y);
    }
    //SNAKE FUNCTIONS
    static createSnake(num = 1){
        for(let i = 0; i < num; i++){
            let randomX = Math.floor(SnakeGame.gridSize * Math.random());
            let randomY = Math.floor(SnakeGame.gridSize * Math.random());
            while(SnakeGame.getTile(randomX, randomY).classList.contains(`occupied`)){
                randomX = Math.floor(SnakeGame.gridSize * Math.random());
                randomY = Math.floor(SnakeGame.gridSize * Math.random());
            }
            SnakeGame.snakes.push(new Snake(randomX, randomY, SnakeGame.snakes.length + 1).initialize());
        }
    }
    static removeAndCreateSnakes(){
        let count = Array.from(SnakeGame.removalMap.keys()).length;
        SnakeGame.snakes = SnakeGame.snakes.filter(snake => !SnakeGame.removalMap.get(snake.id));
        SnakeGame.removalMap = new Map();
        if(count){SnakeGame.createSnake(count)};
        SnakeGame.updateSnakeIDs();
    }
    static setupForRemoval(id){
        SnakeGame.removalMap.set(id, true);
    }
    static updateSnakeIDs(){
        this.snakes.forEach((snake, i)=>{
            snake.id = i;
        })
    }
    //TIMER FUNCTIONS
    static setUpdateTimer(timer){
        SnakeGame.interval = setInterval(()=>{
            SnakeGame.snakes.forEach(snake=>snake.update());
            SnakeGame.removeAndCreateSnakes();
        }, timer || SnakeGame.updateTimer)

    }
    static pauseUpdateTimer(){
        clearInterval(SnakeGame.interval);
    }
}
class DrawSpace {
    static GridSize = 50;
    static map = new Map();
    static createGrid(){
        const container = document.querySelector(`#drawSpace`);
        console.log(container);
        // for(let i = 0; i < DrawSpace.gridSize; i++){
        //     DrawSpace.map.set(i.toString(), new Map());
        // }
        // for(let i = 0; i < (DrawSpace.gridSize ** 2); i++){
        //     let div = document.createElement('div');
        //     div.classList.toggle(`item`);
        //     div.dataset.x = i%DrawSpace.gridSize;
        //     div.dataset.y = Math.floor(i/DrawSpace.gridSize);
        //     div.style.flex = `1 0 ${100/DrawSpace.gridSize}%`;
        //     container.appendChild(div);

        //     DrawSpace.map.get((i%DrawSpace.gridSize).toString()).set((Math.floor(i/DrawSpace.gridSize)).toString(), div);
        // }
    }
}
function shuffleInPlace(array) {
    //Taken from: https://bost.ocks.org/mike/shuffle/ -> Clever Shuffle That Moves Front Items to the Back, Shuffles in O(n);
    var m = array.length, t, i;
    // While there remain elements to shuffle…
    while (m) {
  
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
  
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
}


SnakeGame.createGrid();
SnakeGame.createSnake(50);
SnakeGame.setUpdateTimer(10);
