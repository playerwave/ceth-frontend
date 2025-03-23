import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
<<<<<<< HEAD
import { GoogleOAuthProvider } from "@react-oauth/google";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
=======
>>>>>>> b18dec3 (add recomend activity (no store))

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
<<<<<<< HEAD
      <GoogleOAuthProvider clientId={CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
=======
      <App />
>>>>>>> b18dec3 (add recomend activity (no store))
    </BrowserRouter>
  </StrictMode>
);
