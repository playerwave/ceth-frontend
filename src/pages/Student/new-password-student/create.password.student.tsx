import BubbleBackground from "../../visitor/login/components/BubbleBackground";
import React, { useState } from "react";
import { useAuthStore } from "@/stores/Visitor/auth.store";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";

// 🔧 Custom Eye icons แทน lucide-react
const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const CreatePasswordStudent = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { user, updatePassword } = useAuthStore();

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\|;':"\/.,<>?]/.test(password);

    if (password.length < minLength) {
      return "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";
    }
    if (!hasUpperCase) {
      return "รหัสผ่านต้องมีตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว";
    }
    if (!hasLowerCase) {
      return "รหัสผ่านต้องมีตัวอักษรพิมพ์เล็กอย่างน้อย 1 ตัว";
    }
    if (!hasNumbers) {
      return "รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว";
    }
    if (!hasSpecialChar) {
      return "รหัสผ่านต้องมีอักขระพิเศษอย่างน้อย 1 ตัว";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // ✅ ตรวจสอบว่ามี user หรือ token
    if (!user && !token) {
      setError("ไม่พบข้อมูลผู้ใช้สำหรับการสร้างรหัสผ่าน");
      return;
    }

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    setLoading(true);

    try {
      // ✅ เรียก API อัปเดตรหัสผ่าน
      const result = await updatePassword({ newPassword: password });
      
      if (result.success) {
        // Navigate to main student page after successful password creation
        navigate("/main-student?message=password-created");
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error("Password update error:", err);
      setError("เกิดข้อผิดพลาดในการสร้างรหัสผ่าน");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white-400 flex justify-center items-center px-4 relative">
      <BubbleBackground />

      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full bg-[#1E3A8A] text-white h-[80px] p-4 z-50 flex items-center">
        <h1 className="text-2xl font-bold">Burapha University</h1>
      </div>

      {/* Create Password Form */}
      <div className="w-full max-w-[500px] min-h-[600px] bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg">
        <h1 className="text-black text-3xl font-bold text-center mb-2">
          Burapha University
        </h1>
        <h2 className="text-black mt-10 text-3xl font-semibold mb-6 px-10 text-center"> 
          สร้างรหัสผ่านใหม่
        </h2>
        <p className="text-black text-sm text-center mb-8 px-10">
          กรุณาสร้างรหัสผ่านใหม่สำหรับบัญชีของคุณ
        </p>

        <form className="px-10" onSubmit={handleSubmit}>
          <label className="text-black block mb-1">รหัสผ่านใหม่</label>
          <div className="relative">
            <input
              data-cy="new-password"
              type={showPassword ? "text" : "password"}
              placeholder="รหัสผ่านใหม่"
              className="w-full mb-2 px-4 py-3 rounded-md bg-white/80 focus:outline-none pr-12 text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              data-cy="toggle-password"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-6 -translate-y-1/2 text-gray-600"
            >
              {showPassword ? (
                <EyeOffIcon className="text-gray-600" />
              ) : (
                <EyeIcon className="text-gray-600" />
              )}
            </button>
          </div>

          <label className="text-black block mb-1 mt-4">ยืนยันรหัสผ่าน</label>
          <div className="relative">
            <input
              data-cy="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="ยืนยันรหัสผ่าน"
              className="w-full mb-2 px-4 py-3 rounded-md bg-white/80 focus:outline-none pr-12 text-black"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              data-cy="toggle-confirm-password"
              onClick={() => setShowConfirmPassword((s) => !s)}
              className="absolute right-3 top-6 -translate-y-1/2 text-gray-600"
            >
              {showConfirmPassword ? (
                <EyeOffIcon className="text-gray-600" />
              ) : (
                <EyeIcon className="text-gray-600" />
              )}
            </button>
          </div>

          {/* Password Requirements */}
          <div className="text-black text-sm mt-2 mb-4">
            <p className="font-semibold mb-2 text-base">ข้อกำหนดรหัสผ่าน:</p>
            <ul className="space-y-1.5">
              <li className={password.length >= 8 ? "text-green-600" : "text-gray-500"}>
                • อย่างน้อย 8 ตัวอักษร
              </li>
              <li className={/[A-Z]/.test(password) ? "text-green-600" : "text-gray-500"}>
                • มีตัวอักษรพิมพ์ใหญ่
              </li>
              <li className={/[a-z]/.test(password) ? "text-green-600" : "text-gray-500"}>
                • มีตัวอักษรพิมพ์เล็ก
              </li>
              <li className={/\d/.test(password) ? "text-green-600" : "text-gray-500"}>
                • มีตัวเลข
              </li>
              <li className={/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\|;':"\/.,<>?]/.test(password) ? "text-green-600" : "text-gray-500"}>
                • มีอักขระพิเศษ
              </li>
            </ul>
          </div>

          {error && (
            <p className="text-red-600 text-sm mt-2 text-left">{error}</p>
          )}

          <div className="flex flex-col gap-4 mt-6">
            <StyledButtonWrapper>
              <button
                type="submit"
                data-cy="create-password-button"
                disabled={loading}
                className={`button button-item ${loading && "opacity-50 cursor-not-allowed"}`}
              >
                <span className="button-bg">
                  <span className="button-bg-layers">
                    <span className="button-bg-layer button-bg-layer-1 -blue" />
                    <span className="button-bg-layer button-bg-layer-2 -purple" />
                    <span className="button-bg-layer button-bg-layer-3 -cyan" />
                  </span>
                </span>
                <span className="button-inner">
                  <span className="button-inner-static">
                    {loading ? "กำลังสร้างรหัสผ่าน..." : "สร้างรหัสผ่าน"}
                  </span>
                  <span className="button-inner-hover">
                    {loading ? "กำลังสร้างรหัสผ่าน..." : "สร้างรหัสผ่าน"}
                  </span>
                </span>
              </button>
            </StyledButtonWrapper>

            <div className="text-black text-center">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="underline hover:text-blue-600"
              >
                กลับไปหน้าเข้าสู่ระบบ
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const StyledButtonWrapper = styled.div`
  width: 100%;
  
  button {
    all: unset;
  }

  .button {
    position: relative;
    display: flex;
    width: 100%;
    height: auto;
    align-items: center;
    justify-content: center;
    border-radius: 0.375rem;
    padding: 0.75rem 1rem;
    font-family: inherit;
    font-size: 1rem;
    font-weight: 600;
    color: #fafaf6;
    letter-spacing: -0.02em;
    cursor: pointer;
    box-sizing: border-box;
  }

  .button-item {
    background-color: transparent;
    color: #ffffff;
  }

  .button-item .button-bg {
    border-color: #1E3A8A;
    background-color: #1E3A8A;
  }

  .button-inner,
  .button-inner-hover,
  .button-inner-static {
    pointer-events: none;
    display: block;
  }

  .button-inner {
    position: relative;
  }

  .button-inner-hover {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    transform: translateY(70%);
  }

  .button-bg {
    overflow: hidden;
    border-radius: 0.375rem;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: scale(1);
    transition: transform 1.8s cubic-bezier(0.19, 1, 0.22, 1);
    border: 2px solid transparent;
  }

  .button:hover .button-bg {
    border-color: #1E3A8A;
  }

  .button-bg,
  .button-bg-layer,
  .button-bg-layers {
    display: block;
  }

  .button-bg-layers {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    top: -60%;
    aspect-ratio: 1 / 1;
    width: max(200%, 10rem);
  }

  .button-bg-layer {
    border-radius: 0.375rem;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: scale(0);
  }

  .button-bg-layer.-blue {
    background-color: #ffffff;
  }

  .button-bg-layer.-purple {
    background-color: #ffffff;
  }

  .button-bg-layer.-cyan {
    background-color: #ffffff;
  }

  .button:hover .button-inner-static {
    opacity: 0;
    transform: translateY(-70%);
    transition:
      transform 1.4s cubic-bezier(0.19, 1, 0.22, 1),
      opacity 0.3s linear;
  }

  .button:hover .button-inner-hover {
    opacity: 1;
    transform: translateY(0);
    color: #1E3A8A;
    transition:
      transform 1.4s cubic-bezier(0.19, 1, 0.22, 1),
      opacity 1.4s cubic-bezier(0.19, 1, 0.22, 1),
      color 0.3s linear;
  }

  .button:hover .button-bg-layer {
    transition:
      transform 1.3s cubic-bezier(0.19, 1, 0.22, 1),
      opacity 0.3s linear;
  }

  .button:hover .button-bg-layer-1 {
    transform: scale(1);
  }

  .button:hover .button-bg-layer-2 {
    transition-delay: 0.1s;
    transform: scale(1);
  }

  .button:hover .button-bg-layer-3 {
    transition-delay: 0.2s;
    transform: scale(1);
  }

  .button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .button:disabled:hover .button-inner-static,
  .button:disabled:hover .button-inner-hover,
  .button:disabled:hover .button-bg-layer {
    transform: none;
    opacity: 1;
  }
`;

export default CreatePasswordStudent;
