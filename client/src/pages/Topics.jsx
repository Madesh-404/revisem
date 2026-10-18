
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  createTopic,
  getTopics,
  updateTopic,
  deleteTopic,
} from "../services/api";

import TopicForm from "../components/topics/TopicForm";
import TopicCard from "../components/topics/TopicCard";

import "../styles/topics.css";

const Topics = () => {
  const { planId, subjectId } = useParams();
  const navigate = useNavigate();

  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingTopicId, setDeletingTopicId] = useState(null);
  const [editingTopic, setEditingTopic] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const loadTopics = async () => {
      setIsLoading(true);
      setError("");

      try {
        const responseData = await getTopics(subjectId);
        setTopics(responseData.topics || []);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadTopics();
  }, [subjectId]);

  const handleCreateTopic = () => {
    setEditingTopic(null);
    setShowForm(true);
    setError("");
    setSuccessMessage("");
  };

  const handleEditTopic = (topic) => {
    setEditingTopic(topic);
    setShowForm(true);
    setError("");
    setSuccessMessage("");
  };

  const handleCancelForm = () => {
    setEditingTopic(null);
    setShowForm(false);
  };

  const handleSubmitTopic = async (topicData) => {
    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      if (editingTopic) {
        const responseData = await updateTopic(
          editingTopic.id,
          topicData
        );

        const updatedTopic = responseData.topic;

        setTopics((currentTopics) =>
          currentTopics.map((topic) =>
            topic.id === editingTopic.id
              ? updatedTopic
              : topic
          )
        );

        setSuccessMessage("Topic updated successfully.");
      } else {
        const responseData = await createTopic(
          subjectId,
          topicData
        );

        setTopics((currentTopics) => [
          ...currentTopics,
          responseData.topic,
        ]);

        setSuccessMessage("Topic created successfully.");
      }

      setEditingTopic(null);
      setShowForm(false);
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTopic = async (topic) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${topic.name}"?`
    );

    if (!confirmed) {
      return;
    }

    setDeletingTopicId(topic.id);
    setError("");
    setSuccessMessage("");

    try {
      await deleteTopic(topic.id);

      setTopics((currentTopics) =>
        currentTopics.filter(
          (currentTopic) => currentTopic.id !== topic.id
        )
      );

      setSuccessMessage("Topic deleted successfully.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDeletingTopicId(null);
    }
  };

  return (
    <main className="topics-page">
      <header className="topics-page__header">
        <div>
          <button
            type="button"
            onClick={() =>
              navigate(`/plans/${encodeURIComponent(planId)}/subjects`)
            }
          >
            Back to Subjects
          </button>

          <h1>Topics</h1>
          <p>
            Break your subject into smaller topics you can revise.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={handleCreateTopic}
          >
            + Add Topic
          </button>
        )}
      </header>

      {error && (
        <p className="topics-page__error" role="alert">
          {error}
        </p>
      )}

      {successMessage && (
        <p className="topics-page__success" role="status">
          {successMessage}
        </p>
      )}

      {showForm && (
        <section className="topics-page__form-section">
          <h2>{editingTopic ? "Edit Topic" : "Create Topic"}</h2>

          <TopicForm
            key={editingTopic?.id || "new-topic"}
            initialTopic={editingTopic}
            onSubmit={handleSubmitTopic}
            onCancel={handleCancelForm}
            isSubmitting={isSubmitting}
          />
        </section>
      )}

      <section className="topics-page__content">
        {isLoading ? (
          <p>Loading topics...</p>
        ) : topics.length === 0 ? (
          <div className="topics-page__empty">
            <h2>No topics yet</h2>
            <p>
              Add your first topic to start building your revision plan.
            </p>
          </div>
        ) : (
          <div className="topics-page__grid">
            {topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onEdit={handleEditTopic}
                onDelete={handleDeleteTopic}
                isDeleting={deletingTopicId === topic.id}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Topics;
