import { Geometry } from "../geometry";
import { Matrix } from "../objects/matrix";
import { Vector } from "../objects/vector";
import { Box } from "../shapes/box";
import { Shape } from "../shapes/shape";
import { Errors } from "../utils/errors";
import { Utils } from "../utils/utils";
import { Point } from "./point";


/**
 * Class representing a line
 * @type {Line}
 */
export class Line extends Shape {
  norm: Vector;
  pt: Point;
  /**
   * Line may be constructed by point and normal vector or by two points that a line passes through
   * @param {Point} pt - point that a line passes through
   * @param {Vector|Point} norm - normal vector to a line or second point a line passes through
   */
  constructor(utils: Utils, arg1: Point, arg2: Point | Vector) {
    super(utils);

    this.pt = new Point(utils);

    this.norm = new Vector(utils, 0, 1);

    if (arg1 instanceof Point && arg2 instanceof Point) {
      this.pt = arg1;
      this.norm = this.points2norm(arg1, arg2);
      if (this.norm.dot(new Vector(utils, this.pt.x, this.pt.y)) >= 0) {
        this.norm.invert();
      }
      return;
    }

    if (arg1 instanceof Point && arg2 instanceof Vector) {
      if (utils.equalZero(arg2.x) && utils.equalZero(arg2.y)) {
        throw Geometry.errors.ILLEGAL_PARAMETERS;
      }
      this.pt = arg1.clone();
      this.norm = arg2.clone();
      this.norm = this.norm.normalize();
      if (this.norm.dot(new Vector(utils, this.pt.x, this.pt.y)) >= 0) {
        this.norm.invert();
      }
      return;
    }
  }

  /**
   * Return new cloned instance of line
   */
  clone(): Line {
    return new Line(this.utils, this.pt, this.norm);
  }

  /* The following methods need for implementation of Edge interface
    /**
     * Line has no start point
     * @returns {undefined}
     */
  get start() {
    return undefined;
  }

  /**
   * Line has no end point
   */
  get end() {
    return undefined;
  }

  /**
   * Return positive infinity number as length
   * @returns {number}
   */
  get length(): number {
    return Number.POSITIVE_INFINITY;
  }

  /**
   * Returns infinite box
   * @returns {Box}
   */
  get box(): Box {
    return new Box(
      this.utils,
      Number.NEGATIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY
    );
  }

  /**
   * Middle point is undefined
   * @returns {undefined}
   */
  get middle(): undefined {
    return undefined;
  }

  /**
   * Slope of the line - angle in radians between line and axe x from 0 to 2PI
   * @returns {number} - slope of the line
   */
  get slope(): number {
    let vec = new Vector(this.utils, this.norm.y, -this.norm.x);
    return vec.slope;
  }

  /**
   * Get coefficients [A,B,C] of a standard line equation in the form Ax + By = C
   * @code [A, B, C] = line.standard
   */
  get standard(): number[] {
    let A = this.norm.x;
    let B = this.norm.y;
    let C = this.norm.dot(new Vector(this.utils, this.pt.x, this.pt.y));

    return [A, B, C];
  }

  /**
   * Return true if parallel or incident to other line
   * @param {Line} line - line to check
   */
  parallelTo(line: Line): boolean {
    return this.utils.equalZero(this.norm.cross(line.norm));
  }

  /**
   * Returns true if incident to other line
   * @param {Line} line - line to check
   */
  incidentTo(line: Line): boolean {
    return this.parallelTo(line) && !!this.pt.on(line);
  }

  /**
   * Returns true if point belongs to line
   * @param {Point} pt Query point
   * @returns {boolean}
   */
  contains(pt: Point): boolean {
    if (this.pt.equalTo(pt)) {
      return true;
    }
    /* Line contains point if vector to point is orthogonal to the line normal vector */
    const vec = new Vector(this.utils, this.pt, pt);
    return this.utils.equalZero(this.norm.dot(vec));
  }

  /**
   * Return coordinate of the point that lies on the line in the transformed
   * coordinate system where center is the projection of the point(0,0) to
   * the line and axe y is collinear to the normal vector. <br/>
   * This method assumes that point lies on the line and does not check it
   * @param {Point} pt - point on a line
   * @returns {number}
   */
  coord(pt: Point): number {
    return new Vector(this.utils, pt.x, pt.y).cross(this.norm);
  }


  /**
   * Return new line rotated by angle
   * @param {number} angle - angle in radians
   * @param {Point} center - center of rotation
   */
  rotate(angle: number, center: Point = new Point(this.utils)) {
    return new Line(
      this.utils,
      this.pt.rotate(angle, center),
      this.norm.rotate(angle)
    );
  }

  /**
   * Return new line transformed by affine transformation matrix
   * @param {Matrix} m - affine transformation matrix (a,b,c,d,tx,ty)
   */
  transform(m: Matrix): Line {
    return new Line(this.utils, this.pt.transform(m), this.norm.clone());
  }

  /**
   * Sort given array of points that lay on a line with respect to coordinate on a line
   * The method assumes that points lay on the line and does not check this
   * @param {Point[]} pts - array of points
   * @returns {Point[]} new array sorted
   */
  sortPoints(pts: Point[]): Point[] {
    return pts.slice().sort((pt1, pt2) => {
      if (this.coord(pt1) < this.coord(pt2)) {
        return -1;
      }
      if (this.coord(pt1) > this.coord(pt2)) {
        return 1;
      }
      return 0;
    });
  }

  public points2norm(pt1: Point, pt2: Point) {
    if (pt1.equalTo(pt2)) {
      throw Errors.ILLEGAL_PARAMETERS;
    }
    let vec = new Vector(this.utils, pt1, pt2);
    let unit = vec.normalize();
    return unit.rotate90CCW();
  }

  get name() {
    return "line";
  }
}

