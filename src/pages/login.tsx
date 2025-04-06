import { useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

interface GoogleJwtPayload {
  name: string;
  email: string;
  picture: string;
}

const Login = () => {
  const [user, setUser] = useState<GoogleJwtPayload | null>(null);

  const handleLoginSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      const decoded = jwtDecode<GoogleJwtPayload>(credentialResponse.credential);
      console.log("✅ JWT Token:", credentialResponse.credential);
      console.log("👤 Decoded User:", decoded);
      setUser(decoded); // ⭐ เก็บข้อมูลไว้ใน state
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
          <img src={user.picture} alt={user.name} width={100} style={{ borderRadius: "50%" }} />
        </div>
      )}
    </div>
  );
};

export default Login;

