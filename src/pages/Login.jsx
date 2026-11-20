
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { login } from "@netlify/identity";

export default function Login() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState(
    searchParams.get("confirmed")
      ? "Your email is confirmed. Log in to continue."
      : searchParams.get("emailUpdated")
        ? "Your email address has been updated."
      : searchParams.get("authError") || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    try {
      const user = await login(email, password);
      setMessage(`Logged in as ${user.email}.`);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Login failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleLogin}>
        <h1>Login</h1>

        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />

        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />

        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        {message ? (
          <p className="auth-message" role="status" aria-live="polite">
            {message}
          </p>
        ) : null}

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </main>
  );
}
