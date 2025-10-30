import { AuthUser } from "../../types/auth-user.type";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface UpdatePasswordPayload {
  newPassword: string;
}

export interface SendForgotPasswordCodePayload {
  email: string;
}

export interface VerifyForgotPasswordCodePayload {
  email: string;
  code: string;
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
  sendForgotPasswordCode: (payload: SendForgotPasswordCodePayload) => Promise<{ success: boolean; message: string }>;
  verifyForgotPasswordCode: (payload: VerifyForgotPasswordCodePayload) => Promise<{ success: boolean; message: string }>;
}
