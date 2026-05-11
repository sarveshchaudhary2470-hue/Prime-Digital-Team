import React from 'react';
import { motion } from 'framer-motion';

const ProcessBlock = ({ content }) => {
  return (
    <section id="process" style={{ padding: '8rem 2rem', position: 'relative' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
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
            style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}
          >
            {content.subtitle}
          </motion.p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', position: 'relative' }}>
          {content.steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
            >
              <div style={{
                width: '60px', height: '60px', borderRadius: '50%', background: 'var(--accent-gradient)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
                fontSize: '1.5rem', fontWeight: 800, color: '#fff', boxShadow: '0 10px 20px rgba(138,43,226,0.3)'
              }}>
                {index + 1}
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{step.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessBlock;
