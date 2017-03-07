var math = require('mathjs');
var lodash = require('lodash');




const valueStrings = [...Array(11).keys()].slice(2).map(x => x.toString()).concat(["Jack", "Queen", "King", "Ace"]);
const blackjackValues = [...Array(11).keys()].slice(2).concat([10, 10, 10, 11]);

class ProbabilityTable {
  constructor() {
    this.cardCount = {};
    this.deckCount = 52;

    this.unseenCards;
    this.shoeCount;
  }

  forDeal(){
    valueStrings.forEach(valueString => ( this.cardCount[valueString] = 4));
  }

  afterRound(discardedCards){
    discardedCards.forEach(card => {
      this.deckCount -= 1;
      (this.cardCount[card.valueString] -= 1);
    });
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



  p4(){
    let count = this.cardCount["2"];
    return (math.combinations(count, 2))/(math.combinations(this.deckCount, 2));
  }
  p5(){
    let count2 = this.cardCount["2"];
    let count3 = this.cardCount["3"];
    return (math.combinations(count2, 1) * math.combinations(count3,1))/(math.combinations(this.deckCount, 2));
  }
  p6(){
    let count2 = this.cardCount["2"];
    let count3 = this.cardCount["3"];
    let count4 = this.cardCount["4"];
    return ((math.combinations(count2, 1) * math.combinations(count4,1)) + (math.combinations(count3, 2)))/
      (math.combinations(this.deckCount, 2));
  }
  p7(){
    let count2 = this.cardCount["2"];
    let count3 = this.cardCount["3"];
    let count4 = this.cardCount["4"];
    let count5 = this.cardCount["5"];
    return ((math.combinations(count2, 1) * math.combinations(count5,1)) +
     (math.combinations(count3, 1) * math.combinations(count4,1)))/
      (math.combinations(this.deckCount, 2));
  }
  p(num){

    let values = [];
    let cardKeys = [];
    for (var i = 0; i < blackjackValues.length; i++) {
      for (var j = i; j < blackjackValues.length; j++) {
        if (blackjackValues[i] + blackjackValues[j] === num) {
          values.push([blackjackValues[i], blackjackValues[j]]);
          cardKeys.push([valueStrings[i], valueStrings[j]]);
        }
      }
    }

    let numerator = 0;
    cardKeys.forEach(pair => {
      if(pair[0] === pair[1]){
        numerator += (math.combinations(this.cardCount[pair[0]], 2));
      } else {
        numerator += ((math.combinations(this.cardCount[pair[0]], 1) * math.combinations(this.cardCount[pair[1]], 1)));
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
