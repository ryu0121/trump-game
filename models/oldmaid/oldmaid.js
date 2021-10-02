class OldMaid {
  createTable(userName, playerType) {
    return new OldMaidTable(userName, playerType, this);
  }

  createDeck() {
    return new OldMaidDeck();
  }

  createPlayers(userName, playerType) {
    if (playerType === 'player') return [new OldMaidPlayer('ai1', 'ai', this), new OldMaidPlayer('ai2', 'ai', this), new OldMaidPlayer('ai3', 'ai', this), new OldMaidPlayer(userName, 'player', this)];
    else return [new OldMaidPlayer('ai1', 'ai', this), new OldMaidPlayer('ai2', 'ai', this), new OldMaidPlayer('ai3', 'ai', this), new OldMaidPlayer('ai4', 'ai', this)];
  }
}