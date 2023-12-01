import { PRECISION_DEFAULT } from "../utils/const";
import { ShapeName } from "../utils/enums";
import { ErrorMessage } from "../utils/errors";
import { Shape } from "./shape";

/**
 * A class that represents a circle
 */
export class Circle extends Shape {
  /**
   * {@inheritDoc Shape."constructor"}
   * @param dimensions - an array containing circle radius
   *
   * @throws {@link ErrorMessage.NEGATIVE_OR_ZERO}
   * Is thrown if radius is zero or less
   *
   */
  constructor(
    public radius: number,
    public precision: number = PRECISION_DEFAULT
  ) {
    super(precision);

    if (radius <= 0) {
      throw ErrorMessage.NEGATIVE_OR_ZERO;
    }

    this.radius = radius;
  }

  /**
   * {@inheritDoc Shape.clone}
   */
  public clone() {
    return new Circle(this.radius, this.precision);
  }

  /**
   * {@inheritDoc Shape.multiply}
   */
  public multiply(multiplier: number, precision: number = this.precision) {
    const radius = parseFloat((this.radius * multiplier).toFixed(precision));
    return new Circle(radius, precision);
  }

  /**
   * {@inheritDoc Shape.area}
   */
  public get area() {
    return parseFloat(
      (Math.PI * this.radius * this.radius).toFixed(this.precision)
    );
  }

  /**
   * {@inheritDoc Shape.diameter}
   */
  public get diameter() {
    return this.radius * 2;
  }

  /**
   * {@inheritDoc Shape.perimeter}
   */
  public get perimeter() {
    return parseFloat((this.radius * 2 * Math.PI).toFixed(this.precision));
  }

  /**
   * {@inheritDoc Shape.shape}
   */
  static get shape() {
    return ShapeName.Circle;
  }
}
