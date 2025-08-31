// import React, { useState } from "react";
// import { useAuthStore } from "../../../stores/Visitor/auth.store";
// import { useNavigate } from "react-router-dom";

// // 🔧 Custom Eye icons แทน lucide-react
// const EyeIcon = ({ className }: { className?: string }) => (
//   <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
//     <circle cx="12" cy="12" r="3"/>
//   </svg>
// );

// const EyeOffIcon = ({ className }: { className?: string }) => (
//   <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
//     <line x1="1" y1="1" x2="23" y2="23"/>
//   </svg>
// );

// const Login = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const { authError, login, authLoading } = useAuthStore();
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();

//   await login({ username, password });

//   const user = useAuthStore.getState().user;
//   const error = useAuthStore.getState().authError;

//   console.log(user?.role_id);
  
//   if (!error && user) {
//     switch (user.role_id) {
//       case 1:
//       case 2:
//         navigate("/");
//         break;
//       case 3:
//         navigate("/main-student");
//         console.log("navigate to main-student");
        
//         break;
//       default:
//         navigate("/activity-info-visitor");
//     }
//   }
// };

//   return (
//     <div className="min-h-screen bg-gray-400 flex justify-center items-center px-4">
//       {/* Navbar */}
//       <div className="fixed top-0 left-0 w-full bg-[#1E3A8A] text-white h-[80px] p-4 z-50 flex items-center">
//         <h1 className="text-2xl font-bold">Burapha University</h1>
//       </div>

//       {/* Login Form */}
//       <div className="w-full max-w-[500px] min-h-[600px] bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg">
//         <h1 className="text-white text-3xl font-bold text-center mb-2">
//           Burapha University
//         </h1>
//         <h2 className="text-white mt-10 text-3xl font-semibold mb-6 px-10 text-left"> 
//           Login
//         </h2>

//         <form className="px-10" onSubmit={handleSubmit}>
//           <label className="text-white block mb-1">Username</label>
//           <input
//             data-cy="username"
//             type="text"
//             placeholder="Username"
//             className="w-full mb-4 px-4 py-3 rounded-md bg-white/80 focus:outline-none"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//           />

//           <label className="text-white block mb-1">Password</label>
//           <div className="relative">
//             <input
//               data-cy="password"
//               type={showPassword ? "text" : "password"}
//               placeholder="Password"
//               className="w-full mb-2 px-4 py-3 rounded-md bg-white/80 focus:outline-none pr-12"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//             <button
//               type="button"
//               data-cy="toggle-password"
//               onClick={() => setShowPassword((s) => !s)}
//               className="absolute right-3 top-6 -translate-y-1/2 text-gray-600"
//             >
//               {showPassword ? (
//                 <EyeOffIcon className="text-gray-400" />
//               ) : (
//                 <EyeIcon className="text-gray-400" />
//               )}
//             </button>
//           </div>

//           {authError && (
//             <p className="text-red-200 text-sm mt-2 text-left">{authError}</p>
//           )}

//           <div className="text-white text-sm mb-2 mt-2 underline cursor-pointer text-left">
//             Forgot Password?
//           </div>

//           <button
//             type="submit"
//             data-cy="signin-button"
//             disabled={authLoading}
//             className={`w-full bg-blue-900 text-white py-3 rounded-md mt-5 font-semibold hover:bg-blue-800 ${
//               authLoading && "opacity-50 cursor-not-allowed"
//             }`}
//           >
//             {authLoading ? "Signing in..." : "Sign in"}
//           </button>

//           <div className="text-white text-center my-4">or continue with</div>
//           <button
//             type="button"
//             className="w-full bg-white py-3 rounded-md flex justify-center hover:bg-gray-100 items-center"
//           >
//             <img
//               src="https://developers.google.com/identity/images/g-logo.png"
//               alt="Google"
//               className="w-6 h-6"
//             />
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;

import BubbleBackground from "./components/BubbleBackground";
import React, { useState } from "react";
import { useAuthStore } from "../../../stores/Visitor/auth.store";
import { useNavigate } from "react-router-dom";
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

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { authError, login, authLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  await login({ username, password });

  const user = useAuthStore.getState().user;
  const error = useAuthStore.getState().authError;

  console.log(user?.role_id);
  
  if (!error && user) {
    switch (user.role_id) {
      case 1:
      case 2:
        navigate("/");
        break;
      case 3:
        navigate("/main-student");
        console.log("navigate to main-student");
        
        break;
      default:
        navigate("/activity-info-visitor");
    }
  }
};
  return (
    <div className="min-h-screen bg-white-400 flex justify-center items-center px-4 relative">
      <BubbleBackground />

      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full bg-[#1E3A8A] text-white h-[80px] p-4 z-50 flex items-center">
        <h1 className="text-2xl font-bold">Burapha University</h1>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-[500px] min-h-[600px] bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg">
         <h1 className="text-black text-3xl font-bold text-center mb-2">
           Burapha University
        </h1>
         <h2 className="text-black mt-10 text-3xl font-semibold mb-6 px-10 text-center"> 
           Login
         </h2>

         <form className="px-10" onSubmit={handleSubmit}>
           <label className="text-black block mb-1">Username</label>
          <input
            data-cy="username"
            type="text"
            placeholder="Username"
            className="w-full mb-4 px-4 py-3 rounded-md bg-white/80 focus:outline-none text-black"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label className="text-black block mb-1">Password</label>
          <div className="relative">
            <input
              data-cy="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
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

          {authError && (
            <p className="text-red-600 text-sm mt-2 text-left">{authError}</p>
          )}

          <div className="text-black text-sm mb-2 mt-2 underline cursor-pointer text-left">
            Forgot Password?
          </div>

          <div className="flex flex-col gap-4">
            <StyledButtonWrapper>
              <button
                type="submit"
                data-cy="signin-button"
                disabled={authLoading}
                className={`button button-item ${authLoading && "opacity-50 cursor-not-allowed"}`}
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
                    {authLoading ? "Signing in..." : "Sign in"}
                  </span>
                  <span className="button-inner-hover">
                    {authLoading ? "Signing in..." : "Sign in"}
                  </span>
                </span>
              </button>
            </StyledButtonWrapper>

            <div className="text-black text-center">or continue with</div>
            
            <StyledGoogleButtonWrapper>
              <button
                type="button"
                className="google-button google-button-item"
              >
                <span className="google-button-bg">
                  <span className="google-button-bg-layers">
                    <span className="google-button-bg-layer google-button-bg-layer-1 -white" />
                    <span className="google-button-bg-layer google-button-bg-layer-2 -light-gray" />
                    <span className="google-button-bg-layer google-button-bg-layer-3 -gray" />
                  </span>
                </span>
                <span className="google-button-inner">
                  <span className="google-button-inner-static">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://developers.google.com/identity/images/g-logo.png"
                        alt="Google"
                        className="w-6 h-6"
                      />
                      <p>Google</p>
                    </div>
                  </span>
                  <span className="google-button-inner-hover">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://developers.google.com/identity/images/g-logo.png"
                        alt="Google"
                        className="w-6 h-6"
                      />
                      <p>Google</p>
                    </div>
                  </span>
                </span>
              </button>
            </StyledGoogleButtonWrapper>
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

const StyledGoogleButtonWrapper = styled.div`
  width: 100%;
  
  button {
    all: unset;
  }

  .google-button {
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
    color: #1d1d1f;
    letter-spacing: -0.02em;
    cursor: pointer;
    box-sizing: border-box;
  }

  .google-button-item {
    background-color: transparent;
    color: #1d1d1f;
  }

  .google-button-item .google-button-bg {
    border-color: #d1d5db;
    background-color: #ffffff;
  }

  .google-button-inner,
  .google-button-inner-hover,
  .google-button-inner-static {
    pointer-events: none;
    display: block;
  }

  .google-button-inner {
    position: relative;
  }

  .google-button-inner-hover {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    transform: translateY(70%);
  }

  .google-button-bg {
    overflow: hidden;
    border-radius: 0.375rem;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: scale(1);
    transition: transform 1.8s cubic-bezier(0.19, 1, 0.22, 1);
    border: 2px solid #d1d5db;
  }

  .google-button:hover .google-button-bg {
    border-color: #1E3A8A;
  }

  .google-button-bg,
  .google-button-bg-layer,
  .google-button-bg-layers {
    display: block;
  }

  .google-button-bg-layers {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    top: -60%;
    aspect-ratio: 1 / 1;
    width: max(200%, 10rem);
  }

  .google-button-bg-layer {
    border-radius: 0.375rem;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: scale(0);
  }

  .google-button-bg-layer.-white {
    background-color: #ffffff;
  }

  .google-button-bg-layer.-light-gray {
    background-color: #f9fafb;
  }

  .google-button-bg-layer.-gray {
    background-color: #f3f4f6;
  }

  .google-button:hover .google-button-inner-static {
    opacity: 0;
    transform: translateY(-70%);
    transition:
      transform 1.4s cubic-bezier(0.19, 1, 0.22, 1),
      opacity 0.3s linear;
  }

  .google-button:hover .google-button-inner-hover {
    opacity: 1;
    transform: translateY(0);
    color: #1E3A8A;
    transition:
      transform 1.4s cubic-bezier(0.19, 1, 0.22, 1),
      opacity 1.4s cubic-bezier(0.19, 1, 0.22, 1),
      color 0.3s linear;
  }

  .google-button:hover .google-button-bg-layer {
    transition:
      transform 1.3s cubic-bezier(0.19, 1, 0.22, 1),
      opacity 0.3s linear;
  }

  .google-button:hover .google-button-bg-layer-1 {
    transform: scale(1);
  }

  .google-button:hover .google-button-bg-layer-2 {
    transition-delay: 0.1s;
    transform: scale(1);
  }

  .google-button:hover .google-button-bg-layer-3 {
    transition-delay: 0.2s;
    transform: scale(1);
  }
`;

export default Login;