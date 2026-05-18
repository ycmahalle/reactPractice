# E-Commerce Backend API

A secure and scalable e-commerce backend built with NestJS, MongoDB, and JWT authentication. Features include encrypted API communication, role-based access control, image uploads, and shareable product links.

## 📑 Table of Contents

- [Quick Start](#-quick-start)
- [Prerequisites](#-prerequisites)
- [Step-by-Step Setup](#-step-by-step-setup-instructions)
- [Running the Application](#-running-the-application)
- [Verify Installation](#-verify-installation)
- [Troubleshooting](#-troubleshooting)
- [Project Structure](#-project-structure-overview)
- [API Endpoints](#-api-endpoints)
- [Authentication](#-authentication)
- [Encryption/Decryption](#-encryptiondecryption)
- [Image Upload](#-image-upload)
- [Shareable Links](#-shareable-links)
- [Testing](#-testing)
- [Error Handling](#-error-handling)
- [Security Best Practices](#-security-best-practices)
- [Environment Variables](#-environment-variables)
- [Next Steps](#-next-steps-after-setup)
- [Getting Help](#-getting-help)

## 🚀 Features

- **Authentication & Authorization**
  - User registration and login
  - JWT-based authentication
  - Role-based access control (User/Admin)
  - Secure password hashing with bcrypt

- **CRUD Operations**
  - User management (Register, Login, Get Profile, Update, Delete)
  - Category management (Create, Read, Update, Delete)
  - Subcategory management (Create under category, Read, Update, Delete)
  - Product management (Create with images, Read, Update, Delete)

- **Image Upload & Management**
  - Multi-image upload support
  - Organized storage in `/public/images/products/{productId}/`
  - Image metadata stored in database

- **Shareable Links**
  - Public links: Viewable without authentication
  - Private links: Require valid JWT token

- **Security**
  - AES-256-CBC encryption for all API requests/responses
  - Centralized encryption/decryption middleware
  - Input validation and error handling
  - Secure coding practices

## ⚡ Quick Start

For experienced developers who want to get started quickly:

```bash
# 1. Clone and install
git clone <repository-url>
cd e-commerce-backend
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your MongoDB URI and generate secure keys

# 3. Start MongoDB (if local)
# Windows: net start MongoDB
# macOS/Linux: sudo systemctl start mongod

# 4. Run the application
npm run start:dev
```

The server will start at `http://localhost:3000`

**For detailed instructions, see the [Step-by-Step Setup](#-step-by-step-setup-instructions) section below.**

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18 or higher) - [Download Node.js](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download MongoDB](https://www.mongodb.com/try/download/community)
- **npm** (comes with Node.js) or **yarn**
- **Git** (for cloning the repository)

### Verify Prerequisites

```bash
# Check Node.js version
node --version  # Should be v18 or higher

# Check npm version
npm --version

# Check MongoDB (if installed locally)
mongod --version  # Should be v5 or higher
```

---

## 🛠️ Step-by-Step Setup Instructions

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd e-commerce-backend
```

**Note:** Replace `<repository-url>` with your actual repository URL.

---

### Step 2: Install Dependencies

```bash
# Install all required packages
npm install
```

This will install all dependencies listed in `package.json`. The installation may take a few minutes.

**Expected output:**
```
added 250 packages, and audited 251 packages in 30s
```

---

### Step 3: Set Up MongoDB

#### Option A: Local MongoDB Installation

1. **Install MongoDB** (if not already installed):
   - **Windows**: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - **macOS**: `brew install mongodb-community`
   - **Linux**: Follow [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)

2. **Start MongoDB Service**:
   ```bash
   # Windows (run as Administrator)
   net start MongoDB

   # macOS/Linux
   sudo systemctl start mongod
   # OR
   mongod
   ```

3. **Verify MongoDB is running**:
   ```bash
   # Connect to MongoDB shell
   mongosh
   # OR (older versions)
   mongo
   ```

#### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string from the Atlas dashboard
4. Replace `<password>` and `<dbname>` in the connection string

---

### Step 4: Configure Environment Variables

1. **Copy the example environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Open `.env` file** in your text editor and configure the following:

   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   # For MongoDB Atlas, use:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-in-production

   # Encryption Configuration
   ENCRYPTION_KEY=your-32-byte-encryption-key-change-in-production
   ```

3. **Generate Secure Keys**:

   **For JWT_SECRET** (generate a strong random string):
   ```bash
   # Using OpenSSL
   openssl rand -base64 32

   # Using Node.js
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

   **For ENCRYPTION_KEY** (must be 32 bytes):
   ```bash
   # Using OpenSSL
   openssl rand -base64 32

   # Using Node.js
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

   **Important:** 
   - Never commit the `.env` file to version control
   - Use different keys for development and production
   - Keep your keys secure and never share them

---

### Step 5: Verify MongoDB Connection

Before running the application, ensure MongoDB is accessible:

```bash
# Test MongoDB connection (if using local MongoDB)
mongosh mongodb://localhost:27017/ecommerce

# Or test with Node.js
node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb://localhost:27017/ecommerce').then(() => { console.log('Connected!'); process.exit(0); }).catch(err => { console.error('Error:', err); process.exit(1); });"
```

---

### Step 6: Create Required Directories

The application will create these automatically, but you can create them manually:

```bash
# Create public images directory
mkdir -p public/images/products
```

---

## 🚀 Running the Application

### Development Mode (Recommended for Development)

```bash
# Start the application in watch mode (auto-reload on changes)
npm run start:dev
```

**Expected output:**
```
[Nest] Starting Nest application...
[Nest] Application is running on: http://localhost:3000
```

The application will:
- Automatically restart when you make code changes
- Show detailed error messages
- Enable hot-reload

### Production Mode

```bash
# Step 1: Build the application
npm run build

# Step 2: Start the production server
npm run start:prod
```

**Expected output:**
```
Application is running on: http://localhost:3000
```

### Other Available Commands

```bash
# Start in debug mode
npm run start:debug

# Format code
npm run format

# Lint code
npm run lint

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Generate test coverage
npm run test:cov
```

---

## ✅ Verify Installation

### 1. Check Server Status

Open your browser or use curl:

```bash
# Check if server is running
curl http://localhost:3000

# Or open in browser
# http://localhost:3000
```

### 2. Test API Endpoints

**Register a new user** (without encryption for testing):
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -H "x-no-encryption: true" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**Login** (without encryption for testing):
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -H "x-no-encryption: true" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

You should receive a response with an `access_token`.

---

## 🔧 Troubleshooting

### Issue: MongoDB Connection Error

**Error:** `MongooseError: connect ECONNREFUSED`

**Solutions:**
1. Ensure MongoDB is running:
   ```bash
   # Check MongoDB status
   sudo systemctl status mongod  # Linux
   # OR check Windows Services
   ```

2. Verify MongoDB URI in `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   ```

3. Check if MongoDB is listening on the correct port (default: 27017)

### Issue: Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3000`

**Solutions:**
1. Change the port in `.env`:
   ```env
   PORT=3001
   ```

2. Or kill the process using port 3000:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F

   # macOS/Linux
   lsof -ti:3000 | xargs kill -9
   ```

### Issue: Module Not Found

**Error:** `Cannot find module '...'`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Encryption/Decryption Errors

**Error:** `Invalid encrypted request` or `Decryption failed`

**Solutions:**
1. Ensure `ENCRYPTION_KEY` is set correctly in `.env`
2. The key must be 32 bytes (use the generation commands above)
3. For testing, use the `x-no-encryption: true` header

### Issue: JWT Authentication Fails

**Error:** `Unauthorized` or `Invalid token`

**Solutions:**
1. Verify `JWT_SECRET` is set in `.env`
2. Ensure you're sending the token in the correct format:
   ```
   Authorization: Bearer <your-token>
   ```
3. Check if the token has expired (default: 1 hour)

---

## 📦 Project Structure Overview

```
e-commerce-backend/
├── src/
│   ├── auth/              # Authentication module
│   │   ├── guards/       # JWT authentication guards
│   │   ├── strategies/   # Passport JWT strategy
│   │   └── dto/          # Login DTOs
│   ├── users/            # User management
│   │   ├── schemas/      # User Mongoose schema
│   │   ├── dto/          # User DTOs
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── categories/       # Category management
│   ├── subcategories/    # Subcategory management
│   ├── products/         # Product management
│   │   └── file-upload.service.ts
│   ├── encryption/       # Encryption service & middleware
│   ├── common/           # Shared utilities
│   │   ├── filters/     # Exception filters
│   │   └── interceptors/ # Response interceptors
│   ├── database/         # Database configuration
│   ├── app.module.ts     # Root module
│   └── main.ts           # Application entry point
├── public/              # Static files
│   └── images/          # Uploaded images
│       └── products/    # Product images
├── .env.example         # Environment variables template
├── .env                 # Your environment variables (not in git)
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md           # This file
```

---

## 🔄 Development Workflow

1. **Make changes** to the code
2. **Save files** - The dev server will auto-reload
3. **Test endpoints** using Postman, curl, or your frontend
4. **Check logs** in the terminal for errors
5. **Commit changes** to Git

---

## 📝 Next Steps After Setup

### Complete Setup Workflow

1. **Create your first user**:
   ```bash
   curl -X POST http://localhost:3000/auth/register \
     -H "Content-Type: application/json" \
     -H "x-no-encryption: true" \
     -d '{
       "email": "admin@example.com",
       "password": "admin123",
       "firstName": "Admin",
       "lastName": "User"
     }'
   ```

2. **Login to get JWT token**:
   ```bash
   curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -H "x-no-encryption: true" \
     -d '{
       "email": "admin@example.com",
       "password": "admin123"
     }'
   ```
   Save the `access_token` from the response.

3. **Create a category**:
   ```bash
   curl -X POST http://localhost:3000/categories \
     -H "Authorization: Bearer <your-token>" \
     -H "Content-Type: application/json" \
     -H "x-no-encryption: true" \
     -d '{
       "name": "Electronics",
       "description": "Electronic products"
     }'
   ```
   Save the category `_id` from the response.

4. **Create a subcategory**:
   ```bash
   curl -X POST http://localhost:3000/subcategories \
     -H "Authorization: Bearer <your-token>" \
     -H "Content-Type: application/json" \
     -H "x-no-encryption: true" \
     -d '{
       "name": "Smartphones",
       "description": "Mobile phones",
       "categoryId": "<category-id-from-step-3>"
     }'
   ```
   Save the subcategory `_id` from the response.

5. **Create a product with images**:
   ```bash
   curl -X POST http://localhost:3000/products \
     -H "Authorization: Bearer <your-token>" \
     -H "x-no-encryption: true" \
     -F "name=iPhone 15" \
     -F "description=Latest iPhone model" \
     -F "price=999.99" \
     -F "stock=50" \
     -F "categoryId=<category-id>" \
     -F "subcategoryId=<subcategory-id>" \
     -F "isActive=true" \
     -F "isPublic=true" \
     -F "images=@phone1.jpg" \
     -F "images=@phone2.jpg"
   ```
   Save the product `_id` from the response.

6. **Test shareable links**:
   ```bash
   # Public link (no auth required)
   curl http://localhost:3000/products/share/<product-id> \
     -H "x-no-encryption: true"
   
   # Private link (auth required)
   curl http://localhost:3000/products/private/<product-id> \
     -H "Authorization: Bearer <your-token>" \
     -H "x-no-encryption: true"
   ```

### Testing Checklist

- [ ] Server starts without errors
- [ ] MongoDB connection successful
- [ ] User registration works
- [ ] User login returns JWT token
- [ ] Protected endpoints require authentication
- [ ] Category CRUD operations work
- [ ] Subcategory CRUD operations work
- [ ] Product creation with images works
- [ ] Images are accessible via URL
- [ ] Shareable links work (public and private)
- [ ] Encryption/decryption works (or bypass with header)

---

## 🆘 Getting Help

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Review the **Error Handling** section in this README
3. Check application logs in the terminal
4. Verify all environment variables are set correctly
5. Ensure MongoDB is running and accessible

## 📁 Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── guards/          # JWT guards
│   ├── strategies/      # Passport strategies
│   └── dto/             # Data transfer objects
├── users/               # User management
│   ├── schemas/         # Mongoose schemas
│   ├── dto/             # DTOs
│   └── ...
├── categories/          # Category management
├── subcategories/       # Subcategory management
├── products/            # Product management
│   └── file-upload.service.ts  # Image upload handling
├── encryption/          # Encryption service & middleware
├── common/              # Shared utilities
│   ├── dto/             # Common DTOs
│   ├── filters/         # Exception filters
│   └── interceptors/    # Response interceptors
└── main.ts              # Application entry point
```

## 🔐 Encryption/Decryption

The API uses **AES-256-CBC encryption** for all request and response data. The encryption is handled automatically by middleware.

### How It Works

1. **Request Encryption**: Send encrypted data in the request body:
   ```json
   {
     "encrypted": "<encrypted-string>"
   }
   ```

2. **Response Encryption**: All responses are automatically encrypted:
   ```json
   {
     "encrypted": "<encrypted-string>"
   }
   ```

3. **Disable Encryption**: Add header `x-no-encryption: true` to receive unencrypted responses (useful for development/testing).

### Encryption Service

The `EncryptionService` uses:
- **Algorithm**: AES-256-CBC
- **Key**: Derived from `ENCRYPTION_KEY` environment variable
- **IV**: Random 16-byte initialization vector for each encryption

### Working with Encryption

#### For Development/Testing

Add the `x-no-encryption: true` header to all requests to bypass encryption:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -H "x-no-encryption: true" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### For Production

You'll need to encrypt requests and decrypt responses. Here's a JavaScript example:

**Encrypting a request:**
```javascript
const crypto = require('crypto');

function encryptObject(obj, encryptionKey) {
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(encryptionKey, 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  
  const jsonString = JSON.stringify(obj);
  let encrypted = cipher.update(jsonString, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
}

// Usage
const encrypted = encryptObject({
  email: "user@example.com",
  password: "password123"
}, process.env.ENCRYPTION_KEY);

// Send request
fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ encrypted })
});
```

**Decrypting a response:**
```javascript
function decryptObject(encryptedText, encryptionKey) {
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(encryptionKey, 'salt', 32);
  const parts = encryptedText.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return JSON.parse(decrypted);
}

// Usage
const response = await fetch('http://localhost:3000/users/profile', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const data = await response.json();
const decrypted = decryptObject(data.encrypted, process.env.ENCRYPTION_KEY);
```

### Important Notes

- **File uploads** (multipart/form-data) are automatically excluded from encryption
- **Static files** served from `/public` are not encrypted
- Always use HTTPS in production when handling encrypted data
- Keep your `ENCRYPTION_KEY` secure and never commit it to version control

## 📡 API Endpoints

### Base URL
```
http://localhost:3000
```

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user"
    }
  }
}
```

### Users

- `GET /users/profile` - Get current user profile (requires auth)
- `GET /users/:id` - Get user by ID (requires auth)
- `PATCH /users/:id` - Update user (requires auth)
- `DELETE /users/:id` - Delete user (requires auth)

**Example - Get Profile:**
```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "x-no-encryption: true"
```

### Categories

- `GET /categories` - Get all categories (public)
- `GET /categories/:id` - Get category by ID (public)
- `POST /categories` - Create category (requires auth)
- `PATCH /categories/:id` - Update category (requires auth)
- `DELETE /categories/:id` - Delete category (requires auth)

**Example - Create Category:**
```bash
curl -X POST http://localhost:3000/categories \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -H "x-no-encryption: true" \
  -d '{
    "name": "Electronics",
    "description": "Electronic products"
  }'
```

### Subcategories

- `GET /subcategories` - Get all subcategories (public)
- `GET /subcategories?categoryId=xxx` - Get subcategories by category (public)
- `GET /subcategories/:id` - Get subcategory by ID (public)
- `POST /subcategories` - Create subcategory (requires auth)
- `PATCH /subcategories/:id` - Update subcategory (requires auth)
- `DELETE /subcategories/:id` - Delete subcategory (requires auth)

**Example - Create Subcategory:**
```bash
curl -X POST http://localhost:3000/subcategories \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -H "x-no-encryption: true" \
  -d '{
    "name": "Smartphones",
    "description": "Mobile phones",
    "categoryId": "<category-id>"
  }'
```

### Products

- `GET /products` - Get all products with pagination (public)
  - Query params: `page`, `limit`, `categoryId`, `subcategoryId`, `search`, `isActive`
- `GET /products/:id` - Get product by ID (public)
- `GET /products/share/:id` - Get product via public shareable link
- `GET /products/private/:id` - Get product via private link (requires auth)
- `POST /products` - Create product with images (requires auth)
  - Form data: product fields + `images` (multipart/form-data)
- `PATCH /products/:id` - Update product and images (requires auth)
- `DELETE /products/:id` - Delete product (requires auth)

**Example - Get Products with Filters:**
```bash
curl -X GET "http://localhost:3000/products?page=1&limit=10&categoryId=<category-id>&search=laptop" \
  -H "x-no-encryption: true"
```

**Example - Create Product:**
```bash
curl -X POST http://localhost:3000/products \
  -H "Authorization: Bearer <your-jwt-token>" \
  -F "name=Laptop" \
  -F "description=High performance laptop" \
  -F "price=999.99" \
  -F "stock=50" \
  -F "categoryId=<category-id>" \
  -F "subcategoryId=<subcategory-id>" \
  -F "isActive=true" \
  -F "isPublic=true" \
  -F "images=@image1.jpg" \
  -F "images=@image2.jpg"
```

## 🔑 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Getting a JWT Token

1. **Register a new user** (if you haven't already):
   ```bash
   curl -X POST http://localhost:3000/auth/register \
     -H "Content-Type: application/json" \
     -H "x-no-encryption: true" \
     -d '{
       "email": "user@example.com",
       "password": "password123",
       "firstName": "John",
       "lastName": "Doe"
     }'
   ```

2. **Login to get the token**:
   ```bash
   curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -H "x-no-encryption: true" \
     -d '{
       "email": "user@example.com",
       "password": "password123"
     }'
   ```

3. **Copy the `access_token` from the response** and use it in subsequent requests.

### Using the Token

```bash
# Example: Get user profile
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "x-no-encryption: true"
```

**Note:** The `x-no-encryption: true` header is used for testing. In production, you'll need to handle encryption/decryption.

## 📤 Image Upload

Product images are uploaded using `multipart/form-data`:

### Using cURL

```bash
curl -X POST http://localhost:3000/products \
  -H "Authorization: Bearer <token>" \
  -H "x-no-encryption: true" \
  -F "name=Product Name" \
  -F "description=Product description" \
  -F "price=99.99" \
  -F "stock=100" \
  -F "categoryId=<category-id>" \
  -F "subcategoryId=<subcategory-id>" \
  -F "isActive=true" \
  -F "isPublic=true" \
  -F "images=@image1.jpg" \
  -F "images=@image2.jpg"
```

### Using Postman

1. Set method to **POST**
2. URL: `http://localhost:3000/products`
3. Go to **Headers** tab:
   - Add `Authorization: Bearer <your-token>`
   - Add `x-no-encryption: true` (for testing)
4. Go to **Body** tab:
   - Select **form-data**
   - Add fields:
     - `name` (Text): Product Name
     - `price` (Text): 99.99
     - `categoryId` (Text): <category-id>
     - `images` (File): Select image files (can add multiple)
5. Click **Send**

### Image Requirements

- **Supported formats**: JPG, JPEG, PNG, GIF
- **Max file size**: 5MB per image
- **Max images**: 10 images per product
- **Storage location**: `/public/images/products/{productId}/`

### Accessing Uploaded Images

Images are accessible via:
```
http://localhost:3000/public/images/products/{productId}/{filename}
```

Example:
```
http://localhost:3000/public/images/products/507f1f77bcf86cd799439011/product-1234567890.jpg
```

## 🔗 Shareable Links

### Public Links
- Accessible without authentication
- Format: `/products/share/:id` or `/products/:id`
- Works for products with `isPublic: true`

### Private Links
- Require valid JWT token
- Format: `/products/private/:id`
- Works for all products (public or private)

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🐛 Error Handling

The API uses a global exception filter that returns consistent error responses:

```json
{
  "success": false,
  "statusCode": 400,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/endpoint",
  "message": "Error message"
}
```

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit `.env` file. Use `.env.example` as a template.
2. **JWT Secret**: Use a strong, random secret key in production.
3. **Encryption Key**: Generate a secure 32-byte key for AES encryption.
4. **Password Hashing**: Passwords are automatically hashed using bcrypt (10 rounds).
5. **Input Validation**: All inputs are validated using class-validator.
6. **CORS**: Configure CORS appropriately for your frontend domain.

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/ecommerce` |
| `JWT_SECRET` | Secret key for JWT tokens | - |
| `ENCRYPTION_KEY` | Key for AES encryption | - |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License

## 👤 Author

E-Commerce Backend Team

---

**Note**: This is a backend API. Make sure to configure CORS and authentication properly for production use.


