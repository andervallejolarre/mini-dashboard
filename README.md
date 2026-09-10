# Mini Dashboard — Coffee Production Trends

A full-stack mini dashboard application that visualizes global and per-country Arabica coffee production data. It fetches data securely from the official **FAOSTAT API** via an Express proxy backend and presents interactive charts using React, Redux Toolkit, and Mantine Charts.

---

## 🛠 Tech Stack & Tools

- **Frontend (`client/`)**:
  - **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/)
  - **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) (Async Thunks, Slices)
  - **UI & Visualization**: [Mantine Core](https://mantine.dev/), [Mantine Charts](https://mantine.dev/charts/installation/) (Recharts)
  - **Testing**: [Vitest](https://vitest.dev/), [@testing-library/react](https://testing-library.com/)

- **Backend (`server/`)**:
  - **Runtime & Framework**: [Node.js](https://nodejs.org/) + [Express 5](https://expressjs.com/) + [TypeScript](https://www.typescriptlang.org/)
  - **Development Tooling**: `ts-node-dev` (hot reload)
  - **Middleware & Security**: Token-based authentication manager for FAOSTAT API, CORS
  - **Testing**: [Jest](https://jestjs.io/), [Supertest](https://github.com/ladjs/supertest)

- **End-to-End Testing (`e2e/`)**:
  - **Framework**: [Playwright](https://playwright.dev/)

---

## Required Environment Variables & FAOSTAT Registration

To run the application backend and retrieve production statistics, **you must configure environment variables**.

### Important Notice: FAOSTAT Registration
The backend proxy authenticates against the official FAOSTAT API using user credentials. Before starting the server:

1. **Register an Account**: Go to the [FAOSTAT Portal / Services](https://www.fao.org/faostat/en/#developer-portal) and create a free user account.
2. **Environment File Setup**: Create a `.env` file inside the `server/` directory (you can copy `server/.env.example`).
Add your FAOSTAT login credentials to `server/.env`:

```env
# Mandatory FAOSTAT API Credentials
FAOSTAT_USER=your_registered_email@example.com
FAOSTAT_PASSWORD=your_faostat_password

# Optional Configuration
PORT=4040
```

> 📌 **Note:** Without valid `FAOSTAT_USER` and `FAOSTAT_PASSWORD` environment variables, the backend server will refuse to start and throw a missing variable error.

---

## Getting Started

### 1. Installation

Navigate to the `mini-dashboard` folder and install dependencies across sub-projects:

```bash
# Install root/workspace scripts if applicable, or install dependencies per package:

# Client dependencies
cd client && npm install

# Server dependencies
cd ../server && npm install

# E2E dependencies
cd ../e2e && npm install
```

### 2. Running the Development Servers

1. **Start the Express Proxy Backend**:
   ```bash
   cd server
   npm run dev
   ```
   *The server runs by default on `http://localhost:4040`.*

2. **Start the React Frontend**:
   ```bash
   cd client
   npm run dev
   ```
   *Open the URL output in your terminal (typically `http://localhost:5173`).*

---

## 🧪 Running Tests

The workspace includes scripts at the root of `mini-dashboard` to run all test suites conveniently:

From the `mini-dashboard/` folder:

```bash
# Run client unit & integration tests (Vitest)
npm run test:client

# Run server API tests (Jest & Supertest)
npm run test:server

# Run Playwright E2E tests
npm run test:e2e

# Run all test suites sequentially
npm run test:all
```

---

## 📂 Project Structure

```text
mini-dashboard/
├── client/          # React + Vite frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI widgets & charts
│   │   ├── features/      # Redux slices (country, production)
│   │   └── hooks/         # Custom Redux typed hooks
│   └── tests/             # Vitest UI tests
├── server/          # Express proxy backend API
│   ├── src/
│   │   ├── controllers/   # Production data controller
│   │   ├── middleware/    # FAOSTAT Token Auth manager
│   │   └── routes/        # API route definitions
│   └── tests/             # Jest backend integration tests
└── e2e/             # Playwright E2E test suites
```
