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
- The Browser can manage an absurd number of <div>'s. I built this project using both my gaming PC and my take-about low-end laptop that is approx 8 years old and has ~2GB of RAM. The lappy runs a really low-requirement version of Linux Mint. Both were able to handle both a foreground DrawSpace of 100x100 and a background SnakeGame of 100x100 on 10ms update timers with little to no lag. Resizing or inspecting the parent containers, however, caused some pain, which made debugging later on incredibly painful. Had the requirements of the project not asked for hover implementation, I would have used <canvas>
- I shouldn't have made SnakeGame (the staticClass that manages the background Snake) into a static class, but ought have simply made it a single {Object} which housed the Snake Class. Making self-referencing static calls for functions for a class that is never instantiated into an object was strange.
- Making thousands of divs both in the fore and background is a really stupid and resoursce intensive idea. It did, however, make painting where the snakes were a breeze as each of the tiles could be looked up instantly and have their internal styles overwritten pretty quickly.
- Maps are good and make lookups and checks in a grid as easy as using an array.
- I knew this beforehand but didn't catch myself doing it: Modifying an array as you are iterating thru it is a VERY stupid idea that can result in behaviors that only appear every once in awhile. 
- - Prior to this model, when the snakes realized they couldn't move forward, they would delete themselves from the SnakeGame array of Snakes and would clear out all tiles they occupied by resetting the background color of the divs they occupied and removing the '.occupied' class. This is all fine and dandy except they did it in their update() function, which was being called by SnakeGame in a SnakeGame.snakes.forEach(snake=>{snake.update()}) call. I'd say 1/1000 times it would result in wonky behavior which would leave div's occupied and colore long after the snake was dead and removed.  

## What I Would Do Different
```js
while(justin.ruminatingAboutProject){
    console.log(`I should have ignored the requirements and used <canvas></canvas>`)
}
```
## 