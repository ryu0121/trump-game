class OldMaidPlayer extends Player {
  constructor(name, type) {
    super(name, type);
    // ババ抜きのステータス: joining -> won
    this.gameStatus = "joining";
  }

  promptPlayer(userData, table) {
    const nextPlayer = table.getNextPlayer();

    if (this.type === 'player') {
      return new OldMaidDecision(nextPlayer, userData.placeToDraw);
    } else if (this.type === 'ai') {
      const placeToDraw = this.getPlaceAiDrawFrom(nextPlayer);
      return new OldMaidDecision(nextPlayer, placeToDraw);
    }
  }

  getPlaceAiDrawFrom(player) {
    return Utility.getRandomArbitrary(0, player.hand.length);
  }

  updateStatus() {
    if (this.hand.length === 0) this.gameStatus = "won";
  }

  disposeSameNumber() {

    for (let i = 0; i < this.hand.length; i++) {
      if (!this.hand[i]) continue;
      for (let j = i + 1; j < this.hand.length; j++) {
        if (this.hand[j] && this.hand[i].rank === this.hand[j].rank) {
          this.hand[i] = null;
          this.hand[j] = null;
          break;
        }
      }
    }
    this.hand = this.hand.filter(v => v);
  }
}