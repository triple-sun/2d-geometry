import { Line } from "../primitives/line";
import { Point } from "../primitives/point";
import { Box } from "../shapes/box";
import { Shape } from "../shapes/shape";
import { Utils } from "../utils/utils";
import { Vector } from "./vector";

/** 
 * Class representing a segment
 * @type {Segment}
 */
export class Segment extends Shape {
  public start: Point;
  public end: Point;

  /**
   *
   * @param {Point} start - start point
   * @param {Point} end - end point
   */
  constructor(utils: Utils, start: Point = new Point(utils), end: Point = new Point(utils)) {
    super(utils);
    this.start = start
    this.end = end;

  }

  /**
   * Return new cloned instance of segment
   */
  clone(): Segment {
    return new Segment(this.utils, this.start, this.end);
  }

  /**
   * Returns array of start and end point
   * @returns {[Point,Point]}
   */
  get vertices(): [Point, Point] {
    return [this.start.clone(), this.end.clone()];
  }

  /**
   * Length of a segment
   * @returns {number}
   */
  get length(): number {
    return this.start.distanceTo(this.end)[0];
  }

  /**
   * Slope of the line - angle to axe x in radians from 0 to 2PI
   * @returns {number}
   */
  get slope(): number {
    let vec = new Vector(this.start, this.end);
    return vec.slope;
  }

  /**
   * Bounding box
   * @returns {Box}
   */
  get box(): Box {
    return new Box(
      Math.min(this.start.x, this.end.x),
      Math.min(this.start.y, this.end.y),
      Math.max(this.start.x, this.end.x),
      Math.max(this.start.y, this.end.y)
    );
  }

  /**
   * Returns true if equals to query segment, false otherwise
   * @param {Seg} seg - query segment
   * @returns {boolean}
   */
  equalTo(seg: Seg): boolean {
    return this.start.equalTo(seg.ps) && this.end.equalTo(seg.pe);
  }

  /**
   * Returns true if segment contains point
   * @param {Point} pt Query point
   * @returns {boolean}
   */
  contains(pt: Point): boolean {
    return Utils.EQ_0(this.distanceToPoint(pt));
  }

  /**
   * Returns array of intersection points between segment and other shape
   * @param {Shape} shape - Shape of the one of supported types <br/>
   * @returns {Point[]}
   */
  intersect(shape: Shape): Point[] {
    if (shape instanceof Point) {
      return this.contains(shape) ? [shape] : [];
    }

    if (shape instanceof Line) {
      return Intersection.intersectSegment2Line(this, shape);
    }

    if (shape instanceof Ray) {
      return Intersection.intersectRay2Segment(shape, this);
    }

    if (shape instanceof Segment) {
      return Intersection.intersectSegment2Segment(this, shape);
    }

    if (shape instanceof Circle) {
      return Intersection.intersectSegment2Circle(this, shape);
    }

    if (shape instanceof Box) {
      return Intersection.intersectSegment2Box(this, shape);
    }

    if (shape instanceof Arc) {
      return Intersection.intersectSegment2Arc(this, shape);
    }

    if (shape instanceof Polygon) {
      return Intersection.intersectSegment2Polygon(this, shape);
    }
  }

  /**
   * Calculate distance and shortest segment from segment to shape and return as array [distance, shortest segment]
   * @param {Shape} shape Shape of the one of supported types Point, Line, Circle, Segment, Arc, Polygon or Planar Set
   * @returns {number} distance from segment to shape
   * @returns {Segment} shortest segment between segment and shape (started at segment, ended at shape)
   */
  distanceTo(shape: Shape): number {
    if (shape instanceof Point) {
      let [dist, shortest_segment] = Distance.point2segment(shape, this);
      shortest_segment = shortest_segment.reverse();
      return [dist, shortest_segment];
    }

    if (shape instanceof Circle) {
      let [dist, shortest_segment] = Distance.segment2circle(this, shape);
      return [dist, shortest_segment];
    }

    if (shape instanceof Line) {
      let [dist, shortest_segment] = Distance.segment2line(this, shape);
      return [dist, shortest_segment];
    }

    if (shape instanceof Segment) {
      let [dist, shortest_segment] = Distance.segment2segment(this, shape);
      return [dist, shortest_segment];
    }

    if (shape instanceof Arc) {
      let [dist, shortest_segment] = Distance.segment2arc(this, shape);
      return [dist, shortest_segment];
    }

    if (shape instanceof Polygon) {
      let [dist, shortest_segment] = Distance.shape2polygon(this, shape);
      return [dist, shortest_segment];
    }

    if (shape instanceof PlanarSet) {
      let [dist, shortest_segment] = Distance.shape2planarSet(this, shape);
      return [dist, shortest_segment];
    }
  }

  /**
   * Returns unit vector in the direction from start to end
   * @returns {Vector}
   */
  tangentInStart(): Vector {
    let vec = new Vector(this.start, this.end);
    return vec.normalize();
  }

  /**
   * Return unit vector in the direction from end to start
   * @returns {Vector}
   */
  tangentInEnd(): Vector {
    let vec = new Vector(this.end, this.start);
    return vec.normalize();
  }

  /**
   * Returns new segment with swapped start and end points
   * @returns {Segment}
   */
  reverse(): Segment {
    return new Segment(this.end, this.start);
  }

  /**
   * When point belongs to segment, return array of two segments split by given point,
   * if point is inside segment. Returns clone of this segment if query point is incident
   * to start or end point of the segment. Returns empty array if point does not belong to segment
   * @param {Point} pt Query point
   * @returns {Segment[]}
   */
  split(pt: Point): Segment[] {
    if (this.start.equalTo(pt)) return [null, this.clone()];

    if (this.end.equalTo(pt)) return [this.clone(), null];

    return [new Segment(this.start, pt), new Segment(pt, this.end)];
  }

  /**
   * Return middle point of the segment
   * @returns {Point}
   */
  middle(): Point {
    return new Point(
      (this.start.x + this.end.x) / 2,
      (this.start.y + this.end.y) / 2
    );
  }

  /**
   * Get point at given length
   * @param {number} length - The length along the segment
   * @returns {Point}
   */
  pointAtLength(length: number): Point {
    if (length > this.length || length < 0) return null;
    if (length == 0) return this.start;
    if (length == this.length) return this.end;
    let factor = length / this.length;
    return new Point(
      (this.end.x - this.start.x) * factor + this.start.x,
      (this.end.y - this.start.y) * factor + this.start.y
    );
  }

  distanceToPoint(pt) {
    let [dist, ...rest] = Distance.point2segment(pt, this);
    return dist;
  }

  definiteIntegral(ymin = 0.0) {
    let dx = this.end.x - this.start.x;
    let dy1 = this.start.y - ymin;
    let dy2 = this.end.y - ymin;
    return (dx * (dy1 + dy2)) / 2;
  }

  /**
   * Return new segment transformed using affine transformation matrix
   * @param {Matrix} matrix - affine transformation matrix
   * @returns {Segment} - transformed segment
   */
  transform(matrix: Matrix = new Matrix(this.utils)): Segment {
    return new Segment(this.start.transform(matrix), this.end.transform(matrix));
  }

  /**
   * Returns true if segment start is equal to segment end up to DP_TOL
   * @returns {boolean}
   */
  isZeroLength(): boolean {
    return this.start.equalTo(this.end);
  }

  /**
   * Sort given array of points from segment start to end, assuming all points lay on the segment
   * @param {Point[]} - array of points
   * @returns {Point[]} new array sorted
   */
  sortPoints(pts): Point[] {
    let line = new Line(this.start, this.end);
    return line.sortPoints(pts);
  }

  get name() {
    return "segment";
  }

  /**
   * Return string to draw segment in svg
   * @param {Object} attrs - an object with attributes for svg path element,
   * like "stroke", "strokeWidth" <br/>
   * Defaults are stroke:"black", strokeWidth:"1"
   * @returns {string}
   */
  svg(attrs: object = {}): string {
    return `\n<line x1="${this.start.x}" y1="${this.start.y}" x2="${
      this.end.x
    }" y2="${this.end.y}" ${convertToString(attrs)} />`;
  }
}

Segment = Segment;
/**
 * Shortcut method to create new segment
 */
export const segment = (...args) => new Segment(...args);
segment = segment;
