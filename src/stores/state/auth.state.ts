import { AuthUser } from "../../types/model";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  authError: string | null;

  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}
