import React from "react";
import { formatModeName } from "../utils/formatModeName";

interface ModeButtonProps {
  mode: "nightVision" | "duskTillDawn" | "flashing";
  isActive: boolean;
  intensity: number;
  onToggle: (mode: "nightVision" | "duskTillDawn" | "flashing") => void;
}

const ModeButton: React.FC<ModeButtonProps> = ({
  mode,
  isActive,
  intensity,
  onToggle,
}) => {
  return (
    <div className={`mode-button-container ${isActive ? "active" : ""}`}>
      <span>{formatModeName(mode)}</span>
      <label className="switch">
        <input
          type="checkbox"
          checked={isActive}
          onChange={() => onToggle(mode)}
          disabled={intensity === 0}
        />
        <span className="slider round"></span>
        {intensity === 0 && (
          <div className="tooltip">
            Please increase intensity to turn (by pressing the + button) on the
            effect.
          </div>
        )}
      </label>
    </div>
  );
};

export default ModeButton;
