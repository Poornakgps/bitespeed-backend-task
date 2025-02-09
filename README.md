# BiteSpeed Backend Task

## Project Overview
This project is a backend service built using Node.js, Express, and PostgreSQL. It provides RESTful APIs to handle business logic efficiently. Docker and Docker Compose are used for containerized deployment.

## Features
- REST API with Express
- PostgreSQL database integration
- Dockerized environment
- Environment variable configuration using `.env`

## Prerequisites
Ensure you have the following installed on your system:
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)
- [Postman](https://www.postman.com/) (optional, for testing API requests)

## Installation & Setup

### 1. Clone the Repository
```sh
git clone https://github.com/Poornakgps/bitespeed-backend-task.git
cd bitespeed-backend-task
```

### 2. Setup Environment Variables
Rename `.env.sample` to `.env` and update the required fields.
```sh
cp .env.sample .env
```
Modify `.env` as needed.

### 3. Start the Application Using Docker
```sh
docker-compose up --build
```
This will spin up both the backend server and PostgreSQL database.

### 4. Verify the Application
Once the services are running, check if the API is accessible by hitting:
```sh
http://localhost:5000
```

## API Usage
You can test the API endpoints using Postman or `curl`. 

### Testing with Postman
1. Open Postman.
2. Import the Postman collection available in the repository.
3. Select the desired API request from the collection.
4. Click **Send** to test the API.

## Stopping the Application
To stop the containers, run:
```sh
docker-compose down
```

## Troubleshooting
- If you encounter a `ConnectionRefusedError` for PostgreSQL, ensure that the database container is running properly.
- Run `docker ps` to check running containers.
- If needed, remove old containers and rebuild:
  ```sh
  docker-compose down -v
  docker-compose up --build
  ```

