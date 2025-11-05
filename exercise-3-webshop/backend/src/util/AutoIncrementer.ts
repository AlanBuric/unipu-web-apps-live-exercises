export default class AutoIncrementer {
  private nextIndex: number;

  constructor(initialIndex: number = 0) {
    this.nextIndex = initialIndex;
  }

  public getAndIncrement(): number {
    return this.nextIndex++;
  }
}