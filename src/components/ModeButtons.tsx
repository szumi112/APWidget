import React from "react";
import ModeButton from "./ModeButton";
import { Mode } from "../types/modes";

interface ModeButtonsProps {
  modes: Mode;
  intensity: number;
  handleModeToggle: (mode: "nightVision" | "duskTillDawn" | "flashing") => void;
}

const ModeButtons: React.FC<ModeButtonsProps> = ({
  modes,
  intensity,
  handleModeToggle,
}) => {
  return (
    <div className="modes">
      <ModeButton
        mode="nightVision"
        isActive={modes.nightVision}
        intensity={intensity}
        onToggle={handleModeToggle}
      />
      <ModeButton
        mode="duskTillDawn"
        isActive={modes.duskTillDawn}
        intensity={intensity}
        onToggle={handleModeToggle}
      />
      <ModeButton
        mode="flashing"
        isActive={modes.flashing}
        intensity={intensity}
        onToggle={handleModeToggle}
      />
    </div>
  );
};

export default ModeButtons;
