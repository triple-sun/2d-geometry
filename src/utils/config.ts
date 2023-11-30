export class Config {
  constructor(public precision: number) {
    this.setPrecision(precision);
  }

  public precisionSquared: number = 0;

  setPrecision(precision: number) {
    if (precision < 0) {
      throw Error("Precision must be a positive number!");
    }
    this.precision = precision;
    this.precisionSquared = precision * precision;
  }
}

