var math = require('mathjs');
const ProbabilityTable = require('./probability');
const ChartCreator = require('./chart');
const PlayerAI = require('./player_ai');


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
  constructor(game) {
    this.cards = [];
    this.game = game;
    this.cards.push(this.game.deck.getCard());
    this.cards.push(this.game.deck.getCard());
  }

  hit() {
    let card = this.game.deck.getCard();
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

    this.cards.forEach(card => this.game.discarded.pile.push(card));
    this.cards = [];
  }
}


class DiscardPile {
  constructor(){
    this.pile = [];
  }
}


class Player {
  constructor(name, bankroll, game) {
    this.name = name;
    this.bankroll = bankroll;
    this.hand = new Hand(game);
    this.game = game;
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
  constructor(game){
    this.bet = 0;
    this.hand = new Hand(game);
    this.game = game;
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

function getBet(game) {
  const betForm = document.getElementById('place-bet');
  console.log(betForm)

  betForm.classList.remove("hidden");
    betForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let amt = document.getElementById('quantity').value;
      this.game.player1.placeBet(this.game.dealer, amt);
      console.log(this.game.player1);

      betForm.setAttribute( 'class', 'hidden' );

      renderDeal(game);
    });

}

function renderDeal(game, alreadyHit) {
    console.log("player1's points" + this.game.player1.hand.points());
    console.log("player2's points" + this.game.player2.hand.points());
    console.log("player3's points" + this.game.player3.hand.points());

    this.game.player1.hand.cards.forEach((card, idx) => {
      let cardPic = "./pictures/playing_cards/" + card.valueString.toLowerCase()
        + "_of_" + card.suit.toLowerCase() + ".png";
      let fullString = `url(${cardPic}) no-repeat`;

      let cardNum = ".player1 ";
      if (idx === 0) {
          cardNum += '.first';
        } else if (idx === 1) {
          cardNum = '.second';
        } else if (idx === 2) {
          cardNum = '.third';
        } else if (idx === 3) {
          cardNum = '.fourth';
        } else if (idx === 4) {
          cardNum = '.fifth';
        }

      document.querySelector(`${cardNum}`).classList.remove("hidden");
      document.querySelector(`${cardNum}`).style.background = fullString;
    });

    this.game.player2.hand.cards.forEach((card, idx) => {
      let cardPic = "./pictures/playing_cards/" + card.valueString.toLowerCase()
        + "_of_" + card.suit.toLowerCase() + ".png";
      let fullString = `url(${cardPic}) no-repeat`;

      let cardNum = ".player2 ";
      if (idx === 0) {
          cardNum += '.first';
        } else if (idx === 1) {
          cardNum += '.second';
        } else if (idx === 2) {
          cardNum += '.third';
        } else if (idx === 3) {
          cardNum += '.fourth';
        } else if (idx === 4) {
          cardNum += '.fifth';
        }

      document.querySelector(`${cardNum}`).classList.remove("hidden");
      document.querySelector(`${cardNum}`).style.background = fullString;
    });

    this.game.player3.hand.cards.forEach((card, idx) => {
      let cardPic = "./pictures/playing_cards/" + card.valueString.toLowerCase()
        + "_of_" + card.suit.toLowerCase() + ".png";
      let fullString = `url(${cardPic}) no-repeat`;

      let cardNum  = ".player3 ";
      if (idx === 0) {
          cardNum += '.first';
        } else if (idx === 1) {
          cardNum += '.second';
        } else if (idx === 2) {
          cardNum += '.third';
        } else if (idx === 3) {
          cardNum += '.fourth';
        } else if (idx === 4) {
          cardNum += '.fifth';
        }


      document.querySelector(`${cardNum}`).classList.remove("hidden");
      document.querySelector(`${cardNum}`).style.background = fullString;
    });

    this.game.dealer.hand.cards.forEach((card, idx) => {
      let cardPic = "./pictures/playing_cards/" + card.valueString.toLowerCase()
        + "_of_" + card.suit.toLowerCase() + ".png";
      let fullString = `url(${cardPic}) no-repeat`;

      let cardNum  = ".dealer ";
      if (idx === 0) {
          cardNum += '.first';
        }

      document.querySelector(`${cardNum}`).style.background = fullString;
    });

    this.game.visibleCards = [];
    let dealerTop = this.game.dealer.hand.cards[0];
    this.game.visibleCards.push(dealerTop);
    this.game.players.forEach(player => {
      for (var i = 0; i < player.hand.cards.length; i++) {
        this.game.visibleCards.push(player.hand.cards[i]);
      }
    });
  if (!alreadyHit) {
    renderHit(game);
  }
}


function renderHit(game) {
  const hitForm = document.querySelector('.get-hit');
  console.log(hitForm)

  let expectedValue = this.game.pt.duringRound(this.game.visibleCards);
  console.log(expectedValue.toFixed(2));
  hitForm.classList.remove("hidden");

  const hit = document.getElementById("draw");
  hit.addEventListener('click', (e) => {
    // e.preventDefault();

      let newCard = this.game.player1.hand.hit();
      this.game.visibleCards.push(newCard);
      expectedValue = this.game.pt.duringRound(this.game.visibleCards);

      console.log("player1's points" + this.game.player1.hand.points());

      this.game.player1.hand.cards.forEach((card, idx) => {
        let cardPic = "./pictures/playing_cards/" + card.valueString.toLowerCase()
          + "_of_" + card.suit.toLowerCase() + ".png";
        let fullString = `url(${cardPic}) no-repeat`;

        let cardNum = ".player1 ";
        if (idx === 0) {
            cardNum += '.first';
          } else if (idx === 1) {
            cardNum += '.second';
          } else if (idx === 2) {
            cardNum += '.third';
          } else if (idx === 3) {
            cardNum += '.fourth';
          } else if (idx === 4) {
            cardNum += '.fifth';
          }

        document.querySelector(`${cardNum}`).classList.remove("hidden");
        document.querySelector(`${cardNum}`).style.background = fullString;
        if (this.game.player1.hand.points() > 21) {
          //bust!
        }
      });
    });

    const stay = document.getElementById("stay");
    stay.addEventListener('click', (e) => {
      // e.preventDefault();

      this.game.visibleCards = [];
      let dealerTop = this.game.dealer.hand.cards[0];
      this.game.visibleCards.push(dealerTop);
      this.game.players.slice(1).forEach(player => {
        for (var i = 0; i < player.hand.cards.length; i++) {
          this.game.visibleCards.push(player.hand.cards[i]);
        }
      });

      this.game.players.forEach(player => {
        let playerHand = player.hand.cards;
        let playerPoints = player.hand.points();

        let playAI = new PlayerAI(dealerTop, playerHand, playerPoints, expectedValue);

        let bool = playAI.hitdecision();
        while (playAI.hitdecision()) {
          let newCard = player.hand.hit();
          this.game.visibleCards.push(newCard);
          expectedValue = this.game.pt.duringRound(this.game.visibleCards);
          playerHand = player.hand.cards;
          playerPoints = player.hand.points();
          playAI = new PlayerAI(dealerTop, playerHand, playerPoints, expectedValue);
        }
      });
      let alreadyHit = true;
      renderDeal(game, alreadyHit);
      hitForm.setAttribute( 'class', 'hidden' );
      dealerAction(game);
    });



    const pressAI =document.getElementById("ai");
    pressAI.addEventListener('click', (e) => {

      this.game.visibleCards = [];
      let dealerTop = this.game.dealer.hand.cards[0];
      this.game.visibleCards.push(dealerTop);
      this.game.players.forEach(player => {
        for (var i = 0; i < player.hand.cards.length; i++) {
          this.game.visibleCards.push(player.hand.cards[i]);
        }
      });

      this.game.players.forEach(player => {
        let playerHand = player.hand.cards;
        let playerPoints = player.hand.points();

        let playAI = new PlayerAI(dealerTop, playerHand, playerPoints, expectedValue);

        let bool = playAI.hitdecision();
        while (playAI.hitdecision()) {
          let newCard = player.hand.hit();
          this.game.visibleCards.push(newCard);
          expectedValue = this.game.pt.duringRound(this.game.visibleCards);
          playerHand = player.hand.cards;
          playerPoints = player.hand.points();
          playAI = new PlayerAI(dealerTop, playerHand, playerPoints, expectedValue);
        }
    });
    let alreadyHit = true;
    renderDeal(game, alreadyHit);
    hitForm.setAttribute( 'class', 'hidden' );
    dealerAction(game);
  });
}

function dealerAction(game){
  const dealer =document.getElementById("dealer");
  dealer.classList.remove("hidden");
  dealer.addEventListener('click', (e) => {

    this.game.dealer.playHand();
    this.game.dealer.hand.cards.forEach((card, idx) => {
      let cardPic = "./pictures/playing_cards/" + card.valueString.toLowerCase()
        + "_of_" + card.suit.toLowerCase() + ".png";
      let fullString = `url(${cardPic}) no-repeat`;

      let cardNum = ".dealer ";
      if (idx === 0) {
          cardNum += '.first';
        } else if (idx === 1) {
          cardNum += '.second';
        } else if (idx === 2) {
          cardNum += '.third';
        } else if (idx === 3) {
          cardNum += '.fourth';
        } else if (idx === 4) {
          cardNum += '.fifth';
        }

      document.querySelector(`${cardNum}`).classList.remove("hidden");
      document.querySelector(`${cardNum}`).style.background = fullString;
    });

      console.log("dealer's points" + this.game.dealer.hand.points());
      this.game.players.forEach(player => this.game.dealer.payBets(player));

      console.log(this.game.player1);
      console.log(this.game.player2);
      console.log(this.game.player3);

      this.game.players.forEach(player => player.hand.discardCards());

      this.game.dealer.hand.discardCards();
      console.log(this.game.discarded.pile);
      console.log(this.game.pt.afterRound(this.game.discarded.pile));
      console.log(this.game.pt.cardCount);

      this.game.chart = new ChartCreator(this.game.pt.probArrGen());

      dealer.setAttribute( 'class', 'hidden' );

    getBet(this.game);

  });
}



function Game() {
  this.deck = new Deck(2);
  this.discarded = new DiscardPile();
  this.pt = new ProbabilityTable();
  this.players = [];
  this.game = this;
  this.player1 = new Player("Adam", 1000, this.game);
  this.players.push(this.player1);
  this.player2 = new Player("Ben", 2000, this.game);
  this.players.push(this.player2);
  this.player3 = new Player("Chris", 3000, this.game);
  this.players.push(this.player3);
  this.dealer = new Dealer(this.game);


    document.addEventListener("DOMContentLoaded", () =>{

      this.pt.forDeal();

      this.chart = new ChartCreator(this.pt.probArrGen());

      getBet(this.game);

    });
}

window.game = new Game();















//bottom of page :)
