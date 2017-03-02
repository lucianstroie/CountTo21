var math = require('mathjs');




const valueStrings = [...Array(11).keys()].slice(2).map(x => x.toString()).concat(["Jack", "Queen", "King", "Ace"]);
const blackjackValues = [...Array(11).keys()].slice(2).concat([10, 10, 10, 11]);

class ProbabilityTable {
  constructor() {
    this.cardCount = {};
    this.deckCount = 52;
  }

  forDeal(){
    valueStrings.forEach(valueString => ( this.cardCount[valueString] = 4));
  }

  afterDeal(discardedCards){
    discardedCards.forEach(card => {
      this.deckCount -= 1;
      (this.cardCount[card.valueString] -= 1);
    });
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

}

module.exports = ProbabilityTable;
