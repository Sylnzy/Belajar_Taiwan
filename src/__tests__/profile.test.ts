import { describe, it, expect, beforeEach } from "vitest";
import { DEFAULT_PROFILE, getStoredProfile, saveStoredProfile } from "../hooks/useProfile";

describe("Profile Storage Logic", () => {
  const store: Record<string, string> = {};

  beforeEach(() => {
    Object.keys(store).forEach((k) => delete store[k]);
    global.window = {
      localStorage: {
        getItem: (k: string) => store[k] || null,
        setItem: (k: string, v: string) => {
          store[k] = v;
        },
        removeItem: (k: string) => delete store[k],
        clear: () => {
          Object.keys(store).forEach((k) => delete store[k]);
        },
      },
    } as any;
  });

  it("returns default profile when empty", () => {
    const profile = getStoredProfile();
    expect(profile.name).toBe(DEFAULT_PROFILE.name);
    expect(profile.autoPlayAudio).toBe(true);
  });

  it("saves and loads updated profile", () => {
    saveStoredProfile({
      name: "Maul",
      avatarSeed: "flag",
      autoPlayAudio: false,
      activeLevel: "L1",
    });

    const loaded = getStoredProfile();
    expect(loaded.name).toBe("Maul");
    expect(loaded.autoPlayAudio).toBe(false);
    expect(loaded.activeLevel).toBe("L1");
  });
});
