class Snake {
    static directions = [0,1,2,3]; // up, right, down, left
    static tendency = 10;
    constructor(startingX, startingY){
        this.x = startingX;
        this.y = startingY;
        this.currentDirection = Math.floor(Math.random()*4);
        this.lastDirection = this.currentDirection;
        this.positions = [[this.x, this.y]];
        this.color = {
            red: Math.floor(Math.random()*255),
            green: Math.floor(Math.random()*255),
            blue: Math.floor(Math.random()*255),
            alpha: .4
        }
    }
    setID(id){

    }
    updatePosition(){
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
        //Remove the last element in the area, or add if the snake hasn't hit full length
        this.positions.unshift([this.x, this.y]);
        SnakeGame.map.get(this.x.toString()).get(this.y.toString()).style.backgroundColor = `rgba(${this.color.red}, ${this.color.green}, ${this.color.blue}, ${this.color.alpha})`;
        if (this.positions.length > SnakeGame.startingSnakeLength){
            this.positions.pop()
        }
    }
}

class SnakeGame {
    static gridSize = 30;
    static startingSnakeLength = 3;
    static map = new Map();
    static snakes = [];
    static interval;
    static updateTimer = 200;
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
            div.style.border = `1px solid rgba(255, 255, 255, .1)`;
            background.appendChild(div);

            SnakeGame.map.get((i%SnakeGame.gridSize).toString()).set((Math.floor(i/SnakeGame.gridSize)).toString(), div);
        }
    }
    static createSnake(){
        SnakeGame.snakes.push(new Snake(Math.floor(SnakeGame.gridSize * Math.random()), Math.floor(SnakeGame.gridSize * Math.random()), this));
    }
    static setUpdateTimer(){
        SnakeGame.interval = setInterval(()=>{
            SnakeGame.snakes.forEach(snake=>snake.updatePosition())
        }, SnakeGame.updateTimer)

    }
    static pauseUpdateTimer(){
        clearInterval(SnakeGame.interval);
    }
    static toggleHovered(e){
        e.target.classList.toggle('hovered');
    }
}

SnakeGame.createGrid();
SnakeGame.createSnake();
SnakeGame.setUpdateTimer();


let snake = SnakeGame.snakes[0];
