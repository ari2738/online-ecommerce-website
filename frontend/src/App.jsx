import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AdminDashboard from './pages/AdminDashboard';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Home from './pages/Home';
import Login from './pages/Login';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Register from './pages/Register';

function AppLayout({ children }) {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">{children}</main>
      <footer className="footer">
        <p>© 2026 LuxeStore. Premium E-Commerce Experience.</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<AppLayout><Home /></AppLayout>} />
            <Route path="/products" element={<AppLayout><Products /></AppLayout>} />
            <Route path="/login" element={<AppLayout><Login /></AppLayout>} />
            <Route path="/register" element={<AppLayout><Register /></AppLayout>} />
            <Route path="/cart" element={
              <AppLayout>
                <ProtectedRoute><Cart /></ProtectedRoute>
              </AppLayout>
            } />
            <Route path="/checkout" element={
              <AppLayout>
                <ProtectedRoute><Checkout /></ProtectedRoute>
              </AppLayout>
            } />
            <Route path="/orders" element={
              <AppLayout>
                <ProtectedRoute><Orders /></ProtectedRoute>
              </AppLayout>
            } />
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
