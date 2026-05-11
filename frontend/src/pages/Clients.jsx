import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const Clients = () => {
  const [clientsContent, setClientsContent] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/content')
      .then(res => res.json())
      .then(data => {
        const block = data.find(b => b.type === 'clients');
        if (block) setClientsContent(block.content);
      })
      .catch(err => console.error(err));
  }, []);

  if (!clientsContent) return <div style={{ paddingTop: '120px', textAlign: 'center', color: '#fff' }}>Loading Clients...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ paddingTop: '120px', paddingBottom: '6rem', minHeight: '100vh' }}
    >
      <SEO title="Our Clients" description="Prime Digital partners with ambitious local businesses. See our client list and how we help brands dominate their market." />

      <div style={{ textAlign: 'center', padding: '0 2rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>{clientsContent.title || 'Our Clients'}</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 4rem', fontSize: '1.2rem' }}>
          {clientsContent.subtitle || "We partner with ambitious local businesses. See who we've helped dominate their market."}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
          {clientsContent.clients?.map((client, i) => (
            <motion.div 
              key={i}
              className="glass"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}
            >
              {client.image ? (
                <img src={client.image} alt={client.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'contain', background: '#fff', padding: '5px' }} />
              ) : (
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                  🏢
                </div>
              )}
              <h3 style={{ fontSize: '1.2rem', margin: 0, color: '#fff' }}>{client.name}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Clients;
