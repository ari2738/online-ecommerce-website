import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, loading, updateQuantity, removeItem } = useCart();

  if (loading) {
    return <div className="loading-screen"><div className="spinner" /></div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-state">
          <h2>Your cart is empty</h2>
          <p>Discover our premium collection and add items to your cart.</p>
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="page-title">Shopping Cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.items.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.product.image_url} alt={item.product.name} className="cart-item-image" />
              <div className="cart-item-details">
                <h3>{item.product.name}</h3>
                <p className="cart-item-category">{item.product.category_name}</p>
                <p className="cart-item-price">${parseFloat(item.product.price).toFixed(2)}</p>
              </div>
              <div className="cart-item-quantity">
                <button
                  className="qty-btn"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <div className="cart-item-subtotal">
                ${parseFloat(item.subtotal).toFixed(2)}
              </div>
              <button className="remove-btn" onClick={() => removeItem(item.id)}>✕</button>
            </div>
          ))}
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Items ({cart.total_items})</span>
            <span>${parseFloat(cart.total_price).toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span className="free-shipping">Free</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>${parseFloat(cart.total_price).toFixed(2)}</span>
          </div>
          <Link to="/checkout" className="btn btn-primary btn-full">Proceed to Checkout</Link>
        </div>
      </div>
    </div>
  );
}
