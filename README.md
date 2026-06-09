# Jeb: Autonomous Job Scout & Resume Tailor

Jeb is a minimalist, agentic web dashboard designed to automate the job search and application process. It specializes in finding roles in specific regions (defaulting to Colombo, Sri Lanka), analyzing job descriptions against a Master CV, and generating tailored, ATS-friendly resumes.

## 🚀 Features

- **Automated Scraping:** Stealthy job board scraping using Playwright (Targeting TopJobs.lk and others).
- **AI Analysis:** Skill extraction and match scoring using Gemini 3.1 Pro.
- **Tailored Resumes:** AI-driven CV rewriting to emphasize matching skills while maintaining 100% factual accuracy.
- **ATS-Friendly PDF:** High-fidelity PDF generation via WeasyPrint and text extraction via PyMuPDF.
- **Modern Dashboard:** Minimalist dark-mode UI built with Next.js and Shadcn/UI (Coming in Phase 4).

## 🛠️ Tech Stack

- **Backend:** FastAPI, PostgreSQL (SQLAlchemy), Celery, Redis.
- **Frontend:** Next.js (App Router), Tailwind CSS, Shadcn/UI.
- **AI:** Google Gemini API.
- **PDF Engine:** WeasyPrint.
- **Automation:** Docker, Makefile.

## 📦 Getting Started

### Prerequisites

- Docker and Docker Compose
- `make` utility
- Gemini API Key

### Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Abdul-Malik-0404/Jeb.git
    cd Jeb
    ```

2.  **Configure environment variables:**
    Create a `.env` file (or set in your shell):
    ```bash
    GEMINI_API_KEY=your_api_key_here
    ```

3.  **Initialize the infrastructure:**
    ```bash
    make setup
    ```

4.  **Run the application:**
    ```bash
    make up
    ```

5.  **Run migrations:**
    ```bash
    make migrate
    ```

## 📜 Makefile Commands

- `make setup`: Builds Docker containers and installs Playwright browsers.
- `make up`: Starts the entire stack (API, Worker, DB, Redis) in detached mode.
- `make down`: Stops and removes all containers.
- `make migrate`: Generates and applies database migrations.
- `make logs`: Tails logs for all services.

## 🔌 API Endpoints (Current Progress)

### Hunts & Listings
- `POST /hunts`: Create a new job search and trigger background scraping.
- `GET /hunts`: List all previous searches.
- `GET /listings`: View found job listings (supports `?hunt_id=` filter).

### CV Management
- `POST /cvs`: Upload a Master CV (supports text Form field or PDF File upload).
- `GET /cvs`: List all uploaded CVs.

### AI Engine
- `POST /tailor/{listing_id}`: Trigger the AI to rewrite your CV for a specific job.

## ⚖️ License

MIT
