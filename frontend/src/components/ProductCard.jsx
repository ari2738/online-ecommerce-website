import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, showAddToCart = true }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    setAdding(true);
    try {
      await addToCart(product.id);
      setMessage('Added!');
      setTimeout(() => setMessage(''), 1500);
    } catch {
      setMessage('Error');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-link">
        <div className="product-image-wrap">
          <img src={product.image_url} alt={product.name} className="product-image" />
          <div className="product-image-overlay">
            <span className="overlay-price">${parseFloat(product.price).toFixed(2)}</span>
          </div>
        </div>
        <div className="product-info">
          <span className="product-category">{product.category_name}</span>
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">${parseFloat(product.price).toFixed(2)}</p>
        </div>
      </Link>
      {showAddToCart && (
        <div className="product-card-actions">
          {user ? (
            <button
              className="btn btn-primary btn-full"
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
            >
              {product.stock === 0 ? 'Out of Stock' : adding ? 'Adding...' : message || 'Add to Cart'}
            </button>
          ) : (
            <Link to="/login" className="btn btn-primary btn-full">Login to Buy</Link>
          )}
        </div>
      )}
    </div>
  );
}
