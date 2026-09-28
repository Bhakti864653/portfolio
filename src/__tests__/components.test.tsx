import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CopyEmail } from "@/components/CopyEmail";
import { Questions } from "@/components/home/Questions";
import { Monogram } from "@/components/Monogram";
import { buildThread } from "@/components/thread/ThreadLayer";
import { PROJECTS } from "@/lib/projects";
import { inline } from "@/lib/format";

describe("Questions", () => {
  it("links each human question to its case study, in project order", () => {
    render(<Questions />);
    const links = screen.getAllByRole("link");
    expect(links.map((l) => l.getAttribute("href"))).toEqual([
      "/work/portico",
      "/work/synaptiq",
      "/work/concord",
      "/work/commonground",
    ]);
    expect(
      screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent),
    ).toEqual(PROJECTS.map((p) => p.question));
    // Name and action are visible text, not hover-only.
    expect(links[2]).toHaveTextContent("Concord");
    expect(links[2]).toHaveTextContent("Read the case study");
  });
});

describe("thread", () => {
  const box = (x: number, y: number, w = 10, h = 10) => ({ x, y, w, h });

  it("runs from the monogram's flourish and splits into the four project strands", () => {
    const strands = buildThread(
      "hero",
      { exit: box(200, 100, 1, 1), headline: box(100, 150, 600, 200) },
      1440,
      900,
    );
    expect(strands).toHaveLength(5);
    expect(strands[0].slug).toBeUndefined();
    expect(strands[0].d.startsWith("M200.5 100.5")).toBe(true);
    expect(strands.slice(1).map((s) => s.slug)).toEqual([
      "portico",
      "synaptiq",
      "concord",
      "commonground",
    ]);
  });

  it("draws nothing until its anchors exist", () => {
    expect(buildThread("hero", {}, 1440, 900)).toEqual([]);
    expect(buildThread("contact", {}, 1440, 900)).toEqual([]);
  });

  it("connects the sequence in order, one colored stretch per project", () => {
    const anchors = Object.fromEntries(
      PROJECTS.map((p, i) => [`n-${p.slug}`, box(100 + i * 50, 200 + i * 400)]),
    );
    const strands = buildThread("sequence", anchors, 1440, 2000);
    expect(strands.map((s) => s.slug)).toEqual([
      "portico",
      "portico",
      "synaptiq",
      "concord",
      "commonground",
    ]);
  });
});

describe("Monogram", () => {
  it("is labelled as BA and has a heavier small version", () => {
    const { container, rerender } = render(<Monogram />);
    expect(
      screen.getByRole("img", { name: "Bhakti Ahir" }),
    ).toBeInTheDocument();
    const full = container.querySelector("path")!.getAttribute("d");
    rerender(<Monogram small />);
    expect(container.querySelector("path")!.getAttribute("d")).not.toBe(full);
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
