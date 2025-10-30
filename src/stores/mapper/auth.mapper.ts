// src/mapper/auth.mapper.ts

import { AuthResponse } from "../api/auth.api";
import { AuthUser } from "@/types/auth-user.type";

function normalizeStudent(s?: AuthResponse["user"]["student"]) {
  if (!s) return undefined;
  return {
    ...s,
    first_name_tha: (s as any).first_name_tha ?? s.first_name,
    last_name_tha: (s as any).last_name_tha ?? s.last_name,
    first_name_eng: (s as any).first_name_eng ?? s.first_name,
    last_name_eng: (s as any).last_name_eng ?? s.last_name,
  } as any;
}

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
  // 🔍 Debug: ตรวจสอบข้อมูลที่ได้รับจาก API
  console.log("🔍 [Auth Mapper] API Response:", {
    users_id: api.user.users_id,
    username: api.user.username,
    roles_id: api.user.roles_id,
    roles: api.user.roles,
    roles_name: api.user.roles?.roles_name,
  });

  // ✅ แก้ไข: ใช้ roles_name จาก roles object โดยตรง
  const roleName = api.user.roles?.roles_name;
  const roleId = api.user.roles_id;

  const mappedUser = {
    userId: api.user.users_id,
    username: api.user.username,
    role: roleName || "Student", // ✅ ใช้ roles_name จาก roles object
    role_id: roleId, // ✅ ใช้ roles_id จาก user object
    token: api.token,
    student: normalizeStudent(api.user.student),
    teacher: api.user.teacher,
  };

  // 🔍 Debug: ตรวจสอบข้อมูลที่ map แล้ว
  console.log("🔍 [Auth Mapper] Mapped User:", {
    userId: mappedUser.userId,
    username: mappedUser.username,
    role: mappedUser.role,
    role_id: mappedUser.role_id,
  });

  return mappedUser;
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
  // 🔍 Debug: ตรวจสอบข้อมูล user
  console.log("🚀🚀🚀 [Auth Mapper] User for mapping:", {
    users_id: user.users_id,
    username: user.username,
    roles_id: user.roles_id,
    roles: user.roles,
    student: user.student,
    teacher: user.teacher,
  });

  const mapped = {
    userId: user.users_id,
    username: user.username,
    role: user.roles?.roles_name || "Student", // ✅ ใช้ roles_name จาก roles object
    role_id: user.roles_id,
    token: localStorage.getItem("token") ?? "",
    student: normalizeStudent(user.student),
    teacher: user.teacher,
  };

  // Ensure the returned object matches the AuthUser type, especially for the student field
  console.log("✅✅✅ [Auth Mapper] Mapped result:", mapped);
  
  return mapped;
}
