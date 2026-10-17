
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createPlan,
  getPlans,
  updatePlan,
  archivePlan,
} from "../services/api.js";

import PlanForm from "../components/plans/PlanForm.jsx";
import PlanCard from "../components/plans/PlanCard.jsx";

import "../styles/plans.css";

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [archivingPlanId, setArchivingPlanId] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const navigate = useNavigate();

  const loadPlans = async () => {
    setIsLoading(true);
    setError("");

    try {
      const responseData = await getPlans();
      setPlans(responseData.plans);
    } catch (requestError) {
      setError(requestError.message || "Failed to load plans.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleCreatePlan = () => {
    setEditingPlan(null);
    setSuccessMessage("");
    setError("");
    setIsFormVisible(true);
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setSuccessMessage("");
    setError("");
    setIsFormVisible(true);
  };

  const handleCancelForm = () => {
    setIsFormVisible(false);
    setEditingPlan(null);
    setError("");
  };

  const handleSubmitPlan = async (planData) => {
    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      if (editingPlan) {
        await updatePlan(editingPlan.id, planData);
        setSuccessMessage("Plan updated successfully.");
      } else {
        await createPlan(planData);
        setSuccessMessage("Plan created successfully.");
      }

      setIsFormVisible(false);
      setEditingPlan(null);

      await loadPlans();
    } catch (requestError) {
      throw requestError;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArchivePlan = async (plan) => {
    const shouldArchive = window.confirm(
      `Are you sure you want to archive "${plan.name}"?`
    );

    if (!shouldArchive) {
      return;
    }

    setArchivingPlanId(plan.id);
    setError("");
    setSuccessMessage("");

    try {
      await archivePlan(plan.id);
      setSuccessMessage("Plan archived successfully.");
      await loadPlans();
    } catch (requestError) {
      setError(requestError.message || "Failed to archive plan.");
    } finally {
      setArchivingPlanId(null);
    }
  };

  const handleOpenPlan = (plan) => {
    navigate(`/plans/${plan.id}/subjects`);
  };

  const activePlans = plans.filter(
    (plan) => plan.status === "ACTIVE"
  );

  const archivedPlans = plans.filter(
    (plan) => plan.status === "ARCHIVED"
  );

  return (
    <main className="plans-page">
      <header className="plans-page__header">
        <div>
          <p className="plans-page__eyebrow">YOUR WORKSPACE</p>
          <h1>Revision plans</h1>
          <p className="plans-page__subtitle">
            Organize what you learn and make every revision count.
          </p>
        </div>

        {!isFormVisible && (
          <button
            type="button"
            className="plans-page__create-button"
            onClick={handleCreatePlan}
          >
            + New plan
          </button>
        )}
      </header>

      {successMessage && (
        <p className="plans-page__success" role="status">
          {successMessage}
        </p>
      )}

      {error && (
        <p className="plans-page__error" role="alert">
          {error}
        </p>
      )}

      {isFormVisible && (
        <section className="plans-page__form-section">
          <PlanForm
            key={editingPlan?.id || "new-plan"}
            initialPlan={editingPlan}
            onSubmit={handleSubmitPlan}
            onCancel={handleCancelForm}
            isSubmitting={isSubmitting}
          />
        </section>
      )}

      {isLoading ? (
        <p className="plans-page__message">Loading your plans...</p>
      ) : (
        <>
          <section className="plans-page__section">
            <div className="plans-page__section-header">
              <h2>Active plans</h2>
              <span>{activePlans.length}</span>
            </div>

            {activePlans.length === 0 ? (
              <div className="plans-page__empty">
                <h3>No active plans yet</h3>
                <p>
                  Create your first plan to start organizing your revisions.
                </p>

                {!isFormVisible && (
                  <button
                    type="button"
                    onClick={handleCreatePlan}
                  >
                    Create your first plan
                  </button>
                )}
              </div>
            ) : (
              <div className="plans-page__grid">
                {activePlans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    onEdit={handleEditPlan}
                    onArchive={handleArchivePlan}
                    onOpen={handleOpenPlan}
                    isArchiving={archivingPlanId === plan.id}
                  />
                ))}
              </div>
            )}
          </section>

          {archivedPlans.length > 0 && (
            <section className="plans-page__section">
              <div className="plans-page__section-header">
                <h2>Archived plans</h2>
                <span>{archivedPlans.length}</span>
              </div>

              <div className="plans-page__grid">
                {archivedPlans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    onEdit={handleEditPlan}
                    onArchive={handleArchivePlan}
                    onOpen={handleOpenPlan}
                    isArchiving={archivingPlanId === plan.id}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
};

export default Plans;
