import { PRECISION_DEFAULT } from "../utils/const";
import { ShapeName } from "../utils/enums";
import { ErrorMessage } from "../utils/errors";
import { Rectangle } from "./rectangle";

export class Square extends Rectangle {
  /**
   * {@inheritDoc Shape."constructor"}
   *
   * @param length - Square side length
   * @param precision - floating point op precision
   *
   * @throws {@link ErrorMessage.NEGATIVE_OR_ZERO}
   * Is thrown if length is zero or less
   */
  constructor(
    public length: number,
    public precision: number = PRECISION_DEFAULT
  ) {
    super(length, length);

    if (length <= 0) {
      throw ErrorMessage.NEGATIVE_OR_ZERO;
    }

    this.length = length;
  }

  /**
   * {@inheritDoc Shape.clone}
   */
  public clone() {
    return new Square(this.length);
  }

  /**
   * {@inheritDoc Shape.shape}
   */
  static get shape() {
    return ShapeName.Square;
  }
}
