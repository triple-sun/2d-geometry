import { ErrorMessage } from "./../utils/errors";
import { ShapeName } from "../utils/enums";
import { Shape } from "./shape";
import { POLYGON_SIDES_MIN } from "../utils/const";

/**
 * A class that represents an equal sided polygon
 */
export class Polygon extends Shape {
  /**
   * {@inheritDoc Shape."constructor"}
   *
   * @param dimensions - an array containing polygon side length
   * @param sideCount - polygon side count
   *
   * @throws {@link ErrorMessage.POLYGON_SIDE_COUNT}
   * Is thrown if a polygon is a rectangle (has less than 5 sides)
   *
   * @throws {@link ErrorMessage.NEGATIVE_OR_ZERO}
   * Is thrown if a polygon side length is zero or less
   */
  constructor(
    public side: number,
    public sideCount: number = POLYGON_SIDES_MIN,
    public precision: number = 0
  ) {
    super(precision);

    if (side <= 0) {
      throw ErrorMessage.NEGATIVE_OR_ZERO;
    }

    if (sideCount < POLYGON_SIDES_MIN) {
      throw ErrorMessage.POLYGON_SIDE_COUNT;
    }

    this.precision = precision;
    this.sideCount = sideCount;
    this.side = side;
  }

  /**
   * {@inheritDoc Shape.clone}
   */
  public clone(): Polygon {
    return new Polygon(this.side, this.sideCount, this.precision);
  }

  /**
   * {@inheritDoc Shape.multiply}
   *
   * @param sideCountMultiplier - side count multiplier
   * @param precision - floating point operation precision
   */
  public multiply(
    multiplier: number,
    sideCountMultiplier: number = 1,
    precision: number = this.precision
  ) {
    if (multiplier <= 0 || sideCountMultiplier <= 0) {
      throw ErrorMessage.NEGATIVE_OR_ZERO;
    }

    return new Polygon(
      parseFloat((this.side * multiplier).toFixed(precision)),
      parseFloat((this.sideCount * sideCountMultiplier).toFixed(precision)),
      this.precision
    );
  }

  /**
   * {@inheritDoc Shape.diameter}
   */
  public get diameter() {
    return (
      parseFloat(
        (this.side / Math.sqrt(2 - 2 * Math.cos(360 / this.sideCount))).toFixed(
          this.precision
        )
      ) * 2
    );
  }

  /**
   * {@inheritDoc Shape.area}
   */
  public get area() {
    return parseFloat(
      (
        (this.side * this.side * this.sideCount) /
        (4 * Math.tan(((180 / this.sideCount) * Math.PI) / 180))
      ).toFixed(this.precision)
    );
  }

  /**
   * {@inheritDoc Shape.perimeter}
   */
  public get perimeter() {
    return this.side * this.sideCount;
  }

  /**
   * {@inheritDoc Shape.shape}
   */
  static get shape() {
    return ShapeName.Polygon;
  }
}
