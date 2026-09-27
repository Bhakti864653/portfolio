import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CopyEmail } from "@/components/CopyEmail";
import { JudgmentFigure } from "@/components/verbs/JudgmentFigure";
import { inline } from "@/lib/format";

describe("JudgmentFigure", () => {
  it("links every ability to its project and names it on focus", async () => {
    render(<JudgmentFigure />);
    const links = screen.getAllByRole("link");
    expect(links.map((l) => l.getAttribute("href"))).toEqual([
      "/work/portico",
      "/work/synaptiq",
      "/work/concord",
      "/work/commonground",
    ]);
    expect(links.map((l) => l.textContent)).toEqual([
      "decide01 · Portico",
      "learn02 · Synaptiq",
      "connect03 · Concord",
      "act04 · CommonGround",
    ]);

    await userEvent.tab();
    expect(links[0]).toHaveFocus();
    expect(screen.getByText("→ Portico")).toBeInTheDocument();
    await userEvent.tab();
    expect(screen.getByText("→ Synaptiq")).toBeInTheDocument();
  });

  it("has a text alternative and falls back to 2D without WebGL (jsdom)", () => {
    const { container } = render(<JudgmentFigure />);
    expect(
      screen.getByRole("figure", { name: /all meeting at one center/ }),
    ).toBeInTheDocument();
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

vi.mock("next/navigation", () => ({ usePathname: () => "/work/concord" }));

describe("SiteHeader", () => {
  it("links to real routes and marks Work as current on a case study", async () => {
    const { SiteHeader, routeFor } = await import("@/components/SiteHeader");
    render(<SiteHeader />);
    const nav = screen.getByRole("navigation", { name: "Main" });
    const links = Array.from(nav.querySelectorAll("a"));
    expect(links.map((l) => l.getAttribute("href"))).toEqual([
      "/work",
      "/journey",
      "/about",
      "/contact",
    ]);
    expect(links[0]).toHaveAttribute("aria-current", "page");
    expect(links[1]).not.toHaveAttribute("aria-current");

    expect(routeFor("/")?.id).toBe("index");
    expect(routeFor("/about")?.id).toBe("about");
    expect(routeFor("/workshop")).toBeNull();
  });

  it("opens a full-screen menu, keeps focus inside, and closes on Escape", async () => {
    const { SiteHeader } = await import("@/components/SiteHeader");
    render(<SiteHeader />);
    const toggle = screen.getByRole("button", { name: "Menu" });

    await userEvent.click(toggle);
    const dialog = screen.getByRole("dialog", { name: "Menu" });
    for (const [label, href] of [
      ["Index", "/"],
      ["Work", "/work"],
      ["Journey", "/journey"],
      ["About", "/about"],
      ["Contact", "/contact"],
    ]) {
      const link = Array.from(dialog.querySelectorAll("a")).find((a) =>
        a.textContent?.includes(label),
      );
      expect(link, label).toHaveAttribute("href", href);
    }
    expect(screen.getByRole("link", { name: "LinkedIn ↗" })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/bhakti-ahir-756b9943a/",
    );
    expect(
      within(dialog).getByRole("button", { name: /^Theme:/ }),
    ).toBeInTheDocument();
    expect(dialog.contains(document.activeElement)).toBe(true);

    // Shift+Tab from the first item wraps to the last one, still inside the dialog.
    await userEvent.tab({ shift: true });
    expect(dialog.contains(document.activeElement)).toBe(true);

    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(toggle).toHaveFocus();
  });
});
