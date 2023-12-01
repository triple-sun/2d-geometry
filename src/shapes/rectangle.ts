import { ErrorMessage } from "./../utils/errors";
import { ShapeName } from "../utils/enums";
import { Shape } from "./shape";
import { Triangle } from "./triangle";

/**
 * A Class that represents a Rectangle
 */
export class Rectangle extends Shape {
  /**
   * {@inheritDoc Shape."constructor"}
   * @param length - rectangle length
   * @param width - rectangle width
   *
   * @throws {@link ErrorMessage.NEGATIVE_OR_ZERO}
   * Is thrown if width or length is negative or zero
   */
  constructor(
    public length: number,
    public width: number,
    public precision: number = 5
  ) {
    super(precision);

    if (length <= 0 || width <= 0) {
      throw ErrorMessage.NEGATIVE_OR_ZERO;
    }
    this.width = width;
    this.length = length;
  }

  /**
   * {@inheritDoc Shape.clone}
   */
  public clone() {
    return new Rectangle(this.length, this.width, this.precision);
  }

  /**
   * {@inheritDoc Shape.multiply}
   *
   * @throws {@link ErrorMessage.NEGATIVE_OR_ZERO}
   * Is thrown if multiplier is zero or less
   */
  public multiply(multiplier: number, precision: number = this.precision) {
    if (multiplier <= 0) {
      throw ErrorMessage.NEGATIVE_OR_ZERO;
    }

    return new Rectangle(
      parseFloat((this.length * multiplier).toFixed(precision)),
      parseFloat((this.width * multiplier).toFixed(precision)),
      precision
    );
  }

  public toTriangle() {
    return new Triangle(
      this.length,
      this.width,
      parseFloat(Math.hypot(this.length, this.width).toFixed(this.precision)),
      this.precision
    );
  }

  /**
   * {@inheritDoc Shape.area}
   */
  public get area() {
    return parseFloat((this.length * this.width).toFixed(this.precision));
  }

  /**
   * {@inheritDoc Shape.diameter}
   */
  public get diameter() {
    return parseFloat(
      (
        Math.sqrt(Math.pow(this.width, 2) + Math.pow(this.length, 2)) / 2
      ).toFixed(this.precision)
    );
  }

  /**
   * {@inheritDoc Shape.perimeter}
   */
  public get perimeter() {
    return this.length * 2 + this.width * 2;
  }

  static getName() {
    return ShapeName.Rectangle;
  }
}
