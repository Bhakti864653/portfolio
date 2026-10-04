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
