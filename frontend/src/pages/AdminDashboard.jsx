import { useEffect, useState } from 'react';
import { adminAPI, categoryAPI, orderAPI, productAPI } from '../api';

const TABS = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'products', label: 'Products', icon: '📦' },
  { id: 'orders', label: 'Orders', icon: '🛒' },
];

const STATUS_COLORS = {
  pending: 'status-pending',
  shipped: 'status-shipped',
  delivered: 'status-delivered',
  cancelled: 'status-cancelled',
};

const EMPTY_PRODUCT = {
  name: '', description: '', price: '', stock: '', image_url: '', category: '',
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT);
  const [showForm, setShowForm] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodRes, orderRes, catRes] = await Promise.all([
        adminAPI.stats(),
        productAPI.list(),
        orderAPI.list(),
        categoryAPI.list(),
      ]);
      setStats(statsRes.data);
      setProducts(prodRes.data);
      setOrders(orderRes.data);
      setCategories(catRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...productForm,
      price: parseFloat(productForm.price),
      stock: parseInt(productForm.stock, 10),
      category: parseInt(productForm.category, 10),
    };
    if (editProduct) {
      await productAPI.update(editProduct.id, data);
    } else {
      await productAPI.create(data);
    }
    setShowForm(false);
    setEditProduct(null);
    setProductForm(EMPTY_PRODUCT);
    loadData();
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image_url: product.image_url,
      category: product.category,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      await productAPI.delete(id);
      loadData();
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    await orderAPI.update(orderId, { status });
    loadData();
  };

  if (loading && !stats) {
    return <div className="loading-screen"><div className="spinner" /></div>;
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
          <p>LuxeStore Dashboard</p>
        </div>
        <nav className="admin-nav">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`admin-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="nav-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="admin-main">
        {activeTab === 'overview' && stats && (
          <div className="admin-overview">
            <h1>Dashboard Overview</h1>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon revenue">💰</div>
                <div className="stat-info">
                  <span className="stat-label">Total Revenue</span>
                  <span className="stat-value">${parseFloat(stats.total_revenue).toLocaleString()}</span>
                  <span className="stat-trend positive">↑ All time</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon orders">📋</div>
                <div className="stat-info">
                  <span className="stat-label">Total Orders</span>
                  <span className="stat-value">{stats.total_orders}</span>
                  <span className="stat-trend">{stats.pending_orders} pending</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon customers">👥</div>
                <div className="stat-info">
                  <span className="stat-label">Customers</span>
                  <span className="stat-value">{stats.total_customers}</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon products">📦</div>
                <div className="stat-info">
                  <span className="stat-label">Products</span>
                  <span className="stat-value">{stats.total_products}</span>
                </div>
              </div>
            </div>

            {stats.revenue_by_month.length > 0 && (
              <div className="revenue-chart glass-card">
                <h3>Revenue Trend</h3>
                <div className="chart-bars">
                  {stats.revenue_by_month.map((entry, i) => {
                    const maxRev = Math.max(...stats.revenue_by_month.map((e) => e.revenue));
                    const height = maxRev > 0 ? (entry.revenue / maxRev) * 100 : 0;
                    return (
                      <div key={i} className="chart-bar-group">
                        <div className="chart-bar" style={{ height: `${height}%` }}>
                          <span className="bar-value">${entry.revenue.toFixed(0)}</span>
                        </div>
                        <span className="bar-label">{entry.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="recent-orders-table glass-card">
              <h3>Recent Orders</h3>
              <table>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent_orders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.user?.username}</td>
                      <td>${parseFloat(order.total).toFixed(2)}</td>
                      <td>
                        <span className={`status-badge ${STATUS_COLORS[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="admin-products">
            <div className="admin-section-header">
              <h1>Product Management</h1>
              <button
                className="btn btn-primary"
                onClick={() => { setEditProduct(null); setProductForm(EMPTY_PRODUCT); setShowForm(true); }}
              >
                + Add Product
              </button>
            </div>

            {showForm && (
              <form className="product-form glass-card" onSubmit={handleProductSubmit}>
                <h3>{editProduct ? 'Edit Product' : 'New Product'}</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Name</label>
                    <input value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} required>
                      <option value="">Select category</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} required rows={3} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Price</label>
                    <input type="number" step="0.01" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Stock</label>
                    <input type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input value={productForm.image_url} onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })} required />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">{editProduct ? 'Update' : 'Create'}</button>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                </div>
              </form>
            )}

            <div className="admin-table glass-card">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="table-product">
                          <img src={p.image_url} alt={p.name} />
                          <span>{p.name}</span>
                        </div>
                      </td>
                      <td>{p.category_name}</td>
                      <td>${parseFloat(p.price).toFixed(2)}</td>
                      <td>{p.stock}</td>
                      <td>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(p)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="admin-orders">
            <h1>Order Management</h1>
            <div className="admin-table glass-card">
              <table>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.user?.username}</td>
                      <td>{order.items.length}</td>
                      <td>${parseFloat(order.total).toFixed(2)}</td>
                      <td>
                        <span className={`status-badge ${STATUS_COLORS[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          className="status-select"
                        >
                          <option value="pending">Pending</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
