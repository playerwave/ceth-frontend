// import { useState } from "react";
// import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";
// import { useNavigate } from "react-router-dom";

// //import authStore
// import { useAuthStore } from "../stores/auth.store";

// interface GoogleJwtPayload {
//   name: string;
//   email: string;
//   picture: string;
// }

// const Login = () => {
//   const { login } = useAuthStore();
//   const [user, setUser] = useState<GoogleJwtPayload | null>(null);
//   const navigate = useNavigate(); // ✅ ใช้สำหรับ redirect

//   const handleLoginSuccess = (credentialResponse: CredentialResponse) => {
//     if (credentialResponse.credential) {
//       const decoded = jwtDecode<GoogleJwtPayload>(
//         credentialResponse.credential
//       );
//       console.log("✅ JWT Token:", credentialResponse.credential);
//       console.log("👤 Decoded User:", decoded);

//       if (decoded.email !== "unizalgroup@gmail.com") {
//         if (!decoded.email.endsWith("@go.buu.ac.th")) {
//           alert("❌ ต้องใช้ email @go.buu.ac.th เท่านั้น");
//           return;
//         }
//       }

//       login(decoded.email)
//         .then(() => {
//           setUser(decoded);

//           useAuthStore.setState((prev) => ({
//             user: {
//               ...prev.user!,
//               picture: decoded.picture, // ← เพิ่มเข้ามา
//             },
//           }));

//           // ✅ ใช้ user role จาก store ใน zustand
//           const role = useAuthStore.getState().user?.u_role;
//           console.log("role: ", role);

//           if (role === "admin") {
//             navigate("/main-admin");
//           } else if (role === "student") {
//             navigate("/main-student");
//           } else {
//             alert("❌ ไม่สามารถระบุบทบาทของผู้ใช้ได้");
//           }
//         })
//         .catch((err) => {
//           alert("❌ ไม่พบ email นี้ในระบบ");
//           console.error(err);
//         });
//     } else {
//       console.error("❌ No credential found in response.");
//     }
//   };

//   return (
//     <div>
//       <h1>whatsup brother</h1>
//       <GoogleLogin
//         onSuccess={handleLoginSuccess}
//         onError={() => console.log("❌ Login failed")}
//       />

//       <br />
//       {user && (
//         <div style={{ marginTop: "20px" }}>
//           <h2>👋 Hello, {user.name}</h2>
//           <p>📧 Email: {user.email}</p>
//           <img
//             src={user.picture}
//             alt="profile"
//             width={100}
//             style={{ borderRadius: "50%" }}
//             referrerPolicy="no-referrer"
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default Login;

import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";

interface GoogleJwtPayload {
  name: string;
  email: string;
  picture: string;
}

const Login = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [user, setUser] = useState<GoogleJwtPayload | null>(null);

  const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      const decoded = jwtDecode<GoogleJwtPayload>(
        credentialResponse.credential
      );

      console.log("✅ JWT Token:", credentialResponse.credential);
      console.log("👤 Decoded User:", decoded);

      if (
        decoded.email !== "unizalgroup@gmail.com" &&
        !decoded.email.endsWith("@go.buu.ac.th")
      ) {
        alert("❌ ต้องใช้ email @go.buu.ac.th เท่านั้น");
        return;
      }

      try {
        await login(decoded.email);

        useAuthStore.setState((prev) => ({
          user: {
            ...prev.user!,
            picture: decoded.picture,
          },
        }));

        setUser(decoded);

        const role = useAuthStore.getState().user?.u_role;
        console.log("user role: ", role);
        if (role === "admin") navigate("/main-admin");
        else if (role === "student") navigate("/main-student");
        else alert("❌ ไม่สามารถระบุบทบาทของผู้ใช้ได้");
      } catch (err) {
        alert("❌ ไม่พบ email นี้ในระบบ");
        console.error(err);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-xl text-center w-[350px]">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          ลงชื่อเข้าใช้งาน
        </h2>

        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={() => console.log("❌ Login failed")}
          theme="outline"
          size="large"
          width="300"
        />

        {user && (
          <div className="mt-6 text-center">
            <h3 className="text-lg font-medium text-gray-800">
              👋 Hello, {user.name}
            </h3>
            <p className="text-sm text-gray-500">📧 {user.email}</p>
            <img
              src={user.picture}
              alt="profile"
              className="w-20 h-20 rounded-full mx-auto mt-3"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
