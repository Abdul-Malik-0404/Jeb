# Project Overview

**Jeb (Autonomous Job Scout & Resume Tailor)**

This project aims to build a minimalist web dashboard that scrapes job listings (specifically targeting Colombo, Sri Lanka), analyzes them against a Master CV (supporting both text paste and PDF upload), and generates on-demand, tailored, ATS-friendly PDFs using AI.

**Core Stack:**
*   **Backend:** Python, FastAPI, PostgreSQL (SQLAlchemy), Celery + Redis
*   **Frontend:** Next.js (App Router), Tailwind, Shadcn/UI (Minimalist/Dark Mode)
*   **PDF Engine:** WeasyPrint (HTML-to-PDF)
*   **AI:** Gemini 1.5 Pro (for skill extraction and resume tailoring)
*   **Scraping:** Playwright (for stealth scraping of job boards)

## Building and Running

*Commands will be executed via a unified `Makefile` (currently being drafted in Phase 1).*

*   **Setup:** `make setup` (Builds Docker containers, installs dependencies and Playwright browsers)
*   **Run Stack:** `make up` (Starts docker-compose services: `db`, `redis`, `api`, `worker`)
*   **Stop Stack:** `make down` (Stops docker-compose services)
*   **Database Migrations:** `make migrate` (Runs Alembic migrations)

## Development Conventions

*   **Code Quality:** Modular, strictly type-hinted Python code.
*   **Documentation:** Concise, scannable docstrings for all functions/classes.
*   **UI/UX:** Strictly minimalist interface; prioritizing utility and a developer-centric layout over visual fluff.
*   **Document Parsing:** ATS-friendly HTML-to-PDF conversion via WeasyPrint. The CV template uses simple standard `<div>` and `<p>` tags (avoiding complex floats or grids) to maintain high parseability.
*   **Scraping:** Requires stealth configurations such as randomized user-agents and human-like scroll delays.