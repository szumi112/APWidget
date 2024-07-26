import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setIntensity, setModeState } from "../redux/widgetSlice";

export const fetchWidgetState = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        brightness: 20, //%
        timeLeft: 12, //h
        nightVision: false,
        duskTillDawn: true,
        flashing: false,
      });
    }, 2000);
  });
};

const useWidgetState = (
  id: string,
  setTimeLeft: (time: string) => void,
  setConfirmationReceived: (status: boolean) => void,
  initialFetchCompleted: React.MutableRefObject<boolean>,
  confirmationTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>
) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDataWithTimeout = async () => {
      // overwrite data if the response from API takes 5 seconds or longer
      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            brightness: 0, //%
            timeLeft: 24, //h
            nightVision: false,
            duskTillDawn: false,
            flashing: true,
          });
        }, 5000);
      });

      const state: any = await Promise.race([
        fetchWidgetState(),
        timeoutPromise,
      ]);

      if (confirmationTimeoutRef.current) {
        clearTimeout(confirmationTimeoutRef.current);
      }
      dispatch(setIntensity({ id, intensity: state.brightness }));
      setTimeLeft(`${state.timeLeft} hours`);
      setConfirmationReceived(true);

      dispatch(
        setModeState({
          id,
          modes: {
            nightVision: state.nightVision,
            duskTillDawn: state.duskTillDawn,
            flashing: state.flashing,
          },
        })
      );

      initialFetchCompleted.current = true;
    };

    fetchDataWithTimeout();
  }, [
    dispatch,
    id,
    setTimeLeft,
    setConfirmationReceived,
    initialFetchCompleted,
    confirmationTimeoutRef,
  ]);
};

export default useWidgetState;
