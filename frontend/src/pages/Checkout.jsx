import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../api';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const shippingAddress = [
      form.fullName,
      form.address,
      `${form.city}, ${form.state} ${form.zip}`,
      form.country,
    ].filter(Boolean).join('\n');

    try {
      await orderAPI.checkout(shippingAddress);
      await refreshCart();
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.detail || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <h1 className="page-title">Checkout</h1>
      <div className="checkout-layout">
        <form className="checkout-form glass-card" onSubmit={handleSubmit}>
          <h2>Shipping Address</h2>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Full Name</label>
            <input name="fullName" value={form.fullName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Street Address</label>
            <input name="address" value={form.address} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input name="city" value={form.city} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>State</label>
              <input name="state" value={form.state} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>ZIP Code</label>
              <input name="zip" value={form.zip} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input name="country" value={form.country} onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Processing...' : `Place Order — $${parseFloat(cart.total_price).toFixed(2)}`}
          </button>
        </form>

        <div className="checkout-summary glass-card">
          <h2>Order Summary</h2>
          {cart.items.map((item) => (
            <div key={item.id} className="checkout-item">
              <img src={item.product.image_url} alt={item.product.name} />
              <div>
                <p>{item.product.name}</p>
                <span>Qty: {item.quantity}</span>
              </div>
              <span>${parseFloat(item.subtotal).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-divider" />
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>${parseFloat(cart.total_price).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
