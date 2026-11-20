
import { useState } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated, signup } from "@netlify/identity";

export default function Register() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister(event) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const fullName = String(formData.get("fullName") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    try {
      await signup(email, password, { full_name: fullName });
      setMessage(
        (await isAuthenticated())
          ? "Account created and logged in."
          : "Account created. Check your email to confirm your account, then log in."
      );
      form.reset();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleRegister}>
        <h1>Register</h1>

        <label htmlFor="register-name">Full Name</label>
        <input
          id="register-name"
          name="fullName"
          type="text"
          required
          autoComplete="name"
        />

        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />

        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />

        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Register"}
        </button>

        {message ? (
          <p className="auth-message" role="status" aria-live="polite">
            {message}
          </p>
        ) : null}

        <p>
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}
