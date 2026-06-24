from decimal import Decimal

from django.core.management.base import BaseCommand
from django.utils.text import slugify

from store.models import Cart, Category, Product, User


class Command(BaseCommand):
    help = 'Seed the database with sample categories, products, and an admin user'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database...')

        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@luxestore.com',
                'role': User.Role.ADMIN,
                'is_staff': True,
                'is_superuser': True,
            },
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS('Created admin user (admin / admin123)'))
        else:
            self.stdout.write('Admin user already exists')

        customer, created = User.objects.get_or_create(
            username='customer',
            defaults={
                'email': 'customer@luxestore.com',
                'role': User.Role.CUSTOMER,
            },
        )
        if created:
            customer.set_password('customer123')
            customer.save()
            Cart.objects.get_or_create(user=customer)
            self.stdout.write(self.style.SUCCESS('Created customer user (customer / customer123)'))

        categories_data = [
            {'name': 'Books', 'description': 'Curated literary collections and bestsellers'},
            {'name': 'Fashion', 'description': 'Premium apparel and accessories'},
            {'name': 'Home & Living', 'description': 'Elegant decor and lifestyle essentials'},
            {'name': 'Electronics', 'description': 'Cutting-edge tech and gadgets'},
        ]

        categories = {}
        for cat_data in categories_data:
            cat, _ = Category.objects.get_or_create(
                slug=slugify(cat_data['name']),
                defaults={
                    'name': cat_data['name'],
                    'description': cat_data['description'],
                },
            )
            categories[cat_data['name']] = cat

        products_data = [
            {
                'name': 'The Midnight Library',
                'description': 'A dazzling novel about the choices that go into a life well lived.',
                'price': Decimal('24.99'),
                'stock': 50,
                'image_url': 'https://images.unsplash.com/photo-1544947950-fa07a98da237?w=600',
                'category': 'Books',
            },
            {
                'name': 'Atomic Habits',
                'description': 'Transform your life with tiny changes that lead to remarkable results.',
                'price': Decimal('19.99'),
                'stock': 75,
                'image_url': 'https://images.unsplash.com/photo-1512820790801-4159a737399b?w=600',
                'category': 'Books',
            },
            {
                'name': 'Silk Evening Blazer',
                'description': 'Tailored silk blazer with satin lapels for refined evening wear.',
                'price': Decimal('289.00'),
                'stock': 20,
                'image_url': 'https://images.unsplash.com/photo-1594938298600-c8148c4dae35?w=600',
                'category': 'Fashion',
            },
            {
                'name': 'Cashmere Wrap Scarf',
                'description': 'Luxuriously soft cashmere scarf in a timeless neutral palette.',
                'price': Decimal('145.00'),
                'stock': 35,
                'image_url': 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600',
                'category': 'Fashion',
            },
            {
                'name': 'Artisan Ceramic Vase',
                'description': 'Hand-thrown ceramic vase with a matte glaze finish.',
                'price': Decimal('89.00'),
                'stock': 40,
                'image_url': 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600',
                'category': 'Home & Living',
            },
            {
                'name': 'Scented Candle Collection',
                'description': 'Set of three soy wax candles with notes of amber and sandalwood.',
                'price': Decimal('65.00'),
                'stock': 60,
                'image_url': 'https://images.unsplash.com/photo-1602607240094-205e7103d1f3?w=600',
                'category': 'Home & Living',
            },
            {
                'name': 'Wireless Noise-Canceling Headphones',
                'description': 'Premium over-ear headphones with 40-hour battery life.',
                'price': Decimal('349.00'),
                'stock': 25,
                'image_url': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
                'category': 'Electronics',
            },
            {
                'name': 'Minimalist Smart Watch',
                'description': 'Sleek smartwatch with health tracking and sapphire glass display.',
                'price': Decimal('399.00'),
                'stock': 30,
                'image_url': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
                'category': 'Electronics',
            },
            {
                'name': 'Design Thinking Handbook',
                'description': 'Essential guide for creative problem solving in the modern world.',
                'price': Decimal('34.99'),
                'stock': 45,
                'image_url': 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600',
                'category': 'Books',
            },
            {
                'name': 'Leather Crossbody Bag',
                'description': 'Full-grain leather bag with adjustable strap and gold hardware.',
                'price': Decimal('225.00'),
                'stock': 18,
                'image_url': 'https://images.unsplash.com/photo-1548036328-c9fa89d1284d?w=600',
                'category': 'Fashion',
            },
        ]

        for product_data in products_data:
            category = categories[product_data.pop('category')]
            Product.objects.update_or_create(
                name=product_data['name'],
                defaults={**product_data, 'category': category},
            )

        self.stdout.write(self.style.SUCCESS(f'Seeded {len(products_data)} products across {len(categories)} categories'))
