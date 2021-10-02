class Table {
  constructor(userName, playerType, gameType) {
    this.deck = gameType.createDeck();
    this.players = gameType.createPlayers(userName, playerType);
    this.resultsLog = [];
    this.counterToFindNextPlayer = 1;
    this.turnCounter = 1;
    this.gamePhase;
  }

  prepare() {
    this.concrete_prepare();
  }

  shuffleDeck() {
    this.deck.shuffle();
  }

  getResultsLog() {
    return this.resultsLog;
  }

  evaluateMove() {
    throw 'No Method Error'
  }

  haveTurn() {
    throw 'No Method Error'
  }
}