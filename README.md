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

**website preview**

<img width="1892" height="912" alt="Screenshot 2026-06-24 164849" src="https://github.com/user-attachments/assets/524d2ee5-be54-4c4d-b6fa-1cce7478a37f" />

<img width="1888" height="875" alt="Screenshot 2026-06-24 165528" src="https://github.com/user-attachments/assets/6bc973b2-501e-44d2-96bb-68a4933f59ae" />


<img width="1891" height="913" alt="Screenshot 2026-06-24 165353" src="https://github.com/user-attachments/assets/9fa3991f-b414-477c-ba59-b01fc5a10958" />

<img width="1895" height="891" alt="image" src="https://github.com/user-attachments/assets/c6d67ca1-fffe-4b4e-b412-6c4e520700c3" />


<img width="1885" height="896" alt="Screenshot 2026-06-24 171541" src="https://github.com/user-attachments/assets/37cd4307-2a04-4bd9-ac9a-27b234b6fe53" />



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
