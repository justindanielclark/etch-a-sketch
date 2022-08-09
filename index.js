class Snake {
    static directions = [0,1,2,3]; // up, right, down, left
    static tendency = 25;
    static growthRate = 25;
    constructor(startingX, startingY){
        this.x = startingX;
        this.y = startingY;
        this.length = SnakeGame.startingSnakeLength;
        this.currentDirection = Math.floor(Math.random()*4);
        this.lastDirection = this.currentDirection;
        this.positions = [[this.x, this.y]];
        this.tendency = 10;
        this.turns = 0;
        this.color = {
            red: Math.floor(Math.random()*255),
            green: Math.floor(Math.random()*255),
            blue: Math.floor(Math.random()*255),
            alpha: .4
        }
    }
    updatePosition(){
        if (this.turns > Snake.growthRate){
            this.length++;
            this.turns = 0;
        }

        if(Math.floor(Math.random()*this.tendency) === 0){
            let newDirection = Math.floor(Math.random()*Snake.directions.length);
            while(newDirection === this.lastDirection || newDirection === ((this.lastDirection+2)%4)){
                newDirection = Math.floor(Math.random()*Snake.directions.length);
            }
            this.lastDirection = this.currentDirection;
            this.currentDirection = newDirection;
            this.tendency = Snake.tendency;
        } else {
            this.tendency--;
        }

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
        if (this.positions.length > this.length){
            let tail = this.positions.pop();
            SnakeGame.map.get(tail[0].toString()).get(tail[1].toString()).style.backgroundColor = null;
        }
        
        this.turns++;
    }
}
class SnakeGame {
    static gridSize = 50;
    static startingSnakeLength = 3;
    static map = new Map();
    static snakes = [];
    static interval;
    static updateTimer = 50;
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
    static createSnake(){
        SnakeGame.snakes.push(new Snake(Math.floor(SnakeGame.gridSize * Math.random()), Math.floor(SnakeGame.gridSize * Math.random()), this));
    }
    // static createSnake(num){
    //     console.log('hit');
    //     for(let i = 0; i < num; i++){
    //         SnakeGame.createSnake();
    //     }
    // }
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



SnakeGame.createGrid();
SnakeGame.createSnake();

for(let i = 0; i < 20; i++){
    SnakeGame.snakes.forEach(snake=>snake.updatePosition())
}
SnakeGame.setUpdateTimer();


DrawSpace.createGrid();


let snake = SnakeGame.snakes[0];
