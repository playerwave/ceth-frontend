import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // หรือใช้ <span> 👁️ แทนถ้าไม่ติดตั้ง icon lib

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-blue-400 flex justify-center items-center px-4">
      <div className="fixed top-0 left-0 w-full bg-[#1E3A8A] text-white h-[80px] p-4 z-50 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Burapha University</h1>
        </div>
      </div>

      <div className="w-full max-w-[500px] min-h-[600px] bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg">
        <h1 className="text-white text-3xl font-bold text-center mb-2">
          Burapha University
        </h1>
        <h2 className="text-white mt-10 text-3xl font-semibold mb-6 px-10 text-left">
          Login
        </h2>

        <form className="px-10">
          <label className="text-white block mb-1">Student ID</label>
          <input
            type="text"
            placeholder="Student id"
            className="w-full mb-4 px-4 py-3 rounded-md bg-white/80 focus:outline-none"
          />

          <label className="text-white block mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full mb-2 px-4 py-3 rounded-md bg-white/80 focus:outline-none pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-6 transform -translate-y-1/2 text-gray-600 cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="text-gray-400" size={20} />
              ) : (
                <Eye className="text-gray-400" size={20} />
              )}
            </button>
          </div>

          <div className="text-white text-sm mb-2 mt-2 underline cursor-pointer text-left ">
            Forgot Password?
          </div>

          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-3 rounded-md mt-5 font-semibold hover:bg-blue-800"
          >
            Sign in
          </button>

          <div className="text-white text-center my-4">or continue with</div>

          <button
            type="button"
            className="w-full bg-white py-3 rounded-md flex justify-center hover:bg-gray-100 items-center"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="w-6 h-6"
            />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
