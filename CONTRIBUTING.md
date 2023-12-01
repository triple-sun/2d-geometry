# Contributing to this library

## Adding new shapes

New shapes can be added by extending `Shape` class (`/src/shapes/shape.ts`) and adding a name of an added shape to `ShapeNames` enum (`/src/utils/enums.ts`)

## Adding new error messages

New messages can be added by adding new methods to `ErrorMessage` class in `/src/utils/errors.ts`

## Changing default precision

Default precision is set via `PRECICION_DEFAULT` constant in `/src/utils/const.ts`
