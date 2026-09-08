import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import { mockOrders } from './data/mockData';

// Navbar Component
const Navbar = () => (
  <nav style={{ background: '#1e293b', padding: '1rem', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <h2 style={{ margin: 0 }}>Local Delivery Platform</h2>
    <div style={{ display: 'flex', gap: '15px' }}>
      <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>
      <Link to="/dashboard" style={{ color: '#fff', textDecoration: 'none' }}>Dashboard</Link>
      <Link to="/orders" style={{ color: '#fff', textDecoration: 'none' }}>Orders</Link>
      <Link to="/track" style={{ color: '#fff', textDecoration: 'none' }}>Track Order</Link>
    </div>
  </nav>
);

// Footer Component
const Footer = () => (
  <footer style={{ background: '#0f172a', color: '#94a3b8', textAlign: 'center', padding: '1rem', marginTop: '2rem' }}>
    <p>© 2026 Local Delivery Platform. All rights reserved.</p>
  </footer>
);

// 1. Home Page
const Home = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>Local Delivery Platform</h1>
    <p style={{ fontSize: '1.2rem', color: '#475569' }}>Manage your deliveries easily from one place.</p>
    <Link to="/dashboard">
      <button style={{ padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem' }}>
        Get Started
      </button>
    </Link>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '3rem', flexWrap: 'wrap' }}>
      <div style={{ border: '1px solid #cbd5e1', padding: '1rem', borderRadius: '8px', width: '200px' }}>Fast Dispatch</div>
      <div style={{ border: '1px solid #cbd5e1', padding: '1rem', borderRadius: '8px', width: '200px' }}>Real-time Tracking</div>
      <div style={{ border: '1px solid #cbd5e1', padding: '1rem', borderRadius: '8px', width: '200px' }}>Reliable Riders</div>
    </div>
  </div>
);

// 2. Dashboard Page
const Dashboard = () => (
  <div style={{ padding: '2rem' }}>
    <h2>Dashboard</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginTop: '1rem' }}>
      <div style={{ background: '#f1f5f9', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
        <h3>Total Orders</h3>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>25</p>
      </div>
      <div style={{ background: '#fef3c7', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
        <h3>Pending</h3>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d97706' }}>5</p>
      </div>
      <div style={{ background: '#dbeafe', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
        <h3>In Delivery</h3>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>3</p>
      </div>
      <div style={{ background: '#dcfce7', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
        <h3>Completed</h3>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a' }}>17</p>
      </div>
    </div>
  </div>
);

// 3. Orders Page
const Orders = () => (
  <div style={{ padding: '2rem' }}>
    <h2>Orders</h2>
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
      <thead>
        <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
          <th style={{ padding: '10px', borderBottom: '2px solid #e2e8f0' }}>Order ID</th>
          <th style={{ padding: '10px', borderBottom: '2px solid #e2e8f0' }}>Customer</th>
          <th style={{ padding: '10px', borderBottom: '2px solid #e2e8f0' }}>Rider</th>
          <th style={{ padding: '10px', borderBottom: '2px solid #e2e8f0' }}>Status</th>
          <th style={{ padding: '10px', borderBottom: '2px solid #e2e8f0' }}>Action</th>
        </tr>
      </thead>
      <tbody>
        {mockOrders.map((o) => (
          <tr key={o.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
            <td style={{ padding: '10px' }}>{o.id}</td>
            <td style={{ padding: '10px' }}>{o.customer}</td>
            <td style={{ padding: '10px' }}>{o.rider}</td>
            <td style={{ padding: '10px' }}>{o.status}</td>
            <td style={{ padding: '10px' }}>
              <Link to={`/orders/${o.id}`} style={{ color: '#2563eb' }}>View Details</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// 4. Order Details Page
const OrderDetails = () => {
  const { id } = useParams();
  const order = mockOrders.find((o) => o.id === id) || mockOrders[0];

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Order #{order.id}</h2>
      <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', maxWidth: '500px' }}>
        <p><strong>Customer:</strong> {order.customer}</p>
        <p><strong>Pickup:</strong> {order.pickup}</p>
        <p><strong>Delivery:</strong> {order.delivery}</p>
        <p><strong>Rider:</strong> {order.rider}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <hr />
        <h4>Delivery Timeline:</h4>
        <p style={{ color: '#16a34a' }}>Created → Assigned → Picked Up → <strong>{order.status}</strong></p>
      </div>
    </div>
  );
};

// 5. Customer Tracking Page
const CustomerTracking = () => {
  const [searchId, setSearchId] = useState('DL001');
  const order = mockOrders.find((o) => o.id.toUpperCase() === searchId.toUpperCase()) || mockOrders[0];

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Track Delivery</h2>
      <input
        type="text"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        placeholder="Enter Order ID (e.g. DL001)"
        style={{ padding: '8px', width: '200px', marginRight: '10px' }}
      />
      <div style={{ background: '#f1f5f9', padding: '1.5rem', borderRadius: '8px', maxWidth: '400px', margin: '20px auto' }}>
        <h3>Order: {order.id}</h3>
        <p><strong>Rider:</strong> {order.rider}</p>
        <p>{order.pickup} ➔ {order.delivery}</p>
        <p style={{ color: '#2563eb', fontWeight: 'bold' }}>Current Status: {order.status}</p>
      </div>
    </div>
  );
};

// Main App Router
export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/track" element={<CustomerTracking />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}