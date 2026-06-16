import { atom } from "recoil";

export interface AuthUser {
  /** Google account id (the JWT "sub" claim). */
  sub: string;
  name: string;
  email: string;
  picture: string;
}

export interface PersistedAuth {
  user: AuthUser;
  /** Raw Google ID token — kept for the future backend verification handoff. */
  idToken: string;
}

export const AUTH_STORAGE_KEY = "skyduel.auth";

/** Read + parse the persisted session so a refresh keeps the user signed in. */
export const readPersistedAuth = (): PersistedAuth | null => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PersistedAuth) : null;
  } catch {
    return null;
  }
};

export const authUserState = atom<AuthUser | null>({
  key: "authUserState",
  default: readPersistedAuth()?.user ?? null,
});
