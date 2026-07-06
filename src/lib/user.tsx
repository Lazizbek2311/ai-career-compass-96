import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type UserState = { name: string; email: string };

const USER_KEY = "careerai_user";
const PROFILE_KEY = "careerai_profile";

const DEFAULT: UserState = { name: "", email: "" };

type Ctx = {
  user: UserState;
  displayName: string;
  firstName: string;
  initials: string;
  updateUser: (patch: Partial<UserState>) => void;
  signOut: () => void;
};

const UserContext = createContext<Ctx | null>(null);

function nameFromEmail(email: string): string {
  if (!email) return "";
  const local = email.split("@")[0] || "";
  return local
    .replace(/[._-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function readInitial(): UserState {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return { name: parsed.name || "", email: parsed.email || "" };
      }
    }
    // fallback: profile
    const prof = localStorage.getItem(PROFILE_KEY);
    if (prof) {
      const p = JSON.parse(prof);
      return { name: p.name || "", email: p.email || "" };
    }
  } catch {}
  return DEFAULT;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserState>(DEFAULT);

  useEffect(() => {
    setUser(readInitial());
    const onStorage = (e: StorageEvent) => {
      if (e.key === USER_KEY || e.key === PROFILE_KEY) setUser(readInitial());
    };
    const onCustom = () => setUser(readInitial());
    window.addEventListener("storage", onStorage);
    window.addEventListener("careerai:user-updated", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("careerai:user-updated", onCustom);
    };
  }, []);

  const updateUser = useCallback((patch: Partial<UserState>) => {
    setUser((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(USER_KEY, JSON.stringify(next));
        // keep profile in sync
        const raw = localStorage.getItem(PROFILE_KEY);
        const prof = raw ? JSON.parse(raw) : {};
        const merged = { ...prof, name: next.name || prof.name, email: next.email || prof.email };
        localStorage.setItem(PROFILE_KEY, JSON.stringify(merged));
        window.dispatchEvent(new Event("careerai:user-updated"));
      } catch {}
      return next;
    });
  }, []);

  const signOut = useCallback(() => {
    try {
      localStorage.removeItem(USER_KEY);
      window.dispatchEvent(new Event("careerai:user-updated"));
    } catch {}
    setUser(DEFAULT);
  }, []);

  const resolvedName = user.name || nameFromEmail(user.email);
  const displayName = resolvedName || "Guest";
  const firstName = displayName.split(" ")[0] || displayName;
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("") || "U";

  return (
    <UserContext.Provider value={{ user, displayName, firstName, initials, updateUser, signOut }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): Ctx {
  const ctx = useContext(UserContext);
  if (!ctx) {
    // Safe fallback so accidental usage outside provider doesn't crash
    return {
      user: DEFAULT,
      displayName: "Guest",
      firstName: "Guest",
      initials: "U",
      updateUser: () => {},
      signOut: () => {},
    };
  }
  return ctx;
}
