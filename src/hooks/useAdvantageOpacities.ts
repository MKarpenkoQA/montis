import { useTransform, type MotionValue } from "motion/react";

const ADVANTAGE_RANGES: [number, number][] = [
  [0.16, 0.24],
  [0.24, 0.32],
  [0.32, 0.4],
  [0.4, 0.48],
];

export const useAdvantageOpacities = (maxScrollProgress: MotionValue<number>) => {
  const opacity0 = useTransform(maxScrollProgress, ADVANTAGE_RANGES[0], [0, 1]);
  const opacity1 = useTransform(maxScrollProgress, ADVANTAGE_RANGES[1], [0, 1]);
  const opacity2 = useTransform(maxScrollProgress, ADVANTAGE_RANGES[2], [0, 1]);
  const opacity3 = useTransform(maxScrollProgress, ADVANTAGE_RANGES[3], [0, 1]);
  return [opacity0, opacity1, opacity2, opacity3] as const;
};
