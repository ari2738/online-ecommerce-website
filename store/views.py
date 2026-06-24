from decimal import Decimal

from django.contrib.auth import login
from django.db import transaction
from django.db.models import Count, Sum
from django.db.models.functions import TruncMonth
from rest_framework import generics, permissions, status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Cart, CartItem, Category, Order, OrderItem, Product, User
from .permissions import IsAdminUser
from .serializers import (
    CartItemSerializer,
    CartSerializer,
    CategorySerializer,
    CheckoutSerializer,
    LoginSerializer,
    OrderSerializer,
    ProductSerializer,
    RegisterSerializer,
    UserSerializer,
)


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        Cart.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data,
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        token, _ = Token.objects.get_or_create(user=user)
        Cart.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data,
        })


class LogoutView(APIView):
    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        return Response({'detail': 'Logged out successfully.'})


class ProfileView(APIView):
    def get(self, request):
        return Response(UserSerializer(request.user).data)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.annotate(product_count=Count('products'))
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('category').all()
    serializer_class = ProductSerializer
    filterset_fields = ['category']

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsAdminUser()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search')
        category = self.request.query_params.get('category')
        if search:
            queryset = queryset.filter(name__icontains=search)
        if category:
            queryset = queryset.filter(category_id=category)
        return queryset


class CartView(APIView):
    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return Response(CartSerializer(cart).data)

    def delete(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart.items.all().delete()
        return Response({'detail': 'Cart cleared.'})


class CartItemView(APIView):
    def post(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'detail': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)

        if product.stock < quantity:
            return Response({'detail': 'Insufficient stock.'}, status=status.HTTP_400_BAD_REQUEST)

        item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            item.quantity += quantity
        else:
            item.quantity = quantity
        item.save()
        return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)

    def patch(self, request, item_id):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        try:
            item = cart.items.get(id=item_id)
        except CartItem.DoesNotExist:
            return Response({'detail': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)

        quantity = request.data.get('quantity')
        if quantity is not None:
            quantity = int(quantity)
            if quantity <= 0:
                item.delete()
                return Response(CartSerializer(cart).data)
            if item.product.stock < quantity:
                return Response({'detail': 'Insufficient stock.'}, status=status.HTTP_400_BAD_REQUEST)
            item.quantity = quantity
            item.save()
        return Response(CartSerializer(cart).data)

    def delete(self, request, item_id):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart.items.filter(id=item_id).delete()
        return Response(CartSerializer(cart).data)


class CheckoutView(APIView):
    @transaction.atomic
    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart, _ = Cart.objects.get_or_create(user=request.user)
        items = cart.items.select_related('product').all()

        if not items:
            return Response({'detail': 'Cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

        for item in items:
            if item.product.stock < item.quantity:
                return Response(
                    {'detail': f'Insufficient stock for {item.product.name}.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        total = sum(item.subtotal for item in items)
        order = Order.objects.create(
            user=request.user,
            shipping_address=serializer.validated_data['shipping_address'],
            total=total,
        )

        for item in items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                product_name=item.product.name,
                quantity=item.quantity,
                price=item.product.price,
            )
            item.product.stock -= item.quantity
            item.product.save()

        cart.items.all().delete()
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return Order.objects.select_related('user').prefetch_related('items').all()
        return Order.objects.filter(user=user).prefetch_related('items')


class OrderDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = OrderSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return Order.objects.select_related('user').prefetch_related('items').all()
        return Order.objects.filter(user=user).prefetch_related('items')

    def get_permissions(self):
        if self.request.method in ('PUT', 'PATCH'):
            return [IsAdminUser()]
        return [permissions.IsAuthenticated()]


class AdminStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        orders = Order.objects.all()
        total_revenue = orders.aggregate(total=Sum('total'))['total'] or Decimal('0.00')

        revenue_by_month = (
            orders.annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(revenue=Sum('total'), count=Count('id'))
            .order_by('month')
        )

        month_data = [
            {
                'month': entry['month'].strftime('%b %Y') if entry['month'] else '',
                'revenue': float(entry['revenue'] or 0),
                'orders': entry['count'],
            }
            for entry in revenue_by_month
        ]

        recent_orders = orders.select_related('user').prefetch_related('items').order_by('-created_at')[:10]

        return Response({
            'total_revenue': total_revenue,
            'total_orders': orders.count(),
            'total_customers': User.objects.filter(role=User.Role.CUSTOMER).count(),
            'total_products': Product.objects.count(),
            'pending_orders': orders.filter(status=Order.Status.PENDING).count(),
            'recent_orders': OrderSerializer(recent_orders, many=True).data,
            'revenue_by_month': month_data,
        })
