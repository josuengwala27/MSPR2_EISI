FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY simulate.py .
CMD ["python", "simulate.py", "--host", "mosquitto-colombie", "--interval", "60", "--scenario", "realistic"]
