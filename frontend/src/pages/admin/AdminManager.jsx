import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Shield, Trash2, Mail, Lock, User } from 'lucide-react';

const AdminManager = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/admins', {
        headers: { 'Authorization': token }
      });
      const data = await res.json();
      setAdmins(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setStatus({ type: 'info', msg: 'Creating admin...' });
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', msg: data.message });
        setFormData({ username: '', email: '', password: '' });
        setShowAddForm(false);
        fetchAdmins();
      } else {
        setStatus({ type: 'error', msg: data.message });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Failed to create admin' });
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm('Are you sure you want to remove this admin?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/auth/admins/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': token }
      });
      const data = await res.json();
      if (res.ok) {
        setAdmins(admins.filter(a => a._id !== id));
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ color: '#fff', padding: '2rem' }}>Loading admins...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ padding: '1rem' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', margin: 0 }}>Manage Admins</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Control who has administrative access to the dashboard.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {showAddForm ? 'Cancel' : <><UserPlus size={18} /> Add New Admin</>}
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden', marginBottom: '2rem' }}
          >
            <form onSubmit={handleAddAdmin} className="glass" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Username</label>
                <input 
                  type="text" 
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                  className="custom-input" 
                  placeholder="e.g., admin_user"
                  required 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="custom-input" 
                  placeholder="e.g., user@mail.com"
                  required 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Password</label>
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="custom-input" 
                  placeholder="Strong password"
                  required 
                />
              </div>
              <button type="submit" className="btn-primary" style={{ padding: '1rem 2rem' }}>Create</button>
            </form>
            {status.msg && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '1rem', 
                borderRadius: '8px', 
                textAlign: 'center',
                background: status.type === 'error' ? 'rgba(255,77,79,0.1)' : 'rgba(0,240,255,0.1)',
                color: status.type === 'error' ? '#ff4d4f' : 'var(--accent-blue)',
                border: `1px solid ${status.type === 'error' ? 'rgba(255,77,79,0.2)' : 'rgba(0,240,255,0.2)'}`
              }}>
                {status.msg}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {admins.map((admin) => (
          <div 
            key={admin._id} 
            className="glass" 
            style={{ 
              padding: '1.5rem 2rem', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              border: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            <div style={{ display: 'flex', gap: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <User size={18} style={{ color: 'var(--accent-blue)' }} />
                <div>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Username</p>
                  <p style={{ margin: 0, fontWeight: 600 }}>{admin.username}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <Mail size={18} style={{ color: 'var(--accent-purple)' }} />
                <div>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email</p>
                  <p style={{ margin: 0 }}>{admin.email}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <Shield size={18} style={{ color: '#52c41a' }} />
                <div>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Role</p>
                  <p style={{ margin: 0, color: '#52c41a' }}>Administrator</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleDeleteAdmin(admin._id)}
              style={{
                background: 'rgba(255,77,79,0.1)',
                border: '1px solid rgba(255,77,79,0.2)',
                color: '#ff4d4f',
                padding: '8px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AdminManager;
