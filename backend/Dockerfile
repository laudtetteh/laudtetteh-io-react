FROM python:3.11-slim

# Set working directory inside container
WORKDIR /app

# Copy only app code inside /app
COPY app /app

# Copy requirements first to install dependencies
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Default run command
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
