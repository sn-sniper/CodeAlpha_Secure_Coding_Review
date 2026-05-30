# User Management API (Secure Coding Review Task)
[Task3 Report](https://docs.google.com/document/d/1yXHxx2ejrZ8AVDGiny0XZVfo4FHJemY3qKGSqMJPfoU/edit?usp=sharing)
This is a simple Node.js, Express, and SQLite API built for a university Secure Coding Review exercise.

## Requirements

- Node.js (v14+ recommended)
- npm

## Setup Instructions

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy the example environment variables file:

   ```bash
   cp .env.example .env
   ```

3. **Start the application**

   ```bash
   npm start
   ```

   The server will start on `http://localhost:3000`.

## API Endpoints

### 1. Register User

- **URL:** `/register`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }
  ```

### 2. Login User

- **URL:** `/login`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **Returns:** JWT token to be used for authenticated endpoints.

### 3. Search Users

- **URL:** `/users/search?q=query`
- **Method:** `GET`
- **Description:** Search users by username or email.

### 4. Get Profile

- **URL:** `/profile/:id`
- **Method:** `GET`
- **Description:** Get a user's details without password hashes.

### 5. Upload Avatar

- **URL:** `/upload-avatar`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <your_jwt_token>`
- **Body:** form-data with the key `avatar` containing the file.
- **Description:** Uploads a file to the `/uploads` directory and updates the user's avatar path.
