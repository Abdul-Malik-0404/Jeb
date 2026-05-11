FROM python:3.11-slim

# Install system dependencies for WeasyPrint and Playwright
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libffi-dev \
    libgirepository1.0-dev \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf-2.0-0 \
    shared-mime-info \
    libxml2-dev \
    libxslt1-dev \
    python3-dev \
    libpq-dev \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install Playwright browsers and their system dependencies
RUN playwright install --with-deps chromium

COPY . .

# Create a non-root user (optional but recommended)
# RUN useradd -m jebuser
# USER jebuser

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
