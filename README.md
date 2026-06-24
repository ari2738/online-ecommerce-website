# LuxeStore — Premium E-Commerce

Full-stack e-commerce application with Django REST Framework backend and React frontend.

## Tech Stack

- **Backend:** Django, Django REST Framework, Token Authentication
- **Frontend:** React, Vite, React Router, Axios
- **Database:** SQLite (dev) / PostgreSQL (production via DATABASE_URL)

**website preview**

<img width="1892" height="912" alt="Screenshot 2026-06-24 164849" src="https://github.com/user-attachments/assets/25ec3f82-f00a-40e9-a92c-c174aa7e8ebf" />

<img width="1888" height="875" alt="Screenshot 2026-06-24 165528" src="https://github.com/user-attachments/assets/26d6c424-234b-48ec-b525-f81ff1316701" />

<img width="1891" height="913" alt="Screenshot 2026-06-24 165353" src="https://github.com/user-attachments/assets/a5657e85-50cd-41d4-93b9-bbbf63c66de7" />

<img width="1895" height="891" alt="Screenshot 2026-06-24 172531" src="https://github.com/user-attachments/assets/5fcef0d5-46bc-4b73-80fa-f3b43cf210ee" />

<img width="1885" height="896" alt="Screenshot 2026-06-24 171541" src="https://github.com/user-attachments/assets/464ff89a-d9e4-4c2f-abc5-926fd0fec214" />


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


