import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import NInput from "./NInput.vue";

describe("NInput", () => {
  it("renders label when provided", () => {
    const wrapper = mount(NInput, {
      props: { label: "Username" },
    });
    expect(wrapper.find("label").text()).toBe("Username");
  });

  it("emits update:modelValue on input", async () => {
    const wrapper = mount(NInput);
    const input = wrapper.find("input");
    await input.setValue("test");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["test"]);
  });

  it("renders help text", () => {
    const wrapper = mount(NInput, {
      props: { helpText: "Enter your username" },
    });
    expect(wrapper.text()).toContain("Enter your username");
  });

  it("applies error status class", () => {
    const wrapper = mount(NInput, {
      props: { status: "error" },
    });
    expect(wrapper.find("input").classes()).toContain("border-error-500");
  });

  it("toggles password visibility", async () => {
    const wrapper = mount(NInput, {
      props: { type: "password" },
    });
    const input = wrapper.find("input");
    expect(input.attributes("type")).toBe("password");

    await wrapper.find("button").trigger("click");
    expect(input.attributes("type")).toBe("text");
  });

  it("has aria-invalid when status is error", () => {
    const wrapper = mount(NInput, {
      props: { status: "error" },
    });
    expect(wrapper.find("input").attributes("aria-invalid")).toBe("true");
  });
});
