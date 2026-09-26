import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CopyEmail } from "@/components/CopyEmail";
import { VerbSystem } from "@/components/verbs/VerbSystem";
import { inline } from "@/lib/format";

describe("VerbSystem", () => {
  it("reveals each project when its verb gets keyboard focus", async () => {
    render(<VerbSystem />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.map((b) => b.textContent)).toEqual([
      "01 · Porticodecide",
      "02 · Synaptiqlearn",
      "03 · Concordconnect",
      "04 · CommonGroundact",
    ]);
    expect(screen.getByText("Select a path")).toBeInTheDocument();

    await userEvent.tab();
    expect(buttons[0]).toHaveFocus();
    expect(buttons[0]).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByText("A command center for college applications."),
    ).toBeInTheDocument();

    await userEvent.tab();
    expect(buttons[1]).toHaveAttribute("aria-pressed", "true");
    expect(buttons[0]).toHaveAttribute("aria-pressed", "false");
    expect(
      screen.getByRole("link", { name: "Read the Synaptiq case study →" }),
    ).toHaveAttribute("href", "/work/synaptiq");
  });

  it("falls back to the 2D figure when WebGL is not available (jsdom)", () => {
    const { container } = render(<VerbSystem />);
    expect(container.querySelector("canvas")).toBeNull();
    expect(container.querySelector("svg")).not.toBeNull();
  });
});

describe("CopyEmail", () => {
  it("copies the address and confirms, then reports failure honestly", async () => {
    const writeText = vi
      .fn()
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error("denied"));
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
    render(<CopyEmail email="a@b.c" />);
    const button = screen.getByRole("button");

    await act(async () => fireEvent.click(button));
    expect(writeText).toHaveBeenCalledWith("a@b.c");
    expect(button).toHaveTextContent("Copied ✓");

    await act(async () => fireEvent.click(button));
    expect(button).toHaveTextContent("Couldn’t copy");
  });
});

describe("inline", () => {
  it("turns backtick spans into code", () => {
    const { container } = render(
      <p>{inline("scope with `WHERE user_id = ?` always")}</p>,
    );
    expect(container.querySelector("code")?.textContent).toBe(
      "WHERE user_id = ?",
    );
    expect(container.textContent).toBe("scope with WHERE user_id = ? always");
  });
});
