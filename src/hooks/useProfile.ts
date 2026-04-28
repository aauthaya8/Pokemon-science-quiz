import { useEffect, useState } from "react";
import type { Profile } from "../types";
import { loadProfile, saveProfile } from "../logic/profileStorage";

type Updater = Profile | ((prev: Profile | null) => Profile);

export function useProfile() {
  const [profile, setProfileState] = useState<Profile | null>(() => loadProfile(localStorage));

  useEffect(() => {
    if (profile) saveProfile(localStorage, profile);
  }, [profile]);

  function setProfile(updater: Updater) {
    setProfileState((prev) => (typeof updater === "function" ? (updater as (p: Profile | null) => Profile)(prev) : updater));
  }

  return { profile, setProfile };
}
