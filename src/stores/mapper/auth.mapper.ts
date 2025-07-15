// src/mapper/auth.mapper.ts

import { AuthResponse } from "../api/auth.api";
import { AuthUser } from "../../types/model";

// export function mapApiToAuthUser(api: AuthResponse): AuthUser {
//   return {
//     userId: api.user.users_id,
//     username: api.user.username,
//     role: api.user.roles.roles_name,
//     role_id: api.user.roles_id, // ✅ เพิ่มบรรทัดนี้
//     token: api.token,
//   };
// }

export function mapApiToAuthUser(api: AuthResponse): AuthUser {
  return {
    userId: api.user.users_id,
    username: api.user.username,
    role: api.user.roles?.roles_name ?? "Student", // ✅ fallback ป้องกัน undefined
    role_id: api.user.roles?.roles_id ?? api.user.roles_id ?? 2,
    token: api.token,
  };
}

// export function mapUserToAuthUser(user: AuthResponse["user"]): AuthUser {
//   return {
//     userId: user.users_id,
//     username: user.username,
//     role: user.role_name,
//     role_id: user.roles_id, // ✅ เพิ่มตรงนี้
//     token: localStorage.getItem("token") ?? "",
//   };
// }

export function mapUserToAuthUser(user: AuthResponse["user"]): AuthUser {
  return {
    userId: user.users_id,
    username: user.username,
    role: user.roles.roles_name, // ✅ เปลี่ยนตรงนี้จาก user.role_name
    role_id: user.roles_id,
    token: localStorage.getItem("token") ?? "",
  };
}
