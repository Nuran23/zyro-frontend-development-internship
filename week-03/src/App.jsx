import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';

// Initial Mock Data according to PDF specs with Rider & Location Details
const initialOrders = [
  {
    id: 'DL001',
    customer: 'Ali Khan',
    phone: '0300-1234567',
    pickup: 'Mardan',
    delivery: 'Timergara',
    riderLocation: 'Chakdara',
    packageDetails: 'Electronics Items (1.5 kg)',
    priority: 'High',
    paymentMethod: 'Cash on Delivery',
    rider: 'Hamza',
    riderPhone: '0333-1122334',
    riderVehicle: 'Honda CD 70 (Peshawar LEB-452)',
    estimatedDelivery: '25 minutes',
    status: 'In Transit',
    date: '2026-09-22'
  },
  {
    id: 'DL002',
    customer: 'Sara Ahmed',
    phone: '0312-9876543',
    pickup: 'Station Road, Pabbi',
    delivery: 'GT Road, Pirpiai',
    riderLocation: 'Station Road, Pabbi',
    packageDetails: 'Clothing & Apparel',
    priority: 'Normal',
    paymentMethod: 'Prepaid',
    rider: 'Bilal',
    riderPhone: '0345-5566778',
    riderVehicle: 'Yamaha YBR 125',
    estimatedDelivery: '40 minutes',
    status: 'Picked Up',
    date: '2026-09-22'
  },
  {
    id: 'DL003',
    customer: 'Usman Ghani',
    phone: '0301-5554433',
    pickup: 'Main Bazaar, Nowshera',
    delivery: 'Mall Road, Risalpur',
    riderLocation: 'Main Bazaar, Nowshera',
    packageDetails: 'Home Hardware Tools',
    priority: 'Urgent',
    paymentMethod: 'Cash on Delivery',
    rider: 'Unassigned',
    riderPhone: 'N/A',
    riderVehicle: 'N/A',
    estimatedDelivery: 'Pending Assignment',
    status: 'Pending',
    date: '2026-09-23'
  }
];

const availableRiders = ['Hamza', 'Bilal', 'Usman', 'Zubair'];

const initialNotifications = [
  { id: 1, text: 'New order #DL003 created successfully', time: '10 mins ago', read: false },
  { id: 2, text: 'Rider Hamza picked up order #DL001 from Mardan', time: '25 mins ago', read: false },
  { id: 3, text: 'Order #DL002 assigned to Rider Bilal', time: '1 hour ago', read: true },
];

export default function App() {
  const [orders, setOrders] = useState(initialOrders);
  const [userRole, setUserRole] = useState('Business'); // Roles: Business, Rider, Customer
  const [notifications, setNotifications] = useState(initialNotifications);
  const [showNotifs, setShowNotifs] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markNotifsRead = () => {
    setShowNotifs(!showNotifs);
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Handlers for state updates
  const handleCreateOrder = (newOrder) => {
    setOrders([newOrder, ...orders]);
    addNotification(`New order #${newOrder.id} created`);
  };

  const handleUpdateOrder = (updatedOrder) => {
    setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    addNotification(`Order #${updatedOrder.id} details updated`);
  };

  const handleCancelOrder = (id) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      setOrders(orders.map(o => o.id === id ? { ...o, status: 'Cancelled' } : o));
      addNotification(`Order #${id} has been cancelled`);
    }
  };

  const handleAssignRider = (id, riderName) => {
    setOrders(orders.map(o => o.id === id ? { 
      ...o, 
      rider: riderName, 
      status: 'Assigned', 
      riderPhone: '0333-9988776', 
      riderVehicle: 'Honda 125',
      estimatedDelivery: '35 minutes'
    } : o));
    addNotification(`Rider ${riderName} assigned to order #${id}`);
  };

  const handleStatusChange = (id, newStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    addNotification(`Order #${id} status changed to ${newStatus}`);
  };

  const addNotification = (text) => {
    const newNotif = {
      id: Date.now(),
      text,
      time: 'Just now',
      read: false
    };
    setNotifications([newNotif, ...notifications]);
  };

  return (
    <BrowserRouter>
      <div style={{ background: '#0f172a', color: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        
        {/* Top Navbar with Role Switcher & Notifications Badge */}
        <nav style={{ background: '#1e293b', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', flexWrap: 'wrap', gap: '10px' }}>
          <h2 style={{ margin: 0, color: '#38bdf8' }}>Zyro Logistics</h2>
          
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link to="/" style={navLinkStyle}>Home</Link>
            {userRole === 'Business' && <Link to="/business" style={navLinkStyle}>Business Orders</Link>}
            {userRole === 'Business' && <Link to="/create-order" style={navLinkStyle}>+ Create Order</Link>}
            {userRole === 'Rider' && <Link to="/rider" style={navLinkStyle}>Rider Dashboard</Link>}
            {userRole === 'Customer' && <Link to="/customer" style={navLinkStyle}>My Orders</Link>}
            
            {/* Notification Badge Button */}
            <div style={{ position: 'relative' }}>
              <button onClick={markNotifsRead} style={{ background: '#334155', color: '#fff', border: '1px solid #475569', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🔔 Notifications
                {unreadCount > 0 && (
                  <span style={{ background: '#ef4444', color: '#fff', borderRadius: '50%', padding: '2px 7px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown Notification Box */}
              {showNotifs && (
                <div style={{ position: 'absolute', right: 0, top: '40px', width: '300px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px', zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                  <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #334155', paddingBottom: '5px' }}>Activity Log</h4>
                  {notifications.length === 0 ? <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No notifications</p> : (
                    notifications.map(n => (
                      <div key={n.id} style={{ padding: '8px', borderBottom: '1px solid #334155', fontSize: '0.85rem' }}>
                        <div>{n.text}</div>
                        <small style={{ color: '#94a3b8' }}>{n.time}</small>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Role Switcher Dropdown */}
            <div style={{ background: '#334155', padding: '5px 10px', borderRadius: '6px' }}>
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
        <div style={{ padding: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
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

// 2. Business User: Orders List, Search, Filter, Assign Rider
const BusinessOrders = ({ orders, onCancel, onAssign }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [riderFilter, setRiderFilter] = useState('All');

  // Search & Filter Logic
  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.rider.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    const matchesRider = riderFilter === 'All' || o.rider === riderFilter;

    return matchesSearch && matchesStatus && matchesRider;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '10px' }}>
        <h2>Business Orders Management</h2>
        <button onClick={() => navigate('/create-order')} style={{ padding: '8px 16px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Create Order</button>
      </div>

      {/* Search and Filters Section */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem', flexWrap: 'wrap', background: '#1e293b', padding: '1rem', borderRadius: '8px' }}>
        <input 
          type="text" 
          placeholder="🔍 Search by Order ID, Customer or Rider..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          style={{ flex: '1 1 250px', ...inputStyle }}
        />

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ flex: '1 1 150px', ...inputStyle }}>
          <option value="All">Filter Status: All</option>
          <option value="Pending">Pending</option>
          <option value="Assigned">Assigned</option>
          <option value="Picked Up">Picked Up</option>
          <option value="In Transit">In Transit</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <select value={riderFilter} onChange={(e) => setRiderFilter(e.target.value)} style={{ flex: '1 1 150px', ...inputStyle }}>
          <option value="All">Filter Rider: All</option>
          <option value="Unassigned">Unassigned</option>
          {availableRiders.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Orders Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#1e293b', borderRadius: '8px', minWidth: '650px' }}>
          <thead>
            <tr style={{ background: '#334155', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>ID</th>
              <th style={{ padding: '12px' }}>Customer</th>
              <th style={{ padding: '12px' }}>Pickup ➔ Delivery</th>
              <th style={{ padding: '12px' }}>Rider</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>No orders found matching criteria.</td></tr>
            ) : (
              filteredOrders.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: '#38bdf8' }}>{o.id}</td>
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
                    <Link to={`/order/${o.id}`} style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}>Track</Link>
                    {o.status !== 'Cancelled' && o.status !== 'Delivered' && (
                      <>
                        <button onClick={() => navigate(`/edit-order/${o.id}`)} style={{ background: 'none', border: 'none', color: '#facc15', cursor: 'pointer' }}>Edit</button>
                        <button onClick={() => onCancel(o.id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}>Cancel</button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 3. Create Order Form
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
      riderPhone: 'N/A',
      riderVehicle: 'N/A',
      riderLocation: formData.pickup,
      estimatedDelivery: '30 minutes',
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
        <input type="text" placeholder="Pickup Address (e.g., Mardan)" required value={formData.pickup} onChange={e => setFormData({...formData, pickup: e.target.value})} style={inputStyle} />
        <input type="text" placeholder="Delivery Address (e.g., Timergara)" required value={formData.delivery} onChange={e => setFormData({...formData, delivery: e.target.value})} style={inputStyle} />
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

// 5. Rider Dashboard Flow
const RiderDashboard = ({ orders, currentRider, onStatusChange }) => {
  const riderOrders = orders.filter(o => o.rider === currentRider);

  return (
    <div>
      <h2>Rider Dashboard ({currentRider})</h2>

      <div style={{ display: 'grid', gap: '15px', marginTop: '1rem' }}>
        {riderOrders.length === 0 ? <p>No deliveries assigned to you.</p> : riderOrders.map(o => (
          <div key={o.id} style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid #38bdf8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Order #{o.id}</h3>
              <span style={{ fontWeight: 'bold', color: '#38bdf8', padding: '4px 8px', background: '#0f172a', borderRadius: '4px' }}>{o.status}</span>
            </div>
            <p><strong>Customer:</strong> {o.customer} ({o.phone})</p>
            <p><strong>Pickup:</strong> {o.pickup} ➔ <strong>Delivery:</strong> {o.delivery}</p>
            <p><strong>Package:</strong> {o.packageDetails}</p>

            <div style={{ marginTop: '1rem', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
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
              <Link to={`/order/${o.id}`} style={{ ...btnStyle('#334155'), textDecoration: 'none', display: 'inline-block' }}>View Map Route</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 6. Customer View
const CustomerOrders = ({ orders }) => (
  <div>
    <h2>My Delivery Orders</h2>
    <div style={{ display: 'grid', gap: '15px', marginTop: '1rem' }}>
      {orders.map(o => (
        <div key={o.id} style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ margin: '0 0 5px 0' }}>Order #{o.id} - <span style={{ color: '#38bdf8' }}>{o.status}</span></h3>
            <p style={{ margin: 0, color: '#94a3b8' }}>Delivery Address: {o.delivery}</p>
          </div>
          <Link to={`/order/${o.id}`} style={{ ...btnStyle('#2563eb'), textDecoration: 'none' }}>Track Order & Map ➔</Link>
        </div>
      ))}
    </div>
  </div>
);

// 7. Week 4 Core Requirement: Delivery Tracking, Map Interface, Rider Profile & Route Timeline
const OrderDetails = ({ orders }) => {
  const { id } = useParams();
  const order = orders.find(o => o.id === id);

  if (!order) return <div>Order not found.</div>;

  const steps = ['Pending', 'Assigned', 'Accepted', 'Picked Up', 'In Transit', 'Delivered'];
  const currentStepIdx = steps.indexOf(order.status);

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      
      {/* Top Banner Status */}
      <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderLeft: '5px solid #38bdf8' }}>
        <div>
          <h2 style={{ margin: 0 }}>Tracking Order #{order.id}</h2>
          <p style={{ margin: '5px 0 0 0', color: '#94a3b8' }}>Current Status: <strong style={{ color: '#38bdf8' }}>{order.status}</strong></p>
        </div>
        <div style={{ background: '#0f172a', padding: '10px 15px', borderRadius: '6px', textAlign: 'right' }}>
          <small style={{ color: '#94a3b8' }}>Estimated Delivery Time</small>
          <div style={{ color: '#4ade80', fontSize: '1.2rem', fontWeight: 'bold' }}>⏱ {order.estimatedDelivery}</div>
        </div>
      </div>

      {/* Week 4 Requirement: Simple Map & Route Visualizer */}
      <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0 }}>🗺️ Delivery Map Route</h3>
        
        {/* Simulated Map Container */}
        <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '2rem 1rem', textAlign: 'center', position: 'relative' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '700px', margin: '0 auto', position: 'relative' }}>
            {/* Visual Route Line */}
            <div style={{ position: 'absolute', top: '50%', left: '10%', right: '10%', height: '4px', background: '#334155', zIndex: 1, transform: 'translateY(-50%)' }}></div>
            <div style={{ position: 'absolute', top: '50%', left: '10%', width: order.status === 'In Transit' ? '50%' : order.status === 'Delivered' ? '80%' : '10%', height: '4px', background: '#38bdf8', zIndex: 1, transform: 'translateY(-50%)', transition: 'width 0.5s ease' }}></div>

            {/* Point 1: Pickup Location */}
            <div style={{ zIndex: 2, background: '#1e293b', padding: '10px', borderRadius: '8px', border: '2px solid #38bdf8' }}>
              <div style={{ fontSize: '1.5rem' }}>📍</div>
              <strong style={{ fontSize: '0.85rem' }}>Pickup</strong>
              <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{order.pickup}</div>
            </div>

            {/* Point 2: Rider Location */}
            <div style={{ zIndex: 2, background: '#1e293b', padding: '10px', borderRadius: '8px', border: '2px solid #facc15' }}>
              <div style={{ fontSize: '1.5rem' }}>🏍️</div>
              <strong style={{ fontSize: '0.85rem' }}>Rider</strong>
              <div style={{ color: '#facc15', fontSize: '0.8rem' }}>{order.riderLocation}</div>
            </div>

            {/* Point 3: Delivery Location */}
            <div style={{ zIndex: 2, background: '#1e293b', padding: '10px', borderRadius: '8px', border: '2px solid #22c55e' }}>
              <div style={{ fontSize: '1.5rem' }}>🏠</div>
              <strong style={{ fontSize: '0.85rem' }}>Destination</strong>
              <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{order.delivery}</div>
            </div>
          </div>

          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '1.5rem' }}>
            Route Sequence: <strong>{order.pickup}</strong> ➔ <strong>{order.riderLocation} (Current Rider Location)</strong> ➔ <strong>{order.delivery}</strong>
          </p>
        </div>
      </div>

      {/* Rider Info Card & Package Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Rider Profile Section */}
        <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0 }}>👤 Rider Information</h3>
          {order.rider === 'Unassigned' ? (
            <p style={{ color: '#94a3b8' }}>Rider has not been assigned yet.</p>
          ) : (
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#38bdf8', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 'bold' }}>
                {order.rider[0]}
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{order.rider}</h4>
                <p style={{ margin: '3px 0', color: '#94a3b8', fontSize: '0.9rem' }}>📞 Phone: {order.riderPhone}</p>
                <p style={{ margin: '3px 0', color: '#94a3b8', fontSize: '0.9rem' }}>🛵 Vehicle: {order.riderVehicle}</p>
                <span style={{ fontSize: '0.75rem', background: '#166534', color: '#4ade80', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>Active Driver</span>
              </div>
            </div>
          )}
        </div>

        {/* Package & Customer Summary */}
        <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0 }}>📦 Order Summary</h3>
          <p><strong>Customer:</strong> {order.customer} ({order.phone})</p>
          <p><strong>Package Info:</strong> {order.packageDetails}</p>
          <p><strong>Priority:</strong> {order.priority}</p>
          <p><strong>Payment:</strong> {order.paymentMethod}</p>
        </div>
      </div>

      {/* Status Progress Timeline */}
      <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0 }}>📋 Delivery Status Progress</h3>
        <div style={{ display: 'flex', gap: '10px', marginTop: '1rem', flexWrap: 'wrap' }}>
          {steps.map((step, idx) => (
            <div key={step} style={{ padding: '8px 14px', borderRadius: '20px', background: idx <= currentStepIdx ? '#16a34a' : '#334155', color: '#fff', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span>{idx <= currentStepIdx ? '✓' : '○'}</span> {step}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

// Helper Styles
const navLinkStyle = { color: '#f8fafc', textDecoration: 'none', fontSize: '0.95rem' };
const inputStyle = { padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #475569', borderRadius: '4px', width: '100%', boxSizing: 'border-box' };
const btnStyle = (bg) => ({ padding: '8px 16px', background: bg, color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' });