#!/usr/bin/env bash
set -e

echo "Start entrypoint.sh"

migrate () {
#   Apply database migrations
  echo "Apply database migrations"
  python manage.py migrate
  # Collect static files
  echo "Collect static files"
  python manage.py collectstatic --noinput
}

run_server() {
  echo "Starting server using gunicorn"
  # python manage.py runserver 0.0.0.0:8000
  gunicorn core.wsgi:application --bind 0.0.0.0:8000
}

migrate;
run_server;
