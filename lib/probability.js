var math = require('mathjs');
var lodash = require('lodash');

const deck = require('./deck');

class ProbabilityTable {
  constructor(numDecks, game) {
    this.numDecks = numDecks;
    this.cardCount = {};
    this.game = game;
    this.deckCount = this.game.deck.cards.length;

    this.unseenCards;
    this.shoeCount;
  }

  forDeal(){
    deck.valueStrings.forEach(valueString => ( this.cardCount[valueString] = 4 * this.numDecks));
  }

  afterRound(discardedCards){
    discardedCards.forEach(card => {
      this.deckCount = this.game.deck.cards.length;
      (this.cardCount[card.valueString] -= 1);
    });
    this.game.discarded.pile = [];
    console.log(this.cardCount);
  }

  duringRound(currentCards){
    this.unseenCards = _.merge({}, this.cardCount);
    this.shoeCount = this.deckCount;
    currentCards.forEach(card => {
      this.shoeCount -= 1;
      (this.unseenCards[card.valueString] -= 1);
    });
    let expectedValue = 0;
    Object.keys(this.unseenCards).map(cardKey => {
      if (["Jack", "Queen", "King"].includes(cardKey)) {
        expectedValue += 10 * this.unseenCards[cardKey];
      } else if (cardKey === "Ace") {

      } else if(typeof JSON.parse(cardKey) === 'number') {
        expectedValue += JSON.parse(cardKey) * this.unseenCards[cardKey];
      } else {
        console.log("Unmatched card type")
      }
    });

    expectedValue = (expectedValue / this.shoeCount);

    return expectedValue;
  }


  p(num){

    let values = [];
    let cardKeys = [];
    for (var i = 0; i < deck.blackjackValues.length; i++) {
      for (var j = i; j < deck.blackjackValues.length; j++) {
        if (deck.blackjackValues[i] + deck.blackjackValues[j] === num) {
          values.push([deck.blackjackValues[i], deck.blackjackValues[j]]);
          cardKeys.push([deck.valueStrings[i], deck.valueStrings[j]]);
        }
      }
    }

    let numerator = 0;
    cardKeys.forEach(pair => {
      if(pair[0] === pair[1]){
        if (this.cardCount[pair[0]] > 1) {
          numerator += (math.combinations(this.cardCount[pair[0]], 2));
        }
      } else {
        if (this.cardCount[pair[0]] >= 1 && this.cardCount[pair[1]] >= 1) {
          numerator += ((math.combinations(this.cardCount[pair[0]], 1) * math.combinations(this.cardCount[pair[1]], 1)));
        }
      }
    });
    return (numerator / math.combinations(this.deckCount, 2));
  }

  probArrGen() {
    let probArr = [];
    for (var i = 4; i < 23; i++) {
      probArr.push(this.p(i));
    }
    let extra = probArr.pop();
    probArr[8] = probArr[8] + extra;
    return probArr;
  }

}

module.exports = ProbabilityTable;











//
