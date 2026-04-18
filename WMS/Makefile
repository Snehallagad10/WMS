.PHONY: build build-backend build-frontend run-backend run-frontend test

build: build-backend build-frontend

build-backend:
	docker build -f Dockerfile.backend -t wms-backend .

build-frontend:
	docker build -f Dockerfile.frontend -t wms-frontend .

run-backend:
	docker run --rm -p 8000:8000 wms-backend

run-frontend:
	docker run --rm -p 80:80 wms-frontend

test:
	pytest -q
