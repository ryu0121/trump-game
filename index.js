class View {

}

class Controller {

}

// TypeScript に変更した時に、Abstract Class として作成する
// class Game {
//   constructor(gamePhase) {

//   }
// }

class OldMaid {
  constructor(gamePhase) {
    this.gamePhase = gamePhase;
  }

  // ババ抜きのステータス: joining -> won
  defaultGameStatus() {
    return "joining";
  }

  // ババ抜きのフェーズ: ongoing -> roundOver
  defaultGamePhase() {
    return "ongoing";
  }

  createPlayers() {
    return [new Player('ai1', 'ai', this), new Player('ai2', 'ai', this), new Player('ai3', 'ai', this), new Player('ai4', 'ai', this)];
  }

  evaluateRoundWinners() {

  }

  createDeck() {
    const deck = Deck.SUITS.reduce((cards, suit) => {
      Deck.RANKS.forEach(rank => {
        cards.push(new Card(suit, rank));
      })
      return cards;
    }, [])
    deck.push(new Card(null, 'joker'));

    return deck;
  }

  gameDecition(type, gameTable) {
    if (type === 'user') return;
    nextPlayer = gameTable.getNextPlayerToDraw();
    cardLocationFromHead = Utility.getRandomArbitrary(0, nextPlayer.hand.length);
    return new OldMaidDecition(nextPlayer, cardLocationFromHead);
  }
}

class Table {
  constructor(gameType, betDenominations = [5,20,50,100]) {
    this.gameType = gameType
    this.betDenominations = betDenominations
    this.deck = new Deck(this.gameType);
    this.players = this.gameType.createPlayers();
    this.gamePhase = this.gameType.defaultGamePhase();
    this.resultsLog = [];
    this.turnCounter = 0;
  }

  evaluateMove() {
    throw 'No Method Error'
  }

  evaluateRoundWinners() {
    this.game.evaluateRoundWinners();
  }

  haveTurn() {
    throw 'No Method Error'
  }
}

class OldMaidTable extends Table {
  evaluateMove(player) {
    // gameDecition = player.promptPlayer();
    if (player.gameStatus === 'joining' && player.hand === []) {
      player.gameStatus = 'won';
    }
  }

  evaluateAndGetRoundResults() {
    return this.players.reduce((result, curr) => `${result} ${curr.name}:${curr.gameStatus}`);
  }

  assignPlayerHands() {
    let idx = 0;
    while (this.deck !== []) {
      addCardTo(this.players[idx]);
      idx = (idx+1) % this.players.length;
    }
  }

  getTurnPlayer() {
    return this.players[(this.turnCounter-1) % this.players.length];
  }

  getNextPlayerToDraw() {
    return this.players[(this.turnCounter-1) % this.players.length + 1];
  }

  clearPlayerHands() {
    this.players.forEach(player => {
      player.clearHand();
    })
  }

  // ここから
  haveTurn(userData = null) {
    const currPlayer = this.getTurnPlayer();
    const gameDecition = currPlayer.promptPlayer(userData);
    this.evaluateMove(gameDecition);
    this.turnCounter++;
  }

  addCardTo(player) {
    player.addCardToHand(this.deck.drawOne());
  }
}

class Player {
  constructor(name, type, gameType, gameTable, chips = null) {
    this.name = name
    this.type = type
    this.gameType = gameType
    this.hand = [];
    this.gameTable = gameTable;
    this.chips = chips;
    this.bet = 0;
    this.winAmount = 0;
    this.gameStatus = gameType.defaultGameStatus();
  }

  promptPlayer(userData = null) {
    if (this.type === 'user') return;
    return this.gameType.gameDecition('ai', this.gameTable);
  }

  getHandScore() {
    // ブラックジャック専用のメソッド
    // 合計が21を超える場合、手札の各エースについて、合計が21以下になるまで10を引きます
  }

  gameTakeAction(gameType, action) {
  }

  addCardToHand(card) {
    this.hand.push(card);
  }

  clearHand() {
    this.hand = [];
  }
}

class GameDecision {
}

class OldMaidDecition {
  constructor(nextPlayer, cardLocationFromHead) {
    super();
    this.nextPlayer = nextPlayer;
    this.cardLocationFromHead = cardLocationFromHead;
  }
}

class BlackJackDecition extends GameDecision {
  constructor(action, amount) {
    super();
    this.action = action;
    this.amount = amount;
  }
}

class Deck {
    /*
      String suit : {"H", "D", "C", "S"}から選択
      String rank : {"A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"}から選択
    */
  static SUITS = ["♣", "♦", "♥", "♠"];
  static RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

  constructor(gameType) {
    this.gameType = gameType
    this.cards = gameType.createDeck();
  }

  createDeck() {
    return this.gameType.createDeck();
  }

  shuffle() {
    this.cards.forEach((card, index) => {
      const randomIndex = Utility.getRandomArbitrary(0, this.cards.length);
      const tmp = this.cards[randomIndex];
      this.cards[randomIndex] = card;
      this.cards[index] = tmp;
    })
  }

  drawOne() {
    return this.cards.pop();
  }

  resetDeck() {
    this.cards = this.createDeck();
    this.shuffle();
    return this.cards;
  }
}

class Card {
  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
  }

  getRankNumber() {
    throw new Error('No Method Error')
  }
}

class OldMaidCard extends Card {
  getRankNumber() {
    switch (this.rank) {
      case 'J':
        return 11;
      case 'Q':
        return 12;
      case 'K':
        return 13;
      case 'A':
        return 1;
      default:
        return this.rank;
    }
  }
}

class Utility {
  static getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}

const table1 = new OldMaidTable(new OldMaid('ongoing'));
while (table1.gamePhase != 'roundOver') {
  table1.haveTurn();
}

console.log(table1.resultsLog);