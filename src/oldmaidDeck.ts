class OldMaidDeck extends Deck {
  createDeck(): Card[] {
    const deck: Card[] = Deck.SUITS.reduce((cards: Card[], suit: string) => {
      Deck.RANKS.forEach(rank => {
        cards.push(new Card(suit, rank));
      })
      return cards;
    }, [])
    deck.push(new Card('J', 'joker'));

    return deck;
  }
}