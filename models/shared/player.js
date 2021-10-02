class Player {
  constructor(name, type) {
    this.name = name;
    this.type = type;
    this.hand = [];
    this.gameStatus;
  }

  addCardToHand(card) {
    this.hand.push(card);
  }

  popCard(place) {
    const card = this.hand[place];
    this.hand.splice(place, 1);
    return card;
  }

  showHand() {
    return this.hand.reduce((handString, card) => `${handString} ${card.suit}:${card.rank}`, '');
  }

  promptPlayer() {
    throw 'No Method Error';
  }
}