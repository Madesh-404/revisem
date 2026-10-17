
import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const registrationMessage = location.state?.message;

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await login({ email, password });

      navigate("/dashboard", { replace: true });
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
          <h2>Welcome back</h2>
          <p>
            Build better study habits, stay on top of your
            revisions, and make every study session count.
          </p>

          <div className="auth-illustration" aria-hidden="true">
            <div className="auth-illustration-symbol">✦</div>
            <p>
              Small steps every day lead to big results.
              <br />
              Your next revision starts here.
            </p>
          </div>
        </div>

        <footer className="auth-footer">
          Stay consistent. See your progress.
        </footer>
      </section>

      <section className="auth-form-panel">
        <div className="auth-form-container">
          <h1>Login</h1>
          <p className="auth-subtitle">
            Sign in to continue your revision journey.
          </p>

          {registrationMessage && (
            <p className="auth-success" role="status">
              {registrationMessage}
            </p>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
                autoComplete="current-password"
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
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="auth-bottom-text">
            Don't have an account?
            <Link to="/register">Register</Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;
