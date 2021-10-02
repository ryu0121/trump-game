class OldMaidCard extends Card {
  getRankNumber() {
    switch (this.rank) {
      case 'J':
        return 11;
      case 'Q':
        return 12;
      case 'K':
        return 13;
      case 'A':
        return 1;
      default:
        return this.rank;
    }
  }
}