import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { RootState } from "./store";

export interface WidgetState {
  intensity: number;
  modes: {
    nightVision: boolean;
    duskTillDawn: boolean;
    flashing: boolean;
  };
}

const initialState: Record<string, WidgetState> = {};

type ModeKeys = keyof WidgetState["modes"];

const widgetSlice = createSlice({
  name: "widgets",
  initialState,
  reducers: {
    setIntensity(
      state,
      action: PayloadAction<{ id: string; intensity: number }>
    ) {
      if (state[action.payload.id]) {
        state[action.payload.id].intensity = action.payload.intensity;
      } else {
        state[action.payload.id] = {
          intensity: action.payload.intensity,
          modes: { nightVision: false, duskTillDawn: false, flashing: false },
        };
      }
    },
    toggleMode(state, action: PayloadAction<{ id: string; mode: ModeKeys }>) {
      const currentMode = state[action.payload.id]?.modes[action.payload.mode];
      if (state[action.payload.id]) {
        // Reset all modes before toggling the selected one
        state[action.payload.id].modes = {
          nightVision: false,
          duskTillDawn: false,
          flashing: false,
        };
        state[action.payload.id].modes[action.payload.mode] = !currentMode;
      } else {
        state[action.payload.id] = {
          intensity: 0,
          modes: { nightVision: false, duskTillDawn: false, flashing: false },
        };
        state[action.payload.id].modes[action.payload.mode] = true;
      }
    },
    setModeState(
      state,
      action: PayloadAction<{ id: string; modes: WidgetState["modes"] }>
    ) {
      const { id, modes } = action.payload;
      if (state[id]) {
        state[id].modes = modes;
      } else {
        state[id] = {
          intensity: 0,
          modes,
        };
      }
    },
    resetModes(state, action: PayloadAction<{ id: string }>) {
      if (state[action.payload.id]) {
        state[action.payload.id].modes = {
          nightVision: false,
          duskTillDawn: false,
          flashing: false,
        };
      }
    },
  },
});

export const { setIntensity, toggleMode, resetModes, setModeState } =
  widgetSlice.actions;

const selectWidgets = (state: RootState) => state.widgets;

export const selectIntensity = createSelector(
  [selectWidgets, (_: RootState, id: string) => id],
  (widgets, id) => widgets[id]?.intensity || 0
);

export const selectModes = createSelector(
  [selectWidgets, (_: RootState, id: string) => id],
  (widgets, id) =>
    widgets[id]?.modes || {
      nightVision: false,
      duskTillDawn: false,
      flashing: false,
    }
);

export default widgetSlice.reducer;
