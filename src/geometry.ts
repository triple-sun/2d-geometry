import { Vector } from "./objects/vector";
import { Line } from "./primitives/line";
import { Point } from "./primitives/point";
import { Config } from "./utils/config";
import { PRECISION } from "./utils/const";
import { Errors } from "./utils/errors";
import { Utils } from "./utils/utils";

let config: Config;

export class Geometry {
  static errors = Errors;
  public utils: Utils;

  constructor(precision: number = PRECISION) {
    config = new Config(precision);
    this.utils = new Utils(config);
  }

  public primitive = {
    line: (arg1: Point, arg2: Point | Vector) => new Line(this.utils, arg1, arg2),
    point: (x: number, y: number) => new Point(this.utils, x, y),
  };

  public object = {
    vector: (start: number | Point, end: typeof start) => new Vector(this.utils, start, end),

  }
}
