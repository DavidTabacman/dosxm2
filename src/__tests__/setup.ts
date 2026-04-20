// Global test setup — mock APIs not available in jsdom.

type MatchMediaResult = {
  matches: boolean;
  media: string;
  onchange: null;
  addListener: () => void;
  removeListener: () => void;
  addEventListener: () => void;
  removeEventListener: () => void;
  dispatchEvent: () => boolean;
};

type MatchMediaFn = (query: string) => MatchMediaResult;

const defaultMatchMedia: MatchMediaFn = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
});

let currentMatchMedia: MatchMediaFn = defaultMatchMedia;

Object.defineProperty(window, "matchMedia", {
  writable: true,
  configurable: true,
  value: (query: string) => currentMatchMedia(query),
});

declare global {
  interface Window {
    __setMatchMedia?: (fn: MatchMediaFn | null) => void;
  }
}

// Test escape hatch: swap matchMedia responses per-query without redefining
// the global each time. Pass null to reset to default.
(window as Window).__setMatchMedia = (fn) => {
  currentMatchMedia = fn ?? defaultMatchMedia;
};

// Mock window.scrollTo — jsdom does not implement it.
window.scrollTo = () => {};

// Mock HTMLMediaElement.play() — jsdom does not implement it.
Object.defineProperty(HTMLMediaElement.prototype, "play", {
  writable: true,
  value: () => Promise.resolve(),
});

Object.defineProperty(HTMLMediaElement.prototype, "pause", {
  writable: true,
  value: () => {},
});
