class Utility {
  static getRandomArbitrary(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // 非同期関数を即時実行しているだけ
  static sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
}