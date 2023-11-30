import config from "../config";
import { Point } from "../primitives/point";

/**
 * Represents a 2 dimensional vector.
 */
export class Vector {
  /**
   * Constructs a vector.
   *
   * @param w
   * This is the third component in the vector. This component is used when
   * for example performing transformations. Then a matrix multiplication might
   * result in the w component becoming not equal to 1. In this case one should
   * normalize the vector so that w becomes one again to have a valid vector.
   *
   * Why does this happen with matrix multiplications? Well most often it doesn't,
   * for example translate operations or rotations don't cause this. But if you use
   * Skew operations, this is might happen. I'd need to read up on it more myself
   * to have a better answer.
   */
  constructor(public x: number, public y: number, public w?: number) {
    if (this.w === undefined) {
      this.w = 1;
    }
  }

  static fromArray(a: number[]) {
    return new Vector(a[0], a[1], a[2]);
  }

  static null = new Vector(0, 0);

  /**
   * Gives the dot product between the two vectors.
   * @param v2
   */
  dot(v2: Vector): number {
    return this.x * v2.x + this.y * v2.y;
  }

  /**
   * Returns this vector as an array of numbers as [x, y, w]
   */
  asArray(): number[] {
    return [this.x, this.y, this.w as number];
  }

  /**
   * Returns a point with the same x and y as this vector.
   */
  asPoint(): Point {
    return new Point(this.x, this.y);
  }

  /**
   * Return true if this vector is pointing in the same direction
   * as the other vector.
   */
  parallel(other: Vector): boolean {
    return Math.abs(this.cross(other)) <= config.precisionSquared;
  }

  /**
   * Returns the scalar value of the cross product between this vector and v2.
   * Normally cross product is performed in three dimensions, but here we assume
   * z value equals 0, and returns then the size of the resulting z dimension.
   * @param v2
   */
  cross(v2: Vector): number {
    return this.x * v2.y - this.y * v2.x;
  }

  /**
   * Returns the perpendicular component vector of this vector compared to another vector.
   */
  perpendicularComponentTo(other: Vector): Vector {
    if (other.isNullVector()) {
      return this;
    }
    const projectedOnto = this.projectOnto(other);
    return this.minus(projectedOnto);
  }

  /**
   * Returns this vector projected onto the other vector.
   */
  projectOnto(other: Vector): Vector {
    if (other.isNullVector()) {
      return this;
    }
    const otherNormed = other.normed();
    const factor = this.dot(otherNormed);
    return otherNormed.scale(factor);
  }

  /**
   * Returns this vector in string form.
   */
  toString(): String {
    return `[${this.x}, ${this.y}]`;
  }

  /**
   * Returns the clockwise perpendicular vector to this one.
   * A perpendicular vector can be found by defining a vector where
   * the dot product equals 0. Now, there will be two perpendicular vectors,
   * one that is defined clockwise, and one that is found counter clockwise.
   */
  clockwisePerpendicular(): Vector {
    return new Vector(this.y, -this.x);
  }

  /**
   * Returns a vector pointing in the opposite direction of this vector.
   */
  reverse(): Vector {
    return new Vector(-this.x, -this.y);
  }

  /**
   * Returns a vector that is normalized to have norm2 = 1, pointing in the same
   * direction as this vector.
   */
  normed(): Vector {
    const norm2 = this.norm2();
    if (norm2 === 0) {
      throw Error("Can not norm a vector of size 0!");
    }
    return new Vector(this.x / norm2, this.y / norm2);
  }

  /**
   * Returns a new vector that is this vector multiplied by the given scalar.
   * @param factor
   */
  scale(factor: number): Vector {
    return new Vector(this.x * factor, this.y * factor);
  }

  /**
   * This vector dot producted with itself.
   */
  square(): number {
    return this.dot(this);
  }

  /**
   * Returns whether this vector is the null vector (x and y components are null) or not.
   */
  isNullVector(): boolean {
    return this.x === 0 && this.y === 0;
  }

  /**
   * The euclidean length of this vector.
   */
  norm2(): number {
    return Math.sqrt(this.square());
  }

  /**
   * Returns the vector that is this vector plus another one.
   */
  plus(other: Vector): Vector {
    return vector(this.x + other.x, this.y + other.y);
  }

  /**
   * Returns this vector minus the other vector.
   */
  minus(other: Vector): Vector {
    return this.plus(other.reverse());
  }
}

/**
 * Creates a vector
 */
export function vector(x: number, y: number) {
  return new Vector(x, y);
}
