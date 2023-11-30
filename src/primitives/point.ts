import { Distance, Distance } from './../algos/distance';
import { Distance } from '../algos/distance';
import { Matrix } from '../objects/matrix';
import { Ray } from '../objects/ray';
import { Segment } from '../objects/segment';
import { Vector } from '../objects/vector';
import { Box } from '../shapes/box';
import { Circle } from '../shapes/circle';
import { Polygon } from '../shapes/polygon';
import { T2Axis } from '../utils/types';
import { Utils } from '../utils/utils';
import { Shape } from './../shapes/shape';
import { Line } from './line';

/**
 *
 * Class representing a point
 * @type {Point}
 */
export class Point extends Shape {
  /**
   * Point may be constructed by two numbers, or by array of two numbers */
  constructor(utils: Utils, public x: number = 0, public y: number = 0) {
    super(utils);

    this.x = x;
    this.y = y;
  }

  get box(): Box {
    return new Box(this.utils, this.x, this.y, this.x, this.y);
  }

  clone(): Point {
    return new Point(this.utils, this.x, this.y);
  }

  get vertices() {
    return [this.clone()];
  }

  /**
   * Returns true if points are equal up to tolerance
   * @param {Point} pt Query point
   */
  equalTo(pt: Point): boolean {
    return this.utils.equalTo(this.x, pt.x) && this.utils.equalTo(this.y, pt.y);
  }

  /**
   * Defines predicate "less than" between points. Returns true if the point is less than query points, false otherwise <br/>
   * By definition point1 < point2 if {point1.y < point2.y || point1.y == point2.y && point1.x < point2.x <br/>
   * Numeric values compared with [this.utils.DP_TOL]{@link DP_TOL} tolerance
   * @param {Point} pt Query point
   */
  lessThan(pt: Point): boolean {
    if (this.utils.lessThan(this.y, pt.y)) return true;
    if (this.utils.equalTo(this.y, pt.y) && this.utils.lessThan(this.x, pt.x))
      return true;
    return false;
  }

  /**
   * Return new point transformed by affine transformation matrix
   * @param {Matrix} matrix - affine transformation matrix (a,b,c,d,tx,ty)
   * @returns {Point}
   */
  transform(matrix: Matrix): Point {
    const [x, y] = matrix.transform(this.x, this.y);
    return new Point(this.utils, x, y);
  }

  translate(vector: Vector): Point {
    return this.transform(new Matrix(this.utils).translate(vector));
  }

  rotate(angle: number, center: Point): Point {
    return this.transform(
      new Matrix(this.utils).rotate(angle, center.x, center.y)
    );
  }

  /**
   * Returns projection point on given line
   * @param {Line} line Line this point be projected on
   */
  projectionOn(line: Line): Point {
    if (this.equalTo(line.pt))
      // this point equal to line anchor point
      return this.clone();

    let vec = new Vector(this.utils, this, line.pt);
    if (this.utils.equalZero(vec.cross(line.norm))) return line.pt.clone();

    let dist = vec.dot(line.norm); // signed distance
    let projectedVector = line.norm.multiply(dist);
    return this.translate(projectedVector);
  }

  /**
   * Returns true if point belongs to the "left" semi-plane, which means, point belongs to the same semi plane where line normal vector points to
   * Return false if point belongs to the "right" semi-plane or to the line itself
   * @param {Line} line Query line
   * @returns {boolean}
   */
  leftTo(line: Line): boolean {
    let vec = new Vector(this.utils, line.pt, this);
    let onLeftSemiPlane = this.utils.greaterThan(vec.dot(line.norm), 0);
    return onLeftSemiPlane;
  }

  /**
   * Returns true if point is on a shape, false otherwise
   * @param {Shape} shape Shape of the one of supported types Point, Line, Circle, Segment, Arc, Polygon
   */
  on(shape: Shape): boolean | undefined {
    if (shape instanceof Point) {
      return this.equalTo(shape);
    }

    if (shape instanceof Line) {
      return shape.contains(this);
    }

    if (shape instanceof Ray) {
      return shape.contains(this);
    }

    if (shape instanceof Circle) {
      return shape.contains(this);
    }

    if (shape instanceof Segment) {
      return shape.contains(this);
    }

    if (shape instanceof Polygon) {
      return shape.contains(this);
    }
  }

  distanceTo(shape: Shape) {
    const dist = new Distance(this.utils)
    if (shape instanceof Point) {
      let dx = shape.x - this.x;
      let dy = shape.y - this.y;
      return [Math.sqrt(dx * dx + dy * dy), new Segment(this.utils, this, shape)];
    }

    if (shape instanceof Line) {
      return dist.point2line(this, shape);
    }

    if (shape instanceof Circle) {
      return dist.point2circle(this, shape);
    }

    if (shape instanceof Segment) {
      return dist.point2segment(this, shape);
    }

    if (shape instanceof Polygon) {
      return dist.point2polygon(this, shape);
    }
  }

  get name() {
    return "point";
  }
}