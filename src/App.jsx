
import { useEffect, useRef } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { handleAuthCallback } from "@netlify/identity";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import NewPost from "./pages/NewPost";
import Login from "./pages/Login";
import Register from "./pages/Register";

function IdentityCallbackHandler() {
  const navigate = useNavigate();
  const hasStarted = useRef(false);

  useEffect(() => {
    const hasAuthToken = /^#(confirmation_token|recovery_token|invite_token|email_change_token|access_token)=/.test(
      window.location.hash
    );
    if (!hasAuthToken || hasStarted.current) return;
    hasStarted.current = true;

    handleAuthCallback()
      .then((result) => {
        if (!result) return;

        if (result.type === "confirmation") {
          navigate("/login?confirmed=1", { replace: true });
        } else if (result.type === "oauth") {
          navigate("/", { replace: true });
        } else if (result.type === "email_change") {
          navigate("/login?emailUpdated=1", { replace: true });
        } else {
          const flow = result.type === "invite" ? "Invitations" : "Account recovery";
          navigate(
            `/login?authError=${encodeURIComponent(`${flow} is not set up on this site.`)}`,
            { replace: true }
          );
        }
      })
      .catch((error) => {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to complete the authentication link.";
        navigate(`/login?authError=${encodeURIComponent(message)}`, {
          replace: true,
        });
      });
  }, [navigate]);

  return null;
}

export default function App() {
  return (
    <>
      <IdentityCallbackHandler />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/new-post" element={<NewPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
}
