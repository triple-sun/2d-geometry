import { Point } from "../primitives/point";

export type TGeometryOptions = {
    tolerance?: number;
    decimals?:  number;
}

export type T2Axis = {
    x: number;
    y: number;
}

export type T2Points {
    start: Point;
    end: Point;
}