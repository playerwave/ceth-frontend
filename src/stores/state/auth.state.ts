import { AuthUser } from "../../types/auth-user.type";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface UpdatePasswordPayload {
  newPassword: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  authError: string | null;

  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
  updatePassword: (payload: UpdatePasswordPayload) => Promise<{ success: boolean; message: string }>;
}
