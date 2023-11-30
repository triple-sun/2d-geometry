import { Utils } from "../utils/utils";
import { Vector } from "./vector";

export class Matrix {
  constructor(
    private utils: Utils,
    public a: number = 1,
    public b: number = 0,
    public c: number = 0,
    public d: number = 1,
    public tx: number = 0,
    public ty: number = 0
  ) {
    this.utils = utils
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.tx = tx;
    this.ty = ty;
  }

  clone(): Matrix {
    return new Matrix(this.utils, this.a, this.b, this.c, this.d, this.tx, this.ty);
  }

  transform(x: number, y: number): [number, number] {
    return [
      x * this.a + y * this.c + this.tx,
      x * this.b + y * this.d + this.ty,
    ];
  }

  multiply(matrix: Matrix): Matrix {
    return new Matrix(
      this.utils, 
      this.a * matrix.a + this.c * matrix.b,
      this.b * matrix.a + this.d * matrix.b,
      this.a * matrix.c + this.c * matrix.d,
      this.b * matrix.c + this.d * matrix.d,
      this.a * matrix.tx + this.c * matrix.ty + this.tx,
      this.b * matrix.tx + this.d * matrix.ty + this.ty
    );
  }

  translate(args: Partial<Vector>): Matrix {
    return this.multiply(new Matrix(this.utils, 1, 0, 0, 1, args.x || 0, args.y || 0));
  }

  rotate(angle: number, centerX: number = 0.0, centerY: number = 0.0): Matrix {
    let cos = Math.cos(angle);
    let sin = Math.sin(angle);
    return this.translate([centerX, centerY])
      .multiply(new Matrix(this.utils, cos, sin, -sin, cos, 0, 0))
      .translate([-centerX, -centerY]);
  }

  /**
   * Return new matrix as a result of multiplication of the current matrix
   * by the matrix (sx,0,0,sy,0,0) that defines scaling
   * @param {number} sx
   * @param {number} sy
   * @returns {Matrix}
   */
  scale(sx: number, sy: number): Matrix {
    return this.multiply(new Matrix(this.utils, sx, 0, 0, sy, 0, 0));
  }

  /**
   * Returns true if two matrix are equal parameter by parameter
   * @param {Matrix} matrix - other matrix
   * @returns {boolean} true if equal, false otherwise
   */
  equalTo(matrix: Matrix): boolean {
    if (!this.utils.equalTo(this.tx, matrix.tx)) return false;
    if (!this.utils.equalTo(this.ty, matrix.ty)) return false;
    if (!this.utils.equalTo(this.a, matrix.a)) return false;
    if (!this.utils.equalTo(this.b, matrix.b)) return false;
    if (!this.utils.equalTo(this.c, matrix.c)) return false;
    if (!this.utils.equalTo(this.d, matrix.d)) return false;
    return true;
  }
}
