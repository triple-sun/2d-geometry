export class ErrorMessage {
  static get ILLEGAL_PARAMETERS(): ReferenceError {
    return new ReferenceError("Illegal Parameters");
  }

  static get CANNOT_INVOKE_ABSTRACT_METHOD() {
    return new Error("Abstract method cannot be invoked");
  }

  static get NO_NAME() {
    return new Error("An abstract class 'Shape' does not have a name");
  }

  static get POLYGON_SIDE_COUNT() {
    return new Error("A polygon should have more than 4 sides");
  }

  static get NEGATIVE_OR_ZERO() {
    return new Error(`Dimensions and multipliers should not be zero or less`);
  }
}
