# LuxeCommerce - Full-Stack E-Commerce Platform

A modern, full-featured e-commerce platform built with React and Node.js featuring a premium glassmorphism UI design, real-time order management, and comprehensive admin dashboard.

## Tech Stack

### Frontend
- React 18 with Vite
- TailwindCSS for styling
- Framer Motion for animations
- React Router for navigation
- Axios for API communication

### Backend
- Node.js with Express.js
- PostgreSQL database
- Sequelize ORM
- JWT authentication
- bcrypt for password hashing

## Features

### Customer Features
- User registration and authentication
- Product browsing with search and filters
- Shopping cart management
- Wishlist functionality
- Order placement and tracking
- Address management
- Responsive design for all devices

### Seller Features
- Seller dashboard with analytics
- Product management (CRUD operations)
- Order management and status updates
- Sales tracking

### Admin Features
- Admin dashboard with statistics
- User management (roles, permissions)
- Order oversight and management
- Platform-wide analytics

## Project Structure

```
E-Commerce/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── routes/
│   └── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js (v18+)
- PostgreSQL

### Setup

1. Clone the repository
```bash
git clone https://github.com/Khushwant2808/e-commerce.git
cd e-commerce
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables in backend/.env and frontend/.env

4. Initialize database
```bash
cd backend && npm run db:sync && npm run seed
```

5. Start development servers
```bash
npm run dev
```