import { IntervalType } from "../enum/interval";

/**
 * Represents the interval between two number,
 * The interval can be either open, closed, or half closed, ie.
 * either including or excluding the endpoint values
 */
export class Interval {
  private includeMin: boolean;
  private includeMax: boolean;

  /**
   * Creates a new interval.
   * @param min
   * The minimum endpoint of the interval
   * @param max
   * The maximum endpoint of the interval.
   * @param includeMin
   * If the min value is included in the interval.
   * @param includeMax
   * If the max value is included in the interval.
   */
  constructor(
    public min: number,
    public max: number,
    public intervalType: IntervalType = IntervalType.Closed
  ) {
    if (min === max) {
      this.includeMin = intervalType !== IntervalType.Open;
      this.includeMax = intervalType !== IntervalType.Open;
    } else {
      this.includeMin = (intervalType & IntervalType.OpenStart) === 0;
      this.includeMax = (intervalType & IntervalType.OpenEnd) === 0;
    }
  }

  /**
   * Checks if the given value is contained in the interval or not.
   * @param val
   * Value to check if it is contained.
   */
  contains(val: number): boolean {
    return (
      (this.includeMin ? this.min <= val : this.min < val) &&
      (this.includeMax ? this.max >= val : this.max > val)
    );
  }
}
