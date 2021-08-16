type Config = {
  gamePage: HTMLElement;
  readyPage: HTMLElement;
  mainPage: HTMLElement;
  modalPage: HTMLElement;
  suitImgURL: {
    [key: string]: string
  }
}

type GameObjects = {
  [key: string]: OldMaid;
}

class View {
  static GAMESJP = ['ババ抜き', 'ブラックジャック', 'ポーカー'];
  static GAMES = ['oldmaid', 'blackjack', 'poker'];
  static GAMEObjects: GameObjects = { oldmaid: new OldMaid(), blackjack: new OldMaid(), poker: new OldMaid() };

  static config: Config = {
    gamePage: document.getElementById("gameDiv")!,
    readyPage: document.getElementById("readyPage")!,
    mainPage: document.getElementById("mainPage")!,
    modalPage: document.getElementById("modalPage")!,
    suitImgURL: {
      "S": "./img/spade.png",
      "H": "./img/heart.png",
      "C": "./img/clover.png",
      "D": "./img/diamond.png",
      "J": "./img/joker.jpeg"
    }
  }

  static displayNone(ele: HTMLElement) {
    ele.classList.remove("d-block");
    ele.classList.add("d-none");
  }

  static displayBlock(ele: HTMLElement) {
    ele.classList.remove("d-none");
    ele.classList.add("d-block");
  }

  static renderReadyPage() {
    View.config.readyPage.innerHTML = '';
    View.displayBlock(View.config.readyPage);
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

  static renderMessage(message: string) {
    View.config.mainPage.innerHTML = '';
    const container = document.createElement("div");
    container.classList.add("d-flex", "justify-content-center");
    container.innerHTML =
    `
    <p class="rem3">${message}</p>
    `
    View.config.mainPage.append(container);
  }

  static renderPlayerDivs(table: Table): void {
    const players = table.players;
    const secondAndFourthPlayers: Player[] = [];
    secondAndFourthPlayers.push(players[1]);
    secondAndFourthPlayers.push(players[players.length - 1]);

    View.config.mainPage.innerHTML = '';
    View.appendPlayerDiv(players[0], players);
    View.appendSomePlayersDiv(secondAndFourthPlayers);
    View.appendPlayerDiv(players[players.length - 2], players);
  }

  static appendPlayerDiv(player: Player, players: Player[]) {
    const container = document.createElement("div");
    container.classList.add('d-flex', 'justify-content-center', 'mb-4');
    container.innerHTML =
    `
    <div class="flex-column playerDiv">
      <p class="m-0 text-white text-center rem3">${player.name}</p>
    </div>
    `
    const playerDiv = container.querySelectorAll(".playerDiv")[0];
    // playersの最後が参加playerであるという暗黙のルールがあります
    if (players[players.length - 1].type === 'player') {
      View.renderBlindHandDiv(player.hand, playerDiv);
    } else {
      View.renderHandDiv(player.hand, playerDiv);
    }
    View.config.mainPage.append(container);
  }

  static appendSomePlayersDiv(players: Player[]) {
    const container = document.createElement("div");
    container.classList.add('d-flex', 'justify-content-around', 'mb-4');

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

  static renderHandDiv(hand: (Card | null)[], playerDiv: Element) {
    const handDiv = document.createElement("div");
    handDiv.classList.add('d-flex', 'justify-content-center');
    hand.forEach(card => {
      if(card) View.renderCardDiv(card, handDiv);
    });
    playerDiv.append(handDiv);
  }

  static renderCardDiv(card: Card, handDiv: Element) {
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

  static renderBlindHandDiv(hand: (Card | null)[], playerDiv: Element) {
    const handDiv = document.createElement("div");
    handDiv.classList.add('d-flex', 'justify-content-center');
    hand.forEach(() => {
      View.renderBlindCardDiv(handDiv);
    });
    playerDiv.append(handDiv);
  }

  static renderBlindCardDiv(handDiv: Element) {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add('bg-white', 'border', 'mx-2', 'card');
    cardDiv.innerHTML =
    `
    <img src="./img/trump-back.jpeg" , " alt="" width="50" height="80">
    `;
    handDiv.append(cardDiv);
  }

  static reflectPlayerHands(table: OldMaidTable) {
    View.renderPlayerDivs(table);
  }

  static appendTurnPlayerMessageDiv(turnPlayer: OldMaidPlayer) {
    const container = document.createElement("div");
    container.classList.add("d-flex", "justify-content-center");
    container.innerHTML =
    `
    <p class="rem3">次は${turnPlayer.name}さんのターンです</p>
    `
    View.config.mainPage.append(container);
  }

  static renderResultsPage(table: OldMaidTable) {
    View.appendWinners(table.players);
    View.appendResultsLog(table.getResultsLog());
    View.appendRestartGameButton(table);
  }

  static appendWinners(players: OldMaidPlayer[]) {
    const container = document.createElement("div");
    container.classList.add("d-flex", "flex-column", "justify-content-center", "align-items-center");
    container.innerHTML =
      `
        <p class="rem3">【Winners】</p>
      `
    for (const player of players) {
      if (player.gameStatus === 'won') {
        const winnerP = document.createElement("p");
        winnerP.innerHTML = `${player.name}さん`;
        container.append(winnerP);
      }
    }
    View.config.mainPage.append(container);
  }

  static appendResultsLog(resultsLog: string[]) {
    View.config.modalPage.innerHTML = '';
    const modal = View.config.modalPage;

    const closeButton = document.createElement("button");
    closeButton.classList.add("btn", "btn-info");
    closeButton.innerHTML = 'ログを閉じる';

    const container = document.createElement("div");
    container.classList.add("d-flex", "flex-column", "justify-content-center", "align-items-center");
    const openButton = document.createElement("button");
    openButton.classList.add("btn", "btn-light", "mb-4");
    openButton.innerHTML = 'ログを開く';
    container.append(openButton);

    openButton.addEventListener("click", () => {
      for (const log of resultsLog) {
        modal.innerHTML +=
          `
            <p>${log.replace(/\n/g, '<br>')}</p>
          `
      }
      modal.append(closeButton);
      View.displayBlock(modal);
    });

    closeButton.addEventListener("click", () => {
      modal.innerHTML = ``;
      View.displayNone(modal);
    });

    View.config.mainPage.append(container);
  }

  static appendRestartGameButton(table: OldMaidTable | null) {
    const container = document.createElement("div");
    container.classList.add("d-flex", "flex-column", "justify-content-center", "align-items-center");

    const restartGameButton = document.createElement("button");
    restartGameButton.classList.add("btn", "btn-info");
    restartGameButton.innerHTML = 'ゲームの選択画面に戻る';
    container.append(restartGameButton);
    View.config.mainPage.append(container);

    restartGameButton.addEventListener("click", () => {
      table = null;
      View.config.mainPage.innerHTML = '';
      View.config.modalPage.innerHTML = '';
      View.displayNone(View.config.mainPage);
      Controller.settingGame();
    });
  }
}

class Controller {
  static settingGame() {
    View.renderReadyPage();
    const startGameButton = View.config.gamePage.querySelectorAll("#startGame")[0];

    startGameButton.addEventListener("click", () => {
      const gameInfo = Controller.setGameInfo();
      if (gameInfo.playerType === 'player' && gameInfo.userName === "") {
        alert("名前を入力してください");
      } else if(gameInfo.gameType !== 'oldmaid') {
        alert("そのゲームのリリースはもうしばらくお待ちください");
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

    return { userName: userName, gameType: gameType, gameObject: gameObject, playerType: playerType };
  }

  static async changePageAndReadyToStartGame({ userName, gameObject, playerType }: {userName: string, gameObject: OldMaid, playerType: string}) {
    View.displayNone(View.config.readyPage);
    View.displayBlock(View.config.mainPage);

    const table = gameObject.createTable(userName, playerType);

    View.renderMessage("デッキをシャッフルしています...");
    table.shuffleDeck();
    await Utility.sleep(1500);

    View.renderMessage("プレイヤーにカードを配っています...");
    table.assignPlayerHands();
    await Utility.sleep(1500);

    View.renderMessage("各プレイヤーが同じカードを捨てています...");
    table.checkPlayerHands();
    await Utility.sleep(1500);

    Controller.startGame(table);
  }

  static startGame(table: OldMaidTable) {
    View.renderPlayerDivs(table);
    Controller.proceedToNextTurn(table);
  }

  static async proceedToNextTurn(table: OldMaidTable): Promise<any> {
    if (table.gamePhase === 'roundOver') {
      return View.renderResultsPage(table);
    }

    const currPlayer = table.getTurnPlayer();
    if (currPlayer.gameStatus === 'won') {
      table.increaseCounterToFindNextPlayer();
      return Controller.proceedToNextTurn(table);
    };

    View.appendTurnPlayerMessageDiv(currPlayer);
    await Utility.sleep(200);

    if (currPlayer.type === 'ai') {
      Controller.processTurn(table, null);
    } else if (currPlayer.type === 'player') {
      // players[2]のaiからカードを引きたい場合は、3つ目のplayerDivをnextPlayerDivにする
      // index=2, 3 のplayerがブラウザでは逆に表示されているため
      const nextIndex = (table.getNextPlayerIndex() === 2) ? 3 : table.getNextPlayerIndex();
      const nextPlayerDiv = document.querySelectorAll(".playerDiv")[nextIndex];
      nextPlayerDiv.querySelectorAll(".card").forEach((cardDiv, index) => {
        cardDiv.addEventListener("click", () => {
          const userData = { placeToDraw: index };
          Controller.processTurn(table, userData);
        })
      });
    }
  }

  static async processTurn(table: OldMaidTable, userData: userDatable | null) {
    const currPlayer = table.getTurnPlayer();
    table.haveTurn(userData);
    View.reflectPlayerHands(table);
    View.appendTurnPlayerMessageDiv(currPlayer);

    currPlayer.disposeSameNumber();
    await Utility.sleep(200);
    View.reflectPlayerHands(table);

    table.updateAfterDraw();

    Controller.proceedToNextTurn(table);
  }
}

interface Game {
  createTable(userName: string, playerType: string): Table;
  createDeck(): Deck;
  createPlayers(userName: string, playerType: string): Player[];
}

abstract class Table {
  public deck: Deck;
  public players: Player[];
  protected resultsLog: string[];
  protected counterToFindNextPlayer: number;
  protected turnCounter: number;
  public gamePhase: string;

  constructor(userName: string, playerType: string, gameType: Game) {
    this.deck = gameType.createDeck();
    this.players = gameType.createPlayers(userName, playerType);
    this.resultsLog = [];
    this.counterToFindNextPlayer = 1;
    this.turnCounter = 1;
    this.gamePhase = '';
  }

  shuffleDeck() {
    this.deck.shuffle();
  }

  getResultsLog() {
    return this.resultsLog;
  }

  abstract evaluateMove(player: Player, gameDecision: any): void;

  abstract haveTurn(userData: userDatable | null): void;
}

abstract class Player {
  public hand: (Card | null)[];
  public gameStatus: string;

  constructor(public name: string, public type: string) {
    this.hand = [];
    this.gameStatus = '';
  }

  addCardToHand(card: Card) {
    this.hand.push(card);
  }

  popCard(place: number) {
    const card = this.hand[place];
    this.hand.splice(place, 1);
    return card;
  }

  showHand(): string {
    return this.hand.reduce((handString, card) => `${handString} ${card!.suit}:${card!.rank}`, '');
  }
}

abstract class Deck {
  static SUITS = ["H", "D", "C", "S"];
  static RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

  public cards: Card[];

  constructor() {
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

  drawOne(): Card {
    return this.cards.pop()!;
  }

  abstract createDeck(): Card[];
}

class Card {
  public suit: string;
  public rank: string;

  constructor(suit: string, rank: string) {
    this.suit = suit;
    this.rank = rank;
  }
}

Controller.settingGame();