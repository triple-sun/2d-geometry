import { Ray } from "../objects/ray";
import { Line } from "../primitives/line";
import { Config } from "./config";

export class Utils {
  constructor(private config: Config) {
    this.config = config
  }

  public equalZero(x: number): boolean {
    return x < this.config.precision && x > -this.config.precision;
  }

  public equalTo(x: number, y: number): boolean {
    return x - y < this.config.precision && x - y > -this.config.precision;
  }
  public greaterThan(x: number, y: number): boolean {
    return x - y > this.config.precision;
  }
  public greaterOrEqual(x: number, y: number): boolean {
    return x - y > -this.config.precision;
  }

  public lessThan(x: number, y: number): boolean {
    return x - y < -this.config.precision;
  }

  public lessOrEqual(x: number, y: number): boolean {
    return x - y < this.config.precision;
  }

  public get precision() {
    return this.config.precision
  }
}
