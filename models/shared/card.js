class Card {
  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
  }

  getRankNumber() {
    throw new Error('No Method Error');
  }
}