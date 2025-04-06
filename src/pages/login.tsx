import { useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

//import authStore
import { useAuthStore } from "../stores/auth.store";

interface GoogleJwtPayload {
  name: string;
  email: string;
  picture: string;
}

const Login = () => {
  const { login } = useAuthStore();
  const [user, setUser] = useState<GoogleJwtPayload | null>(null);
  const navigate = useNavigate(); // ✅ ใช้สำหรับ redirect

  const handleLoginSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      const decoded = jwtDecode<GoogleJwtPayload>(
        credentialResponse.credential
      );
      console.log("✅ JWT Token:", credentialResponse.credential);
      console.log("👤 Decoded User:", decoded);

      if (decoded.email !== "unizalgroup@gmail.com") {
        if (!decoded.email.endsWith("@go.buu.ac.th")) {
          alert("❌ ต้องใช้ email @go.buu.ac.th เท่านั้น");
          return;
        }
      }

      login(decoded.email)
        .then(() => {
          setUser(decoded);

          // ✅ ใช้ user role จาก store ใน zustand
          const role = useAuthStore.getState().user?.u_role;

          if (role === "admin") {
            navigate("/main-admin");
          } else if (role === "student") {
            navigate("/main-student");
          } else {
            alert("❌ ไม่สามารถระบุบทบาทของผู้ใช้ได้");
          }
        })
        .catch((err) => {
          alert("❌ ไม่พบ email นี้ในระบบ");
          console.error(err);
        });
    } else {
      console.error("❌ No credential found in response.");
    }
  };

  return (
    <div>
      <h1>whatsup brother</h1>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => console.log("❌ Login failed")}
      />

      <br />
      {user && (
        <div style={{ marginTop: "20px" }}>
          <h2>👋 Hello, {user.name}</h2>
          <p>📧 Email: {user.email}</p>
          <img
            src={user.picture}
            alt="profile"
            width={100}
            style={{ borderRadius: "50%" }}
            referrerPolicy="no-referrer"
          />
        </div>
      )}
    </div>
  );
};

export default Login;
