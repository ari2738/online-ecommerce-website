import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryAPI, productAPI } from '../api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      productAPI.list(),
      categoryAPI.list(),
    ]).then(([prodRes, catRes]) => {
      setProducts(prodRes.data.slice(0, 8));
      setCategories(catRes.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(search)}`);
  };

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <p className="hero-eyebrow">Curated Collection</p>
          <h1 className="hero-title">Discover Premium Products</h1>
          <p className="hero-subtitle">
            Explore our handpicked selection of luxury goods — from timeless literature to cutting-edge technology.
          </p>
          <form className="hero-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="hero-search-input"
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">🚚</div>
          <h3>Free Shipping</h3>
          <p>Complimentary delivery on orders over $100</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">✨</div>
          <h3>Premium Quality</h3>
          <p>Curated products from trusted luxury brands</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3>Secure Checkout</h3>
          <p>Safe and encrypted payment processing</p>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Featured Products</h2>
          <p className="section-subtitle">Hand-selected items from our premium collection</p>
        </div>

        {loading ? (
          <div className="loading-screen"><div className="spinner" /></div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="section-cta">
          <button className="btn btn-outline" onClick={() => navigate('/products')}>
            View All Products
          </button>
        </div>
      </section>

      <section className="categories-section">
        <h2 className="section-title">Shop by Category</h2>
        <div className="category-grid">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="category-card"
              onClick={() => navigate(`/products?category=${cat.id}`)}
            >
              <h3>{cat.name}</h3>
              <p>{cat.product_count} products</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
