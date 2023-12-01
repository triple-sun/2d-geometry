export const validateTriangle = (s1: number, s2: number, s3: number) =>
  s1 + s2 > s3 && s1 + s3 > s2 && s2 + s3 > s1;
