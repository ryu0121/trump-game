class OldMaidDeck extends Deck {
  createDeck() {
    const deck = Deck.SUITS.reduce((cards, suit) => {
      Deck.RANKS.forEach(rank => {
        cards.push(new Card(suit, rank));
      })
      return cards;
    }, [])
    deck.push(new Card('J', 'joker'));

    return deck;
  }
}