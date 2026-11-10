# ReqLink — AI-Powered Requirements Traceability System

> **Interactive Frontend Prototype (MVP)**  
> Built for graduation project evaluation and demonstration.  
> A modern SaaS interface demonstrating automated requirements-to-code traceability through semantic retrieval, code dependency analysis, and LLM verification.

---

## 1. Project Overview

### What is ReqLink?
**ReqLink** is an AI-powered requirements traceability system that automatically identifies and maintains semantic trace links between natural-language requirements and source-code artifacts (methods, classes, and packages).

### The Problem It Solves
Maintaining accurate requirement-to-code traceability is a critical but notoriously neglected activity in software engineering:
* **Vocabulary Mismatch:** Stakeholders specify requirements in natural language (e.g., *"allow patients to book appointments"*), while source code uses programming identifiers and abbreviations (e.g., `AppointmentService.scheduleSlot`). Traditional Information Retrieval (IR) methods (VSM, LSI) fail when terms diverge.
* **Scattered Implementations:** A single requirement often spans multiple classes and packages, making manual link discovery tedious and error-prone.
* **Link Staleness / Trace Decay:** As codebases evolve through commits and pull requests, manually created trace links quickly become outdated.

### Proposed System Architecture vs. MVP Prototype
* **Proposed Full System Architecture:** The complete research concept incorporates an AST parsing pipeline (Tree-sitter / JavaParser), hierarchical LLM-generated summaries (methods $\rightarrow$ classes $\rightarrow$ packages), embedding cosine similarity for initial semantic seeds, dependency graph expansion (calls, inheritance, interfaces, imports, field types), LLM-based binary verification with justifications, and GitHub webhook integration for PR monitoring.
* **Current MVP Scope:** This repository contains the **interactive frontend prototype (MVP)**. It represents all screens, user flows, and data relationships using **realistic predefined mock data and simulated services**. **No live AI models, runtime embedding calculations, or backend servers are executed in this prototype.**

---

## 2. Key Features & Implementation Status

| Module | What You Can Do in the UI | Implementation Status |
|---|---|---|
| **Dashboard** | View project portfolio, global metrics, project status badges, and open projects or create new ones. | **Fully Implemented** (State persisted in `localStorage`) |
| **Project Creation Wizard** | 4-step wizard to create a **Standard Project**: configure metadata, upload requirements (`.docx`, `.pdf`, `.txt`), provide GitHub URL or upload ZIP archives, and review settings. | **Fully Implemented** (Real client-side `.txt` file reading + simulated binary preview + interactive ZIP tree) |
| **Analysis Pipeline** | Watch a simulated 7-stage animated progress pipeline with live percentages, sub-details, and restart capabilities. | **Simulated** (Timer-driven reactive observer pattern; no actual backend AI) |
| **Trace Links Table** | Browse AI-accepted trace links, search, filter by retrieval origin (`semantic_seed`, `graph_expansion`), sort by requirement or artifact, and review AI explanations. | **Fully Implemented UI** (Displays AI-verified accepted links with explanations) |
| **Requirements Explorer** | Browse functional requirements with unique IDs (`FR-01`), full texts, source citations, and linked code artifact counts. | **Fully Implemented** (Predefined mock requirements) |
| **Code Artifacts Explorer** | Explore parsed Java classes, methods, and packages with line numbers and LLM-generated summaries. | **Fully Implemented** (Predefined mock code artifacts) |
| **Pull Request Monitor** | Inspect pull request diffs (`+`/`-`), affected methods, impact analysis, and automated ReqLink bot comments. *(Available for GitHub projects)* | **Fully Implemented UI** (Predefined mock PR diffs & bot comments) |
| **Evaluation Dashboard** | Explore benchmark results (Configs A–D) across standard datasets (`eTour`, `iTrust`, `SMOS`, `eAnci`) with F1 bar charts and Research Question answers. *(Accessible exclusively via the pre-loaded eTour demo project)* | **Fully Implemented UI** (Predefined empirical ablation mock data) |

---

## 3. Technology Stack

* **Frontend Framework:** [React 18](https://react.dev/) (`18.3.1`)
* **Language:** [TypeScript](https://www.typescriptlang.org/) (`~5.6.2`)
* **Build Tool & Dev Server:** [Vite](https://vitejs.dev/) (`5.4.11`)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) (`3.4.15`) with `tailwindcss-animate`
* **UI Components:** [shadcn/ui](https://ui.shadcn.com/) primitives built on [Radix UI](https://www.radix-ui.com/)
* **State Management:** [Zustand](https://github.com/pmndrs/zustand) (`4.5.5`) with local persistence middleware
* **Charts:** [Recharts](https://recharts.org/) (`2.13.3`)
* **Icons:** [Lucide React](https://lucide.dev/) (`0.460.0`)
* **Notifications:** [Sonner](https://sonner.emilkowal.ski/) (`1.7.0`)
* **Routing:** [React Router DOM](https://reactrouter.com/) (`6.28.0`)

---

## 4. Prerequisites

Before running the project locally, ensure you have the following installed:

* **Node.js:** Version **`>= 18.0.0`** (Node.js 20 LTS or 22 LTS recommended).  
  Check with:
  ```bash
  node -v
  ```
* **npm:** Version **`>= 9.0.0`** (bundled with Node.js).  
  Check with:
  ```bash
  npm -v
  ```
* **Git:** Installed and available on your system path.
* **Modern Web Browser:** Google Chrome, Microsoft Edge, Firefox, or Safari.

> **Note:** No backend servers, external databases, Docker containers, or third-party AI API keys (OpenAI, Gemini) are required to run this prototype.

---

## 5. Installation and Setup

Follow these steps to set up the project on your machine:

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/ReqLink_MVP.git
```

### Step 2: Navigate to the Project Directory
```bash
cd ReqLink_MVP
```

### Step 3: Install Dependencies
Install all required npm dependencies:
```bash
npm install
```

### Step 4: Environment Variables (None Required)
ReqLink MVP is a self-contained frontend application with simulated mock services. **No `.env` file or API configuration is needed.**

---

## 6. Running the Application

### Start the Development Server
Run the following command in the project root:
```bash
npm run dev
```

You should see output similar to:
```text
  VITE v5.4.11  ready in 400 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Accessing the App
Open your web browser and navigate to:
```
http://localhost:5173/
```

### Stopping the Development Server
To stop the local server at any time, press **`Ctrl + C`** (or `Cmd + C` on macOS) in your terminal.

### Other Available Scripts
* **Typecheck and Build:**
  ```bash
  npm run build
  ```
  Runs the TypeScript compiler (`tsc -b`) and bundles the production application into the `dist/` directory.
* **Preview Production Build:**
  ```bash
  npm run preview
  ```
  Locally serves the compiled `dist/` production build for testing.

---

## 7. Project Structure

```
ReqLink_MVP/
├── index.html                   # Entry HTML file
├── package.json                 # Project dependencies and npm scripts
├── tsconfig.json                # TypeScript root configuration
├── tsconfig.app.json            # Application TypeScript configuration
├── vite.config.ts               # Vite bundler config with '@/' alias mapping
├── tailwind.config.js           # Tailwind theme tokens and colors
├── src/
│   ├── main.tsx                 # React DOM mount point
│   ├── App.tsx                  # Application routing and route definitions
│   ├── index.css                # Global CSS variables and Tailwind layers
│   ├── types/
│   │   └── index.ts             # Domain interfaces (Project, TraceLink, Requirement, etc.)
│   ├── lib/
│   │   └── utils.ts             # Helper utilities (cn, formatting, delays, IDs)
│   ├── data/                    # Predefined mock datasets
│   │   ├── mockRequirements.ts  # Standard (HMS) & Benchmark (eTour) requirements
│   │   ├── mockCodeArtifacts.ts # Java classes and methods with LLM summaries
│   │   ├── mockTraceLinks.ts    # Trace links with confidence scores and explanations
│   │   ├── mockGraph.ts         # Dependency graph nodes and typed edges
│   │   ├── mockPullRequests.ts  # GitHub pull requests with diffs and bot comments
│   │   ├── mockEvaluation.ts   # Benchmark evaluation metrics (Configs A–D) & RQ1–RQ4
│   │   └── mockFileTree.ts      # ZIP archive folder structure for preview
│   ├── services/                # Decoupled mock API services
│   │   ├── projectService.ts    # Project storage and CRUD operations
│   │   ├── analysisService.ts   # 7-stage animated pipeline simulation runner
│   │   ├── traceLinkService.ts  # Trace link querying, filtering, and decision overrides
│   │   ├── requirementService.ts# Requirements lookup
│   │   ├── codeArtifactService.ts# Code units lookup
│   │   ├── graphService.ts      # Dependency graph loader
│   │   ├── prService.ts         # Pull request loader
│   │   └── evaluationService.ts # Benchmark evaluation loader
│   ├── store/                   # Zustand state stores
│   │   ├── useProjectStore.ts   # Project state (persisted to localStorage)
│   │   ├── useAnalysisStore.ts  # Pipeline progress state and subscription
│   │   └── useTraceLinkStore.ts # Trace links, active filters, and decision actions
│   ├── components/
│   │   ├── ui/                  # 21 shadcn/ui components (Button, Card, Dialog, Table, etc.)
│   │   └── layout/
│   │       ├── AppLayout.tsx    # App shell containing Sidebar, main view, and Toaster
│   │       └── Sidebar.tsx      # Sidebar with contextual active project sub-navigation
│   └── pages/                   # 11 screen views
│       ├── LandingPage.tsx      # Welcome / marketing landing page
│       ├── DashboardPage.tsx    # Project dashboard with portfolio metrics
│       ├── NewProjectPage.tsx   # 4-step project creation wizard (Standard Projects)
│       ├── AnalysisPage.tsx     # 7-stage animated analysis simulation
│       ├── ProjectResultsPage.tsx # Results shell with stats and navigation tabs
│       ├── TraceLinksPage.tsx   # Traceability links table with search, filters, modal
│       ├── RequirementsViewPage.tsx # Requirements explorer with code mappings
│       ├── CodeArtifactsPage.tsx# Code units explorer with summaries
│       ├── PRMonitorPage.tsx    # GitHub PR monitor and bot comments (GitHub only)
│       └── EvaluationPage.tsx   # Benchmark ablation charts & RQ cards (Benchmark only)
```

---

## 8. Demo Data, Persistence & Feature Availability

### Pre-loaded Projects vs. User-Created Projects

The application includes two pre-loaded demonstration projects to showcase distinct aspects of the ReqLink research vision:

#### 1. Hospital Management System (`proj-1`) — Primary Enterprise Demo
* **Project Type:** Standard Project
* **Language:** Java
* **Source:** GitHub (`https://github.com/example/hospital-management-system`)
* **Dataset:** 12 functional requirements, 20 code artifacts, 25 trace links, 3 pull requests.
* **Demonstrated Capabilities:** Standard traceability analysis, vocabulary mismatch bridging, semantic seeds vs. graph expansion, and **Pull Request Monitoring**.

#### 2. eTour Benchmark (`proj-bench-1`) — Predefined Legacy Demo Project
* **Project Type:** Benchmark Evaluation (legacy demo data)
* **Language:** Java (with Italian code identifiers)
* **Source:** Archive Upload
* **Dataset:** 8 requirements, 5 Italian code artifacts, 12 trace links, 16 ablation evaluation rows.
* **Demonstrated Capabilities:** Demonstrates cross-lingual handling and contains the **Evaluation Dashboard** comparing ReqLink (54% F1) against the LiSSA baseline (31% F1) across configurations A, B, C, and D.
* **Access Note:** The Evaluation Dashboard is accessible **exclusively by opening this pre-loaded benchmark project from the Dashboard**. It is not shown on Standard Projects.

### Currently Available Project Creation Workflow
* **Only Standard Projects are supported for newly created projects.** The Project Creation Wizard creates Standard Projects focusing on Java traceability analysis.
* **Benchmark Evaluation is not a user-selectable option** in the creation wizard; it exists solely as the predefined `proj-bench-1` demo project.
* **Experimental C support has been removed** from the wizard. All projects analyze Java source code.

### How Data Persistence Works
* **Projects:** Stored in browser `localStorage` under key `'reqlink-projects'`.
* **Trace Link Review Decisions:** When you accept or reject a trace link, your decision is saved to `localStorage` under key `'reqlink-tl-decisions'`. Reloading the page or restarting your browser preserves your accepted/rejected reviews.
* **Resetting Demo Data:** To reset to the original default state, open your browser Developer Tools Console (`F12`), run `localStorage.clear()`, and reload the page.

---

## 9. Application Workflow

Here is the standard user journey through the application:

```text
1. Landing Page (/)
   └── Click "Go to Dashboard"
2. Dashboard (/dashboard)
   └── Click "Hospital Management System" (Standard Project Demo)
3. Project Results (/projects/proj-1)
   ├── Trace Links Tab
   │   ├── Search for "auth"
   │   ├── Filter by Retrieval Method ("semantic_seed" vs "graph_expansion")
   │   ├── Sort by Requirement or Artifact
   │   └── Click row to inspect AI explanation
   ├── Requirements Tab
   │   └── Search requirements & inspect linked code units
   ├── Code Artifacts Tab
   │   └── Browse parsed Java units & read generated summaries
   └── PR Monitor Tab (GitHub-sourced projects)
       └── Click PR #42 to view diffs, affected methods & bot comments
4. New Project Creation (/projects/new)
   ├── Step 1: Project Info — Enter Name & Description (Standard Project is the default and only type)
   ├── Step 2: Requirements — Upload .docx, .pdf, or .txt (real client-side parse for .txt; simulated preview for binary)
   ├── Step 3: Code Source — Choose GitHub repo URL or ZIP upload with interactive folder tree preview
   └── Step 4: Review & Start — Review settings & click "Start Analysis"
5. Analysis Pipeline (/projects/:id/analysis)
   ├── Watch 7 stages animate with live progress bars
   ├── Click "Restart Analysis" if desired
   └── Click "View Results" when complete
6. Benchmark Evaluation Demo (/projects/proj-bench-1/evaluation)
   └── Return to Dashboard, open "eTour Benchmark" to view Configs A–D F1 comparison charts & RQ1–RQ4 findings
```

---

## 10. Important Notes and Limitations

This application is an **interactive frontend prototype (MVP)** built for evaluation and demonstration:

1. **No Live Backend:** There is no Python backend, server database, or external microservice running. All data operations are handled through modular mock services located in `src/services/`.
2. **Predefined Mock AI Data:** **The application does not call OpenAI, Anthropic, or Gemini APIs at runtime, nor does it compute vector embeddings.** All method/class summaries, candidate retrieval badges (`semantic_seed` vs. `graph_expansion`), and natural-language justifications are **predefined mock records** structured to illustrate the proposed backend data contract.
3. **Simulated Analysis Pipeline:** The 7-stage analysis progress screen uses timer-based intervals to realistically demonstrate the user experience without requiring backend infrastructure.
4. **File Upload Handling:**
   * **Plain text files (`.txt`):** The browser genuinely parses lines, strips prefixes, and displays real requirements via `File.text()`.
   * **Binary files (`.docx`, `.pdf`):** Binary document parsing requires server-side NLP converters. The application displays a simulated preview labeled with a clear disclaimer badge.
5. **Dependency Graph Architecture:** Dependency graph expansion (traversing calls, inheritance, and imports) remains an integral part of the proposed candidate retrieval pipeline; its standalone visual canvas is omitted from the MVP presentation.
6. **Simulated GitHub CI/CD:** Pull request lists and bot comments simulate the behavior of the proposed ReqLink GitHub Action bot without connecting to the GitHub REST/GraphQL APIs.
7. **Creation Wizard Scope:** All newly created projects are Standard Projects analyzing Java code. Benchmark evaluation mode and experimental C support are not exposed in the creation wizard.

---

## 11. Troubleshooting

### Port 5173 Already in Use
If port `5173` is occupied by another process, Vite will automatically try the next available port (e.g., `5174`), or you can specify a custom port:
```bash
npx vite --port 3000
```

### Node.js Version Error
If you see syntax errors during build or startup, check your Node.js version:
```bash
node -v
```
If your version is below `18.0.0`, update Node.js to the latest LTS version from [nodejs.org](https://nodejs.org/).

### Stale Local Storage Data
If you encounter unexpected project states from previous testing sessions:
1. Open your browser Developer Tools (`F12`).
2. Go to the **Application** (or **Storage**) tab.
3. Select **Local Storage** $\rightarrow$ `http://localhost:5173`.
4. Right-click and choose **Clear**, or run `localStorage.clear()` in the Console, then refresh the page.

### Clean Rebuild
To verify that all TypeScript types and bundles compile cleanly:
```bash
npm run build
```

---

## License & Academic Context
Developed as part of the **Software Engineering Graduation Project (Level 4)**.  
Built for the **eJad** project presentation and technical evaluation.
