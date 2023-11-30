import { Point } from "../primitives/point";
import { Utils } from "../utils/utils";
import { Box } from "./box";
import { Shape } from "./shape";

/**
 * Class representing a circle
 * @type {Circle}
 */
export class Circle extends Shape {
  /**
   * Class private property
   * @type {string}
   */

  /**
   *
   * @param {Point} centerPoint - circle center point
   * @param {number} radius - circle radius
   */
  constructor(public utils: Utils, public centerPoint: Point = new Point(utils), public radius: number = 1) {
    super(utils);
    this.centerPoint = centerPoint
    this.radius = radius;
  }

  /**
   * Return new cloned instance of circle
   * @returns {Circle}
   */
  clone(): Circle {
    return new Circle(this.utils, this.centerPoint.clone(), this.radius);
  }

  /**
   * Circle center
   * @returns {Point}
   */
  get center(): Point {
    return this.centerPoint;
  }

  /**
   * Circle bounding box
   * @returns {Box}
   */
  get box(): Box {
    return new Box(
        this.utils,
      this.centerPoint.x - this.radius,
      this.centerPoint.y - this.radius,
      this.centerPoint.x + this.radius,
      this.centerPoint.y + this.radius
    );
  }

  /**
   * Return true if circle contains shape: no point of shape lies outside of the circle
   * @param {Shape} shape - test shape
   * @returns {boolean}
   */
  contains(shape: Shape): boolean {
    if (shape instanceof Point) {
      return utils.LE(shape.distanceTo(this.center)[0], this.radius);
    }

    if (shape instanceof Segment) {
      return (
        Utils.LE(shape.start.distanceTo(this.center)[0], this.radius) &&
        Utils.LE(shape.end.distanceTo(this.center)[0], this.radius)
      );
    }

    if (shape instanceof Arc) {
      return (
        this.intersect(shape).length === 0 &&
        Utils.LE(shape.start.distanceTo(this.center)[0], this.radius) &&
        Utils.LE(shape.end.distanceTo(this.center)[0], this.radius)
      );
    }

    if (shape instanceof Circle) {
      return (
        this.intersect(shape).length === 0 &&
        Utils.LE(shape.radius, this.radius) &&
        Utils.LE(shape.center.distanceTo(this.center)[0], this.radius)
      );
    }

    /* TODO: box, polygon */
  }

  /**
   * Transform circle to closed arc
   * @param {boolean} counterclockwise
   * @returns {Arc}
   */
  toArc(counterclockwise: boolean = true): Arc {
    return new Arc(
      this.center,
      this.radius,
      Math.PI,
      -Math.PI,
      counterclockwise
    );
  }

  /**
   * Method scale is supported only for uniform scaling of the circle with (0,0) center
   * @param {number} sx
   * @param {number} sy
   * @returns {Circle}
   */
  scale(sx: number, sy: number): Circle {
    if (sx !== sy) throw Errors.OPERATION_IS_NOT_SUPPORTED;
    if (!(this.centerPoint.x === 0.0 && this.centerPoint.y === 0.0))
      throw Errors.OPERATION_IS_NOT_SUPPORTED;
    return new Circle(this.centerPoint, this.radius * sx);
  }

  /**
   * Return new circle transformed using affine transformation matrix
   * @param {Matrix} matrix - affine transformation matrix
   * @returns {Circle}
   */
  transform(matrix: Matrix = new Matrix()): Circle {
    return new Circle(this.centerPoint.transform(matrix), this.radius);
  }

  /**
   * Returns array of intersection points between circle and other shape
   * @param {Shape} shape Shape of the one of supported types
   * @returns {Point[]}
   */
  intersect(shape: Shape): Point[] {
    if (shape instanceof Point) {
      return this.contains(shape) ? [shape] : [];
    }
    if (shape instanceof Line) {
      return Intersection.intersectLine2Circle(shape, this);
    }
    if (shape instanceof Ray) {
      return Intersection.intersectRay2Circle(shape, this);
    }
    if (shape instanceof Segment) {
      return Intersection.intersectSegment2Circle(shape, this);
    }

    if (shape instanceof Circle) {
      return Intersection.intersectCircle2Circle(shape, this);
    }

    if (shape instanceof Box) {
      return Intersection.intersectCircle2Box(this, shape);
    }

    if (shape instanceof Arc) {
      return Intersection.intersectArc2Circle(shape, this);
    }
    if (shape instanceof Polygon) {
      return Intersection.intersectCircle2Polygon(this, shape);
    }
  }

  get name() {
    return "circle";
  }
}