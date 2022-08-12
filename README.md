# etch-a-sketch

## Project Summary
### Per The Requirements of The Odin Project:
- Create a webpage with a 16x16 grid of square divs
- Create the divs using JavaScript
- Set up a “hover” effect so that the grid divs change color when your mouse passes over them, leaving a (pixelated) trail through your grid like a pen would
- Add a button to the top of the screen that will send the user a popup asking for the number of squares per side for the new grid. Once entered, the existing grid should be removed and a new grid should be generated in the same total space as before (e.g. 960px wide) so that you’ve got a new sketch pad. Tip: Set the limit for the user input to a maximum of 100.
### My Own Requirements
- Have autonomous snakes in the background at all times emulating the patterns drawn by the 'pen'


## What I Learned
- I shouldn't have made SnakeGame (the staticClass that manages the background Snake) into a static class, but ought have simply made it a single {Object} which housed the Snake Class. Making self-referencing static calls to your own functions for a class you never instantiate into an object was strange.
- Making thousands of divs both in the fore and background is a really stupid and resoursce intensive idea. It did, however, make painting where the snakes were a breeze as each of the tiles could be looked up instantly and have their internal styles overwritten pretty quickly.
- I knew this, but modifying an array as you are iterating thru it is a VERY stupid idea that can result in behaviors that only appear every once in awhile. Prior to this model, when the snakes realized they couldn't move forward, they would delete themselves from the SnakeGame array of Snakes and would clear out all tiles they occupied by resetting the background color and removing the '.occupied' class. This is all fine and dandy except they did it in their update() function, whichw as being called by SnakeGame in a SnakeGame.snakes.forEach(snake=>{snake.update()}) call. I'd say 1/1000 times it would result in wonky behavior. It took longer than I would like to admit to realize this was the resulting behavior

## What I Would Do Different
```js
while(justin.ruminatingAboutProject){
    console.log(`I should have ignored the requirements and used <canvas></canvas>`)
}
```
## 