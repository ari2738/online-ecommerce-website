# LuxeStore — Premium E-Commerce

Full-stack e-commerce application with Django REST Framework backend and React frontend.

## Tech Stack

- **Backend:** Django, Django REST Framework, Token Authentication
- **Frontend:** React, Vite, React Router, Axios
- **Database:** SQLite (dev) / PostgreSQL (production via DATABASE_URL)

## Getting Started

### Backend

```bash
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py seed
python manage.py runserver 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev


## Demo Accounts

| Role     | Username  | Password     |
|----------|-----------|--------------|
| Admin    | admin     | admin123     |
| Customer | customer  | customer123  |

## API Endpoints

- `POST /api/auth/register/` — Register
- `POST /api/auth/login/` — Login
- `GET /api/products/` — List products
- `GET /api/cart/` — Get cart
- `POST /api/checkout/` — Place order
- `GET /api/orders/` — List orders
- `GET /api/admin/stats/` — Admin dashboard stats

## Features

- Custom User model with admin/customer roles
- Product catalog with category filtering and search
- Shopping cart with quantity controls
- Checkout with address form
- Order tracking with status badges
- Admin dashboard with analytics, product & order management
- Premium dark theme with gold accents


