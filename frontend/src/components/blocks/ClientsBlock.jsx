import React from 'react';
import { motion } from 'framer-motion';

const ClientsBlock = ({ content }) => {
  return (
    <section style={{ padding: '6rem 2rem', background: 'rgba(255,255,255,0.02)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ fontSize: '2.5rem', marginBottom: '1rem' }}
        >
          {content.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '4rem' }}
        >
          {content.subtitle}
        </motion.p>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '3rem' }}>
          {content.clients.map((client, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                width: '150px',
                height: '150px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-card)',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.05)',
                fontWeight: 800,
                color: 'var(--text-muted)',
                fontSize: '1.2rem',
                textAlign: 'center',
                padding: '1rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
            >
              {client.name}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientsBlock;
