import { Matrix } from "../objects/matrix";
import { Segment } from "../objects/segment";
import { Point } from "../primitives/point";
import { Utils } from "../utils/utils";
import { Shape } from "./shape";

/**
 * Class Box represents bounding box of the shape.
 * It may also represent axis-aligned rectangle
 */
export class Box extends Shape {
  /**
   * @param {number} xmin - minimal x coordinate
   * @param {number} ymin - minimal y coordinate
   * @param {number} xmax - maximal x coordinate
   * @param {number} ymax - maximal y coordinate
   */
  constructor(
    utils: Utils,
    public xmin: number = 0,
    public ymin: number = 0,
    public xmax: number = 0,
    public ymax: number = 0
  ) {
    super(utils);
    this.xmin = xmin;
    this.ymin = ymin;
    this.xmax = xmax;
    this.ymax = ymax;
  }

  set(xmin: number, ymin: number, xmax: number, ymax: number) {
    this.xmin = xmin;
    this.ymin = ymin;
    this.xmax = xmax;
    this.ymax = ymax;
  }

  /**
   * Property low need for interval tree interface
   */
  get low(): Point {
    return new Point(this.utils, this.xmin, this.ymin);
  }

  /**
   * Property high need for interval tree interface
   */
  get high(): Point {
    return new Point(this.utils, this.xmax, this.ymax);
  }

  /**
   * Property max returns the box itself !
   */
  get max(): Box {
    return this.clone();
  }

  /**
   * Return center of the box
   */
  get center(): Point {
    return new Point(
      this.utils,
      (this.xmin + this.xmax) / 2,
      (this.ymin + this.ymax) / 2
    );
  }

  /**
   * Return the width of the box
   */
  get width(): number {
    return Math.abs(this.xmax - this.xmin);
  }

  /**
   * Return the height of the box
   */
  get height(): number {
    return Math.abs(this.ymax - this.ymin);
  }

  /**
   * Return property box like all other shapes
   */
  get box(): Box {
    return this.clone();
  }

  clone(): Box {
    return new Box(this.utils, this.xmin, this.ymin, this.xmax, this.ymax);
  }

  /**
   * Returns true if not intersected with other box
   * @param {Box} otherBox - other box to test
   */
  notIntersect(otherBox: Box): boolean {
    return (
      this.xmax < otherBox.xmin ||
      this.xmin > otherBox.xmax ||
      this.ymax < otherBox.ymin ||
      this.ymin > otherBox.ymax
    );
  }

  /**
   * Returns true if intersected with other box
   * @param {Box} otherBox - Query box
   * @returns {boolean}
   */
  intersect(otherBox: Box): boolean {
    return !this.notIntersect(otherBox);
  }

  /**
   * Returns new box merged with other box
   * @param {Box} otherBox - Other box to merge with
   * @returns {Box}
   */
  merge(otherBox: Box): Box {
    return new Box(
      this.utils,
      Math.min(this.xmin, otherBox.xmin),
      Math.min(this.ymin, otherBox.ymin),
      Math.max(this.xmax, otherBox.xmax),
      Math.max(this.ymax, otherBox.ymax)
    );
  }

  /**
   * Defines predicate "less than" between two boxes. Need for interval index
   * @param {Box} otherBox - other box
   * @returns {boolean} - true if this box less than other box, false otherwise
   */
  lessThan(otherBox: Box): boolean {
    if (this.low.lessThan(otherBox.low)) return true;
    if (this.low.equalTo(otherBox.low) && this.high.lessThan(otherBox.high))
      return true;
    return false;
  }

  /**
   * Returns true if this box is equal to other box, false otherwise
   * @param {Box} otherBox - query box
   * @returns {boolean}
   */
  equalTo(otherBox: Box): boolean {
    return this.low.equalTo(otherBox.low) && this.high.equalTo(otherBox.high);
  }

  static comparableMax(box1: Box, box2: Box) {
    // return pt1.lessThan(pt2) ? pt2.clone() : pt1.clone();
    return box1.merge(box2);
  }

  static comparableLessThan(pt1: Point, pt2: Point) {
    return pt1.lessThan(pt2);
  }

  /**
   * Transform box into array of points from low left corner in counterclockwise
   */
  toPoints(): Point[] {
    return [
      new Point(this.utils, this.xmin, this.ymin),
      new Point(this.utils, this.xmax, this.ymin),
      new Point(this.utils, this.xmax, this.ymax),
      new Point(this.utils, this.xmin, this.ymax),
    ];
  }

  /**
   * Transform box into array of segments from low left corner in counterclockwise
   */
  toSegments(): Segment[] {
    let pts = this.toPoints();
    return [
      new Segment(this.utils, pts[0], pts[1]),
      new Segment(this.utils, pts[1], pts[2]),
      new Segment(this.utils, pts[2], pts[3]),
      new Segment(this.utils, pts[3], pts[0]),
    ];
  }

  /**
   * Return new box transformed using affine transformation matrix
   * New box is a bounding box of transformed corner points
   * @param {Matrix} m - affine transformation matrix
   */
  transform(m: Matrix = new Matrix(this.utils)): Box {
    const transformed = this.toPoints().map((pt) => pt.transform(m));
    return transformed.reduce(
      (newBox, pt) => newBox.merge(pt.box),
      new Box(this.utils)
    );
  }

  get name() {
    return "box";
  }
}