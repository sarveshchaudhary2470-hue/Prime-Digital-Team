import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Mail, User, Calendar, MessageSquare } from 'lucide-react';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/messages')
      .then(res => res.json())
      .then(data => {
        setMessages(data.reverse()); // Newest first
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const deleteMessage = (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    fetch(`http://localhost:5000/api/messages/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => {
        setMessages(messages.filter(m => m.id !== id));
      })
      .catch(err => console.error(err));
  };

  if (loading) return <div style={{ color: '#fff', padding: '2rem' }}>Loading messages...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ padding: '1rem' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', margin: 0 }}>Client Messages</h1>
        <div className="glass" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Total Inquiries: {messages.length}
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="glass" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Mail size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
          <p>No messages received yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass"
                style={{
                  padding: '2rem',
                  position: 'relative',
                  border: '1px solid rgba(255,255,255,0.05)',
                  background: 'rgba(255,255,255,0.02)'
                }}
              >
                <button
                  onClick={() => deleteMessage(msg.id)}
                  style={{
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem',
                    background: 'rgba(255,77,79,0.1)',
                    border: '1px solid rgba(255,77,79,0.2)',
                    color: '#ff4d4f',
                    padding: '8px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,77,79,0.2)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,77,79,0.1)'}
                >
                  <Trash2 size={18} />
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div style={{ color: 'var(--accent-blue)' }}><User size={20} /></div>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>From</p>
                      <p style={{ margin: 0, fontWeight: 600, color: '#fff' }}>{msg.name}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div style={{ color: 'var(--accent-purple)' }}><Mail size={20} /></div>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email</p>
                      <p style={{ margin: 0, color: '#fff' }}>{msg.email}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div style={{ color: 'var(--text-muted)' }}><Calendar size={20} /></div>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Received On</p>
                      <p style={{ margin: 0, color: '#fff' }}>{msg.date}</p>
                    </div>
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', gap: '0.8rem' }}>
                    <div style={{ color: 'var(--accent-blue)', marginTop: '3px' }}><MessageSquare size={18} /></div>
                    <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-main)' }}>{msg.message}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default Messages;
