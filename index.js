class OldMaid {
  createTable(userName, playerType) {
    return new OldMaidTable(userName, playerType, this);
  }

  createDeck() {
    return new OldMaidDeck(this)
  }

  createPlayers(userName, playerType) {
    if (playerType === 'player') return [new OldMaidPlayer('ai1', 'ai', this), new OldMaidPlayer('ai2', 'ai', this), new OldMaidPlayer('ai3', 'ai', this), new OldMaidPlayer(userName, 'player', this)];
    else return [new OldMaidPlayer('ai1', 'ai', this), new OldMaidPlayer('ai2', 'ai', this), new OldMaidPlayer('ai3', 'ai', this), new OldMaidPlayer('ai4', 'ai', this)];
  }

  createGameDecition(player, placeToDraw) {
    return new OldMaidDecition(player, placeToDraw);
  }
}

class View {
  static GAMESJP = ['ババ抜き', 'ブラックジャック', 'ポーカー'];
  static GAMES = ['oldmaid', 'blackjack', 'poker'];
  static GAMEObjects = { oldmaid: new OldMaid(), blackjack: 'BlackJackComingSoon...', poker: 'PokerComingSoon...' };

  static config = {
    gamePage: document.getElementById("gameDiv"),
    readyPage: document.getElementById("readyPage"),
    mainPage: document.getElementById("mainPage"),
    suitImgURL: {
      "S": "./img/spade.png",
      "H": "./img/heart.png",
      "C": "./img/clover.png",
      "D": "./img/diamond.png",
      "?": "./img/questionMark.png",
      "J": "./img/joker.jpeg"
    }
  }

  static displayNone(ele) {
    ele.classList.remove("d-block");
    ele.classList.add("d-none");
  }

  static displayBlock(ele) {
    ele.classList.remove("d-none");
    ele.classList.add("d-block");
  }

  static renderReadyPage() {
    View.config.readyPage.innerHTML = '';
    const container = document.createElement("div");
    const gameOptions = View.GAMESJP.reduce((options, game, index) => `${options}<option value="${View.GAMES[index]}">${game} </option>`, "");
    container.innerHTML =
    `
    <p class="text-white">遊びたいカードゲームを選択してください</p>
    <div class="my-2">
        <input type="text" placeholder="ユーザー名" value="">
    </div>
    <div class="my-2">
        <select class="w-100">
          ${gameOptions}
        </select>
    </div>
    <div class="my-2">
        <select class="w-100">
            <option value="ai">AI戦 </option>
            <option value="player">プレイヤーとして参加 </option>
        </select>
    </div>
    <div class="my-2">
        <button type="submit" class="btn btn-success" id="startGame">ゲームを始める</button>
    <div>
    `
    View.config.readyPage.append(container);
  }

  static renderMessage(message) {
    View.config.mainPage.innerHTML = '';
    const container = document.createElement("div");
    container.classList.add("d-flex", "justify-content-center");
    container.innerHTML =
    `
    <p class="rem3">${message}</p>
    `
    View.config.mainPage.append(container);
  }

  static renderPlayerDivs(players) {
    const somePlayers = [];
    somePlayers.push(players[1]);
    somePlayers.push(players[players.length - 1]);
    View.config.mainPage.innerHTML = '';
    View.appendPlayerDiv(players[0], players);
    View.appendSomePlayersDiv(somePlayers);
    View.appendPlayerDiv(players[players.length - 2], players);
  }

  static appendPlayerDiv(player, players) {
    const container = document.createElement("div");
    container.classList.add('d-flex', 'justify-content-center', 'mb-4');
    container.innerHTML =
    `
    <div class="flex-column playerDiv">
      <p class="m-0 text-white text-center rem3">${player.name}</p>
    </div>
    `
    const playerDiv = container.querySelectorAll(".playerDiv")[0];
    if (players[players.length - 1].type === 'player') {
      player.type === 'ai' ? View.renderBlindHandDiv(player.hand, playerDiv) : View.renderHandDiv(player.hand, playerDiv);
    } else {
      View.renderHandDiv(player.hand, playerDiv);
    }
    View.config.mainPage.append(container);
  }

  static appendSomePlayersDiv(players) {
    const container = document.createElement("div");
    container.classList.add('d-flex', 'justify-content-between', 'mb-4');

    for (const player of players) {
      const playerDiv = document.createElement("div");
      playerDiv.classList.add('flex-column', 'playerDiv');
      playerDiv.innerHTML =
      `
      <p class="m-0 text-white text-center rem3">${player.name}</p>
      `
      if (players[players.length - 1].type === 'player') {
        player.type === 'ai' ? View.renderBlindHandDiv(player.hand, playerDiv) : View.renderHandDiv(player.hand, playerDiv);
      } else {
        View.renderHandDiv(player.hand, playerDiv);
      }
      container.append(playerDiv);
    }
    View.config.mainPage.append(container);
  }

  static renderHandDiv(hand, playerDiv) {
    const handDiv = document.createElement("div");
    handDiv.classList.add('d-flex', 'justify-content-center');
    hand.forEach(card => {
      View.renderCardDiv(card, handDiv);
    });
    playerDiv.append(handDiv);
  }

  static renderCardDiv(card, handDiv) {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add('bg-white', 'border', 'mx-2', 'card');
    cardDiv.innerHTML =
    `
    <div class="text-center">
      <img src="${View.config.suitImgURL[card.suit]}" , " alt="" width=" 50" height="50">
    </div>
    <div class="text-center">
      <p class="m-0 text-black">${card.rank}</p>
    </div>
    `;
    handDiv.append(cardDiv);
  }

  static renderBlindHandDiv(hand, playerDiv) {
    const handDiv = document.createElement("div");
    handDiv.classList.add('d-flex', 'justify-content-center');
    hand.forEach(() => {
      View.renderBlindCardDiv(handDiv);
    });
    playerDiv.append(handDiv);
  }

  static renderBlindCardDiv(handDiv) {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add('bg-white', 'border', 'mx-2', 'card');
    cardDiv.innerHTML =
    `
    <img src="./img/trump-back.jpeg" , " alt="" width="50" height="80">
    `;
    handDiv.append(cardDiv);
  }

  static reflectTableInfo(table) {
    View.renderPlayerDivs(table.players);
  }

  static showResults(resultsLog) {
    for (const log of resultsLog) {
      console.log(log);
    }
  }
}

class Controller {
  static settingGame() {
    View.renderReadyPage();
    let startGameBtn = View.config.gamePage.querySelectorAll("#startGame")[0];
    startGameBtn.addEventListener("click", () => {
      const gameInfo = Controller.setGameInfo();
      if(gameInfo.playerType === 'player' && gameInfo.userName === ""){
          alert("名前を入力してください");
      } else{
          Controller.changePageAndReadyToStartGame(gameInfo);
      }
    });
  }

  static setGameInfo() {
    const userName = View.config.gamePage.querySelectorAll("input")[0].value;
    const gameType = View.config.readyPage.querySelectorAll("select")[0].value;
    const gameObject = View.GAMEObjects[gameType];
    const playerType = View.config.readyPage.querySelectorAll("select")[1].value;

    return { userName: userName, gameObject: gameObject, playerType: playerType };
  }

  static async changePageAndReadyToStartGame({ userName, gameObject, playerType }) {
    View.displayNone(View.config.readyPage);
    View.displayBlock(View.config.mainPage);

    let table = gameObject.createTable(userName, playerType);
    View.renderMessage("デッキをシャッフルしています...");
    table.shuffleDeck();
    // await Utility.sleep(1500);

    View.renderMessage("プレイヤーにカードを配っています...");
    table.assignPlayerHands();
    // await Utility.sleep(1500);
    for (const player of table.players) {
      console.log(player.hand);
    }

    View.renderMessage("各プレイヤーが同じカードを捨てています...");
    table.checkPlayerHands();
    for (const player of table.players) {
      console.log(player.hand);
    }
    // await Utility.sleep(1500);

    Controller.startGame(table);
  }

  static startGame(table) {
    View.renderPlayerDivs(table.players);
    Controller.proceedToNextTurn(table);
  }

  static async proceedToNextTurn(table) {
    if (table.gamePhase === 'roundOver') return View.showResults(table.getResultsLog());

    const currPlayer = table.getTurnPlayer();
    if (currPlayer.gameStatus === 'won') {
      table.counterToFindNextPlayer++;
      return Controller.proceedToNextTurn(table);
    };

    await Utility.sleep(200);
    if (currPlayer.type === 'ai') {
      Controller.processTurn(table, null);
    } else if (currPlayer.type === 'player') {
      const nextIndex = table.getNextPlayerIndex();
      console.log(nextIndex);
      const nextPlayerDiv = document.querySelectorAll(".playerDiv")[nextIndex];
      nextPlayerDiv.querySelectorAll(".card").forEach((cardDiv, index) => {
        cardDiv.addEventListener("click", () => {
          const userData = { placeToDraw: index };
          Controller.processTurn(table, userData);
        })
      });
    }
  }

  static async processTurn(table, userData) {
    const currPlayer = table.getTurnPlayer();
    table.haveTurn(userData);
    View.reflectTableInfo(table);

    currPlayer.disposeSameNumber();
    await Utility.sleep(200);
    View.reflectTableInfo(table);
    table.updateInfoAfterDraw();

    Controller.proceedToNextTurn(table);
  }
}

class Table {
  constructor(userName, playerType, gameType) {
    this.deck = gameType.createDeck();
    this.players = gameType.createPlayers(userName, playerType);
    this.resultsLog = [];
    this.counterToFindNextPlayer = 1;
    this.turnCounter = 1;
    this.gamePhase;
  }

  evaluateMove() {
    throw 'No Method Error'
  }

  evaluateRoundWinners() {
    throw 'No Method Error'
  }

  haveTurn() {
    throw 'No Method Error'
  }

  shuffleDeck() {
    this.deck.shuffle();
  }
}

class BlackJackTable extends Table {
  constructor(gameType) {
    super(gameType);
    this.betDenominations = [5, 20, 50, 100];
    this.gamePhase = "betting";
  }

  evaluateAndGetRoundResults() {
    return this.players.reduce((result, curr) => `${result} ${curr.name}:${curr.gameStatus}`);
  }
}

class OldMaidTable extends Table {
  constructor(userName, playerType, gameType) {
    super(userName, playerType, gameType);
    this.gamePhase = "ongoing";
  }

  evaluateMove(player, gameDecition) {
    const nextPlayer = gameDecition.nextPlayer;
    const place = gameDecition.placeToDraw;
    this.passCard({ place: place, from: nextPlayer, to: player });
  }

  passCard({ place, from, to }) {
    const card = from.popCard(place);
    to.addCardToHand(card);
  }

  evaluateAndGetRoundResults() {
    const turnExplanation = `${this.turnCounter}ターン目: ${this.getTurnPlayer().name}さんのターンです`;
    const turnPlayerHand = `引いた後の手札: ${this.getTurnPlayer().showHand()}`;
    const playerStatus = this.players.reduce((result, player) => `${result} ${player.name}:${player.gameStatus}`, '');
    const line = "========================================";
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

  clearPlayerHands() {
    this.players.forEach(player => {
      player.clearHand();
    })
  }

  haveTurn(userData = null) {
    const currPlayer = this.getTurnPlayer();
    const gameDecition = currPlayer.promptPlayer(userData, this);
    this.evaluateMove(currPlayer, gameDecition);
    this.counterToFindNextPlayer++;
  }

  updateInfoAfterDraw() {
    const currPlayer = this.getTurnPlayer();
    const nextPlayer = this.getNextPlayer();
    this.updateStatusOf(nextPlayer);
    this.updateStatusOf(currPlayer);
    this.checkRoundOver();
    this.resultsLog.push(this.evaluateAndGetRoundResults());
    this.turnCounter++;
  }

  addCardTo(player, deck) {
    player.addCardToHand(deck.drawOne());
  }

  getResultsLog() {
    return this.resultsLog;
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
}

class Player {
  constructor(name, type, gameType) {
    this.name = name
    this.type = type
    this.gameType = gameType
    this.hand = [];
  }

  promptPlayer() {
    throw 'No Method Error'
  }

  getHandScore() {
    // ブラックジャック専用のメソッド
    // 合計が21を超える場合、手札の各エースについて、合計が21以下になるまで10を引きます
  }

  gameTakeAction(gameType, action) {
  }

  addCardToHand(card) {
    this.hand.push(card);
  }

  popCard(place) {
    const card = this.hand[place];
    this.hand.splice(place, 1);
    return card;
  }

  clearHand() {
    this.hand = [];
  }
}

class BlackJackPlayer extends Player {
  constructor(name, type, gameType, chips) {
    super(name, type, gameType);
    this.chips = chips;
    this.bet = 0;
    this.winAmount = 0;
  }
}

class OldMaidPlayer extends Player {
  constructor(name, type, gameType) {
    super(name, type, gameType);
    this.gameStatus = "joining";
  }

  // ババ抜きのステータス: joining -> won
  promptPlayer(userData, table) {
    const nextPlayer = table.getNextPlayer();

    if (this.type === 'player') {
      console.log('プレイヤーが選択した場合のpromptPlayerを通りました');
      return this.gameType.createGameDecition(nextPlayer, userData.placeToDraw);
    } else if (this.type === 'ai') {
      const placeToDraw = this.getPlaceAiDrawFrom(nextPlayer);
      return this.gameType.createGameDecition(nextPlayer, placeToDraw);
    }
  }

  getPlaceAiDrawFrom(player) {
    return Utility.getRandomArbitrary(0, player.hand.length);
  }

  updateStatus() {
    if (this.hand.length === 0) this.gameStatus = "won";
  }

  disposeSameNumber() {
    let disposedIndexSet = new Set();
    let resultHand = [];

    for (let i = 0; i < this.hand.length; i++) {
      if (disposedIndexSet.has(i)) continue;
      for (let j = i + 1; j < this.hand.length; j++) {
        if (!disposedIndexSet.has(j) && this.hand[i].rank === this.hand[j].rank) {
          disposedIndexSet.add(i);
          disposedIndexSet.add(j);
          break;
        }
      }
      if(!disposedIndexSet.has(i)) resultHand.push(this.hand[i]);
    }
    this.hand = resultHand;
  }

  showHand() {
    return this.hand.reduce((handString, card) => `${handString} ${card.suit}:${card.rank}`, '');
  }
}

class GameDecision {
}

class OldMaidDecition extends GameDecision {
  constructor(nextPlayer, placeToDraw) {
    super();
    this.nextPlayer = nextPlayer;
    this.placeToDraw = placeToDraw;
  }
}

class BlackJackDecition extends GameDecision {
  constructor(action, amount) {
    super();
    this.action = action;
    this.amount = amount;
  }
}

class Deck {
    /*
      String suit : {"H", "D", "C", "S"}から選択
      String rank : {"A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"}から選択
    */
  static SUITS = ["H", "D", "C", "S"];
  static RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

  constructor(gameType) {
    this.gameType = gameType
    this.cards = this.createDeck();
  }

  shuffle() {
    this.cards.forEach((card, index) => {
      const randomIndex = Utility.getRandomArbitrary(0, this.cards.length);
      const tmp = this.cards[randomIndex];
      this.cards[randomIndex] = card;
      this.cards[index] = tmp;
    })
  }

  drawOne() {
    return this.cards.pop();
  }

  resetDeck() {
    this.cards = this.createDeck();
    this.shuffle();
    return this.cards;
  }
}

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

class Card {
  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
  }

  getRankNumber() {
    throw new Error('No Method Error')
  }
}

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

class Utility {
  static getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // 非同期関数を即時実行しているだけ
  static sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
}

Controller.settingGame();