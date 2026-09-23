import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';

// Initial Mock Data according to PDF specs
const initialOrders = [
  {
    id: 'DL001',
    customer: 'Ali Khan',
    phone: '0300-1234567',
    pickup: 'Main Bazaar, Nowshera',
    delivery: 'Mall Road, Risalpur',
    packageDetails: 'Electronics Items (1.5 kg)',
    priority: 'High',
    paymentMethod: 'Cash on Delivery',
    rider: 'Hamza',
    status: 'Assigned',
    date: '2026-09-15'
  },
  {
    id: 'DL002',
    customer: 'Sara Ahmed',
    phone: '0312-9876543',
    pickup: 'Station Road, Pabbi',
    delivery: 'GT Road, Pirpiai',
    packageDetails: 'Clothing & Apparel',
    priority: 'Normal',
    paymentMethod: 'Prepaid',
    rider: 'Unassigned',
    status: 'Pending',
    date: '2026-09-15'
  }
];

const availableRiders = ['Hamza', 'Bilal', 'Usman', 'Zubair'];

export default function App() {
  const [orders, setOrders] = useState(initialOrders);
  const [userRole, setUserRole] = useState('Business'); // Roles: Business, Rider, Customer

  // Handlers for state updates
  const handleCreateOrder = (newOrder) => setOrders([newOrder, ...orders]);
  
  const handleUpdateOrder = (updatedOrder) => {
    setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  };

  const handleCancelOrder = (id) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      setOrders(orders.map(o => o.id === id ? { ...o, status: 'Cancelled' } : o));
    }
  };

  const handleAssignRider = (id, riderName) => {
    setOrders(orders.map(o => o.id === id ? { ...o, rider: riderName, status: 'Assigned' } : o));
  };

  const handleStatusChange = (id, newStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  return (
    <BrowserRouter>
      <div style={{ background: '#0f172a', color: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        
        {/* Top Navbar with Role Switcher */}
        <nav style={{ background: '#1e293b', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155' }}>
          <h2 style={{ margin: 0, color: '#38bdf8' }}>Zyro Logistics</h2>
          
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link to="/" style={{ color: '#f8fafc', textDecoration: 'none' }}>Home</Link>
            {userRole === 'Business' && <Link to="/business" style={{ color: '#f8fafc', textDecoration: 'none' }}>Business Orders</Link>}
            {userRole === 'Business' && <Link to="/create-order" style={{ color: '#f8fafc', textDecoration: 'none' }}>+ Create Order</Link>}
            {userRole === 'Rider' && <Link to="/rider" style={{ color: '#f8fafc', textDecoration: 'none' }}>Rider Dashboard</Link>}
            {userRole === 'Customer' && <Link to="/customer" style={{ color: '#f8fafc', textDecoration: 'none' }}>My Orders</Link>}
            
            {/* Role Switcher Dropdown */}
            <div style={{ marginLeft: '15px', background: '#334155', padding: '5px 10px', borderRadius: '6px' }}>
              <label style={{ fontSize: '0.85rem', marginRight: '8px' }}>Role:</label>
              <select value={userRole} onChange={(e) => setUserRole(e.target.value)} style={{ background: '#0f172a', color: '#fff', border: '1px solid #475569', padding: '4px', borderRadius: '4px' }}>
                <option value="Business">Business</option>
                <option value="Rider">Rider (Hamza)</option>
                <option value="Customer">Customer</option>
              </select>
            </div>
          </div>
        </nav>

        {/* Dynamic Route Content */}
        <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
          <Routes>
            <Route path="/" element={<Home role={userRole} />} />
            <Route path="/business" element={<BusinessOrders orders={orders} onCancel={handleCancelOrder} onAssign={handleAssignRider} />} />
            <Route path="/create-order" element={<CreateOrder onCreate={handleCreateOrder} />} />
            <Route path="/edit-order/:id" element={<EditOrder orders={orders} onUpdate={handleUpdateOrder} />} />
            <Route path="/rider" element={<RiderDashboard orders={orders} currentRider="Hamza" onStatusChange={handleStatusChange} />} />
            <Route path="/customer" element={<CustomerOrders orders={orders} />} />
            <Route path="/order/:id" element={<OrderDetails orders={orders} />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

// 1. Home View
const Home = ({ role }) => (
  <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Local Delivery & Logistics Platform</h1>
    <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginBottom: '2rem' }}>Currently viewing system as <strong>{role}</strong> user.</p>
    <Link to={role === 'Business' ? '/business' : role === 'Rider' ? '/rider' : '/customer'}>
      <button style={{ padding: '12px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>
        Open {role} Panel
      </button>
    </Link>
  </div>
);

// 2. Business User: Orders List, Assign Rider, Cancel
const BusinessOrders = ({ orders, onCancel, onAssign }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Business Orders Management</h2>
        <button onClick={() => navigate('/create-order')} style={{ padding: '8px 16px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Create Order</button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#1e293b', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: '#334155', textAlign: 'left' }}>
            <th style={{ padding: '12px' }}>ID</th>
            <th style={{ padding: '12px' }}>Customer</th>
            <th style={{ padding: '12px' }}>Pickup / Delivery</th>
            <th style={{ padding: '12px' }}>Rider</th>
            <th style={{ padding: '12px' }}>Status</th>
            <th style={{ padding: '12px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} style={{ borderBottom: '1px solid #334155' }}>
              <td style={{ padding: '12px' }}>{o.id}</td>
              <td style={{ padding: '12px' }}>{o.customer}<br/><small style={{ color: '#94a3b8' }}>{o.phone}</small></td>
              <td style={{ padding: '12px' }}><small>{o.pickup} ➔ {o.delivery}</small></td>
              <td style={{ padding: '12px' }}>
                {o.rider !== 'Unassigned' ? o.rider : (
                  <select onChange={(e) => onAssign(o.id, e.target.value)} defaultValue="" style={{ padding: '4px', background: '#0f172a', color: '#fff', border: '1px solid #475569', borderRadius: '4px' }}>
                    <option value="" disabled>Assign Rider</option>
                    {availableRiders.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                )}
              </td>
              <td style={{ padding: '12px' }}>
                <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', background: o.status === 'Delivered' ? '#166534' : o.status === 'Cancelled' ? '#991b1b' : '#1e40af' }}>
                  {o.status}
                </span>
              </td>
              <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                <Link to={`/order/${o.id}`} style={{ color: '#38bdf8' }}>View</Link>
                {o.status !== 'Cancelled' && o.status !== 'Delivered' && (
                  <>
                    <button onClick={() => navigate(`/edit-order/${o.id}`)} style={{ background: 'none', border: 'none', color: '#facc15', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => onCancel(o.id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}>Cancel</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// 3. Create Order Form (With all required PDF fields)
const CreateOrder = ({ onCreate }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customer: '', phone: '', pickup: '', delivery: '', packageDetails: '', priority: 'Normal', paymentMethod: 'Cash on Delivery'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newOrder = {
      id: `DL00${Math.floor(Math.random() * 900) + 100}`,
      ...formData,
      rider: 'Unassigned',
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };
    onCreate(newOrder);
    navigate('/business');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', background: '#1e293b', padding: '2rem', borderRadius: '8px' }}>
      <h2>Create Delivery Order</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px', marginTop: '1rem' }}>
        <input type="text" placeholder="Customer Name" required value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})} style={inputStyle} />
        <input type="text" placeholder="Customer Phone" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={inputStyle} />
        <input type="text" placeholder="Pickup Address" required value={formData.pickup} onChange={e => setFormData({...formData, pickup: e.target.value})} style={inputStyle} />
        <input type="text" placeholder="Delivery Address" required value={formData.delivery} onChange={e => setFormData({...formData, delivery: e.target.value})} style={inputStyle} />
        <textarea placeholder="Package Details (Weight, size, items)" required value={formData.packageDetails} onChange={e => setFormData({...formData, packageDetails: e.target.value})} style={{ ...inputStyle, height: '70px' }} />
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} style={inputStyle}>
            <option value="Normal">Normal Priority</option>
            <option value="High">High Priority</option>
            <option value="Urgent">Urgent</option>
          </select>
          <select value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} style={inputStyle}>
            <option value="Cash on Delivery">Cash on Delivery</option>
            <option value="Prepaid">Prepaid</option>
          </select>
        </div>

        <button type="submit" style={{ padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Create Order</button>
      </form>
    </div>
  );
};

// 4. Edit Order Page
const EditOrder = ({ orders, onUpdate }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = orders.find(o => o.id === id);
  const [formData, setFormData] = useState(order || {});

  if (!order) return <div>Order not found</div>;

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    navigate('/business');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', background: '#1e293b', padding: '2rem', borderRadius: '8px' }}>
      <h2>Edit Order #{order.id}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px', marginTop: '1rem' }}>
        <input type="text" value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})} style={inputStyle} />
        <input type="text" value={formData.pickup} onChange={e => setFormData({...formData, pickup: e.target.value})} style={inputStyle} />
        <input type="text" value={formData.delivery} onChange={e => setFormData({...formData, delivery: e.target.value})} style={inputStyle} />
        <textarea value={formData.packageDetails} onChange={e => setFormData({...formData, packageDetails: e.target.value})} style={{ ...inputStyle, height: '70px' }} />
        <button type="submit" style={{ padding: '10px', background: '#facc15', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Update Order</button>
      </form>
    </div>
  );
};

// 5. Rider Dashboard (Accept, Pick Up, In Transit, Delivered Flow)
const RiderDashboard = ({ orders, currentRider, onStatusChange }) => {
  const riderOrders = orders.filter(o => o.rider === currentRider);

  return (
    <div>
      <h2>Rider Dashboard ({currentRider})</h2>

      <div style={{ display: 'grid', gap: '15px', marginTop: '1rem' }}>
        {riderOrders.length === 0 ? <p>No deliveries assigned to you.</p> : riderOrders.map(o => (
          <div key={o.id} style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid #38bdf8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3>Order #{o.id}</h3>
              <span style={{ fontWeight: 'bold', color: '#38bdf8' }}>{o.status}</span>
            </div>
            <p><strong>Customer:</strong> {o.customer} ({o.phone})</p>
            <p><strong>Pickup:</strong> {o.pickup} ➔ <strong>Delivery:</strong> {o.delivery}</p>
            <p><strong>Package:</strong> {o.packageDetails}</p>

            {/* Rider Action Workflow Buttons */}
            <div style={{ marginTop: '1rem', display: 'flex', gap: '10px' }}>
              {o.status === 'Assigned' && (
                <button onClick={() => onStatusChange(o.id, 'Accepted')} style={btnStyle('#2563eb')}>Accept Delivery</button>
              )}
              {o.status === 'Accepted' && (
                <button onClick={() => onStatusChange(o.id, 'Picked Up')} style={btnStyle('#d97706')}>Mark as Picked Up</button>
              )}
              {o.status === 'Picked Up' && (
                <button onClick={() => onStatusChange(o.id, 'In Transit')} style={btnStyle('#0284c7')}>Start In Transit</button>
              )}
              {o.status === 'In Transit' && (
                <button onClick={() => onStatusChange(o.id, 'Delivered')} style={btnStyle('#16a34a')}>Mark as Delivered</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 6. Customer Orders View
const CustomerOrders = ({ orders }) => (
  <div>
    <h2>My Delivery Orders</h2>
    <div style={{ display: 'grid', gap: '15px', marginTop: '1rem' }}>
      {orders.map(o => (
        <div key={o.id} style={{ background: '#1e293b', padding: '1rem', borderRadius: '8px' }}>
          <h3>Order #{o.id} - <span style={{ color: '#38bdf8' }}>{o.status}</span></h3>
          <p><strong>Delivery Address:</strong> {o.delivery}</p>
          <Link to={`/order/${o.id}`} style={{ color: '#38bdf8' }}>View Details & Timeline</Link>
        </div>
      ))}
    </div>
  </div>
);

// 7. Order Details & Delivery Timeline
const OrderDetails = ({ orders }) => {
  const { id } = useParams();
  const order = orders.find(o => o.id === id);

  if (!order) return <div>Order not found.</div>;

  const steps = ['Pending', 'Assigned', 'Accepted', 'Picked Up', 'In Transit', 'Delivered'];
  const currentStepIdx = steps.indexOf(order.status);

  return (
    <div style={{ background: '#1e293b', padding: '2rem', borderRadius: '8px' }}>
      <h2>Order Details #{order.id}</h2>
      <p><strong>Customer:</strong> {order.customer} ({order.phone})</p>
      <p><strong>Pickup Location:</strong> {order.pickup}</p>
      <p><strong>Delivery Location:</strong> {order.delivery}</p>
      <p><strong>Package Details:</strong> {order.packageDetails}</p>
      <p><strong>Assigned Rider:</strong> {order.rider}</p>
      <p><strong>Payment Method:</strong> {order.paymentMethod}</p>

      <hr style={{ borderColor: '#334155', margin: '1.5rem 0' }} />

      <h3>Delivery Timeline</h3>
      <div style={{ display: 'flex', gap: '10px', marginTop: '1rem', flexWrap: 'wrap' }}>
        {steps.map((step, idx) => (
          <div key={step} style={{ padding: '8px 12px', borderRadius: '20px', background: idx <= currentStepIdx ? '#16a34a' : '#334155', color: '#fff', fontSize: '0.85rem' }}>
            {step} {idx <= currentStepIdx ? '✓' : ''}
          </div>
        ))}
      </div>
    </div>
  );
};

// Helpers Styles
const inputStyle = { padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #475569', borderRadius: '4px', width: '100%', boxSizing: 'border-box' };
const btnStyle = (bg) => ({ padding: '8px 16px', background: bg, color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' });