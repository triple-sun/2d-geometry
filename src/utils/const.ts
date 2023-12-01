import { Circle } from "../shapes/circle";
import { Rectangle } from "../shapes/rectangle";
import { Square } from "../shapes/square";
import { Triangle } from "../shapes/triangle";

export const PRECISION_DEFAULT = 5;
export const POLYGON_SIDES_MIN = 5;

export const shapes = [Circle, Square, Rectangle, Triangle] as const;
