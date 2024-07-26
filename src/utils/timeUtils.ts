export const formatTimeLeft = (intensity: number): string => {
  const baseBatteryLife = 24;
  const intensityLevels: { [key: number]: number } = {
    1: baseBatteryLife,
    3: baseBatteryLife / 1.5,
    10: baseBatteryLife / 2.5,
    20: baseBatteryLife / 3,
    30: baseBatteryLife / 4,
    50: baseBatteryLife / 6,
    100: baseBatteryLife / 24,
  };

  if (intensityLevels[intensity]) {
    return `${Math.floor(intensityLevels[intensity])} hours`;
  }

  const closestLowerIntensity = Object.keys(intensityLevels)
    .map(Number)
    .filter((level) => level < intensity)
    .pop();

  const closestHigherIntensity = Object.keys(intensityLevels)
    .map(Number)
    .find((level) => level > intensity);

  if (
    closestLowerIntensity !== undefined &&
    closestHigherIntensity !== undefined
  ) {
    const lowerTime = intensityLevels[closestLowerIntensity];
    const higherTime = intensityLevels[closestHigherIntensity];

    const interpolatedTime =
      lowerTime +
      ((higherTime - lowerTime) * (intensity - closestLowerIntensity)) /
        (closestHigherIntensity - closestLowerIntensity);
    return `${Math.floor(interpolatedTime)} hours`;
  }

  if (closestLowerIntensity !== undefined) {
    return `${Math.floor(intensityLevels[closestLowerIntensity])} hours`;
  }

  return "N/A";
};
