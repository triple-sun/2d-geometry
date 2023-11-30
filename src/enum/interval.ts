/**
 * Enum that defines how to interpret the interval of a line segment.
 * It can either be Closed, meaning that endpoints are included [p1, p2]
 * OpenStart meaning half open, start is excluded (p1, p2]
 * OpenEnd meaning half open, end is excluded [p1, p2)
 * or Open meaning that start and end are excluded (p1, p2).
 */

export enum IntervalType {
  Closed = 1,
  OpenStart = 1 << 1,
  OpenEnd = 1 << 2,
  Open = OpenStart | OpenEnd,
}
