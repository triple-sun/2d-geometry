import { shapes } from "./utils/const";
import { ShapeName } from "./utils/enums";

/**
 * Geometry object
 */
const Geometry: Record<ShapeName, (typeof shapes)[number]> = Object.fromEntries(
  new Map(shapes.map((shape) => [shape.shape, shape]))
);

export default Geometry;
