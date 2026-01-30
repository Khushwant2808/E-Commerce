# LuxeCommerce - Premium E-Commerce Platform

A stunning, modern e-commerce platform built with React, Vite, and Tailwind CSS featuring a premium dark-mode UI with glassmorphism effects and smooth animations.

## ✨ Features

### 🎨 Design
- **Premium Dark Mode UI** with glassmorphism effects
- **Advanced Animations** powered by Framer Motion
- **Responsive Design** optimized for all devices
- **Gradient Accents** for a modern, luxury feel
- **Custom Scrollbars** and micro-interactions

### 🛍️ Shopping Features
- Browse products with search and filters
- Product details with reviews and ratings
- Shopping cart with real-time updates
- Wishlist functionality
- Secure checkout process
- Order tracking

### 👤 User Features
- User authentication (Login/Register)
- User profile management
- Order history
- Wishlist management
- Become a seller option

### 💼 Seller Features
- Seller dashboard with analytics
- Product management (Add/Edit/Delete)
- Inventory tracking
- Order management
- Sales statistics

### 👑 Admin Features
- Admin dashboard
- User management (coming soon)
- Platform-wide analytics

## 🚀 Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- React Router DOM
- Axios
- React Hot Toast
- Lucide React Icons

**Backend:**
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- B crypt

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- PostgreSQL database
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd E-Commerce
```

2. **Install backend dependencies**
```bash
npm install
```

3. **Install frontend dependencies**
```bash
cd frontend
npm install
cd ..
```

4. **Configure environment variables**
Create a `.env` file in the root directory:
```env
PORT=8000
DATABASE_URL=postgresql://username:password@localhost:5432/ecommerce
JWT_SECRET=your-secret-key
LOG=true
```

5. **Run database migrations**
```bash
# Set up your PostgreSQL database and run migrations
```

6. **Start the application**

Terminal 1 - Backend:
```bash
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`
The backend API will run on `http://localhost:8000`

## 🎯 Project Structure

```
E-Commerce/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── config/
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   └── ProductCard.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── user/
│   │   │   ├── seller/
│   │   │   └── admin/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── index.css
│   └── ...
└── README.md
```

## 🔑 Key Features Explained

### Authentication
- JWT-based authentication
- Role-based access control (User, Seller, Admin)
- Protected routes
- Automatic token refresh

### Product Management
- CRUD operations for products
- Image URL support
- Stock management
- Product activation/deactivation
- Featured products

### Shopping Cart
- Backend-synced cart
- Persistent cart data
- Real-time price calculations
- Quantity management

### Orders
- Complete checkout flow
- Order tracking
- Order history
- Status updates

## 🎨 Design System

The application uses a comprehensive design system with:
- Glass morphism effects
- Custom color gradients
- Reusable component classes
- Consistent spacing and typography
- Smooth transitions and animations

Key  CSS classes:
- `glass` / `glass-card` - Glassmorphism effects
- `btn-primary` / `btn-secondary` - Button styles
- `gradient-text` - Gradient text effects
- `stat-card` - Statistics cards
- `badge-*` - Status badges

## 📱 Pages

**Public Pages:**
- Home
- Products (with filters)
- Product Detail
- Cart
- Login/Register

**User Pages:**
- Profile
- Orders
- Order Detail
- Wishlist

**Seller Pages:**
- Dashboard
- Products Management
- Add/Edit Product
- Orders

**Admin Pages:**
- Dashboard
- User Management
- Order Management

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/api/profile` - Get user profile
- `PUT /api/auth/become-seller` - Upgrade to seller

### Products
- `GET /api/products` - Get all products (with pagination, search, filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (seller only)
- `PUT /api/products/meta` - Update product metadata
- `PUT /api/products/stock` - Update product stock
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/show` - Get seller's products

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Update cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order

### Wishlist
- `GET /api/wish` - Get wishlist
- `POST /api/wish` - Toggle wishlist item

### Reviews
- `GET /api/review/:productId` - Get product reviews
- `POST /api/review` - Add review
- `PUT /api/review` - Update review

## 🎨 Customization

### Colors
Edit `frontend/tailwind.config.js` to customize the color scheme.

### Animations
Modify `frontend/src/index.css` to adjust animations and transitions.

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. Contact the owner for contribution guidelines.

## 📧 Support

For support, email your.email@example.com

---

Built with ❤️ using React, Vite, and Tailwind CSS
