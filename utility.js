class Utility {
  static getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // 非同期関数を即時実行しているだけ
  static sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
}