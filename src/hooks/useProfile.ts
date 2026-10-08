"use client";

import { useState, useEffect } from "react";
import { UserProfile } from "../types/vocab";

const STORAGE_KEY = "tocfl_user_profile";

export const DEFAULT_PROFILE: UserProfile = {
  name: "Pelajar",
  avatarSeed: "臺",
  autoPlayAudio: true,
  activeLevel: "L0",
};

export function getStoredProfile(): UserProfile {
  if (typeof window === "undefined" || !window.localStorage) return DEFAULT_PROFILE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveStoredProfile(profile: UserProfile): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error("Failed to save profile:", err);
  }
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProfile(getStoredProfile());
    setMounted(true);
  }, []);

  const updateProfile = (partial: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...partial };
      saveStoredProfile(next);
      return next;
    });
  };

  return {
    profile,
    updateProfile,
    mounted,
  };
}
