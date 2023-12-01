import { validateTriangle } from "./../utils/utils";
import { ErrorMessage } from "./../utils/errors";
import { PRECISION_DEFAULT } from "../utils/const";
import { ShapeName } from "../utils/enums";
import { Shape } from "./shape";

/**
 * A class that represents a triangle
 */
export class Triangle extends Shape {
  /**
   * {@inheritDoc Shape."constructor"}
   *
   * @param side1 - side 1 length
   * @param side2 - side 2 length
   * @param side2 - side 3 length
   *
   * @throws {@link ErrorMessage.NEGATIVE_OR_ZERO}
   * Is thrown if any of the sides is negative or zero
   *
   * @throws {@link ErrorMessage.NEGATIVE_OR_ZERO}
   * Is thrown if the longest side is too long
   */
  constructor(
    public side1: number,
    public side2: number,
    public side3: number,
    public precision: number = PRECISION_DEFAULT
  ) {
    super(precision);

    if (side1 <= 0 || side2 <= 0 || side3 <= 0) {
      throw ErrorMessage.NEGATIVE_OR_ZERO;
    }

    if (!validateTriangle(side1, side2, side3)) {
      throw ErrorMessage.TRIANGLE_SIDES;
    }

    this.side1 = side1;
    this.side2 = side2;
    this.side3 = side3;
  }

  /**
   * {@inheritDoc Shape.clone}
   */
  public clone(): Triangle {
    return new Triangle(this.side1, this.side2, this.side3, this.precision);
  }

  /**
   * {@inheritDoc Shape.multiply}
   *
   * @throws {@link ErrorMessage.NEGATIVE_OR_ZERO}
   * Is thrown if multiplier is zero or less
   *
   */
  public multiply(multiplier: number, precision: number = this.precision) {
    const [s1, s2, s3] = [this.side1, this.side2, this.side3].map(
      (d) => d * multiplier
    );
    return new Triangle(s1, s2, s3, precision);
  }

  /**
   * {@inheritDoc Shape.area}
   */
  public get area(): number {
    const semi = this.perimeter / 2;
    return parseFloat(
      Math.sqrt(
        semi * (semi - this.side1) * (semi - this.side2) * (semi - this.side3)
      ).toFixed(this.precision)
    );
  }

  /**
   * {@inheritDoc Shape.diameter}
   */
  public get diameter() {
    return Math.max(this.side1, this.side2, this.side3);
  }

  /**
   * {@inheritDoc Shape.perimeter}
   */
  public get perimeter() {
    return parseFloat(
      (this.side1 + this.side2 + this.side3).toFixed(this.precision)
    );
  }

  /**
   * {@inheritDoc Shape.shape}
   */
  static get shape() {
    return ShapeName.Triangle;
  }
}
