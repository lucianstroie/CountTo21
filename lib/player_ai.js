
//2 to ace decending 17 to 21 BJ BUST
const DEALERTABLE = [
  [0.138976, 0.131762, 0.131815, 0.123948, 0.120526, 0.352973],
  [0.130313, 0.130946, 0.123761, 0.123345, 0.116047, 0.375588],
  [0.130973, 0.114163, 0.120679, 0.116286, 0.115096, 0.402803],
  [0.119687, 0.123483, 0.116909, 0.104694, 0.106321, 0.428905],
  [0.166948, 0.106454, 0.107192, 0.100705, 0.0978785, 0.420823],
  [0.372345, 0.138583, 0.0773344, 0.0788967, 0.072987, 0.259854],
  [0.130857, 0.362989, 0.129445, 0.0682898, 0.0697914, 0.238627],
  [0.121886, 0.103921, 0.357391, 0.12225, 0.0611088, 0.233442],
  [0.114418, 0.112879, 0.114662, 0.328879, 0.1148975, 0.214264],
  [0.114418, 0.112879, 0.114662, 0.328879, 0.1148975, 0.214264],
  [0.114418, 0.112879, 0.114662, 0.328879, 0.1148975, 0.214264],
  [0.114418, 0.112879, 0.114662, 0.328879, 0.1148975, 0.214264],
  [0.126128, 0.131003, 0.129486, 0.131553, 0.3652906, 0.11654]
  [0.14583, 0.138063, 0.13482, 0.175806, 0.1218951, 0.283585],
];

const DEALERTABLEVALUES = [17, 18, 19, 20, 21, "BUST"]

const valueStrings = [...Array(11).keys()].slice(2).map(x => x.toString()).concat(["Jack", "Queen", "King", "Ace"]);

class PlayerAI {
  constructor(dealerTop, playerHand, points, expectedValue) {
    this.dealerTop = dealerTop;
    this.playerHand = playerHand;
    this.acesInHand = 0;
    this.playerHand.forEach(card => {if(card.valueString === "Ace") this.acesInHand += 1})
    this.points = points;
    this.expectedValue = expectedValue;

    this.dealerProbability = DEALERTABLE[valueStrings.indexOf(dealerTop.valueString)];

  }

  hitdecision() {
    let dealerExpectedValue = 0;
    for (var i = 0; i < this.dealerProbability.length - 1; i++) {
      dealerExpectedValue += this.dealerProbability[i] * DEALERTABLEVALUES[i];
    }
    if (this.points < dealerExpectedValue) {
      if ((this.points + this.expectedValue) <= 21) {
        return true;
      } else {
        //handle edge case better!
        return false;
      }
    } else {
      return false;
    }
  }

  //take the dealerTop calc the dealerExpectedValue
  //count aces in playerHand
  //get the points and see if > than dealerExpectedValue
  // if not add expectedValue and compare outcomes between hit and stay, take aces into account

}

module.exports = PlayerAI;
