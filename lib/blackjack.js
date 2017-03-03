// const Deck = require('./deck.js');
var math = require('mathjs');
const ProbabilityTable = require('./probability');
const PlayerAI = require('./player_ai');

// const testing = (math.combinations(4, 2))/(math.combinations(52, 2));
// window.testing = testing;

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
  constructor(deckCount){
    this.cards = [];
    for (var i = 0; i < deckCount; i++) {
      for (let suit in suits) {
        for (let val in valueStrings) {
          this.cards.push(new Card(suits[suit], valueStrings[val], blackjackValues[val]));
        }
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
    let card = deck.getCard();
    this.cards.push(card);
    return card;
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

    while (points > 21) {
      if (aces > 0) {
        points -= 10;
        aces -= 1;
      } else {
        break;
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
    this.cards.forEach(card => discarded.pile.push(card));
    this.cards = [];
  }
}


class DiscardPile {
  constructor(){
    this.pile = [];
  }
}


class Player {
  constructor(name, bankroll) {
    this.name = name;
    this.bankroll = bankroll;
    this.hand = new Hand;
  }

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
    this.hand = new Hand;
  }

  playHand() {
    while (!this.hand.busted() && this.hand.points() < 16) {
      this.hand.hit();
    }
  }

  takeBet(betAmt) {
    this.bet = betAmt;
  }

  payBets(currentPlayer){
    if (currentPlayer.hand.beats(this.hand)) {
      currentPlayer.payWinnings(this.bet * 2);
    } else if (currentPlayer.hand.points() === this.hand.points()) {
      currentPlayer.payWinnings(this.bet);
    }
  }
}

function Game() {
  this.deck = new Deck(2);
  this.discarded = new DiscardPile();
  this.pt = new ProbabilityTable();
  this.players = [];
  this.player1 = new Player("Adam", 100);
  this.players.push(this.player1);
  this.player2 = new Player("Ben", 200);
  this.players.push(this.player2);
  this.player3 = new Player("Chris", 300);
  this.players.push(this.player3);
  this.dealer = new Dealer();

  // while (this.deck.cards.length > 4 && this.player.bankroll > 0) {
    console.log(this.deck.cards.length);
    console.log(this.players);

    //Initial p dist

    console.log(this.pt.forDeal());
    console.log(this.pt.cardCount);
    let prob = 0;
    for (var i = 4; i < 23; i++) {
      console.log(this.pt.p(i));
      prob += this.pt.p(i);
    }
    console.log(prob);


    this.players.forEach(player => player.placeBet(this.dealer, 10));

    console.log("player1's points" + this.player1.hand.points());
    console.log("player2's points" + this.player2.hand.points());
    console.log("player3's points" + this.player3.hand.points());

    this.visibleCards = [];
    let dealerTop = this.dealer.hand.cards[0];
    this.visibleCards.push(dealerTop);
    this.players.forEach(player => {
      for (var i = 0; i < player.hand.cards.length; i++) {
        this.visibleCards.push(player.hand.cards[i]);
      }
    });

    let expectedValue = this.pt.duringRound(this.visibleCards); // returns expectedValue

    this.players.forEach(player => {
      let playerHand = player.hand.cards;
      let playerPoints = player.hand.points();

      let playAI = new PlayerAI(dealerTop, playerHand, playerPoints, expectedValue);

      let bool = playAI.hitdecision();
      while (playAI.hitdecision()) {
        let newCard = player.hand.hit();
        this.visibleCards.push(newCard);
        expectedValue = this.pt.duringRound(this.visibleCards);
        playerHand = player.hand.cards;
        playerPoints = player.hand.points();
        playAI = new PlayerAI(dealerTop, playerHand, playerPoints, expectedValue);
      }
      //if hit add to visibleCards ie update expectedValue and replay playerAI


    });
    //This is where the PlayerAI logic will go! dealerTop, playerHand, points, expectedValue


    this.dealer.playHand();
    console.log("dealer's points" + this.dealer.hand.points());
    this.players.forEach(player => this.dealer.payBets(player));

    console.log(this.player1);
    console.log(this.player2);
    console.log(this.player3);

    this.players.forEach(player => player.hand.discardCards());

    this.dealer.hand.discardCards();
    console.log(this.discarded.pile);
  // }





    console.log(this.pt.afterRound(this.discarded.pile));
    console.log(this.pt.cardCount);

    prob = 0;
    for (var i = 4; i < 23; i++) {
      console.log(this.pt.p(i));
      prob += this.pt.p(i);
    }
    console.log(prob);
}

window.game = Game();

















//bottom of page :)
