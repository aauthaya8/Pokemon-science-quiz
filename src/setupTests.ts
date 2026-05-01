// src/setupTests.ts
import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement HTMLMediaElement.play/pause; stub them so our
// sound module's audio playback attempts don't spam "Not implemented" warnings.
if (typeof window !== "undefined") {
  const proto = window.HTMLMediaElement?.prototype;
  if (proto) {
    proto.play = function () {
      return Promise.resolve();
    };
    proto.pause = function () {
      // no-op
    };
  }
}
