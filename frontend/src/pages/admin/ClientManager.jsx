import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, CheckCircle2, Clock, XCircle, X } from 'lucide-react';

const ClientManager = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  
  // New Client Form State
  const [newClient, setNewClient] = useState({
    name: '', contactPerson: '', email: '', phone: '', servicePlan: 'Social Media', customService: '', startDate: '', status: 'Active'
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = () => {
    fetch('/api/clients')
      .then(res => res.json())
      .then(data => { setClients(data); setLoading(false); })
      .catch(err => { console.error("Error fetching clients", err); setLoading(false); });
  };

  const updateBackend = (updatedClients, successMessage) => {
    fetch('/api/clients/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedClients)
    })
    .then(res => res.json())
    .then(() => {
      setClients(updatedClients);
      alert(successMessage);
    })
    .catch(() => alert("Failed to update database. Check backend."));
  };

  const handleAddClient = (e) => {
    e.preventDefault();
    const finalServicePlan = newClient.servicePlan === 'Other' ? newClient.customService : newClient.servicePlan;
    
    const clientData = { ...newClient, servicePlan: finalServicePlan, id: `c${Date.now()}` };
    delete clientData.customService; // clean up

    const updatedClients = [...clients, clientData];
    
    updateBackend(updatedClients, "New Client Added Successfully!");
    
    setShowAddForm(false);
    setNewClient({ name: '', contactPerson: '', email: '', phone: '', servicePlan: 'Social Media', customService: '', startDate: '', status: 'Active' });
  };

  const handleUpdateClient = () => {
    const updatedClients = clients.map(c => c.id === selectedClient.id ? selectedClient : c);
    updateBackend(updatedClients, "Client Details Updated!");
    setSelectedClient(null);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Active': return <span style={{ background: 'rgba(82, 196, 26, 0.2)', color: '#52c41a', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={12}/> Active</span>;
      case 'On-Pause': return <span style={{ background: 'rgba(250, 173, 20, 0.2)', color: '#faad14', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={12}/> On-Pause</span>;
      default: return <span style={{ background: 'rgba(255, 77, 79, 0.2)', color: '#ff4d4f', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><XCircle size={12}/> Completed</span>;
    }
  };

  if (loading) return <div style={{ color: '#fff' }}>Loading CRM...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: '1200px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Users size={32} color="var(--accent-blue)" /> Client Management
        </h1>
        <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {showAddForm ? 'Cancel' : <><Plus size={18} /> Add New Client</>}
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="glass" style={{ padding: '2rem', marginBottom: '2rem', overflow: 'hidden' }}>
            <h2 style={{ margin: '0 0 1.5rem', color: '#fff' }}>Add New Client</h2>
            <form onSubmit={handleAddClient} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label>Company Name</label>
                <input required type="text" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Contact Person</label>
                <input required type="text" value={newClient.contactPerson} onChange={e => setNewClient({...newClient, contactPerson: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} />
              </div>
              
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Service Plan</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select value={newClient.servicePlan} onChange={e => setNewClient({...newClient, servicePlan: e.target.value})} style={{ flex: newClient.servicePlan === 'Other' ? '0.4' : '1' }}>
                    <option>Social Media</option>
                    <option>Video Editing</option>
                    <option>Social Media + Video Editing</option>
                    <option>SEO Optimization</option>
                    <option value="Other">Other (Type custom)</option>
                  </select>
                  {newClient.servicePlan === 'Other' && (
                    <input 
                      type="text" 
                      placeholder="e.g. Meta Ads, Website" 
                      required 
                      value={newClient.customService} 
                      onChange={e => setNewClient({...newClient, customService: e.target.value})}
                      style={{ flex: '0.6' }}
                    />
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Start Date</label>
                <input type="date" required value={newClient.startDate} onChange={e => setNewClient({...newClient, startDate: e.target.value})} />
              </div>
              <button type="submit" className="btn-primary" style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>Save Client Data</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: '#fff' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '1rem' }}>Client / Company</th>
              <th style={{ padding: '1rem' }}>Contact Info</th>
              <th style={{ padding: '1rem' }}>Service Plan</th>
              <th style={{ padding: '1rem' }}>Start Date</th>
              <th style={{ padding: '1rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr 
                key={client.id} 
                className="table-row"
                onClick={() => setSelectedClient(client)}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
                title="Click to view full details"
              >
                <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--accent-blue)' }}>{client.name}</td>
                <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <div>{client.contactPerson}</div>
                  <div>{client.phone}</div>
                </td>
                <td style={{ padding: '1rem' }}>{client.servicePlan}</td>
                <td style={{ padding: '1rem' }}>{client.startDate}</td>
                <td style={{ padding: '1rem' }}>{getStatusBadge(client.status)}</td>
              </tr>
            ))}
            {clients.length === 0 && <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No clients added yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Full Detail Modal */}
      <AnimatePresence>
        {selectedClient && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            onClick={() => setSelectedClient(null)}
          >
            <motion.div 
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="glass"
              style={{ width: '100%', maxWidth: '600px', padding: '2rem', position: 'relative' }}
              onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              <button onClick={() => setSelectedClient(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={24} />
              </button>
              
              <h2 className="text-gradient" style={{ margin: '0 0 1.5rem', fontSize: '2rem' }}>{selectedClient.name}</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem', color: 'var(--text-muted)' }}>
                <div>
                  <strong style={{ color: '#fff' }}>Contact Person:</strong><br/>{selectedClient.contactPerson}
                </div>
                <div>
                  <strong style={{ color: '#fff' }}>Phone:</strong><br/>{selectedClient.phone || 'N/A'}
                </div>
                <div>
                  <strong style={{ color: '#fff' }}>Email:</strong><br/>{selectedClient.email || 'N/A'}
                </div>
                <div>
                  <strong style={{ color: '#fff' }}>Start Date:</strong><br/>{selectedClient.startDate}
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <strong style={{ color: '#fff' }}>Service Plan:</strong><br/>
                  <span style={{ color: 'var(--accent-blue)' }}>{selectedClient.servicePlan}</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="form-group" style={{ margin: 0, width: '200px' }}>
                  <label>Update Status</label>
                  <select 
                    value={selectedClient.status} 
                    onChange={e => setSelectedClient({...selectedClient, status: e.target.value})}
                  >
                    <option value="Active">Active</option>
                    <option value="On-Pause">On-Pause</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <button onClick={handleUpdateClient} className="btn-primary" style={{ padding: '10px 20px' }}>Update Details</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .form-group { display: flex; flexDirection: column; gap: 0.5rem; }
        .form-group label { color: var(--text-muted); font-size: 0.9rem; }
        .form-group input, .form-group select { padding: 0.8rem; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 8px; outline: none; transition: 0.3s; }
        .form-group input:focus, .form-group select:focus { border-color: var(--accent-blue); }
        .table-row:hover { background: rgba(255,255,255,0.05); }
      `}</style>
    </motion.div>
  );
};

export default ClientManager;
