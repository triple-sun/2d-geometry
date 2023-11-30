import { Matrix } from "./matrix";
import { Errors } from "../utils/errors";
import { Shape } from "../shapes/shape";
import { Point } from "../primitives/point";
import { Utils } from "../utils/utils";

export class Vector extends Shape {
  x!: number;
  y!: number;

  /**
   * Vector may be constructed by two points, or by two float numbers
   * @param {Point} start - start point
   * @param {Point} end - end point
   */
  constructor(utils: Utils, start: number | Point, end: typeof start) {
    super(utils);

    this.x = 0;
    this.y = 0;

    if (typeof start == "number" && typeof end == "number") {
      this.x = start;
      this.y = end;
    }

    if (start instanceof Point && end instanceof Point) {
      this.x = end.x - start.x;
      this.y = end.y - start.y;
    }
  }

  /**
   * Method clone returns new instance of Vector
   * @returns {Vector}
   */
  clone(): Vector {
    return new Vector(this.utils, this.x, this.y);
  }

  /**
   * Slope of the vector in radians from 0 to 2PI
   * @returns {number}
   */
  get slope(): number {
    let angle = Math.atan2(this.y, this.x);
    if (angle < 0) angle = 2 * Math.PI + angle;
    return angle;
  }

  /**
   * Length of vector
   * @returns {number}
   */
  get length(): number {
    return Math.sqrt(this.dot(this));
  }

  // Returns true if vectors are equal up to tolerance
  equalTo(v: Vector): boolean {
    return this.utils.equalTo(this.x, v.x) && this.utils.equalTo(this.y, v.y);
  }

  /**
   * Returns new vector multiplied by scalar
   * @param {number} scalar
   * @returns {Vector}
   */
  multiply(scalar: number): Vector {
    return new Vector(this.utils, scalar * this.x, scalar * this.y);
  }

  /**
   * Returns scalar product (dot product) of two vectors
   * @param {Vector} v Other vector
   * @returns {number}
   */
  dot(v: Vector): number {
    return this.x * v.x + this.y * v.y;
  }

  /**
   * Returns vector product (cross product) of two vectors
   * @param {Vector} v Other vector
   * @returns {number}
   */
  cross(v: Vector): number {
    return this.x * v.y - this.y * v.x;
  }

  /**
   * Returns unit vector.<br/>
   * Throw error if given vector has zero length
   * @returns {Vector}
   */
  normalize(): Vector {
    if (!this.utils.equalZero(this.length)) {
      return new Vector(this.utils, this.x / this.length, this.y / this.length);
    }
    throw Errors.zeroDivision;
  }

  rotate(angle: number, center = new Point(this.utils)): Vector {
    if (center.x === 0 && center.y === 0) {
      return this.transform(new Matrix().rotate(angle));
    }
    throw Errors.notSupported;
  }

  /**
   * Return new vector transformed by affine transformation matrix m
   * @param {Matrix} matrix - affine transformation matrix (a,b,c,d,tx,ty)
   * @returns {Vector}
   */
  transform(matrix: Matrix): Vector {
    const transformed = matrix.transform(this.x, this.y);
    return new Vector(this. utils, transformed[0], transformed[1]);
  }

  /**
   * Returns vector rotated 90 degrees counterclockwise
   * @returns {Vector}
   */
  rotate90CCW(): Vector {
    return new Vector(this.utils , - this.y, this.x);
  }

  /**
   * Returns vector rotated 90 degrees clockwise
   * @returns {Vector}
   */
  rotate90CW(): Vector {
    return new Vector(this.utils, this.y, -this.x);
  }

  /**
   * Return inverted vector
   * @returns {Vector}
   */
  invert(): Vector {
    return new Vector(this.utils, - this.x, -this.y);
  }

  /**
   * Return result of addition of other vector to this vector as a new vector
   * @param {Vector} v Other vector
   * @returns {Vector}
   */
  add(v: Vector): Vector {
    return new Vector(this.utils, this.x + v.x, this.y + v.y);
  }

  /**
   * Return result of subtraction of other vector from current vector as a new vector
   * @param {Vector} v Another vector
   * @returns {Vector}
   */
  subtract(v: Vector): Vector {
    return new Vector(this.utils, this.x - v.x, this.y - v.y);
  }

  /**
   * Return angle between this vector and other vector. <br/>
   * Angle is measured from 0 to 2*PI in the counterclockwise direction
   * from current vector to  another.
   * @param {Vector} v Another vector
   * @returns {number}
   */
  angleTo(v: Vector): number {
    let norm1 = this.normalize();
    let norm2 = v.normalize();
    let angle = Math.atan2(norm1.cross(norm2), norm1.dot(norm2));
    if (angle < 0) angle += 2 * Math.PI;
    return angle;
  }

  /**
   * Return vector projection of the current vector on another vector
   * @param {Vector} v Another vector
   * @returns {Vector}
   */
  projectionOn(v: Vector): Vector {
    let n = v.normalize();
    let d = this.dot(n);
    return n.multiply(d);
  }

  get name() {
    return "vector";
  }
}
