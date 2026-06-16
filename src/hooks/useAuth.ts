import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { jwtDecode } from "jwt-decode";
import {
  AUTH_STORAGE_KEY,
  authUserState,
  AuthUser,
  PersistedAuth,
} from "../stores/auth.store";

/** Claims we rely on from the Google ID token. */
interface GoogleIdTokenPayload {
  sub: string;
  name: string;
  email: string;
  picture: string;
}

const useAuth = () => {
  const [user, setUser] = useRecoilState(authUserState);
  const navigate = useNavigate();

  /**
   * Sign in from a Google ID-token credential. For now we trust the token
   * client-side; when the backend lands, swap this decode for a verified
   * `POST /auth/google { idToken }` exchange — nothing else here changes.
   */
  const login = useCallback(
    (credential: string) => {
      const payload = jwtDecode<GoogleIdTokenPayload>(credential);
      const nextUser: AuthUser = {
        sub: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      };
      const persisted: PersistedAuth = { user: nextUser, idToken: credential };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(persisted));
      setUser(nextUser);
      navigate("/");
    },
    [navigate, setUser]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    navigate("/login");
  }, [navigate, setUser]);

  return { user, isAuthenticated: user !== null, login, logout };
};

export default useAuth;
