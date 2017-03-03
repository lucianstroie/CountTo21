var math = require('mathjs');
var lodash = require('lodash');

//2 to ace decending 17 to 21 BJ BUST
const DEALERPROB = [
  [0.138976, 0.131762, 0.131815, 0.123948, 0.120526, 0, 0.352973],
  [0.130313	0.130946	0.123761	0.123345	0.116047	0	0.375588],
  [0.130973	0.114163	0.120679	0.116286	0.115096	0	0.402803],
  [0.119687	0.123483	0.116909	0.104694	0.106321	0	0.428905],
  [0.166948	0.106454	0.107192	0.100705	0.0978785	0	0.420823],
  [0.372345	0.138583	0.0773344	0.0788967	0.072987	0	0.259854],
  [0.130857	0.362989	0.129445	0.0682898	0.0697914	0	0.238627],
  [0.121886	0.103921	0.357391	0.12225	0.0611088	0	0.233442],
  [0.114418	0.112879	0.114662	0.328879	0.0364661	0.0784314	0.214264],
  [0.14583	0.138063	0.13482	0.175806	0.0736296	0.0482655	0.283585],
  [0.126128, 0.131003, 0.129486, 0.131553, 0.0515646, 0.313726, 0.11654]
];


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
  }

  parentNode() {

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
