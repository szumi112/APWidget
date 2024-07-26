import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  setIntensity,
  toggleMode,
  resetModes,
  selectIntensity,
  selectModes,
} from "../redux/widgetSlice";
import "../styles/widget.css";
import useWidgetState from "../hooks/useWidgetState";
import ModeButtons from "./ModeButtons";

interface WidgetProps {
  id: string;
}

const Widget: React.FC<WidgetProps> = ({ id }) => {
  const dispatch = useDispatch();
  const intensity = useSelector((state: RootState) =>
    selectIntensity(state, id)
  );
  const modes = useSelector((state: RootState) => selectModes(state, id));
  const [timeLeft, setTimeLeft] = useState<string>("N/A");
  const [prevIntensity, setPrevIntensity] = useState<number>(intensity);
  const [confirmationReceived, setConfirmationReceived] =
    useState<boolean>(false);
  const initialFetchCompleted = useRef<boolean>(false);
  const confirmationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useWidgetState(
    id,
    setTimeLeft,
    setConfirmationReceived,
    initialFetchCompleted,
    confirmationTimeoutRef
  );

  const intensityLevels = [1, 3, 10, 30, 100] as const;
  type IntensityLevel = (typeof intensityLevels)[number];
  const opacityLevels: Record<IntensityLevel, number> = {
    1: 0.2,
    3: 0.3,
    10: 0.4,
    30: 0.5,
    100: 1.0,
  };

  const handleIncrease = () => {
    const nextLevel = intensityLevels.find((level) => level > intensity);
    const newIntensity = nextLevel !== undefined ? nextLevel : 100;
    console.log(`Increasing intensity to ${newIntensity}`);
    dispatch(setIntensity({ id, intensity: newIntensity }));
    sendDataToBackend();
  };

  const handleDecrease = () => {
    const previousLevel = [...intensityLevels]
      .reverse()
      .find((level) => level < intensity);
    const newIntensity = previousLevel !== undefined ? previousLevel : 0;
    console.log(`Decreasing intensity to ${newIntensity}`);
    dispatch(setIntensity({ id, intensity: newIntensity }));
    sendDataToBackend();
  };

  const handleModeToggle = (
    mode: "nightVision" | "duskTillDawn" | "flashing"
  ) => {
    if (intensity > 0) {
      console.log(`Toggling mode: ${mode}`);
      dispatch(toggleMode({ id, mode }));
      sendDataToBackend();
    }
  };

  const sendDataToBackend = () => {
    if (!initialFetchCompleted.current) {
      setConfirmationReceived(false);
      if (confirmationTimeoutRef.current)
        clearTimeout(confirmationTimeoutRef.current);

      confirmationTimeoutRef.current = setTimeout(() => {
        if (!confirmationReceived) {
          handleModeToggle("flashing");
          dispatch(setIntensity({ id, intensity: 0 }));
          setTimeLeft("N/A");
        }
      }, 5000);
    }
  };

  useEffect(() => {
    if (intensity === 100) {
      setTimeLeft("Less than 1 hour");
    } else if (intensity >= 30) {
      setTimeLeft("12 hours");
    } else {
      setTimeLeft("24 hours");
    }

    if (intensity === 0 && prevIntensity !== 0) {
      dispatch(resetModes({ id }));
    }

    setPrevIntensity(intensity);
  }, [intensity, prevIntensity, dispatch, id]);

  const getBarClassName = (index: number) => {
    const level = intensityLevels[index];
    let className = intensity >= level ? "bar active" : "bar";
    if (modes.duskTillDawn) {
      className += " dusk-till-dawn";
    }
    if (modes.flashing) {
      className += " flashing";
    }
    return className;
  };

  const getBarStyle = (index: number) => {
    const level = intensityLevels[index];
    const opacity = intensity >= level ? opacityLevels[level] : 0;
    return {
      backgroundColor: `rgba(${
        modes.nightVision ? "255, 255, 255" : "1, 1, 128"
      }, ${modes.nightVision && intensity !== 0 ? opacity + 0.25 : opacity})`,
    };
  };

  const getBatteryLevel = () => {
    let powerConsumption;

    switch (true) {
      case intensity === 0:
        powerConsumption = 0;
        break;
      case intensity > 0 && intensity <= 1:
        powerConsumption = 5;
        break;
      case intensity > 1 && intensity <= 3:
        powerConsumption = 10;
        break;
      case intensity > 3 && intensity <= 10:
        powerConsumption = 12.5;
        break;
      case intensity > 10 && intensity <= 20:
        powerConsumption = 20;
        break;
      case intensity > 20 && intensity <= 30:
        powerConsumption = 30;
        break;
      case intensity > 30 && intensity <= 60:
        powerConsumption = 55;
        break;
      case intensity > 60 && intensity <= 80:
        powerConsumption = 75;
        break;
      case intensity > 80 && intensity <= 90:
        powerConsumption = 85;
        break;
      case intensity > 90:
        powerConsumption = 90;
        break;
      default:
        powerConsumption = 0;
    }

    if (modes.nightVision || modes.duskTillDawn || modes.flashing) {
      powerConsumption += 10;
    }

    return powerConsumption;
  };

  return (
    <div className="widget">
      <div className="header">
        {id}
        <div className="intensity-bars">
          {intensityLevels.map((_, index) => (
            <div
              key={index}
              className={getBarClassName(index)}
              style={getBarStyle(index)}
            ></div>
          ))}
        </div>
      </div>
      <div className="time-left">Time left: {timeLeft}</div>
      <div className="controls">
        <button onClick={handleDecrease} className="powerButton">
          -
        </button>
        <div className="intensity">{intensity}%</div>
        <button onClick={handleIncrease} className="powerButton">
          +
        </button>
      </div>

      <div className="modes">
        <ModeButtons
          modes={modes}
          handleModeToggle={handleModeToggle}
          intensity={intensity}
        />
      </div>
      <>
        {getBatteryLevel() > 0
          ? `Power Consumption: ${getBatteryLevel()}%`
          : "No Power Consumption"}
        <div className="battery">
          <div className="battery-body">
            <div
              className="battery-level"
              style={{ width: `${getBatteryLevel()}%` }}
            ></div>
          </div>
          <div className="battery-head"></div>
        </div>
      </>
    </div>
  );
};

export default Widget;
