import { ErrorMessage } from "./../utils/errors";
import { ShapeName } from "../utils/enums";

/**
 * Basic class representing a 2-dimensional geometric shape
 */
export abstract class Shape {
  /**
   * @param precision - floating point operation precision
   */
  constructor(public precision: number) {
    this.precision = precision;
  }

  /**
   * @returns a clone of current instance
   */
  public clone() {}

  /**
   * Multiplies each shape dimension by a number
   * @param multiplier - multiplier
   * @param dimensions - shape dimension array
   * @returns shape dimensions multiplied by a number
   *
   * @throws {@link ErrorMessage.NEGATIVE_OR_ZERO}
   * Is thrown if called when mutiplier or any dimension is zero or less
   *
   * @throws {@link ErrorMessage.CANNOT_INVOKE_ABSTRACT_METHOD}
   * Is thrown if called when shape has no such method
   */
  public multiply(multiplier: number): void | Shape {
    if (multiplier <= 0) {
      throw ErrorMessage.NEGATIVE_OR_ZERO;
    }
    throw ErrorMessage.CANNOT_INVOKE_ABSTRACT_METHOD;
  }

  /**
   * Calculates the area a shape
   * @returns shape area
   *
   * @throws {@link ErrorMessage.CANNOT_INVOKE_ABSTRACT_METHOD}
   * Is thrown if called when an instance has no such method
   */
  public get area(): void | number {
    throw ErrorMessage.CANNOT_INVOKE_ABSTRACT_METHOD;
  }

  /**
   * Calculates the diameter of a circle or a circumcircle
   * @returns circle diameter
   *
   * @throws {@link ErrorMessage.CANNOT_INVOKE_ABSTRACT_METHOD}
   * Is thrown when an instance has no such method
   */
  public get diameter(): number | void {
    throw ErrorMessage.CANNOT_INVOKE_ABSTRACT_METHOD;
  }

  /**
   * Calculates the perimeter of a shape
   * @returns shape perimeter
   *
   * @throws {@link ErrorMessage.CANNOT_INVOKE_ABSTRACT_METHOD}
   * Is thrown if called when an instance has no such method
   */
  public get perimeter(): void | number {
    throw ErrorMessage.CANNOT_INVOKE_ABSTRACT_METHOD;
  }

  /**
   * Returns a {@link ShapeName} for current instance
   * @returns shape of an instance
   *
   * @throws {@link ErrorMessage.NO_NAME}
   * Is thrown if called for a basic {@link Shape} class
   */
  static get shape(): void | ShapeName {
    throw ErrorMessage.NO_NAME;
  }
}
