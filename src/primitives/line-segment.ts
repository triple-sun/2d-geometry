import { IntervalType } from '../enum/interval';
import { Point } from './point';
import { Line } from './line';
import { Vector } from '../objects/vector';
import { Interval } from './interval';
import config from '../config';
import { Optional } from '@ruffy/ts-optional';

/**
 * A LineSegment is defined by two points, it represents the line between these points.
 */
export class LineSegment {
  constructor(public p1: Point, public p2:Point) {
  }

  /**
   * Creates a LineSegment from four numbers. The first two being x and y from the start point
   * of the line segment, the last two the x and y value of the end point.
   */
  static fromValues(x1: number, y1: number, x2: number, y2: number) {
    return lineSegment(x1, y1, x2, y2);
  }

  /**
   * Creates a LineSegment from an array of numbers. The array must be at least 4 elements long
   * and these first 4 values will be used as [x1, y1, x2, y2].
   */
  static fromArray(a: number[]) {
    return new LineSegment(new Point(a[0], a[1]), new Point(a[2], a[3]));
  }

  /**
   * Gets the closest point on the line segment to the given point.
   * @param p2
   * Point to get closest point for.
   */
  closestPoint(p2: Point): Point {
    const l = new Line(this.p1, this.p2.minus(this.p1));
    const factor = l.projectFactor(p2);
    if (factor >= 1) {
      return this.p2;
    }  if (factor <= 0) {
      return this.p1;
    }
    return l.project(p2);
  }

  /**
   * Returns the point where the given line intersect this line segment, if such
   * point exists. If the line and the line segment are parallel and on the same
   * line, none is returned because there is no one unique point of intersect.
   */
  intersectForLine(l: Line): Optional<Point> {
    const intersect = this.asLine().intersect(l);

    return intersect.filter(p => this.containsPoint(p));
  }

  /**
   * Verifies if the given point is on the line that would be defined by p1 and p2 of this line
   * segment.
   * @param p
   * The point to verify
   */
  onLine(p: Point): boolean {
    const v1 = p.minus(this.p1);
    const v2 = this.p2.minus(this.p1);
    return Math.abs(v1.cross(v2)) < config.precisionSquared;
  }

  /**
   * Returns boolean whether this segment is placed to the right of given point.
   * This is defined as if whether a line segment starting at point p, and going
   * to x = infinity, intersect this line segment.
   * If the point is on the line segment, false is returned,
   * @param p
   * Point to check if line segemnt is to the right of
   * @param intervalType
   * Tells us if endpoints should be part of interval or not.
   */
  rightOfPoint(p: Point, intervalType: IntervalType = IntervalType.OpenEnd) : boolean {
    const heightInterval = this.getHeightInterval(intervalType);
    if (! heightInterval.contains(p.y)) {
      return false;
    }
    // the line is parallel, we make sure that x is < p1.x and p2.x
    if (p.y === this.p1.y && p.y === this.p2.y) {
      return p.x < Math.min(this.p1.x, this.p2.x);
    }
    const [topPoint, bottomPoint] = this.p1.y >= this.p2.y ? [this.p1, this.p2]
      : [this.p2, this.p1];
    return p.minus(topPoint).cross(bottomPoint.minus(topPoint)) >= 0;
  }

  /**
   * Returns new line segment that is like this segment moved.
   * @param x
   * @param y
   */
  translate(x: number, y: number): LineSegment {
    return new LineSegment(this.p1.translate(x, y), this.p2.translate(x, y));
  }

  /**
   * Checks if this line segment is parallel to another line segment.
   * Parallel will also hold true if the line segments overlap,
   * or lie on the same axis. I.e. [0,0] -> [1,0] is deemed parallel to [1,0] -> [2,0]
   * @param other
   * The line segment to do the comparison on.
   */
  parallel(other: LineSegment): boolean {
    const v1 = this.asVector();
    const v2 = other.asVector();

    return Math.abs(v1.cross(v2)) < config.precisionSquared;
  }

  /**
   * Checks if there is any overlapping point between the two line segments.
   * This is like intersect, but returns a boolean and will also return
   * true if the line segments are parallel and share one or more common points.
   */
  overlap(other: LineSegment): boolean {
    const intersect = this.intersect(other).nonEmpty();
    const overlap = intersect
    || other.containsPoint(this.p1)
    || other.containsPoint(this.p2)
    || this.containsPoint(other.p1);
    return overlap;
  }

  /**
   * Gives a string representing this line segment that's readable.
   */
  toString(): string {
    return `(${this.p1.toString()} -> ${this.p2.toString()})`;
  }

  private getHeightInterval(paramIntervalType: IntervalType) : Interval {
    let intervalType = paramIntervalType;
    if (this.p1.y < this.p2.y) {
      return new Interval(this.p1.y, this.p2.y, intervalType);
    }
    if (intervalType === IntervalType.OpenStart) {
      intervalType = IntervalType.OpenEnd;
    } else if (intervalType === IntervalType.OpenEnd) {
      intervalType = IntervalType.OpenStart;
    }
    return new Interval(this.p2.y, this.p1.y, intervalType);
  }

  /**
   * Returns the vector defined by going from point p1 to point p2
   */
  asVector(): Vector {
    return this.p2.minus(this.p1);
  }

  /**
   * Returns the point where the given line segments intersect, if such point exists.
   * If the line segments are parallel none is return since the intersect can potentially
   * be many points.
   * @param ls2
   * The other line segment.
   * @param otherInterval
   * How the endpoints should be interpreted of the other line segment.
   * @param thisInterval
   * How the endpoints should be interpreted on this line segment.
   */
  intersect(ls2: LineSegment, otherInterval: IntervalType = IntervalType.Closed,
            thisInterval: IntervalType = IntervalType.Closed)
    : Optional<Point> {
    const l1 = this.asLine();
    const l2 = ls2.asLine();

    const intersect = l1.intersect(l2);

    return intersect.filter(intersect => this.containsPoint(intersect, thisInterval)
      && ls2.containsPoint(intersect, otherInterval));
  }

  /**
   * Returns a new Line Segment where p1 equals the new p instead.
   * @param p
   */
  startFrom(p: Point) : LineSegment {
    return new LineSegment(p, this.p2);
  }

  /**
   * Return true if the points of this line segment equals the points of the other line segment.
   * @param ls
   * Line segment to compare with.
   */
  equals(ls: LineSegment) : boolean {
    return this.p1.equals(ls.p1) && this.p2.equals(ls.p2);
  }

  /**
   * Returns if the given point exists on this line segment or not.
   * @param p
   */
  containsPoint(p: Point, interval: IntervalType = IntervalType.Closed): boolean {
    const p1p = p.minus(this.p1);
    const p1p2 = this.p2.minus(this.p1);
    const dotProd = p1p.dot(p1p2);
    const crossProd = p1p.cross(p1p2);

    const pointOnSegment = dotProd >= 0
    && dotProd <= p1p2.square() + config.precisionSquared
    && Math.abs(crossProd) < config.precision;

    if (!pointOnSegment) {
      return false;
    }  if (interval === IntervalType.Open) {
      return !p.equals(this.p1) && !p.equals(this.p2) ;
    }  if (interval === IntervalType.OpenEnd) {
      return !p.equals(this.p2);
    }  if (interval === IntervalType.OpenStart) {
      return !p.equals(this.p1);
    }
    return true;
  }

  asLine() : Line {
    return new Line(this.p1, this.p2.minus(this.p1));
  }

  /**
   * Returns a new Line Segment where p1 and p2 have changed places.
   */
  flip(): LineSegment {
    return new LineSegment(this.p2, this.p1);
  }
}

/**
 * Creates a line segment.
 */
export function lineSegment(x1: number, y1: number, x2: number, y2: number): LineSegment {
  return new LineSegment(new Point(x1, y1), new Point(x2, y2));
}