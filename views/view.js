class View {
  static GAMESJP = ['ババ抜き'];
  static GAMES = ['oldmaid', 'blackjack', 'poker'];
  static GAMEObjects = { oldmaid: new OldMaid() };

  static config = {
    gamePage: document.getElementById("gameDiv"),
    readyPage: document.getElementById("readyPage"),
    mainPage: document.getElementById("mainPage"),
    modalPage: document.getElementById("modalPage"),
    suitImgURL: {
      "S": "./img/spade.png",
      "H": "./img/heart.png",
      "C": "./img/clover.png",
      "D": "./img/diamond.png",
      "?": "./img/questionMark.png",
      "J": "./img/joker.png"
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
    View.displayBlock(View.config.readyPage);
    const container = document.createElement("div");
    const gameOptions = View.GAMESJP.reduce((options, game, index) => `${options}<option value="${View.GAMES[index]}">${game} </option>`, "");
    container.innerHTML =
    `
    <p>遊びたいカードゲームを選択してください</p>
    <div class="my-3 w-100">
        <input class="w-100 neumophism-box basic-color p-1" type="text" placeholder="ユーザー名" value="">
    </div>
    <div class="my-3 w-100">
        <select class="w-100 neumophism-box basic-color p-1">
          ${gameOptions}
        </select>
    </div>
    <div class="my-3">
        <select class="w-100 neumophism-box basic-color p-1">
            <option value="ai">AI戦 </option>
            <option value="player">プレイヤーとして参加 </option>
        </select>
    </div>
    <div class="my-3">
        <button type="submit" class="btn neumophism" id="startGame">ゲームを始める</button>
    <div>
    `
    View.config.readyPage.append(container);
  }

  static async renderMessages(table) {
    for(let message of table.prepareMessages()) {
      View.renderMessage(message);
      await Utils.sleep(1500);
    }
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

  static renderPlayerDivs(table) {
    const players = table.players;
    const secondAndFourthPlayers = [];
    secondAndFourthPlayers.push(players[1]);
    secondAndFourthPlayers.push(players[players.length - 1]);

    View.config.mainPage.innerHTML = '';
    View.appendPlayerDiv(players[0], players);
    View.appendSomePlayersDiv(secondAndFourthPlayers);
    View.appendPlayerDiv(players[players.length - 2], players);
  }

  static appendPlayerDiv(player, players) {
    const container = document.createElement("div");
    container.classList.add('d-flex', 'justify-content-center', 'mb-4');
    container.innerHTML =
    `
    <div class="flex-column playerDiv">
      <p class="m-0 text-center rem3">${player.name}</p>
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

  static appendSomePlayersDiv(players) {
    const container = document.createElement("div");
    container.classList.add('d-flex', 'justify-content-around', 'mb-4');

    for (const player of players) {
      const playerDiv = document.createElement("div");
      playerDiv.classList.add('flex-column', 'playerDiv');
      playerDiv.innerHTML =
      `
      <p class="m-0 text-center rem3">${player.name}</p>
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
    cardDiv.classList.add('mx-2', 'card', 'neumophism-card' , 'basic-color');
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
    cardDiv.classList.add('mx-2', 'card', 'neumophism-card', 'basic-color');
    cardDiv.innerHTML =
    `
    <img src="./img/trump-back.jpeg" , " alt="" width="50" height="80">
    `;
    handDiv.append(cardDiv);
  }

  static reflectPlayerHands(table) {
    View.renderPlayerDivs(table);
  }

  static appendTurnPlayerMessageDiv(turnPlayer) {
    const container = document.createElement("div");
    container.classList.add("d-flex", "justify-content-center");
    container.innerHTML =
    `
    <p class="rem3">次は${turnPlayer.name}さんのターンです</p>
    `
    View.config.mainPage.append(container);
  }

  static renderResultsPage(table) {
    View.appendWinners(table.players);
    View.appendResultsLog(table.getResultsLog());
    View.appendRestartGameButton();
  }

  static appendWinners(players) {
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

  static appendResultsLog(resultsLog) {
    View.config.modalPage.innerHTML = '';
    const modal = View.config.modalPage;

    const closeButton = document.createElement("button");
    closeButton.classList.add("btn", "neumophism-close-button");
    closeButton.innerHTML = 'ログを閉じる';

    const container = document.createElement("div");
    container.classList.add("d-flex", "flex-column", "justify-content-center", "align-items-center");
    const openButton = document.createElement("button");
    openButton.classList.add("btn", "mb-4", "neumophism-open-button");
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

  static appendRestartGameButton() {
    const container = document.createElement("div");
    container.classList.add("d-flex", "flex-column", "justify-content-center", "align-items-center");

    const restartGameButton = document.createElement("button");
    restartGameButton.classList.add("btn", "neumophism-open-button");
    restartGameButton.innerHTML = 'ゲームの選択画面に戻る';
    container.append(restartGameButton);
    View.config.mainPage.append(container);

    restartGameButton.addEventListener("click", () => {
      View.config.mainPage.innerHTML = '';
      View.config.modalPage.innerHTML = '';
      View.displayNone(View.config.mainPage);
      Controller.settingGame();
    });
  }
}