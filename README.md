CountTo21

# Background
Blackjack is one of the few casino games with ‘memory’ in that the previous games change the possible outcome of future games. As a result, it is possible to keep track of previously played cards and see how the advantage can shift from the House to the player with changes in strategy.

# Functionality
* Players of Counting to 21 will be able to:
* Play a hand of Blackjack
* Make bets up to the limit of the bankroll
* See the probability of getting dealt different point levels and have it change with the card count in real time
* Let an AI make game and betting decisions until the end of the decks
In addition, the project will include:
* An About modal describing the rules of the game and another explaining the probability calculations

![GamePlay](./pictures/countto21gif.gif)

# Architecture and Technologies
This project will be implemented with the following technologies:
* Vanilla JavaScript for the game logic and Math.js for the calculation of the probabilities.
* charts.js for the visualization
* Webpack to bundle and serve up the various scripts
In addition to the webpack file, there will be three scripts involved in this project:
* blackjack.js: contains the game logic and the css manipulation logic.
* probability.js: creates the probability tree, keeps track of the card count, and calculates the expected value for the AI logic.
* chart.js: handles the chart rendering logic.
* player_ai.js:  calculates the probability of winning for each hand and then makes betting recommendations based on them.
