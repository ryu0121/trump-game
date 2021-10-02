class Deck {
  static SUITS = ["H", "D", "C", "S"];
  static RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

  constructor() {
    this.cards = this.createDeck();
  }

  shuffle() {
    this.cards.forEach((card, index) => {
      const randomIndex = Utils.getRandomArbitrary(0, this.cards.length);
      const tmp = this.cards[randomIndex];
      this.cards[randomIndex] = card;
      this.cards[index] = tmp;
    })
  }

  drawOne() {
    return this.cards.pop();
  }

  createDeck() {
    throw new Error('No Method Error');
  }
}