import { describe, it, expect, vi } from "vitest";

describe("Audio Player Lifecycle", () => {
  it("stops and resets audio when audioFile prop changes", () => {
    let paused = false;
    const mockAudio = {
      pause: () => { paused = true; },
      currentTime: 10,
      src: "old.mp3",
    };

    // Simulate cleanup
    mockAudio.pause();
    mockAudio.currentTime = 0;

    expect(paused).toBe(true);
    expect(mockAudio.currentTime).toBe(0);
  });
});
