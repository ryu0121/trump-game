class Controller {
  static settingGame() {
    View.renderReadyPage();
    const startGameButton = View.config.gamePage.querySelectorAll("#startGame")[0];

    startGameButton.addEventListener("click", () => {
      const gameInfo = Controller.setGameInfo();
      if (gameInfo.playerType === 'player' && gameInfo.userName === "") {
        alert("名前を入力してください");
      } else if(gameInfo.gameType !== 'oldmaid'){
        alert("このゲームのリリースはもうしばらくお待ちください");
      } else {
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

  static async changePageAndReadyToStartGame({ userName, gameObject, playerType }) {
    View.displayNone(View.config.readyPage);
    View.displayBlock(View.config.mainPage);

    const table = gameObject.createTable(userName, playerType);
    // prepare() でダック・タイピング
    table.prepare();
    await View.renderMessages(table);

    Controller.startGame(table);
  }

  static startGame(table) {
    View.renderPlayerDivs(table);
    Controller.proceedToNextTurn(table);
  }

  static proceedToNextTurn(table) {
    if(table instanceof OldMaidTable) {
      Controller.OldMaidTurn(table);
    }
    // 他のゲームが追加されたらここの処理を加える
  }

  static async OldMaidTurn(table) {
    if (table.gamePhase === 'roundOver') {
      return View.renderResultsPage(table);
    }

    const currPlayer = table.getTurnPlayer();
    if (currPlayer.gameStatus === 'won') {
      table.increaseCounterToFindNextPlayer();
      return Controller.proceedToNextTurn(table);
    };

    View.appendTurnPlayerMessageDiv(currPlayer);
    await Utils.sleep(700);

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

  static async processTurn(table, userData) {
    const currPlayer = table.getTurnPlayer();
    table.haveTurn(userData);
    View.reflectPlayerHands(table);
    View.appendTurnPlayerMessageDiv(currPlayer);

    currPlayer.disposeSameNumber();
    await Utils.sleep(700);
    View.reflectPlayerHands(table);

    table.updateAfterDraw();

    Controller.proceedToNextTurn(table);
  }
}