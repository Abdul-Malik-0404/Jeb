.PHONY: setup up down migrate logs

setup:
	sudo docker compose build
	sudo docker compose run --rm api playwright install chromium
	# Frontend node_modules will be installed during container build

up:
	sudo docker compose up -d

down:
	sudo docker compose down

migrate:
	sudo docker compose run --rm api alembic upgrade head

makemigrations:
	sudo docker compose run --rm api alembic revision --autogenerate -m "Update models"

logs:
	sudo docker compose logs -f
