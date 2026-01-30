import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/vue";
import NModal from "./NModal.vue";

describe("NModal", async () => {
  it("renders when modelValue is true", () => {
    render(NModal, {
      props: { modelValue: true, title: "Test Modal" },
    });
    expect(screen.getByText("Test Modal")).toBeTruthy();
  });

  it("does not render when modelValue is false", () => {
    render(NModal, {
      props: { modelValue: false, title: "Test Modal" },
    });
    expect(screen.queryByText("Test Modal")).toBeNull();
  });

  it("emits update:modelValue when close button is clicked", async () => {
    const { emitted } = render(NModal, {
      props: { modelValue: true, title: "Test", closable: true },
    });
    const closeBtn = screen.getByLabelText("Close modal");
    await fireEvent.click(closeBtn);
    expect(emitted()["update:modelValue"]).toBeTruthy();
    expect(emitted()["update:modelValue"][0]).toEqual([false]);
  });

  it("applies correct size class", () => {
    render(NModal, {
      props: { modelValue: true, size: "lg" },
      slots: { default: "Content" },
    });
    const dialog = screen.getByRole("dialog");
    expect(dialog.className).toContain("max-w-lg");
  });

  it("renders footer slot", () => {
    render(NModal, {
      props: { modelValue: true },
      slots: { default: "Content", footer: "Footer Content" },
    });
    expect(screen.getByText("Footer Content")).toBeTruthy();
  });

  it("has draggable cursor when draggable prop is true", () => {
    render(NModal, {
      props: { modelValue: true, title: "Draggable", draggable: true },
    });
    const header = screen.getByText("Draggable").parentElement;
    expect(header?.className).toContain("cursor-grab");
  });

  it("has correct aria attributes", () => {
    render(NModal, {
      props: { modelValue: true },
      slots: { default: "Content" },
    });
    const dialog = screen.getByRole("dialog");
    expect(dialog.getAttribute("aria-modal")).toBe("true");
  });
});
