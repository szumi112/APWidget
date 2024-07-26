import React from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { Provider } from "react-redux";
import "@testing-library/jest-dom/vitest";
import App from "../components/App";
import store from "../redux/store";
import { describe, it, expect } from "vitest";

describe("App Component", () => {
  it("displays specific text on the page", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    const hoursText = screen.queryAllByText(/24 hours/i);
    expect(hoursText.length).toBeGreaterThan(0);

    const percentText = screen.queryAllByText(/0%/i);
    expect(percentText.length).toBeGreaterThan(0);
  });

  it("checks widget bars for 'active' class", () => {
    const { container } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    const widgets = container.querySelectorAll("div.widget");

    expect(widgets.length).toBeGreaterThanOrEqual(8);

    widgets.forEach((widget) => {
      const bars = widget.querySelectorAll("div.bar");
      bars.forEach((bar) => {
        expect(bar).not.toHaveClass("active");
      });
    });
  });

  it("clicks the first plus button, then the minus button, and checks for updated text", async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    const plusButtons = screen.getAllByText("+");

    if (plusButtons.length > 0) {
      fireEvent.click(plusButtons[0]);
      fireEvent.click(plusButtons[0]);
    } else {
      throw new Error("No plus buttons found");
    }

    const changeIntensityTo3 = await waitFor(() =>
      screen.queryAllByText(/3%/i)
    );
    expect(changeIntensityTo3.length).toBeGreaterThan(0);

    const minusButtons = screen.getAllByText("-");

    if (minusButtons.length > 0) {
      fireEvent.click(minusButtons[0]);
    } else {
      throw new Error("No minus buttons found");
    }

    const changeIntensityTo1 = await waitFor(() =>
      screen.queryAllByText(/1%/i)
    );
    expect(changeIntensityTo1.length).toBeGreaterThan(0);
  });

  it("reflect fetching data from the API after 2 seconds", async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    await new Promise((resolve) => setTimeout(resolve, 2000));

    await waitFor(() => {
      const updatedTextElements = screen.queryAllByText(
        /Less than 1 hour|12 hours|24 hours/i
      );
      expect(updatedTextElements.length).toBeGreaterThan(0);
    });
  });

  it("verifies intensity value changes after fetching data and clicking buttons", async () => {
    const { container } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const firstWidget = container.querySelector("div.widget");
    const initialIntensityElement = firstWidget?.querySelector("div.intensity");
    const initialIntensity = initialIntensityElement?.textContent;

    const plusButtons = container.querySelectorAll("button");
    const plusButton = Array.from(plusButtons).find(
      (btn) => btn.textContent === "+"
    );

    if (plusButton) {
      fireEvent.click(plusButton);
    } else {
      throw new Error("No plus buttons found");
    }

    const newIntensityElement = await waitFor(() =>
      container.querySelector("div.intensity")
    );
    const newIntensity = newIntensityElement?.textContent;
    expect(newIntensity).not.toBe(initialIntensity);

    const minusButtons = container.querySelectorAll("button");
    const minusButton = Array.from(minusButtons).find(
      (btn) => btn.textContent === "-"
    );

    if (minusButton) {
      fireEvent.click(minusButton);
    } else {
      throw new Error("No minus buttons found");
    }
    const revertedIntensityElement = await waitFor(() =>
      container.querySelector("div.intensity")
    );
    const revertedIntensity = revertedIntensityElement?.textContent;
    expect(revertedIntensity).not.toBe(initialIntensity);
  });
});

describe("Special Modes Activation for the First Widget", () => {
  it("toggles Night Vision mode correctly ", async () => {
    const { container } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    const plusButtons = container.querySelectorAll("button");
    const plusButton = Array.from(plusButtons).find(
      (btn) => btn.textContent === "+"
    );

    if (plusButton) {
      fireEvent.click(plusButton);
    } else {
      throw new Error("No plus buttons found");
    }

    const firstWidget = document.querySelector(".widget") as HTMLElement;
    const nightVisionButtonContainer = within(firstWidget!)
      .getByText("Night Vision")
      .closest(".mode-button-container");
    const nightVisionSwitch =
      nightVisionButtonContainer!.querySelector("label.switch");

    fireEvent.click(nightVisionSwitch!);

    await waitFor(() => {
      const activeBar = firstWidget.querySelector("div.bar.active");
      const style = getComputedStyle(activeBar!);
      expect(style.backgroundColor).toBe("rgba(255, 255, 255, 0.45)");
    });

    fireEvent.click(nightVisionSwitch!);

    await waitFor(() => {
      const activeBar = firstWidget.querySelector("div.bar.active");
      const style = getComputedStyle(activeBar!);
      expect(style.backgroundColor).not.toBe("rgba(255, 255, 255, 0.45)");
    });
  });

  it("toggles Dusk Till Dawn mode correctly", async () => {
    const { container } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    const plusButtons = container.querySelectorAll("button");
    const plusButton = Array.from(plusButtons).find(
      (btn) => btn.textContent === "+"
    );

    if (plusButton) {
      fireEvent.click(plusButton);
    } else {
      throw new Error("No plus buttons found");
    }

    const firstWidget = document.querySelector(".widget") as HTMLElement;
    const duskTillDawnButtonContainer = within(firstWidget!)
      .getByText("Dusk Till Dawn")
      .closest(".mode-button-container");
    const duskTillDawnSwitch =
      duskTillDawnButtonContainer!.querySelector("label.switch");

    fireEvent.click(duskTillDawnSwitch!);

    await waitFor(() => {
      const activeBar = firstWidget.querySelector("div.bar.active");
      expect(activeBar).toHaveClass("dusk-till-dawn");
    });

    fireEvent.click(duskTillDawnSwitch!);

    await waitFor(() => {
      const activeBar = firstWidget.querySelector("div.bar.active");
      expect(activeBar).not.toHaveClass("dusk-till-dawn");
    });
  });

  it("toggles Flashing mode correctly", async () => {
    const { container } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    const plusButtons = container.querySelectorAll("button");
    const plusButton = Array.from(plusButtons).find(
      (btn) => btn.textContent === "+"
    );

    if (plusButton) {
      fireEvent.click(plusButton);
    } else {
      throw new Error("No plus buttons found");
    }

    const firstWidget = document.querySelector(".widget") as HTMLElement;
    const duskTillDawnButtonContainer = within(firstWidget!)
      .getByText("Flashing")
      .closest(".mode-button-container");
    const duskTillDawnSwitch =
      duskTillDawnButtonContainer!.querySelector("label.switch");

    fireEvent.click(duskTillDawnSwitch!);

    await waitFor(() => {
      const activeBar = firstWidget.querySelector("div.bar.active");
      expect(activeBar).toHaveClass("flashing");
    });

    fireEvent.click(duskTillDawnSwitch!);

    await waitFor(() => {
      const activeBar = firstWidget.querySelector("div.bar.active");
      expect(activeBar).not.toHaveClass("flashing");
    });
  });
});
