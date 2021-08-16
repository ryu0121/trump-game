class OldMaid implements Game {
  createTable(userName: string, playerType: string) {
    return new OldMaidTable(userName, playerType, this);
  }

  createDeck() {
    return new OldMaidDeck();
  }

  createPlayers(userName: string, playerType: string) {
    if (playerType === 'player') return [new OldMaidPlayer('ai1', 'ai'), new OldMaidPlayer('ai2', 'ai'), new OldMaidPlayer('ai3', 'ai'), new OldMaidPlayer(userName, 'player')];
    else return [new OldMaidPlayer('ai1', 'ai'), new OldMaidPlayer('ai2', 'ai'), new OldMaidPlayer('ai3', 'ai'), new OldMaidPlayer('ai4', 'ai')];
  }
}