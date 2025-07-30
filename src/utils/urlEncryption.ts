import CryptoJS from "crypto-js";

// 🔐 ระบบเข้ารหัส URL
export class URLEncryption {
  private static readonly SECRET_KEY =
    import.meta.env.VITE_ENCRYPTION_KEY || "your-secret-key-here";
  private static readonly ALGORITHM = "AES-256-CBC";

  /**
   * 🔒 เข้ารหัสข้อมูลที่สำคัญสำหรับ URL
   * @param data - ข้อมูลที่ต้องการเข้ารหัส
   * @returns ข้อความที่เข้ารหัสแล้วและปลอดภัยสำหรับ URL
   */
  static encrypt(data: string): string {
    try {
      const encrypted = CryptoJS.AES.encrypt(data, this.SECRET_KEY).toString();
      // แปลงเป็น base64 ที่ปลอดภัยสำหรับ URL
      return btoa(encrypted)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
    } catch (error) {
      console.error("การเข้ารหัสล้มเหลว:", error);
      return "";
    }
  }

  /**
   * 🔓 ถอดรหัสข้อมูลที่เข้ารหัสแล้วจาก URL
   * @param encryptedData - ข้อความที่เข้ารหัสแล้วจาก URL
   * @returns ข้อมูลที่ถอดรหัสแล้ว
   */
  static decrypt(encryptedData: string): string {
    try {
      // คืนค่า base64 padding และแปลงกลับ
      const restored = encryptedData.replace(/-/g, "+").replace(/_/g, "/");
      const padded = restored + "=".repeat((4 - (restored.length % 4)) % 4);
      const decrypted = CryptoJS.AES.decrypt(atob(padded), this.SECRET_KEY);
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error("การถอดรหัสล้มเหลว:", error);
      return "";
    }
  }

  /**
   * 📝 การเข้ารหัส URL แบบง่าย (สำหรับข้อมูลที่ไม่สำคัญ)
   * @param data - ข้อมูลที่ต้องการเข้ารหัส
   * @returns ข้อความที่เข้ารหัสแล้วและปลอดภัยสำหรับ URL
   */
  static encode(data: string): string {
    return encodeURIComponent(btoa(data));
  }

  /**
   * 📖 การถอดรหัส URL แบบง่าย
   * @param encodedData - ข้อความที่เข้ารหัสแล้วจาก URL
   * @returns ข้อมูลที่ถอดรหัสแล้ว
   */
  static decode(encodedData: string): string {
    try {
      return atob(decodeURIComponent(encodedData));
    } catch (error) {
      console.error("การถอดรหัสล้มเหลว:", error);
      return "";
    }
  }

  /**
   * 🔗 สร้าง URL ที่เข้ารหัสพร้อมพารามิเตอร์
   * @param basePath - เส้นทางหลัก
   * @param params - พารามิเตอร์ที่ต้องการเข้ารหัส
   * @param useEncryption - ใช้การเข้ารหัส (true) หรือการเข้ารหัสแบบง่าย (false)
   * @returns URL ที่เข้ารหัสแล้ว
   */
  static createSecureURL(
    basePath: string,
    params: Record<string, string | number>,
    useEncryption: boolean = true
  ): string {
    const paramString = JSON.stringify(params);
    const processed = useEncryption
      ? this.encrypt(paramString)
      : this.encode(paramString);
    return `${basePath}/${processed}`;
  }

  /**
   * 🔍 ดึงและถอดรหัสพารามิเตอร์จาก URL
   * @param pathname - เส้นทางปัจจุบัน
   * @param useEncryption - ใช้การถอดรหัส (true) หรือการถอดรหัสแบบง่าย (false)
   * @returns พารามิเตอร์ที่ถอดรหัสแล้ว
   */
  static extractParams(
    pathname: string,
    useEncryption: boolean = true
  ): Record<string, any> {
    const segments = pathname.split("/");
    const encryptedSegment = segments[segments.length - 1];

    if (!encryptedSegment) return {};

    try {
      const decrypted = useEncryption
        ? this.decrypt(encryptedSegment)
        : this.decode(encryptedSegment);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error("ไม่สามารถดึงพารามิเตอร์ได้:", error);
      return {};
    }
  }

  /**
   * 🔐 ตรวจสอบว่า URL มีข้อมูลที่เข้ารหัสหรือไม่
   * @param pathname - เส้นทางปัจจุบัน
   * @returns True ถ้า URL มีข้อมูลที่เข้ารหัส
   */
  static isEncryptedURL(pathname: string): boolean {
    const segments = pathname.split("/");
    const lastSegment = segments[segments.length - 1];

    // ตรวจสอบว่าดูเหมือนข้อมูลที่เข้ารหัส (base64-like พร้อมอักขระที่ปลอดภัยสำหรับ URL)
    return /^[A-Za-z0-9_-]+$/.test(lastSegment) && lastSegment.length > 20;
  }
}

// 🛡️ ระดับการป้องกันเส้นทาง
export enum ProtectionLevel {
  NONE = "none", // ไม่มีการป้องกัน
  ENCODED = "encoded", // การเข้ารหัสแบบง่าย
  ENCRYPTED = "encrypted", // การเข้ารหัสแบบเต็ม
}

// 📋 อินเตอร์เฟสการกำหนดค่าเส้นทางที่ปลอดภัย
export interface SecureRouteConfig {
  path: string;
  element: JSX.Element;
  protectionLevel: ProtectionLevel;
  roles?: string[];
  label?: string;
  icon?: string;
  visibleInSidebar?: boolean;
}

// 🔧 ฟังก์ชันช่วยเหลือสำหรับเส้นทาง
export const RouteHelpers = {
  /**
   * 🔗 สร้างเส้นทางที่ปลอดภัย
   */
  generateSecurePath: (
    basePath: string,
    params: Record<string, any>,
    protectionLevel: ProtectionLevel
  ): string => {
    switch (protectionLevel) {
      case ProtectionLevel.ENCRYPTED:
        return URLEncryption.createSecureURL(basePath, params, true);
      case ProtectionLevel.ENCODED:
        return URLEncryption.createSecureURL(basePath, params, false);
      default:
        // สำหรับ NONE เพิ่มพารามิเตอร์เป็น query string
        const queryParams = new URLSearchParams(
          params as Record<string, string>
        );
        return `${basePath}?${queryParams.toString()}`;
    }
  },

  /**
   * 🔍 แยกวิเคราะห์พารามิเตอร์เส้นทางที่ปลอดภัย
   */
  parseSecureParams: (
    pathname: string,
    protectionLevel: ProtectionLevel
  ): Record<string, any> => {
    switch (protectionLevel) {
      case ProtectionLevel.ENCRYPTED:
        return URLEncryption.extractParams(pathname, true);
      case ProtectionLevel.ENCODED:
        return URLEncryption.extractParams(pathname, false);
      default:
        // สำหรับ NONE แยกวิเคราะห์ query parameters
        const url = new URL(pathname, window.location.origin);
        const params: Record<string, any> = {};
        url.searchParams.forEach((value, key) => {
          params[key] = value;
        });
        return params;
    }
  },
};
