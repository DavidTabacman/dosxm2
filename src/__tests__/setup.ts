// Global test setup — mock APIs not available in jsdom

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock HTMLMediaElement.play() — jsdom does not implement it
Object.defineProperty(HTMLMediaElement.prototype, "play", {
  writable: true,
  value: () => Promise.resolve(),
});

Object.defineProperty(HTMLMediaElement.prototype, "pause", {
  writable: true,
  value: () => {},
});
