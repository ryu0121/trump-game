class OldMaidTable extends Table {
  constructor(userName, playerType, gameType) {
    super(userName, playerType, gameType);
    this.gamePhase = "ongoing";
  }

  passCard({ place, from, to }) {
    const card = from.popCard(place);
    to.addCardToHand(card);
  }

  evaluateAndGetRoundResults() {
    const turnExplanation = `${this.turnCounter}ターン目: ${this.getTurnPlayer().name}さんのターンです`;
    const turnPlayerHand = `引いた後の手札: ${this.getTurnPlayer().showHand()}`;
    const playerStatus = this.players.reduce((result, player) => `${result} ${player.name}:${player.gameStatus}`, '');
    const line = "=============================================================";
    return `${turnExplanation}\n${turnPlayerHand}\n${playerStatus}\n${line}`;
  }

  updateStatusOf(player) {
    player.updateStatus();
  }

  assignPlayerHands() {
    let index = 0;
    while (this.deck.cards.length !== 0) {
      this.addCardTo(this.players[index], this.deck);
      index = (index+1) % this.players.length;
    }
  }

  getTurnPlayer() {
    return this.players[(this.counterToFindNextPlayer-1) % this.players.length];
  }

  getNextPlayerIndex() {
    let nextIndex = this.counterToFindNextPlayer % this.players.length
    let nextPlayer = this.players[nextIndex];
    while (nextPlayer.gameStatus === 'won') {
      nextIndex = (nextIndex+1) % this.players.length;
      nextPlayer = this.players[nextIndex];
    }
    return nextIndex;
  }

  getNextPlayer() {
    return this.players[this.getNextPlayerIndex()];
  }

  increaseCounterToFindNextPlayer() {
    this.counterToFindNextPlayer++;
  }

  clearPlayerHands() {
    this.players.forEach(player => {
      player.clearHand();
    })
  }

  updateAfterDraw() {
    const currPlayer = this.getTurnPlayer();
    const nextPlayer = this.getNextPlayer();
    this.updateStatusOf(nextPlayer);
    this.updateStatusOf(currPlayer);
    this.checkRoundOver();
    this.resultsLog.push(this.evaluateAndGetRoundResults());
    this.turnCounter++;
    this.counterToFindNextPlayer++;
  }

  addCardTo(player, deck) {
    player.addCardToHand(deck.drawOne());
  }

  checkRoundOver() {
    let counter = 0;
    for (const player of this.players) {
      if (player.gameStatus === 'won') counter++;
      if (counter === this.players.length - 1) {
        this.gamePhase = 'roundOver';
        return;
      }
    }
  }

  checkPlayerHands() {
    for (const player of this.players) {
      player.disposeSameNumber();
    }
  }

  evaluateMove(player, gameDecision) {
    const nextPlayer = gameDecision.nextPlayer;
    const place = gameDecision.placeToDraw;
    this.passCard({ place: place, from: nextPlayer, to: player });
  }

  haveTurn(userData = null) {
    const currPlayer = this.getTurnPlayer();
    const gameDecision = currPlayer.promptPlayer(userData, this);
    this.evaluateMove(currPlayer, gameDecision);
  }
}