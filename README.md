# GreenBasket — Full-stack E-commerce Starter

A responsive grocery store inspired by the supplied screenshots.

## Stack
- Frontend: Next.js 16 App Router, TypeScript, Tailwind CSS 4, lucide-react, Framer Motion, next-themes
- Backend: Node.js, Express 5, ES modules, MongoDB/Mongoose, JWT, bcryptjs
- API: REST, centralized error handling, CORS allowlist, protected admin routes

## Requirements
- Node.js 20.9+
- MongoDB local instance or MongoDB Atlas connection string

## 1. Start the backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
Set `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in `.env`.
The first server start creates the configured admin if it does not already exist. To load demo categories and products, run `npm run seed` once from the backend folder after configuring `.env`.

Backend runs at `http://localhost:5000`.

## 2. Start the frontend
In a second terminal:
```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```
Open `http://localhost:3000`.

## Admin login
Use `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `backend/.env`.

## Main routes
- `/` Storefront and hero slider
- `/products/[slug]` Product detail
- `/cart` Shopping basket
- `/checkout` Cash-on-delivery checkout
- `/admin/login` Admin sign in
- `/admin` Dashboard
- `/admin/products` Product management
- `/admin/categories` Category management
- `/admin/orders` Order management
- `/admin/orders/[id]` Order detail

## API overview
- `POST /api/auth/login`
- `GET /api/products`, `GET /api/products/:id`, `POST /api/products`, `PATCH /api/products/:id`, `DELETE /api/products/:id`
- `GET /api/categories`, `POST /api/categories`, `PATCH /api/categories/:id`, `DELETE /api/categories/:id`
- `POST /api/orders`, `GET /api/orders`, `GET /api/orders/:id`, `PATCH /api/orders/:id/status`
- `GET /api/dashboard/stats`

Admin endpoints require `Authorization: Bearer <token>`.

## Notes before production
- Configure a strong `JWT_SECRET`, real admin credentials, and a production CORS origin.
- Use a managed image host (Cloudinary, S3, etc.) for product images; this starter accepts image URLs.
- Add rate limiting, request logging, email/SMS notifications, backups, and payment gateway integration before launch.
- Online payment is intentionally not enabled; checkout uses Cash on Delivery as shown in the reference screenshots.
