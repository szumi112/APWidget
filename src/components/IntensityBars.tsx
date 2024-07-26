import React from "react";
import IntensityBar from "./IntensityBar";
import { Mode } from "../types/modes";

interface IntensityBarsProps {
  intensity: number;
  modes: Mode;
}

const IntensityBars: React.FC<IntensityBarsProps> = ({ intensity, modes }) => {
  const intensityLevels = [1, 3, 10, 30, 100];

  return (
    <div className="intensity-bars">
      {intensityLevels.map((level, index) => (
        <IntensityBar
          key={index}
          intensity={intensity}
          level={level}
          isActive={intensity >= level}
          nightVision={modes.nightVision}
          duskTillDawn={modes.duskTillDawn}
          flashing={modes.flashing}
        />
      ))}
    </div>
  );
};

export default IntensityBars;
