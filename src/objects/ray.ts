import { Point } from "../primitives/point";
import { Shape } from "../shapes/shape";
import { Utils } from "../utils/utils";
import { Vector } from "./vector";
import { Box } from "../shapes/box";
import { Segment } from "./segment";
import { Line } from "../primitives/line";
import { Matrix } from "./matrix";

export class Ray extends Shape {
  public point: Point;
  public vector: Vector;

  /**
   * Ray may be constructed by setting an <b>origin</b> point and a <b>normal</b> vector, so that any point <b>x</b>
   * on a ray fit an equation: <br />
   *  (<b>x</b> - <b>origin</b>) * <b>vector</b> = 0 <br />
   * Ray defined by constructor is a right semi-infinite line with respect to the normal vector <br/>
   * If normal vector is omitted ray is considered horizontal (normal vector is (0,1)). <br/>
   * Don't be confused: direction of the normal vector is orthogonal to the ray <br/>
   * @param {Utils} utils - module utils
   * @param {point: Point; vector: Vector} data - data
   */
  constructor(
    utils: Utils,
    {
      point = new Point(utils),
      vector = new Vector(utils, 0, 1),
    }: { point: Point; vector: Vector }
  ) {
    super(utils);
    this.point = point;
    this.vector = vector;
  }

  /**
   * Return new cloned instance of ray
   */
  clone() {
    return new Ray(this.utils, { point: this.point, vector: this.vector });
  }

  /**
   * Slope of the ray - angle in radians between ray and axe x from 0 to 2PI
   */
  get slope(): number {
    let vec = new Vector(this.utils, this.vector.y, -this.vector.x);
    return vec.slope;
  }

  /**
   * Returns half-infinite bounding box of the ray
   */
  get box(): Box {
    let slope = this.slope;
    return new Box(
      this.utils,
      slope > Math.PI / 2 && slope < (3 * Math.PI) / 2
        ? Number.NEGATIVE_INFINITY
        : this.point.x,
      slope >= 0 && slope <= Math.PI ? this.point.y : Number.NEGATIVE_INFINITY,
      slope >= Math.PI / 2 && slope <= (3 * Math.PI) / 2
        ? this.point.x
        : Number.POSITIVE_INFINITY,
      (slope >= Math.PI && slope <= 2 * Math.PI) || slope === 0
        ? this.point.y
        : Number.POSITIVE_INFINITY
    );
  }

  /**
   * Return ray start point
   */
  get start(): Point {
    return this.point;
  }

  /**
   * Ray has no end point?
   */
  get end(): undefined {
    return undefined;
  }

  /**
   * Return positive infinity number as length
   */
  get length(): number {
    return Number.POSITIVE_INFINITY;
  }

  /**
   * Returns true if point belongs to ray
   * @param {Point} pt Query point
   */
  contains(pt: Point): boolean {
    if (this.point.equalTo(pt)) {
      return true;
    }
    /* Ray contains point if vector to point is orthogonal to the ray normal vector
            and cross product from vector to point is positive */
    let vector = new Vector(this.utils, this.point, pt);
    return (
      this.utils.equalZero(this.vector.dot(vector)) &&
      this.utils.greaterOrEqual(vector.cross(this.vector), 0)
    );
  }

  /**
   * Split ray with point and return array of segment and new ray
   * @param {Point} pt
   * @returns [Segment,Ray]
   */
  split(pt: Point) {
    if (!this.contains(pt)) return [];

    if (this.point.equalTo(pt)) {
      return [this];
    }

    return [
      new Segment(this.utils, this.point, pt),
      new Ray(this.utils, { point: pt, vector: this.vector }),
    ];
  }

  /**
   * Returns array of intersection points between ray and another shape
   * @param {Shape} shape - Shape to intersect with ray
   */
  intersect(shape: Shape): Point[] {
    if (shape instanceof Point) {
      return this.contains(shape) ? [shape] : [];
    }

    if (shape instanceof Segment) {
      return Intersection.intersectRay2Segment(this, shape);
    }

    if (shape instanceof Arc) {
      return Intersection.intersectRay2Arc(this, shape);
    }

    if (shape instanceof Line) {
      return Intersection.intersectRay2Line(this, shape);
    }

    if (shape instanceof Ray) {
      return Intersection.intersectRay2Ray(this, shape);
    }

    if (shape instanceof Circle) {
      return Intersection.intersectRay2Circle(this, shape);
    }

    if (shape instanceof Box) {
      return Intersection.intersectRay2Box(this, shape);
    }

    if (shape instanceof Polygon) {
      return Intersection.intersectRay2Polygon(this, shape);
    }
  }

  /**
   * Return new line rotated by angle
   * @param {number} angle - angle in radians
   * @param {Point} center - center of rotation
   */
  rotate(angle: number, center: Point = new Point(this.utils)) {
    return new Ray(this.utils, {
      point: this.point.rotate(angle, center),
      vector: this.vector.rotate(angle),
    });
  }

  /**
   * Return new ray transformed by affine transformation matrix
   * @param {Matrix} m - affine transformation matrix (a,b,c,d,tx,ty)
   */
  transform(m: Matrix) {
    return new Ray(this.utils, {
      point: this.point.transform(m),
      vector: this.vector.clone(),
    });
  }

  get name() {
    return "ray";
  }
}
