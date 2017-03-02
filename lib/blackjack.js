// const Deck = require('./deck.js');

const suits = ["Hearts", "Spades", "Clubs", "Diamonds"];
const valueStrings = [...Array(11).keys()].slice(2).map(x => x.toString()).concat(["Jack", "Queen", "King", "Ace"]);

const blackjackValues = [...Array(11).keys()].slice(2).concat([10, 10, 10, 11]);

class Card {
  constructor(suit, valueString, blackjackValue){
    this.suit = suit;
    this.valueString = valueString;
    this.blackjackValue = blackjackValue;
  }

}

class Deck {
  constructor(){
    this.cards = [];
    for (let suit in suits) {
      for (let val in valueStrings) {
        this.cards.push(new Card(suits[suit], valueStrings[val], blackjackValues[val]));
      }
    }
    for ( let i = (this.cards.length - 1); i > 0; i -= 1) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = this.cards[i];
      this.cards[i] = this.cards[j];
      this.cards[j] = temp;
    }
    this.getCard = this.getCard.bind(this);
  }

  getCard(){
    let a = this.cards.shift();
    return a;
  }
}

class Hand {
  constructor() {
    this.cards = [];
    this.cards.push(deck.getCard());
    this.cards.push(deck.getCard());
  }

  hit() {
    return this.cards.push(deck.getCard());
  }

  points() {
    let points = 0;
    let aces = 0;

    for (var i = 0; i < this.cards.length; i++) {
      points += this.cards[i].blackjackValue;
      if (this.cards[i].blackjackValue === 11) {
        aces += 1;
      }
    }

    if (points > 21) {
      if (aces > 0) {
        points -= 10;
      }
    }

    return points;
  }

  busted() {
    return this.points() > 21;
  }

  beats(otherHand) {
    if (this.busted()) {
      return "Already Busted";
    } else {
      return (otherHand.busted()) || (this.points() > otherHand.points());
    }
  }

  discardCards() {
    discarded.pile.concat(this.cards);
    this.cards = [];
  }
}


class DiscardPile {
  constructor(){
    this.pile = [];
  }
}


class Player {
  constructor(bankroll) {
    this.bankroll = bankroll;
    this.hand = new Hand; //Is this needed?
  }

  //return hand method

  payWinnings(winnings) {
    this.bankroll += winnings;
  }

  placeBet(dealer, betAmt) {
    if (betAmt > this.bankroll) {
      console.log( "Insufficient funds");
    } else {
      dealer.takeBet(betAmt);
      this.bankroll -= betAmt;
    }
  }
}


class Dealer {
  constructor(){
    this.bet = 0;
    this.hand = new Hand; //Is this needed?
  }

  playHand() {
    while (!this.hand.busted() || this.hand.points() > 16) {
      this.hand.hit();
    }
  }

  takeBet(betAmt) {
    this.bet = betAmt;
  }

  payBets(){
    if (player.hand.beats(this.hand)) {
      player.payWinnings(this.bet * 2);
    }
  }
}

function Game() {
  this.deck = new Deck;
  this.discarded = new DiscardPile();
  this.player = new Player(100);
  this.dealer = new Dealer();

  // debugger
  while (this.deck.cards.length > 4 && this.player.bankroll > 0) {
    console.log(this.player);
    this.player.placeBet(this.dealer, 10);
    console.log(this.player);
    this.dealer.payBets();
    console.log(this.player);
  }


}

window.game = Game();
// var deck = new Deck();
// var hand = new Hand();
// var discarded = new DiscardPile();
// var player = new Player();
// var dealer = new Dealer();
// window.hand = hand;

















//bottom of page :)
