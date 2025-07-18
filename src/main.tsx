// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.tsx";
// import { BrowserRouter } from "react-router-dom";
// import { GoogleOAuthProvider } from "@react-oauth/google";

// const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

// createRoot(document.getElementById("root")!).render(
//   <StrictMode>
//     <BrowserRouter>
//       <GoogleOAuthProvider clientId={CLIENT_ID}>
//         <App />
//       </GoogleOAuthProvider>
//     </BrowserRouter>
//   </StrictMode>,
// );
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <GoogleOAuthProvider clientId={CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
