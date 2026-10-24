# REVISEM — Smart Revision Planner

REVISEM is a full-stack revision planning application designed to help students and professionals organize their study plans, manage topics, and schedule revisions systematically. It uses performance-based scheduling to help users plan their next revision according to how well they recalled the material.

## Features

### Authentication
- User registration and login
- JWT-based authentication using HTTP-only cookies
- Protected API endpoints
- User-specific access to revision plans and related data

### Plan Management
- Create and view revision plans
- Update plan details and target dates
- Configure daily study capacity
- Archive plans

### Subject and Topic Management
- Create, update, and delete subjects
- Organize topics under subjects
- Set topic difficulty and priority

### Revision Scheduling
- Automatically schedule initial revisions
- View today's, upcoming, and overdue revisions
- Start, complete, and skip revisions
- Calculate subsequent revision dates based on recall performance
- Keep missed revisions overdue until completed
- Warn when scheduled workload exceeds daily study capacity

### Adaptive Revision Intervals

REVISEM uses performance-based intervals to determine when a topic should be reviewed again.

| Performance | Meaning | Next revision interval |
|---|---|---:|
| AGAIN | Could not recall the material | 1 day |
| HARD | Recalled with difficulty | 2 days |
| GOOD | Recalled correctly | 4 days |
| EASY | Recalled effortlessly | 7 days |

### Dashboard
- View total and completed revisions
- Track today's revision workload
- Monitor overdue revisions
- View overall progress
- Review workload distribution across plans
- Identify plans that exceed daily study capacity

## Tech Stack

**Frontend**
- React
- JavaScript (ES6+)
- CSS
- React Router

**Backend**
- Node.js
- Express.js
- REST API architecture
- JSON Web Tokens (JWT)
- HTTP-only cookies

**Database**
- PostgreSQL
- Neon PostgreSQL
- `pg` connection pooling

**Development and Testing**
- Git and GitHub
- npm
- Nodemon
- Node.js test runner
- Supertest

## Architecture

REVISEM follows a client-server architecture.

```text
React Frontend
      |
      | HTTP requests
      v
Express REST API
      |
      | Authentication and validation
      v
Controllers and Services
      |
      | SQL queries
      v
PostgreSQL Database
```

The frontend communicates with the backend through REST endpoints. The backend handles authentication, request validation, business logic, revision scheduling, and database operations.

## Getting Started

### Prerequisites

Install the following before running the project:

- Node.js (LTS recommended)
- npm
- A PostgreSQL database, such as Neon
- Git

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd revisem
```

Replace `<your-repository-url>` with your actual Git repository URL.

### 2. Configure the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_long_random_secret
```

Use your PostgreSQL connection string from Neon or your local database. Configure any additional environment variables required by your application.

**Security:** Never commit `.env` files, database credentials, or JWT secrets to Git.

### 3. Start the Backend

```bash
npm run dev
```

If your project uses a different development script, use the script defined in `server/package.json`.

Verify the backend health endpoint:

```text
GET http://localhost:5000/api/health
```

### 4. Configure and Start the Frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal.

Ensure the frontend API configuration points to your running backend and that the frontend and backend are configured to handle credentials correctly for cookie-based authentication.

## Testing

Run the backend test suite from the `server` directory:

```bash
npm test
```

The existing automated tests cover cases including:

- Rejecting unauthenticated requests to protected endpoints
- Rejecting invalid and expired authentication tokens
- Rejecting tokens without a valid user ID
- Validating revision-plan input, including names, dates, and daily capacity

## Example Workflow

1. Register an account and log in.
2. Create a revision plan with a target date and daily study capacity.
3. Add subjects to the plan.
4. Add topics and configure their difficulty and priority.
5. Review the automatically scheduled revisions.
6. Start a revision and record your recall performance.
7. Let REVISEM calculate the next revision date.
8. Monitor progress, upcoming work, and overdue revisions through the dashboard.

## Project Structure

```text
revisem/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   └── app.test.js
│   └── package.json
│
└── README.md
```

*This is a representative structure. Adjust it to match the actual files in your repository.*

## Design Decisions

- **Separation of concerns:** Routes, controllers, and services keep HTTP handling separate from business logic and database operations.
- **Relational database:** PostgreSQL provides structured relationships between plans, subjects, topics, revisions, and revision history.
- **Protected resources:** Authentication middleware verifies JWTs before allowing access to protected endpoints.
- **Adaptive scheduling:** Recall performance determines the interval before the next revision.
- **Overdue revision handling:** Missed revisions remain visible until completed instead of being silently discarded.
- **Capacity awareness:** The application warns about excessive workload without automatically changing the user's schedule.

## Future Improvements

Potential enhancements include:

- Deploy the frontend and backend
- Add automated integration tests for revision scheduling and performance-based intervals
- Improve accessibility and responsive design
- Add calendar-based revision views
- Introduce configurable scheduling algorithms
- Add analytics for recall performance and learning progress

## Author

**Madesh**

Computer Science Graduate | Full-Stack Developer

Built with React, Node.js, Express.js, and PostgreSQL.
