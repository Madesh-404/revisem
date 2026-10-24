
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getDashboardSummary } from "../services/api";

import "../styles/dashboard.css";
const Dashboard = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");

  const [error, setError] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchDashboardSummary = async () => {
      setIsLoading(true);
      setDashboardError("");

      try {
        const response = await getDashboardSummary();
        setSummary(response.summary);
      } catch (requestError) {
        setDashboardError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardSummary();
  }, []);

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
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <Link to="/dashboard" className="dashboard-brand">
          <span className="brand-icon">R</span>
          <span>REVISEM</span>
        </Link>

        <p className="sidebar-label">WORKSPACE</p>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <Link to="/dashboard" className="sidebar-link active">
            <span aria-hidden="true">▦</span>
            Dashboard
          </Link>

          <Link to="/plans" className="sidebar-link">
            <span aria-hidden="true">▤</span>
            My Plans
          </Link>

          <Link to="/subjects" className="sidebar-link">
            <span aria-hidden="true">◫</span>
            Subjects
          </Link>

          <Link to="/topics" className="sidebar-link">
            <span aria-hidden="true">☷</span>
            Topics
          </Link>

          <Link to="/revisions" className="sidebar-link">
            <span aria-hidden="true">↻</span>
            Revisions
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="user-details">
              <p className="user-name">{user?.name || "User"}</p>
              <p className="user-email">{user?.email || ""}</p>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-logout"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging out..." : "↗ Log out"}
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">YOUR LEARNING SPACE</p>
            <h1>Dashboard</h1>
            <p className="header-description">
              A little progress every day adds up to big results.
            </p>
          </div>

          <Link to="/revisions" className="primary-button">
            <span aria-hidden="true">+</span> View Revisions
          </Link>
        </header>

        {error && (
          <p className="dashboard-alert error-alert" role="alert">
            {error}
          </p>
        )}

        <section className="dashboard-content">
          <div className="welcome-banner">
            <div>
              <p className="welcome-label">WELCOME BACK</p>
              <h2>Keep your momentum going{user?.name ? `, ${user.name}` : ""}!</h2>
              <p>Let's make today's revision session count.</p>
            </div>

            <div className="welcome-decoration" aria-hidden="true">
              <span>✦</span>
            </div>
          </div>

          {isLoading && (
            <div className="dashboard-message" role="status">
              <span className="loading-spinner" />
              Loading your learning overview...
            </div>
          )}

          {!isLoading && dashboardError && (
            <div className="dashboard-message error-message" role="alert">
              <h3>We couldn't load your dashboard</h3>
              <p>{dashboardError}</p>
              <button
                type="button"
                className="secondary-button"
                onClick={() => window.location.reload()}
              >
                Try again
              </button>
            </div>
          )}

          {!isLoading && !dashboardError && summary && (
            <>
              <div className="section-heading">
                <div>
                  <h2>Your overview</h2>
                  <p>Here's how your revision journey is going.</p>
                </div>
              </div>

              <div className="stats-grid">
                <article className="stat-card">
                  <div className="stat-card-top">
                    <span className="stat-icon purple-icon">↻</span>
                    <span className="stat-caption">ALL TIME</span>
                  </div>
                  <p className="stat-value">{summary.totalRevisions}</p>
                  <h3>Total revisions</h3>
                  <p className="stat-description">
                    Revisions across your active plans
                  </p>
                </article>

                <article className="stat-card">
                  <div className="stat-card-top">
                    <span className="stat-icon green-icon">✓</span>
                    <span className="stat-caption">COMPLETED</span>
                  </div>
                  <p className="stat-value">{summary.completedRevisions}</p>
                  <h3>Revisions completed</h3>
                  <p className="stat-description">
                    Every session moves you forward
                  </p>
                </article>

                <article className="stat-card">
                  <div className="stat-card-top">
                    <span className="stat-icon blue-icon">◷</span>
                    <span className="stat-caption">TODAY</span>
                  </div>
                  <p className="stat-value">{summary.todayRevisions}</p>
                  <h3>Due today</h3>
                  <p className="stat-description">
                    Approximately {summary.todayEstimatedMinutes} minutes
                  </p>
                </article>

                <article className="stat-card">
                  <div className="stat-card-top">
                    <span className="stat-icon orange-icon">!</span>
                    <span className="stat-caption">NEEDS ATTENTION</span>
                  </div>
                  <p className="stat-value">{summary.overdueRevisions}</p>
                  <h3>Overdue revisions</h3>
                  <p className="stat-description">
                    {summary.overdueRevisions > 0
                      ? "Consider catching up on these topics"
                      : "You're all caught up!"}
                  </p>
                </article>
              </div>

              <div className="dashboard-lower-grid">
                <section className="panel progress-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Overall progress</h2>
                      <p>Your revision completion rate</p>
                    </div>

                    <span className="progress-badge">
                      {summary.completionPercentage}%
                    </span>
                  </div>

                  <div
                    className="progress-track"
                    role="progressbar"
                    aria-label="Overall revision completion"
                    aria-valuenow={summary.completionPercentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="progress-fill"
                      style={{
                        width: `${summary.completionPercentage}%`,
                      }}
                    />
                  </div>

                  <div className="progress-footer">
                    <span>
                      {summary.completedRevisions} completed
                    </span>
                    <span>
                      {Math.max(
                        0,
                        summary.totalRevisions - summary.completedRevisions
                      )}{" "}
                      remaining
                    </span>
                  </div>

                  <Link to="/revisions" className="text-link">
                    Go to revisions <span aria-hidden="true">→</span>
                  </Link>
                </section>

                <section className="panel today-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Today's focus</h2>
                      <p>Your planned study workload</p>
                    </div>
                    <span className="today-icon">✦</span>
                  </div>

                  <div className="focus-metric">
                    <span className="focus-number">
                      {summary.todayEstimatedMinutes}
                    </span>
                    <span className="focus-unit">minutes estimated</span>
                  </div>

                  <div className="focus-divider" />

                  <div className="focus-row">
                    <span>Revisions scheduled</span>
                    <strong>{summary.todayRevisions}</strong>
                  </div>

                  <Link to="/revisions" className="text-link">
                    Start revising <span aria-hidden="true">→</span>
                  </Link>
                </section>
              </div>

              <section className="panel plans-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Plan workload</h2>
                    <p>Today's estimated time versus your daily capacity</p>
                  </div>

                  <Link to="/plans" className="text-link">
                    View plans <span aria-hidden="true">→</span>
                  </Link>
                </div>

                {summary.workloadByPlan.length === 0 ? (
                  <div className="empty-state">
                    <span className="empty-state-icon">▤</span>
                    <h3>No active plans yet</h3>
                    <p>
                      Create a revision plan to start organizing your learning.
                    </p>
                    <Link to="/plans" className="primary-button">
                      View Plans
                    </Link>
                  </div>
                ) : (
                  <div className="plan-list">
                    {summary.workloadByPlan.map((plan) => (
                      <article className="plan-row" key={plan.plan_id}>
                        <div className="plan-details">
                          <h3>{plan.plan_name}</h3>
                          <p>
                            {plan.due_revisions} revisions ·{" "}
                            {plan.estimated_minutes} minutes planned
                          </p>
                        </div>

                        <div className="plan-capacity">
                          <div className="capacity-labels">
                            <span>Daily capacity</span>
                            <span>{plan.daily_capacity} min</span>
                          </div>

                          <div className="capacity-track">
                            <div
                              className={`capacity-fill ${
                                plan.capacity_exceeded
                                  ? "capacity-fill-warning"
                                  : ""
                              }`}
                              style={{
                                width: `${
                                  plan.daily_capacity > 0
                                    ? Math.min(
                                        100,
                                        (plan.estimated_minutes /
                                          plan.daily_capacity) *
                                          100
                                      )
                                    : 0
                                }%`,
                              }}
                            />
                          </div>

                          {plan.capacity_exceeded && (
                            <p className="capacity-warning" role="status">
                              <span aria-hidden="true">!</span>
                              Workload exceeds daily capacity
                            </p>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
