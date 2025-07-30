/// <reference types="vite/client" />

// 📋 Environment variables types
interface ImportMetaEnv {
  readonly VITE_CLIENT_ID: string;
  readonly VITE_ENCRYPTION_KEY: string;
  // เพิ่ม environment variables อื่นๆ ตามต้องการ
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// 📋 CSS modules types
declare module "*.css" {
  const content: string;
  export default content;
}

declare module "*.scss" {
  const content: string;
  export default content;
}

declare module "*.sass" {
  const content: string;
  export default content;
}

declare module "*.less" {
  const content: string;
  export default content;
}

declare module "*.styl" {
  const content: string;
  export default content;
}
