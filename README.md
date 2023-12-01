geometry
============

A library for creation and manipulation of basic 2-dimensional geometric shapes

## Install

```
npm install @triplesun/geometry
```

## Usage

### `const { Shape } = Geometry`

- `Shape` is a class that creates a shape based on required dimesions
**Returns** shape that has methods `.clone() .multiply() .area .diameter .perimeter`

- `.clone()` and `.multiply()` return new shape instance based on an existing one
- `.area`, `.diameter` and `.perimeter` calculate an area, diameter and perimeter of a shape
- any shape constructor also accepts floating point decimals limit as a last argument

## Example

```js
import {Circle, Polygon, Rectangle, Square, Triangle}  from '@triplesun/geometry'

const circle = new Circle(123, 0)
console.log(circle.area);
```

Output:

```js
47529
```
