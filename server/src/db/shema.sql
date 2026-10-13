CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(100) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    password_hash TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    name VARCHAR(150) NOT NULL,

    description TEXT,

    target_date DATE NOT NULL,

    daily_capacity INTEGER NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_plans_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT check_plan_daily_capacity
        CHECK (daily_capacity > 0),

    CONSTRAINT check_plan_status
        CHECK (status IN ('ACTIVE', 'ARCHIVED'))
);

CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    plan_id UUID NOT NULL,

    name VARCHAR(150) NOT NULL,

    description TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_subjects_plan
        FOREIGN KEY (plan_id)
        REFERENCES plans(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_subject_name_per_plan
        UNIQUE (plan_id, name)
);

CREATE TABLE topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    subject_id UUID NOT NULL,

    name VARCHAR(150) NOT NULL,

    description TEXT,

    difficulty VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',

    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',

    duration_minutes INTEGER NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_topics_subject
        FOREIGN KEY (subject_id)
        REFERENCES subjects(id)
        ON DELETE CASCADE,

    CONSTRAINT check_topic_difficulty
        CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD')),

    CONSTRAINT check_topic_priority
        CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),

    CONSTRAINT check_topic_duration
        CHECK (duration_minutes > 0),

    CONSTRAINT unique_topic_name_per_subject
        UNIQUE (subject_id, name)
);

CREATE TABLE revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    topic_id UUID NOT NULL,

    scheduled_date DATE NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED',

    started_at TIMESTAMPTZ,

    completed_at TIMESTAMPTZ,

    skipped_at TIMESTAMPTZ,

    performance VARCHAR(20),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_revisions_topic
        FOREIGN KEY (topic_id)
        REFERENCES topics(id)
        ON DELETE CASCADE,

    CONSTRAINT check_revision_status
        CHECK (
            status IN (
                'SCHEDULED',
                'IN_PROGRESS',
                'COMPLETED',
                'SKIPPED'
            )
        ),

    CONSTRAINT check_revision_performance
        CHECK (
            performance IS NULL
            OR performance IN (
                'AGAIN',
                'HARD',
                'GOOD',
                'EASY'
            )
        )
);

CREATE TABLE revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    topic_id UUID NOT NULL,

    scheduled_date DATE NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED',

    started_at TIMESTAMPTZ,

    completed_at TIMESTAMPTZ,

    skipped_at TIMESTAMPTZ,

    performance VARCHAR(20),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_revisions_topic
        FOREIGN KEY (topic_id)
        REFERENCES topics(id)
        ON DELETE CASCADE,

    CONSTRAINT check_revision_status
        CHECK (
            status IN (
                'SCHEDULED',
                'IN_PROGRESS',
                'COMPLETED',
                'SKIPPED'
            )
        ),

    CONSTRAINT check_revision_performance
        CHECK (
            performance IS NULL
            OR performance IN (
                'AGAIN',
                'HARD',
                'GOOD',
                'EASY'
            )
        ),

    CONSTRAINT unique_topic_revision_date
        UNIQUE (topic_id, scheduled_date)
);

CREATE TABLE revision_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    revision_id UUID NOT NULL,

    topic_id UUID NOT NULL,

    performance VARCHAR(20) NOT NULL,

    previous_interval INTEGER NOT NULL,

    next_interval INTEGER NOT NULL,

    scheduled_date DATE NOT NULL,

    completed_at TIMESTAMPTZ NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_revision_history_revision
        FOREIGN KEY (revision_id)
        REFERENCES revisions(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_revision_history_topic
        FOREIGN KEY (topic_id)
        REFERENCES topics(id)
        ON DELETE CASCADE,

    CONSTRAINT check_history_performance
        CHECK (
            performance IN (
                'AGAIN',
                'HARD',
                'GOOD',
                'EASY'
            )
        ),

    CONSTRAINT check_previous_interval
        CHECK (previous_interval >= 0),

    CONSTRAINT check_next_interval
        CHECK (next_interval > 0)
);

CREATE TABLE notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL UNIQUE,

    daily_reminder BOOLEAN NOT NULL DEFAULT TRUE,

    overdue_reminder BOOLEAN NOT NULL DEFAULT TRUE,

    reminder_time TIME NOT NULL DEFAULT '08:00:00',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_notification_preferences_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_plans_user_id
    ON plans(user_id);

CREATE INDEX idx_subjects_plan_id
    ON subjects(plan_id);

CREATE INDEX idx_topics_subject_id
    ON topics(subject_id);

CREATE INDEX idx_revisions_status
    ON revisions(status);

CREATE INDEX idx_revisions_scheduled_date
    ON revisions(scheduled_date);

CREATE INDEX idx_revisions_status
    ON revisions(status);

CREATE INDEX idx_revisions_date_status
    ON revisions(scheduled_date, status);

CREATE INDEX idx_revision_history_topic_id
    ON revision_history(topic_id);