import React from "react";

interface IntensityBarProps {
  intensity: number;
  level: number;
  isActive: boolean;
  nightVision: boolean;
  duskTillDawn: boolean;
  flashing: boolean;
}

const IntensityBar: React.FC<IntensityBarProps> = ({
  intensity,
  level,
  isActive,
  nightVision,
  duskTillDawn,
  flashing,
}) => {
  const opacityLevels: { [key: number]: number } = {
    1: 0.2,
    3: 0.3,
    10: 0.4,
    30: 0.5,
    100: 1.0,
  };

  const opacity = intensity >= level ? opacityLevels[level] : 0;
  const backgroundColor = nightVision
    ? `rgba(173, 216, 230, ${opacity})`
    : `rgba(1, 1, 128, ${opacity})`;

  return (
    <div
      className={`bar ${isActive ? "active" : ""} ${
        duskTillDawn && isActive ? "dusk-till-dawn" : ""
      } ${flashing && isActive ? "flashing" : ""}`}
      style={{ backgroundColor }}
    ></div>
  );
};

export default IntensityBar;
