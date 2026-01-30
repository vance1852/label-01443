import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/vue";
import NTabs from "./NTabs.vue";

const tabs = [
  { key: "tab1", label: "Tab 1" },
  { key: "tab2", label: "Tab 2" },
  { key: "tab3", label: "Tab 3", disabled: true },
];

describe("NTabs", () => {
  it("renders all tabs", () => {
    render(NTabs, {
      props: { tabs },
    });
    expect(screen.getByText("Tab 1")).toBeTruthy();
    expect(screen.getByText("Tab 2")).toBeTruthy();
    expect(screen.getByText("Tab 3")).toBeTruthy();
  });

  it("selects first tab by default", () => {
    render(NTabs, {
      props: { tabs },
    });
    const firstTab = screen.getByText("Tab 1");
    expect(firstTab.getAttribute("aria-selected")).toBe("true");
  });

  it("selects tab based on modelValue", () => {
    render(NTabs, {
      props: { tabs, modelValue: "tab2" },
    });
    const secondTab = screen.getByText("Tab 2");
    expect(secondTab.getAttribute("aria-selected")).toBe("true");
  });

  it("emits update:modelValue when tab is clicked", async () => {
    const { emitted } = render(NTabs, {
      props: { tabs },
    });
    await fireEvent.click(screen.getByText("Tab 2"));
    expect(emitted()["update:modelValue"]).toBeTruthy();
    expect(emitted()["update:modelValue"][0]).toEqual(["tab2"]);
  });

  it("does not emit when disabled tab is clicked", async () => {
    const { emitted } = render(NTabs, {
      props: { tabs },
    });
    await fireEvent.click(screen.getByText("Tab 3"));
    expect(emitted()["update:modelValue"]).toBeFalsy();
  });

  it("applies disabled styles to disabled tab", () => {
    render(NTabs, {
      props: { tabs },
    });
    const disabledTab = screen.getByText("Tab 3");
    expect(disabledTab.className).toContain("opacity-50");
  });

  it("has correct aria attributes", () => {
    render(NTabs, {
      props: { tabs },
    });
    const tabButtons = screen.getAllByRole("tab");
    expect(tabButtons.length).toBe(3);
    expect(screen.getByRole("tablist")).toBeTruthy();
  });

  it("passes activeKey to slot", () => {
    render(NTabs, {
      props: { tabs, modelValue: "tab2" },
      slots: {
        default: `<template #default="{ activeKey }">
          <div data-testid="slot-content">{{ activeKey }}</div>
        </template>`,
      },
    });
    expect(screen.getByTestId("slot-content").textContent).toBe("tab2");
  });
});
