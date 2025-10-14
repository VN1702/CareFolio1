# -----------------------------
# Dockerfile for Meal Planner API
# -----------------------------

# Use official Python slim image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy requirements first for caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the project files
COPY . .

# Expose port 5000
EXPOSE 5000

# Use Gunicorn for production
# 1 worker, bind to 0.0.0.0:5000, use app.py's app variable
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app", "--workers", "1"]
