import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { categoryAPI, productAPI } from '../api';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const selectedCategory = searchParams.get('category') || '';

  useEffect(() => {
    categoryAPI.list().then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (searchParams.get('search')) params.search = searchParams.get('search');
    if (searchParams.get('category')) params.category = searchParams.get('category');

    productAPI.list(params)
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (search) params.search = search;
    if (selectedCategory) params.category = selectedCategory;
    setSearchParams(params);
  };

  const handleCategoryChange = (catId) => {
    const params = {};
    if (search) params.search = search;
    if (catId) params.category = catId;
    setSearchParams(params);
  };

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Shop Collection</h1>
        <p>Browse our curated premium products</p>
      </div>

      <div className="products-layout">
        <aside className="sidebar">
          <h3>Categories</h3>
          <ul className="category-list">
            <li>
              <button
                className={`category-btn ${!selectedCategory ? 'active' : ''}`}
                onClick={() => handleCategoryChange('')}
              >
                All Products
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  className={`category-btn ${selectedCategory === String(cat.id) ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(String(cat.id))}
                >
                  {cat.name}
                  <span className="cat-count">{cat.product_count}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="products-main">
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>

          {loading ? (
            <div className="loading-screen"><div className="spinner" /></div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <p>No products found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
