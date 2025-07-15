// src/types/api/auth.api.ts

export interface ApiLoginRequest {
  username: string;
  password: string;
}

// export interface AuthResponse {
//   user: {
//     user_id: number;
//     username: string;
//     roles_id: number;
//     role_name: "Student" | "Teacher" | "Admin";
//   };
//   access_token: string;
// }

// auth.api.ts
export interface AuthResponse {
  message: string;
  token: string;
  user: {
    users_id: number;
    username: string;
    roles_id: number;
    roles: {
      roles_id: number;
      roles_name: "Admin" | "Teacher" | "Student";
    };
  };
}
