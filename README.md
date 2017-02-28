Counting to 21

#Background
Blackjack is one of the few casino games with ‘memory’ in that the previous games change the possible outcome of future games. As a result, it is possible to keep track of previously played cards and see how the advantage can shift from the House to the player with changes in strategy.

#Functionality & MVP
Players of Counting to 21 will be able to:
Play a hand of Blackjack
Make bets up to a certain minimum/maximum
See the probability of winning and the card count change in real time
Let an AI make game and betting decisions until the end of the deck
In addition, the project will include:
An About modal describing the rules of the game and another explaining the probability calculations
A production README

#Wireframe
The game will consist of a single screen with the game board being represented, not as a card game, but as a visualization of the probabilities of various outcomes.

![Wireframe](https://github.com/lucianstroie/CountTo21/blob/master/Screen%20Shot%202017-02-28%20at%208.35.26%20AM.png)

#Architecture and Technologies
This project will be implemented with the following technologies:
Vanilla JavaScript for the game logic and Math.js for the calculation of the probabilities.
D3.js for the visualization
Webpack to bundle and serve up the various scripts
In addition to the webpack file, there will be three scripts involved in this project:
board.js: contains the visualization as well as collects user input.
game.js: will handle the game logic which includes setting the deck and keeps track of bets.
ai.js:  calculates the probability of winning for each hand and then makes betting recommendations based on them.

#Implementation Timeline
Day 1: Dedicate the day looking into D3.js and finding the appropriate visualization for the probability tree. Goals of the day:
Learn the requirements and the data structure needed for the visualization
See how I can make the visualizations interactive
Day 2: Build the JavaScript game functionality, with probability calculations and AI.
Day 3: Build out the front end, player interactivity, and the animation.
