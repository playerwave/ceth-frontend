import BubbleBackground from "../login/components/BubbleBackground";
import React, { useState } from "react";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import { useAuthStore } from "@/stores/Visitor/auth.store";

const ForgotPassword = () => {
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { sendForgotPasswordCode } = useAuthStore();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email.trim()) {
      setError('กรุณากรอกอีเมล');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('รูปแบบอีเมลไม่ถูกต้อง');
      return;
    }

    // Check if email ends with @go.buu.ac.th
    if (!email.endsWith('@go.buu.ac.th')) {
      setError('กรุณาใช้อีเมล @go.buu.ac.th เท่านั้น');
      return;
    }

    setLoading(true);

    try {
      const result = await sendForgotPasswordCode({ email });
      
      if (result.success) {
        setSuccess(result.message);
        setStep('code');
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('Send code error:', err);
      setError('เกิดข้อผิดพลาดในการส่งรหัสยืนยัน');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (code.length !== 6) {
      setError('กรุณากรอกรหัส 6 หลัก');
      return;
    }

    setLoading(true);

    try {
      // ✅ ตรวจสอบรหัส 6 หลัก เมื่อถูกต้องให้ไปหน้า create password
      const response = await fetch('http://localhost:5090/api/auth/forgot-password/verify-code-only', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const result = await response.json();
      
      if (result.success) {
        setSuccess('รหัสถูกต้อง กำลังนำไปหน้าสร้างรหัสผ่านใหม่...');
        // Navigate to create password page with email and code
        setTimeout(() => {
          navigate(`/new-password?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`);
        }, 1000);
      } else {
        setError(result.message || 'รหัสไม่ถูกต้อง');
      }
    } catch (err) {
      console.error('Verify code error:', err);
      setError('เกิดข้อผิดพลาดในการตรวจสอบรหัส');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
      <BubbleBackground />
      
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              ลืมรหัสผ่าน?
            </h1>
            {step === 'email' ? (
              <div className="space-y-1 text-gray-600 font-semibold">
                <p>
                  กรอกอีเมลของคุณ รหัสยืนยันจะถูกส่งไปที่อีเมลของคุณ
                </p>
                <p>
                  กรุณาใช้อีเมล @go.buu.ac.th เท่านั้น
                </p>
              </div>
            ) : (
              <p>
                กรอกรหัส 6 หลักที่ได้รับจากอีเมล
              </p>
            )}
          </div>

          {/* Form */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <TextField
                label="อีเมล"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                error={!!error}
                helperText={error || ' '}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#f9fafb',
                    '& fieldset': {
                      borderColor: '#e5e7eb',
                    },
                    '&:hover fieldset': {
                      borderColor: '#3b82f6',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3b82f6',
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#6b7280',
                  },
                }}
              />

              <Button
                type="submit"
                disabled={loading}
                width="100%"
                textColor="#FFFFFF"
              >
                {loading ? 'กำลังส่ง...' : 'ส่งรหัสยืนยัน'}
              </Button>

              <Button
                type="button"
                onClick={() => navigate('/login')}
                disabled={loading}
                variant="text"
                width="100%"
                textColor="#FFFFFF"
              >
                กลับไปหน้าเข้าสู่ระบบ
              </Button>
            </form>
          )}
          {step === 'code' && (
            <form onSubmit={handleCodeSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  รหัสยืนยัน (6 หลัก)
                </label>
                <TextField
                  value={code}
                  onChange={handleCodeChange}
                  fullWidth
                  required
                  error={!!error}
                  helperText={error || ' '}
                  disabled={loading}
                  inputProps={{
                    maxLength: 6,
                    pattern: '[0-9]*',
                    inputMode: 'numeric',
                    style: {
                      textAlign: 'center',
                      fontSize: '2rem',
                      letterSpacing: '0.5rem',
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: '#f9fafb',
                      '& fieldset': {
                        borderColor: '#e5e7eb',
                      },
                      '&:hover fieldset': {
                        borderColor: '#3b82f6',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#3b82f6',
                        borderWidth: '2px',
                      },
                    },
                  }}
                />
                <p className="text-sm text-gray-500 mt-2 text-center">
                  รหัสถูกส่งไปที่ <span className="font-semibold">{email}</span>
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading || code.length !== 6}
                width="100%"

                textColor="#FFFFFF"
              >
                {loading ? 'กำลังตรวจสอบ...' : 'ยืนยันรหัส'}
              </Button>

              <div className="flex justify-between items-center text-sm">
                <Button
                  type="button"
                  onClick={() => setStep('email')}
                  disabled={loading}
                  variant="text"
                  bgColor="transparent"
                  textColor="#2563eb"
                  className="!text-sm !font-normal hover:underline"
                >
                  ← เปลี่ยนอีเมล
                </Button>
                <Button
                  type="button"
                  onClick={handleEmailSubmit}
                  disabled={loading}
                  variant="text"
                  bgColor="transparent"
                  textColor="#2563eb"
                  className="!text-sm !font-normal hover:underline"
                >
                  ส่งรหัสใหม่
                </Button>
              </div>
            </form>
          )}

          {/* Success and Error Messages */}
          {success && step === 'code' && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}
          {error && step === 'code' && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

