// import React, { useState } from "react";
// import { Eye, EyeOff } from "lucide-react";
// import { useAuthStore } from "../stores/Visitor/auth.store";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   // ➡ เปลี่ยนเป็น username
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const { login, authError, authLoading } = useAuthStore();
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     // ➡ เรียก login ด้วย { username, password }
//     await login({ username, password });

//     if (!authError) {
//       navigate("/main-student");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-blue-400 flex justify-center items-center px-4">
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
//               type={showPassword ? "text" : "password"}
//               placeholder="Password"
//               className="w-full mb-2 px-4 py-3 rounded-md bg-white/80 focus:outline-none pr-12"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword((s) => !s)}
//               className="absolute right-3 top-6 -translate-y-1/2 text-gray-600"
//             >
//               {showPassword ? (
//                 <EyeOff size={20} className="text-gray-400" />
//               ) : (
//                 <Eye size={20} className="text-gray-400" />
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

import React, { useState, useEffect, useRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../stores/Visitor/auth.store";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { isAuthenticated, user, authError, login, authLoading } = useAuthStore();
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   await login({ username, password });

  //   const user = useAuthStore.getState().user;

  //   if (!authError && user) {
  //     if (user.role_id === 1 || user.role_id === 2) {
  //       navigate("/"); // Admin / Teacher
  //       console.log('Admin or Teacher: ', user.role_id);
        
  //     } else if (user.role_id === 3) {
  //       navigate("/main-student"); // Student
  //       console.log("Student role_id: ", user.role_id);
        
  //     } else {
  //       navigate("/activity-info-visitor"); // Visitor or other role
  //       console.log("Visitor: ",  user.role_id);
        
  //     }
  //   }
  // };

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




//   useEffect(() => {
//   console.log("🔍 useEffect triggered");
//   console.log("authLoading:", authLoading);
//   console.log("isAuthenticated:", isAuthenticated);
//   console.log("authError:", authError);
//   console.log("user:", user);

//   if (!authLoading && isAuthenticated && user && !authError && !hasRedirected.current) {
//     hasRedirected.current = true;
//     console.log("✅ Passing condition with role_id:", user.role_id);

//     if (user.role_id === 1 || user.role_id === 3) {
//       navigate("/");
//       console.log("➡️ Navigating to Admin/Teacher");
//     } else if (user.role_id === 2) {
//       navigate("/main-student");
//       console.log("➡️ Navigating to Student");
//     } else {
//       navigate("/activity-info-visitor");
//       console.log("🛑 Unexpected role_id → Navigating to Visitor");
//     }
//   }
// }, [authLoading, isAuthenticated, user, authError]);



  return (
    <div className="min-h-screen bg-blue-400 flex justify-center items-center px-4">
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full bg-[#1E3A8A] text-white h-[80px] p-4 z-50 flex items-center">
        <h1 className="text-2xl font-bold">Burapha University</h1>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-[500px] min-h-[600px] bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg">
        <h1 className="text-white text-3xl font-bold text-center mb-2">
          Burapha University
        </h1>
        <h2 className="text-white mt-10 text-3xl font-semibold mb-6 px-10 text-left">
          Login
        </h2>

        <form className="px-10" onSubmit={handleSubmit}>
          <label className="text-white block mb-1">Username</label>
          <input
            type="text"
            placeholder="Username"
            className="w-full mb-4 px-4 py-3 rounded-md bg-white/80 focus:outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label className="text-white block mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full mb-2 px-4 py-3 rounded-md bg-white/80 focus:outline-none pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-6 -translate-y-1/2 text-gray-600"
            >
              {showPassword ? (
                <EyeOff size={20} className="text-gray-400" />
              ) : (
                <Eye size={20} className="text-gray-400" />
              )}
            </button>
          </div>

          {authError && (
            <p className="text-red-200 text-sm mt-2 text-left">{authError}</p>
          )}

          <div className="text-white text-sm mb-2 mt-2 underline cursor-pointer text-left">
            Forgot Password?
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className={`w-full bg-blue-900 text-white py-3 rounded-md mt-5 font-semibold hover:bg-blue-800 ${
              authLoading && "opacity-50 cursor-not-allowed"
            }`}
          >
            {authLoading ? "Signing in..." : "Sign in"}
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
