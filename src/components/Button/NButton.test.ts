import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import NButton from "./NButton.vue";

describe("NButton", () => {
  it("renders slot content", () => {
    const wrapper = mount(NButton, {
      slots: { default: "Click me" },
    });
    expect(wrapper.text()).toContain("Click me");
  });

  it("emits click event", async () => {
    const wrapper = mount(NButton);
    await wrapper.trigger("click");
    expect(wrapper.emitted("click")).toBeTruthy();
  });

  it("does not emit click when disabled", async () => {
    const wrapper = mount(NButton, {
      props: { disabled: true },
    });
    await wrapper.trigger("click");
    expect(wrapper.emitted("click")).toBeFalsy();
  });

  it("does not emit click when loading", async () => {
    const wrapper = mount(NButton, {
      props: { loading: true },
    });
    await wrapper.trigger("click");
    expect(wrapper.emitted("click")).toBeFalsy();
  });

  it("applies variant classes", () => {
    const wrapper = mount(NButton, {
      props: { variant: "outline" },
    });
    expect(wrapper.classes()).toContain("border");
  });

  it("applies size classes", () => {
    const wrapper = mount(NButton, {
      props: { size: "lg" },
    });
    expect(wrapper.classes()).toContain("h-12");
  });

  it("has correct aria attributes when disabled", () => {
    const wrapper = mount(NButton, {
      props: { disabled: true },
    });
    expect(wrapper.attributes("aria-disabled")).toBe("true");
  });

  it("has correct aria attributes when loading", () => {
    const wrapper = mount(NButton, {
      props: { loading: true },
    });
    expect(wrapper.attributes("aria-busy")).toBe("true");
  });
});
