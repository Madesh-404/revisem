
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  createSubject,
  getSubjects,
  updateSubject,
  deleteSubject,
} from "../services/api";

import SubjectForm from "../components/subjects/SubjectForm";
import SubjectCard from "../components/subjects/SubjectCard";

import "../styles/subjects.css";

const Subjects = () => {
  const { planId } = useParams();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingSubjectId, setDeletingSubjectId] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const loadSubjects = async () => {
      setIsLoading(true);
      setError("");

      try {
        const responseData = await getSubjects(planId);
        setSubjects(responseData.subjects || []);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadSubjects();
  }, [planId]);

  const handleCreateSubject = () => {
    setEditingSubject(null);
    setShowForm(true);
    setError("");
    setSuccessMessage("");
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setShowForm(true);
    setError("");
    setSuccessMessage("");
  };

  const handleCancelForm = () => {
    setEditingSubject(null);
    setShowForm(false);
  };

  const handleSubmitSubject = async (subjectData) => {
    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      if (editingSubject) {
        const responseData = await updateSubject(
          editingSubject.id,
          subjectData
        );

        const updatedSubject = responseData.subject;

        setSubjects((currentSubjects) =>
          currentSubjects.map((subject) =>
            subject.id === editingSubject.id
              ? updatedSubject
              : subject
          )
        );

        setSuccessMessage("Subject updated successfully.");
      } else {
        const responseData = await createSubject(
          planId,
          subjectData
        );

        setSubjects((currentSubjects) => [
          ...currentSubjects,
          responseData.subject,
        ]);

        setSuccessMessage("Subject created successfully.");
      }

      setEditingSubject(null);
      setShowForm(false);
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubject = async (subject) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${subject.name}"? Its topics will also be deleted.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingSubjectId(subject.id);
    setError("");
    setSuccessMessage("");

    try {
      await deleteSubject(subject.id);

      setSubjects((currentSubjects) =>
        currentSubjects.filter(
          (currentSubject) =>
            currentSubject.id !== subject.id
        )
      );

      setSuccessMessage("Subject deleted successfully.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDeletingSubjectId(null);
    }
  };

  const handleOpenSubject = (subject) => {
    navigate(
      `/plans/${encodeURIComponent(planId)}/subjects/${encodeURIComponent(subject.id)}/topics`
    );
  };

  return (
    <main className="subjects-page">
      <header className="subjects-page__header">
        <div>
          <button
            type="button"
            onClick={() => navigate("/plans")}
          >
            Back to Plans
          </button>

          <h1>Subjects</h1>
          <p>Organize your plan into subjects and topics.</p>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={handleCreateSubject}
          >
            + Add Subject
          </button>
        )}
      </header>

      {error && (
        <p className="subjects-page__error" role="alert">
          {error}
        </p>
      )}

      {successMessage && (
        <p className="subjects-page__success" role="status">
          {successMessage}
        </p>
      )}

      {showForm && (
        <section className="subjects-page__form-section">
          <h2>
            {editingSubject ? "Edit Subject" : "Create Subject"}
          </h2>

          <SubjectForm
            key={editingSubject?.id || "new-subject"}
            initialSubject={editingSubject}
            onSubmit={handleSubmitSubject}
            onCancel={handleCancelForm}
            isSubmitting={isSubmitting}
          />
        </section>
      )}

      <section className="subjects-page__content">
        {isLoading ? (
          <p>Loading subjects...</p>
        ) : subjects.length === 0 ? (
          <div className="subjects-page__empty">
            <h2>No subjects yet</h2>
            <p>Create your first subject to start organizing topics.</p>
          </div>
        ) : (
          <div className="subjects-page__grid">
            {subjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                onOpen={handleOpenSubject}
                onEdit={handleEditSubject}
                onDelete={handleDeleteSubject}
                isDeleting={deletingSubjectId === subject.id}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Subjects;
