# Project Setup

This project consists of a frontend built with Vite, React, TypeScript, and React Bootstrap, and a backend built with Node.js, Express, and TypeScript. It also includes a MongoDB database.

## Prerequisites

- Docker and Docker Compose installed on your machine.

## Running with Docker Compose

To run the entire application (frontend, backend, and MongoDB) using Docker Compose, follow these steps:

1. Navigate to the project directory:

   ```sh
   cd /f:/FTP-files
   ```

2. Build and start the services:

   ```sh
   docker-compose up --build
   ```

3. The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:3001`.

## Frontend Development

To run the frontend in development mode:

1. Navigate to the frontend directory:

   ```sh
   cd /f:/FTP-files/frontend
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

3. Start the development server:

   ```sh
   npm run dev
   ```

4. The frontend will be available at `http://localhost:3000`.

## Backend Development

To run the backend in development mode:

1. Navigate to the backend directory:

   ```sh
   cd /f:/FTP-files/backend
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

3. Start the development server:

   ```sh
   npm run dev
   ```

4. The backend will be available at `http://localhost:3000`.

## Frontend Production Build

To build the frontend for production:

1. Navigate to the frontend directory:

   ```sh
   cd /f:/FTP-files/frontend
   ```

2. Build the application:

   ```sh
   npm run build
   ```

3. Serve the production build:

   ```sh
   npm run serve
   ```

4. The frontend will be available at `http://localhost:3000`.

## Backend Production Build

To build the backend for production:

1. Navigate to the backend directory:

   ```sh
   cd /f:/FTP-files/backend
   ```

2. Build the application:

   ```sh
   npm run build
   ```

3. Start the production server:

   ```sh
   npm start
   ```

4. The backend will be available at `http://localhost:3000`.
