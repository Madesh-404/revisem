
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await registerUser({ name, email, password });

      navigate("/login", {
        replace: true,
        state: {
          message: "Account created successfully. Please log in.",
        },
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-brand-panel">
        <header className="auth-brand">
          <div className="auth-brand-icon" aria-hidden="true">
            R
          </div>

          <div>
            <p className="auth-brand-name">REVISEM</p>
            <p className="auth-brand-tagline">
              Smart Revision Planner
            </p>
          </div>
        </header>

        <div className="auth-intro">
          <h2>Make every revision count</h2>
          <p>
            Organize your subjects, plan your study time,
            and build a revision routine that adapts to you.
          </p>

          <div className="auth-illustration" aria-hidden="true">
            <div className="auth-illustration-symbol">✓</div>
            <p>
              One plan at a time.
              <br />
              One topic at a time.
            </p>
          </div>
        </div>

        <footer className="auth-footer">
          Better habits. Better results.
        </footer>
      </section>

      <section className="auth-form-panel">
        <div className="auth-form-container">
          <h1>Create your account</h1>
          <p className="auth-subtitle">
            Start planning your study goals today.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                autoComplete="name"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create a password"
                autoComplete="new-password"
                required
              />
            </div>

            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}

            <button
              className="auth-primary-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="auth-bottom-text">
            Already have an account?
            <Link to="/login">Login</Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Register;
