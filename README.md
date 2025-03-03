# Fastify API with Prisma & SQLite

This project is a simple REST API built using **Fastify**, **Prisma**, and **SQLite**. It includes user and product management endpoints with proper error handling.

## Features
- 🚀 Fastify framework for high-performance API development  
- 🛢️ Prisma as the ORM with SQLite as the database  
- 🧑‍💻 User and product CRUD operations  
- 📄 Swagger documentation  
- 🔄 CORS support  
- 🛠️ Proper error handling for better API responses  
- 🔜 JWT authentication and role-based access control (Upcoming)  

---

## 📦 Installation

### 1️⃣ Clone the Repository  
```sh
git clone https://github.com/Batin-dev/fastify-prisma-api.git
cd fastify-prisma-api
```

### 2️⃣ Install Dependencies  
```sh
npm install
```

### 3️⃣ Set Up Prisma & SQLite  
Prisma and SQLite are already configured via `schema.prisma`. You just need to apply the migrations:

#### Run Prisma Migrations  
```sh
npx prisma migrate dev --name init
```
This initializes your SQLite database and creates the necessary tables.

#### Generate Prisma Client  
```sh
npx prisma generate
```
This generates the Prisma client, which is needed for interacting with the database.

---

## 🚀 Running the Server  
After setting up Prisma and SQLite, you can start the API server:  
```sh
npx tsx src/server.ts
```
The server will start on `http://localhost:3000`.

---

## 📡 API Endpoints

### User Routes (`/users`)
| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET` | `/users` | Get all users |
| `POST` | `/users/add` | Add a new user (Requires `name`, `surname`, `email`, `password`, `age`, and optional `role`) |
| `POST` | `/users/delete/:id` | Delete a user by ID |
| `POST` | `/users/update/:id` | Update a user by ID |
| `POST` | `/users/login` | Authenticate user (Requires `email` and `password`) |

### Product Routes (`/products`)
| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET` | `/products` | Get all products |
| `POST` | `/products/add` | Add a new product |
| `POST` | `/products/delete/:id` | Delete a product by ID |
| `POST` | `/products/update/:id` | Update a product by ID |
| `/products/update/:id` | Update a product |

---

## 📑 Swagger Documentation
Once the server is running, you can access the API documentation at:  
```
http://localhost:3000/docs
```

---

## 🔜 Upcoming Features
- ✅ User and Product Management  
- ✅ JWT Authentication & Role-based Access Control  
- 🔜 Advanced Logging and Monitoring  

---

## 💡 Troubleshooting

### 🔹 Error: `Error: SQLite database file not found`
Make sure you have run:
```sh
npx prisma migrate dev --name init
```
This will create the `dev.db` file.

### 🔹 Error: `PrismaClient is not initialized`
Run:
```sh
npx prisma generate
```
This regenerates the Prisma client.

---

## 🛠️ Contributing
Feel free to fork this repo and submit a pull request if you have any improvements!

---

## 📜 License
This project is licensed under the **MIT License**.

by [Batin.cpp](https://github.com/Batin-dev)
