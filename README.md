# Cricket Equipment Ecommerce Website

A full-stack ecommerce website for selling cricket equipment built with React, Express, Node.js, and MongoDB.

## Features

### Frontend (React)
- Modern responsive design with Tailwind CSS
- Product catalog with filtering and search
- Shopping cart functionality
- User authentication (login/register)
- Checkout process
- Order management
- Product reviews and ratings

### Backend (Express/Node.js)
- RESTful API architecture
- JWT authentication
- MongoDB integration with Mongoose
- File upload support
- Input validation
- CORS enabled

### Database Models
- Users (with authentication)
- Products (cricket equipment)
- Shopping Cart
- Orders
- Reviews

## Tech Stack

- **Frontend**: React 18, React Router, React Query, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Project Structure

```
Cricket/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   └── package.json
├── server/                 # Express backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── uploads/            # File uploads
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Cricket
   ```

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/cricket-equipment
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system.

6. **Run the Application**
   
   Start the backend server:
   ```bash
   cd server
   npm run dev
   ```
   
   Start the frontend (in a new terminal):
   ```bash
   cd client
   npm start
   ```

7. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Admin API Endpoints
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users (Admin only)
- `PUT /api/admin/users/:id/role` - Update user role (Admin only)
- `DELETE /api/admin/users/:id` - Delete user (Admin only)
- `GET /api/admin/orders` - Get all orders (Admin only)
- `PUT /api/admin/orders/:id/status` - Update order status (Admin only)

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `POST /api/products/:id/reviews` - Add product review

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:productId` - Update cart item
- `DELETE /api/cart/remove/:productId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `GET /api/orders` - Get all orders (Admin only)
- `PUT /api/orders/:id/status` - Update order status (Admin only)

## Cricket Equipment Categories

- **Bats** - Cricket bats of various sizes and materials
- **Balls** - Cricket balls for different formats
- **Pads** - Batting and wicket-keeping pads
- **Gloves** - Batting and wicket-keeping gloves
- **Helmets** - Protective helmets
- **Shoes** - Cricket shoes and spikes
- **Clothing** - Cricket jerseys, pants, and accessories
- **Accessories** - Other cricket equipment and accessories

## Admin Setup

### Method 1: Using the Setup Script (Recommended)
```bash
cd server
npm run create-admin
```

This creates an admin user with:
- Email: admin@cricketstore.com
- Password: admin123

### Method 2: Manual Database Update
Register normally and then update the user's role in the database:

```javascript
// In MongoDB shell or compass
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## Admin Features

### Admin Dashboard
- View total users, products, orders, and revenue
- Recent orders overview
- Top selling products analytics
- Quick access to all management sections

### Product Management
- Add new cricket equipment products
- Edit existing product details (name, price, stock, etc.)
- Delete products from inventory
- Search and filter products
- Real-time stock status indicators

### User Management
- View all registered users
- Change user roles (user/admin)
- Delete user accounts
- Search users by name or email
- User registration analytics

### Order Management
- View all customer orders
- Update order status (pending → processing → shipped → delivered)
- Filter orders by status
- Search orders by customer or order ID
- View detailed order information
- Order status analytics

### Access Admin Panel
Once logged in as an admin user, click the "Admin" button in the navigation bar to access the admin dashboard.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
```


```
```
Cricket
├─ client
│  ├─ .env.example
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  ├─ favicon_io
│  │  │  ├─ android-chrome-192x192.png
│  │  │  ├─ android-chrome-512x512.png
│  │  │  ├─ apple-touch-icon.png
│  │  │  ├─ favicon-16x16.png
│  │  │  ├─ favicon-32x32.png
│  │  │  ├─ favicon.ico
│  │  │  └─ site.webmanifest
│  │  └─ index.html
│  ├─ src
│  │  ├─ App.js
│  │  ├─ assets
│  │  │  ├─ Brands
│  │  │  │  ├─ dsc-Logo.png
│  │  │  │  ├─ GM-Logo.png
│  │  │  │  ├─ GN-Logo.png
│  │  │  │  ├─ HC-Logo.jpg
│  │  │  │  ├─ Kookaburra-Logo.png
│  │  │  │  ├─ MRF-Logo.png
│  │  │  │  ├─ NB-Logo.png
│  │  │  │  ├─ SF-Logo.webp
│  │  │  │  ├─ SG-Logo.jpg
│  │  │  │  └─ SS-Logo.png
│  │  │  ├─ category-balls.png
│  │  │  ├─ category-bats.png
│  │  │  ├─ category-gloves.png
│  │  │  ├─ category-helmets.png
│  │  │  ├─ category-pads.png
│  │  │  ├─ category-shoes.png
│  │  │  ├─ cricket-Hero-Image.png
│  │  │  ├─ cricket-kit.jpg
│  │  │  ├─ cricket-kit.png
│  │  │  ├─ proseries-image.webp
│  │  │  └─ pvv-logo.png
│  │  ├─ components
│  │  │  ├─ AdminRoute.js
│  │  │  ├─ Footer.css
│  │  │  ├─ Footer.js
│  │  │  ├─ LoadingSpinner.js
│  │  │  ├─ Navbar.css
│  │  │  ├─ Navbar.js
│  │  │  ├─ ProductCard.css
│  │  │  ├─ ProductCard.js
│  │  │  ├─ ProtectedRoute.js
│  │  │  └─ ScrollToTop.js
│  │  ├─ context
│  │  │  ├─ AuthContext.js
│  │  │  └─ CartContext.js
│  │  ├─ data
│  │  │  └─ mockData.js
│  │  ├─ hooks
│  │  │  └─ useAppDispatch.js
│  │  ├─ index.css
│  │  ├─ index.js
│  │  ├─ pages
│  │  │  ├─ admin
│  │  │  │  ├─ AdminBestSellers.js
│  │  │  │  ├─ AdminDashboard.js
│  │  │  │  ├─ AdminLayout.js
│  │  │  │  ├─ AdminNewArrivals.js
│  │  │  │  ├─ AdminOrders.js
│  │  │  │  ├─ AdminProducts.js
│  │  │  │  └─ AdminUsers.js
│  │  │  ├─ Cart.js
│  │  │  ├─ Checkout.js
│  │  │  ├─ Favorites.js
│  │  │  ├─ Home.css
│  │  │  ├─ Home.js
│  │  │  ├─ Login.js
│  │  │  ├─ Orders.js
│  │  │  ├─ ProductDetail.css
│  │  │  ├─ ProductDetail.js
│  │  │  ├─ Products.js
│  │  │  ├─ Profile.js
│  │  │  └─ Register.js
│  │  ├─ services
│  │  │  ├─ adminService.js
│  │  │  ├─ api.js
│  │  │  ├─ authService.js
│  │  │  ├─ bestSellerService.js
│  │  │  ├─ cartService.js
│  │  │  ├─ favoriteService.js
│  │  │  ├─ newArrivalsService.js
│  │  │  ├─ orderService.js
│  │  │  └─ productService.js
│  │  ├─ store
│  │  │  ├─ index.js
│  │  │  └─ slices
│  │  │     ├─ adminSlice.js
│  │  │     ├─ authSlice.js
│  │  │     ├─ cartSlice.js
│  │  │     ├─ orderSlice.js
│  │  │     └─ productSlice.js
│  │  └─ utils
│  │     ├─ constants.js
│  │     └─ errorHandler.js
│  └─ tailwind.config.js
├─ README.md
├─ server
│  ├─ .env
│  ├─ .env.example
│  ├─ middleware
│  │  ├─ auth.js
│  │  ├─ rateLimiter.js
│  │  ├─ security.js
│  │  ├─ upload.js
│  │  └─ validation.js
│  ├─ models
│  │  ├─ BestSeller.js
│  │  ├─ Cart.js
│  │  ├─ Favorite.js
│  │  ├─ Order.js
│  │  ├─ Product.js
│  │  └─ User.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ routes
│  │  ├─ admin.js
│  │  ├─ auth.js
│  │  ├─ bestsellers.js
│  │  ├─ cart.js
│  │  ├─ favorites.js
│  │  ├─ newArrivals.js
│  │  ├─ orders.js
│  │  └─ products.js
│  ├─ scripts
│  │  ├─ createAdmin.js
│  │  ├─ makeS3Public.js
│  │  └─ resetWithSampleBat.js
│  └─ server.js
└─ SETUP.md

```