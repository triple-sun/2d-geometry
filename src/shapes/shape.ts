import { Matrix } from "../objects/matrix";
import { Vector } from "../objects/vector";
import { Line } from "../primitives/line";
import { Point } from "../primitives/point";
import { Errors } from "../utils/errors";
import { Utils } from "../utils/utils";
import { Box } from "./box";

/**
 * Base class representing shape
 * Implement common methods of affine transformations
 */
export abstract class Shape {
  constructor(public utils: Utils) {
    this.utils = utils;
  }

  get name(): string | void {
    throw Errors.CANNOT_INVOKE_ABSTRACT_METHOD;
  }

  get box(): Box | void {
    throw Errors.CANNOT_INVOKE_ABSTRACT_METHOD;
  }

  clone() {
    throw Errors.CANNOT_INVOKE_ABSTRACT_METHOD;
  }

  /**
  translate(vector: Vector): this {
    return this.transform(new Matrix(this.utils).translate(vector));
  }
   */

  /**
   * Returns new shape rotated by given angle around given center point.
   * If center point is omitted, rotates around zero point (0,0).
   * Positive value of angle defines rotation in counterclockwise direction,
   * negative angle defines rotation in clockwise direction
   * @param {number} angle - angle in radians
   * @param {Point} [center=(0,0)] center
  rotate(angle: number, center: Point): this {
    return this.transform(
      new Matrix(this.utils).rotate(angle, center.x, center.y)
    );
  }
     */

  /**
   * Return new shape with coordinates multiplied by scaling factor
   * @param {number} sx - x-axis scaling factor
   * @param {number} sy - y-axis scaling factor
   * @returns {Shape}
  scale(sx: number, sy: number): Shape | Line {
    return this.transform(new Matrix(this.utils).scale(sx, sy));
  }
     */

  /**
  transform<T>(matrix: Matrix): T {
    throw Errors.CANNOT_INVOKE_ABSTRACT_METHOD;
  }
  */
}
