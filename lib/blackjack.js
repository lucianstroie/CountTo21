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
      return false;
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

  betForm.classList.remove("hidden");
  this.game.getBetCallb = getBetCallback.bind(game);
  betForm.addEventListener('submit', this.game.getBetCallb);

}

function getBetCallback(e) {
  e.preventDefault();
  const betForm = document.getElementById('place-bet');
  let amt = document.getElementById('quantity').value;
  this.game.player1.placeBet(this.game.dealer, amt);
  console.log(this.game.player1);

  betForm.className += ' hidden';
  renderDeal(game, false);
}

function renderDeal(game, alreadyHit) {

    // console.log("player1's points" + this.game.player1.hand.points());
    // console.log("player2's points" + this.game.player2.hand.points());
    // console.log("player3's points" + this.game.player3.hand.points());

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
          document.querySelector(`${cardNum}`).classList.remove("hidden");
        } else if (idx === 3) {
          cardNum += '.fourth';
          document.querySelector(`${cardNum}`).classList.remove("hidden");
        } else if (idx === 4) {
          cardNum += '.fifth';
          document.querySelector(`${cardNum}`).classList.remove("hidden");
        }


      // document.querySelector(`${cardNum}`).classList.remove("hidden");
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
          document.querySelector(`${cardNum}`).classList.remove("hidden");
        } else if (idx === 3) {
          cardNum += '.fourth';
          document.querySelector(`${cardNum}`).classList.remove("hidden");
        } else if (idx === 4) {
          cardNum += '.fifth';
          document.querySelector(`${cardNum}`).classList.remove("hidden");
        }

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
          document.querySelector(`${cardNum}`).classList.remove("hidden");
        } else if (idx === 3) {
          cardNum += '.fourth';
          document.querySelector(`${cardNum}`).classList.remove("hidden");
        } else if (idx === 4) {
          cardNum += '.fifth';
          document.querySelector(`${cardNum}`).classList.remove("hidden");
        }


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
    alreadyHit = false;
    renderHit(this.game);
  }
}


function renderHit(game) {
  const hitForm = document.getElementById('get-hit');

  let expectedValue = this.game.pt.duringRound(this.game.visibleCards);
  console.log(expectedValue.toFixed(2));
  hitForm.classList.remove("hidden");

  const hit = document.getElementById("draw");
  this.game.hitCallb = hitCallback.bind(game);
  hit.addEventListener('click', this.game.hitCallb);

  const stay = document.getElementById("stay");
  this.game.stayCallb = stayCallback.bind(game);
  stay.addEventListener('click', this.game.stayCallb);

  const pressAI =document.getElementById("ai");
  this.game.aiCallb = aiCallback.bind(game);
  pressAI.addEventListener('click', this.game.aiCallb);
}


function hitCallback(e) {
  const hitForm = document.getElementById('get-hit');

  let expectedValue = this.game.pt.duringRound(this.game.visibleCards);

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
        document.querySelector(`${cardNum}`).classList.remove("hidden");
      } else if (idx === 3) {
        cardNum += '.fourth';
        document.querySelector(`${cardNum}`).classList.remove("hidden");
      } else if (idx === 4) {
        cardNum += '.fifth';
        document.querySelector(`${cardNum}`).classList.remove("hidden");
      }

    document.querySelector(`${cardNum}`).style.background = fullString;
    if (this.game.player1.hand.points() > 21) {
      //bust!
      this.game.bustedPlayer;
      if (!this.game.bustedPlayer) {
        this.game.stayCallb();
      }
      this.game.bustedPlayer = true;
    }
  });
}


function stayCallback(e) {

  const hitForm = document.getElementById('get-hit');

  let expectedValue = this.game.pt.duringRound(this.game.visibleCards);

  this.game.visibleCards = [];
  let dealerTop = this.game.dealer.hand.cards[0];
  this.game.visibleCards.push(dealerTop);
  this.game.players.forEach(player => {
    for (var i = 0; i < player.hand.cards.length; i++) {
      this.game.visibleCards.push(player.hand.cards[i]);
    }
  });

  this.game.players.forEach(player => {
    if (player.name !== "Adam") {
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
    }
  });
  let alreadyHit = true;
  renderDeal(game, alreadyHit);
  hitForm.className += ' hidden';
  dealerAction(game);
}


function aiCallback(e) {

  const hitForm = document.getElementById('get-hit');

  let expectedValue = this.game.pt.duringRound(this.game.visibleCards);

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
  renderDeal(this.game, alreadyHit);
  hitForm.className += ' hidden';
  dealerAction(this.game);
}


function dealerAction(game){
  const dealer = document.getElementById("dealer");
  dealer.classList.remove("hidden");
  this.game.dealerCallb = dealerCallback.bind(game);
  dealer.addEventListener('click', this.game.dealerCallb);
}

function dealerCallback(e) {

  const dealer = document.getElementById("dealer");

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
      document.querySelector(`${cardNum}`).classList.remove("hidden");
    } else if (idx === 3) {
      cardNum += '.fourth';
      document.querySelector(`${cardNum}`).classList.remove("hidden");
    } else if (idx === 4) {
      cardNum += '.fifth';
      document.querySelector(`${cardNum}`).classList.remove("hidden");
    }

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
    this.game.pt.afterRound(this.game.discarded.pile);


    this.game.chart.probArrArray.push(this.game.pt.probArrGen());

    this.game.chart.chart.destroy();

    this.game.chart = new ChartCreator(this.game.chart.probArrArray);

    dealer.className += ' hidden';

  restart(this.game);
}


function restart(game) {
  console.log(this.game)
  const nextRound = document.getElementById("next-round");
  nextRound.classList.remove("hidden");
  this.game.restartCallb = restartCallback.bind(game)
  nextRound.addEventListener('click', this.game.restartCallb);
}

function restartCallback(e) {

  const nextRound = document.getElementById("next-round");

  for (let playerNum = 1; playerNum < 4; playerNum++) {

    for (let idx = 0; idx < 5; idx++) {
      let cardNum = ".player" + playerNum + " ";
      if (idx === 0) {
          cardNum += '.first';
          document.querySelector(`${cardNum}`).style.background = "url('./pictures/back_pc.png') no-repeat";
        } else if (idx === 1) {
          cardNum += '.second';
          document.querySelector(`${cardNum}`).style.background = "url('./pictures/back_pc.png') no-repeat";
        } else if (idx === 2) {
          cardNum += '.third';
          document.querySelector(`${cardNum}`).style.background = "url('./pictures/back_pc.png') no-repeat";
          document.querySelector(`${cardNum}`).className += ' hidden';
        } else if (idx === 3) {
          cardNum += '.fourth';
          document.querySelector(`${cardNum}`).style.background = "url('./pictures/back_pc.png') no-repeat";
          document.querySelector(`${cardNum}`).className += ' hidden';
        } else if (idx === 4) {

          cardNum += '.fifth';
          document.querySelector(`${cardNum}`).style.background = "url('./pictures/back_pc.png') no-repeat";
          document.querySelector(`${cardNum}`).className += ' hidden';
        }
      }
    }
    for (let idx = 0; idx < 5; idx++) {
      let cardNum = ".dealer ";
      if (idx === 0) {
        cardNum += '.first';
          document.querySelector(`${cardNum}`).style.background = "url('./pictures/back_pc.png') no-repeat";
        } else if (idx === 1) {
          cardNum += '.second';
          document.querySelector(`${cardNum}`).style.background = "url('./pictures/back_pc.png') no-repeat";
        } else if (idx === 2) {
          cardNum += '.third';
          document.querySelector(`${cardNum}`).style.background = "url('./pictures/back_pc.png') no-repeat";
          document.querySelector(`${cardNum}`).className += ' hidden';
        } else if (idx === 3) {
          cardNum += '.fourth';
          document.querySelector(`${cardNum}`).style.background = "url('./pictures/back_pc.png') no-repeat";
          document.querySelector(`${cardNum}`).className += ' hidden';
        } else if (idx === 4) {

          cardNum += '.fifth';
          document.querySelector(`${cardNum}`).style.background = "url('./pictures/back_pc.png') no-repeat";
          document.querySelector(`${cardNum}`).className += ' hidden';
        }
    }
  nextRound.className += ' hidden';
  if (!this.game.player1.hand.length) {
    this.game.player1.hand.hit();
    this.game.player1.hand.hit();
    this.game.player2.hand.hit();
    this.game.player2.hand.hit();
    this.game.player3.hand.hit();
    this.game.player3.hand.hit();
    this.game.dealer.hand.hit();
    this.game.dealer.hand.hit();
  }

  this.game.bustedPlayer = false;

  const betForm = document.getElementById('place-bet');
  betForm.removeEventListener('submit', this.game.getBetCallb);

  const hit = document.getElementById("draw");
  hit.removeEventListener('click', this.game.hitCallb);

  const stay = document.getElementById("stay");
  stay.removeEventListener('click', this.game.stayCallb);

  const pressAI =document.getElementById("ai");
  pressAI.removeEventListener('click', this.game.aiCallb);

  const dealer = document.getElementById("dealer");
  dealer.removeEventListener('click', this.game.dealerCallb);

  nextRound.removeEventListener('click', this.game.restartCallb);

  getBet(this.game);
}




function Game() {
  this.game = this;
  this.deck = new Deck(2);
  this.discarded = new DiscardPile();
  this.pt = new ProbabilityTable(2, this.game);
  this.players = [];
  this.player1 = new Player("Adam", 1000, this.game);
  this.players.push(this.player1);
  this.player2 = new Player("Ben", 2000, this.game);
  this.players.push(this.player2);
  this.player3 = new Player("Chris", 3000, this.game);
  this.players.push(this.player3);
  this.dealer = new Dealer(this.game);


    document.addEventListener("DOMContentLoaded", () =>{

      this.pt.forDeal();

      this.game.chart = new ChartCreator([this.pt.probArrGen()]);

      getBet(this.game);

    });
}

window.game = new Game();















//bottom of page :)
