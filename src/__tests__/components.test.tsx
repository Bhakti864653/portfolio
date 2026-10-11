import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Gallery } from "@/components/case/Gallery";
import { CaseStudy } from "@/components/CaseStudy";
import { Certifications } from "@/components/Certifications";
import { CopyEmail } from "@/components/CopyEmail";
import { Entrance } from "@/components/home/Entrance";
import { IdeaFigure } from "@/components/home/IdeaFigure";
import { Marquee } from "@/components/home/Marquee";
import { Showcase } from "@/components/home/Showcase";
import { MediaSlot } from "@/components/MediaSlot";
import { EasterEgg } from "@/components/motion/EasterEgg";
import { PROJECTS, TECH, projectBySlug } from "@/lib/projects";
import { inline } from "@/lib/format";

describe("IdeaFigure", () => {
  it("links every ability to its project and names it at the center on focus", async () => {
    render(<IdeaFigure />);
    const list = screen.getByRole("list", { name: "Paths to each project" });
    const links = within(list).getAllByRole("link");
    expect(links.map((l) => l.getAttribute("href"))).toEqual([
      "/work/portico",
      "/work/synaptiq",
      "/work/concord",
      "/work/commonground",
    ]);
    expect(links.map((l) => l.textContent)).toEqual([
      "decide: Portico. 61 tests.",
      "learn: Synaptiq. Adaptive AI tutor.",
      "connect: Concord. Stable matching.",
      "act: CommonGround. 7 languages.",
    ]);

    await userEvent.tab();
    expect(links[0]).toHaveFocus();
    expect(screen.getByText("→ Portico")).toBeInTheDocument();
    await userEvent.tab();
    expect(screen.getByText("→ Synaptiq")).toBeInTheDocument();
  });

  it("has a text alternative, draws as plain SVG, and keeps its labels when the paths wait", () => {
    const { container } = render(<IdeaFigure paths="pending" />);
    expect(
      screen.getByRole("figure", { name: /all meeting at one center/ }),
    ).toBeInTheDocument();
    expect(container.querySelector("canvas")).toBeNull();
    // The four paths draw outward from the center; each has a soft glow beneath it.
    expect(container.querySelectorAll("path.draw-out")).toHaveLength(4);
    expect(container.querySelectorAll("path.path-glow")).toHaveLength(4);
    // Only the strokes wait to draw in; every label is there from the first frame.
    expect(screen.getAllByRole("link")).toHaveLength(4);
    expect(screen.getByText("Human")).toBeInTheDocument();
    expect(screen.getByText("Judgment")).toBeInTheDocument();
  });

  it("on a touchscreen, the first tap previews the project instead of leaving the page", () => {
    render(<IdeaFigure />);
    const learn = screen.getByRole("link", { name: /learn: Synaptiq/ });
    // A real tap presses, then focuses the link, then clicks it.
    fireEvent.pointerDown(learn, { pointerType: "touch" });
    fireEvent.focus(learn);
    const followed = fireEvent.click(learn);
    expect(followed).toBe(false);
    expect(screen.getByText("→ Synaptiq")).toBeInTheDocument();
  });
});

describe("Entrance", () => {
  it("opens on the statement, with every word readable before any animation", () => {
    render(<Entrance />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent(
      "Technology should expand what people can do.",
    );
    expect(screen.getByText("Bhakti Ahir")).toBeInTheDocument();
    expect(screen.getByText("A personal portfolio")).toBeInTheDocument();
    expect(
      screen.getByText("Building what school doesn’t teach."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Continue to the idea/ }),
    ).toHaveAttribute("href", "#idea");
  });

  it("states the idea once, then leads on to the work", () => {
    render(<Entrance />);
    expect(
      screen.getByRole("heading", { level: 2, name: "I build ways forward." }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/Every one leaves the final call to you/),
    ).toHaveLength(1);
    expect(
      screen.getByRole("link", { name: /Continue to the work/ }),
    ).toHaveAttribute("href", "#directions");
  });

  it("drops the separate list of ability words; the figure's paths are the links", () => {
    render(<Entrance />);
    expect(screen.queryByRole("list", { name: "Four abilities" })).toBeNull();
    expect(
      screen.getByRole("list", { name: "Paths to each project" }),
    ).toBeInTheDocument();
  });

  it("floats in a preview with a badge when a path is highlighted", async () => {
    render(<Entrance />);
    const learn = screen.getByRole("link", { name: /learn: Synaptiq/ });
    await userEvent.hover(learn);
    expect(screen.getByText("→ Synaptiq")).toBeInTheDocument();
    // One preview beside the figure (wide screens) and one under it (phones).
    expect(screen.getAllByText("Adaptive AI tutor")).toHaveLength(2);
    expect(
      screen.getAllByText(projectBySlug("synaptiq")!.oneLine),
    ).toHaveLength(2);
  });

  it("stacks the two screens, with nothing waiting to draw, under reduced motion", () => {
    document.documentElement.dataset.motion = "reduce";
    const { container } = render(<Entrance />);
    expect(container.querySelector("#entrance")).toHaveAttribute(
      "data-mode",
      "stack",
    );
    expect(container.querySelector('[data-paths="pending"]')).toBeNull();
    delete document.documentElement.dataset.motion;
  });
});

describe("Showcase", () => {
  it("shows each project as a card with its badge and tags, in project order", () => {
    const { container } = render(<Showcase />);
    const links = screen.getAllByRole("link");
    expect(links.map((l) => l.getAttribute("href"))).toEqual(
      PROJECTS.map((p) => `/work/${p.slug}`),
    );
    for (const p of PROJECTS) {
      expect(screen.getByText(p.name)).toBeInTheDocument();
      expect(screen.getByText(p.badge)).toBeInTheDocument();
    }
    for (const link of links) {
      expect(link).toHaveAttribute("data-cursor", "View");
      expect(link).toHaveAttribute("data-tilt");
    }
    // Screenshots are always shown in full color.
    for (const img of container.querySelectorAll("img"))
      expect(img.getAttribute("style") ?? "").not.toMatch(/opacity|filter/);
  });
});

describe("MediaSlot", () => {
  const portico = projectBySlug("portico")!;

  it("shows the screenshot when there is no demo video", () => {
    const { container } = render(<MediaSlot project={portico} sizes="100vw" />);
    expect(container.querySelector("video")).toBeNull();
    expect(screen.getByRole("img")).toHaveAttribute(
      "alt",
      portico.screenshot.alt,
    );
  });

  it("plays a demo video muted and looped, loading it only once it is near the screen", () => {
    const withVideo = { ...portico, media: { video: "/media/portico.mp4" } };
    const { container } = render(
      <MediaSlot project={withVideo} sizes="100vw" />,
    );
    const video = container.querySelector("video")!;
    expect(video.muted).toBe(true);
    expect(video.loop).toBe(true);
    expect(video).toHaveAttribute("preload", "none");
    expect(video.getAttribute("poster")).toBe(portico.screenshot.src);
    expect(video.getAttribute("src")).toBeNull();
  });

  it("never autoplays under reduced motion: it offers controls instead", () => {
    document.documentElement.dataset.motion = "reduce";
    const withVideo = { ...portico, media: { video: "/media/portico.mp4" } };
    const { container } = render(
      <MediaSlot project={withVideo} sizes="100vw" />,
    );
    const video = container.querySelector("video")!;
    expect(video.controls).toBe(true);
    expect(video.autoplay).toBe(false);
    delete document.documentElement.dataset.motion;
  });
});

describe("CaseStudy", () => {
  it.each(PROJECTS.map((p) => [p.slug, p] as const))(
    "%s: five short sections under 350 words, with the rest in Read more",
    (_, p) => {
      const { container } = render(<CaseStudy project={p} />);
      const headings = screen
        .getAllByRole("heading", { level: 2 })
        .map((h) => h.textContent?.replace(/^\d+/, ""));
      expect(headings).toEqual(
        expect.arrayContaining([
          "The problem",
          "What it does",
          "The hard part",
          "What I learned",
          "Tech",
        ]),
      );
      expect(screen.getByRole("link", { name: /Live site/ })).toHaveAttribute(
        "href",
        p.live,
      );
      expect(screen.getByRole("link", { name: /GitHub/ })).toHaveAttribute(
        "href",
        p.repo,
      );
      expect(screen.getAllByText(p.badge).length).toBeGreaterThan(0);

      // Count what a reader sees before opening anything: no folded detail, no
      // screen-reader-only text.
      const article = container
        .querySelector("article")!
        .cloneNode(true) as HTMLElement;
      article
        .querySelectorAll(".read-more-body, .sr-only, nav")
        .forEach((el) => el.remove());
      const words = article.textContent!.split(/\s+/).filter(Boolean);
      expect(words.length).toBeLessThan(350);
      expect(container.querySelectorAll("details.read-more")).toHaveLength(4);
    },
  );

  it("ends with a big link to the next project", () => {
    render(<CaseStudy project={PROJECTS[3]} />);
    expect(
      screen.getByRole("link", { name: /Next project · 01/ }),
    ).toHaveAttribute("href", "/work/portico");
  });
});

describe("Gallery", () => {
  it("opens a shot larger, steps through the rest, and closes", async () => {
    const shots = projectBySlug("portico")!.gallery;
    render(<Gallery shots={shots} name="Portico" />);
    await userEvent.click(
      screen.getByRole("button", { name: /Open screenshot 1 of 4/ }),
    );
    expect(screen.getByText("1 / 4")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Next →" }));
    expect(screen.getByText("2 / 4")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "← Previous" }));
    await userEvent.click(screen.getByRole("button", { name: "← Previous" }));
    expect(screen.getByText("4 / 4")).toBeInTheDocument();
  });
});

describe("Certifications", () => {
  it("renders nothing at all until there is a certificate", () => {
    const { container } = render(
      <>
        <Certifications />
        <Certifications compact />
      </>,
    );
    expect(container).toBeEmptyDOMElement();
  });
});

describe("Marquee", () => {
  it("lists the tech stack once for screen readers; the moving copy is hidden", () => {
    render(<Marquee />);
    const list = screen.getByRole("list", { name: "Technologies I use" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(TECH.length);
    expect(screen.getAllByRole("list")).toHaveLength(1);
  });
});

describe("EasterEgg", () => {
  it("answers “panama” and “india” with a caption", async () => {
    render(<EasterEgg />);
    await userEvent.keyboard("panama");
    expect(screen.getByText(/Born in Panama/)).toBeInTheDocument();
    await userEvent.keyboard("india");
    expect(screen.getByText(/Grew up partly in India/)).toBeInTheDocument();
  });

  it("ignores typing inside a text field", async () => {
    render(
      <>
        <input aria-label="field" />
        <EasterEgg />
      </>,
    );
    await userEvent.type(screen.getByRole("textbox"), "panama");
    expect(screen.queryByText(/Born in Panama/)).toBeNull();
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
    expect(button).toHaveTextContent("Copied!");

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

const push = vi.fn();
vi.mock("next/navigation", () => ({
  usePathname: () => "/work/concord",
  useRouter: () => ({ push }),
}));

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

  it("shows a Résumé link only once there is a résumé", async () => {
    const { SiteHeader } = await import("@/components/SiteHeader");
    const { rerender } = render(<SiteHeader />);
    expect(screen.queryByRole("link", { name: /Résumé/ })).toBeNull();
    rerender(<SiteHeader hasResume />);
    expect(screen.getByRole("link", { name: /Résumé/ })).toHaveAttribute(
      "href",
      "/resume.pdf",
    );
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
