
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [error, setError] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setError("");
    setIsLoggingOut(true);

    try {
      await logout();

      navigate("/login", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <main>
      <h1>REVISEM Dashboard</h1>

      <p>Welcome, {user?.name}!</p>
      <p>Email: {user?.email}</p>

      <section>
        <h2>Your revision workspace</h2>
        <p>
          Your plans, subjects, topics, and revision schedule
          will appear here.
        </p>
      </section>

      {error && <p role="alert">{error}</p>}

      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? "Logging out..." : "Logout"}
      </button>
    </main>
  );
};

export default Dashboard;
