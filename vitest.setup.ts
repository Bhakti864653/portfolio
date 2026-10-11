import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(cleanup);

// jsdom has no matchMedia; report a phone-sized screen with no motion preference.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn((query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
});

// Nor ResizeObserver or IntersectionObserver; nothing in the tests depends on them firing.
class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
for (const name of ["ResizeObserver", "IntersectionObserver"])
  Object.defineProperty(window, name, { writable: true, value: NoopObserver });

// The app runs on the React bundled with Next.js, which has <ViewTransition>; the plain `react`
// package these tests import does not yet. Outside a browser transition it only renders its
// children, so a pass-through stands in for it here.
vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return {
    ...actual,
    ViewTransition: ({ children }: { children?: import("react").ReactNode }) =>
      children,
  };
});
