# Ginni E-Commerce Backend

This is the production-ready Node.js backend for the Ginni E-Commerce functional application. It serves APIs for user authentication, product management, cart handling, orders placing, and admin dashboard statistics.

## ✨ Tech Stack
- **Framework**: Node.js + Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (Access & Refresh tokens) + BCrypt Password hashing
- **Validation**: Zod
- **File Upload**: Multer + Cloudinary
- **Security**: Helmet, CORS, Rate Limiting

---

## 🚀 How to Run the Project Local
1. **Clone & Install Dependencies**
```bash
cd backend
npm install
```

2. **Database Setup**
Ensure PostgreSQL is running locally. Update your `.env` connection string:
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/ginni_db?schema=public"
```

3. **Push Prisma Schema**
```bash
npx prisma db push
# or to create migrations
npx prisma migrate dev --name init
```

4. **Start Application**
```bash
npm run dev
```

---

## 🐳 Running with Docker
You can easily spawn the API and the PostgreSQL database together via docker-compose:
```bash
docker-compose up --build -d
```
The API will run on port `5000` and the database on `5432`.

Note: After the containers start, you need to run prisma migrations inside the API container:
```bash
docker-compose exec api npx prisma db push
```

---

## 📖 Example API Requests & Responses

### 1. Register User (`POST /api/auth/register`)
**Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepassword",
  "phone": "9876543210"
}
```
**Response**:
```json
{
  "success": true,
  "data": {
    "id": "abc-123-xyz",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "USER",
    "createdAt": "2023-11-20T10:00:00.000Z"
  },
  "message": "User registered successfully"
}
```

### 2. Login User (`POST /api/auth/login`)
**Request Body**:
```json
{
  "email": "jane@example.com",
  "password": "securepassword"
}
```
**Response** *(Also sets HttpOnly cookies for Access and Refresh tokens)*:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "abc-123-xyz",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "USER"
    },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  },
  "message": "User logged in successfully"
}
```

### 3. Fetch Products (`GET /api/products?page=1&limit=10`)
**Response**:
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "product-123",
        "name": "Red Silk Saree",
        "price": 12000,
        "images": ["https://res.cloudinary.com/foo/image.jpg"],
        "category": {
           "name": "Sarees"
        }
      }
    ],
    "total": 1,
    "totalPages": 1,
    "currentPage": 1
  },
  "message": "Products fetched successfully"
}
```

### 4. Create Order (`POST /api/orders`) - *Requires Auth*
**Request Body**:
```json
{
  "addressId": "address-123",
  "paymentMethod": "ONLINE"
}
```
**Response**:
```json
{
  "success": true,
  "data": {
    "id": "order-123",
    "totalAmount": 12000,
    "status": "PENDING",
    "paymentMethod": "ONLINE",
    "orderItems": [
      {
        "productId": "product-123",
        "quantity": 1,
        "price": 12000
      }
    ]
  },
  "message": "Order placed successfully"
}
```
