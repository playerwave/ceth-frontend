// ✅ แบบใหม่ที่ถูกต้อง
module.exports = {
  plugins: [
    require("@tailwindcss/postcss")(), // ใช้ plugin ใหม่
    require("autoprefixer"),
  ],
};
