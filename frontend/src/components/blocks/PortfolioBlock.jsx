import React from 'react';
import { motion } from 'framer-motion';

const PortfolioBlock = ({ content }) => {
  return (
    <section id="portfolio" style={{
      padding: '6rem 2rem',
      position: 'relative'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ fontSize: '2.5rem', marginBottom: '1rem' }}
          >
            {content.title}
          </motion.h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '2rem'
        }}>
          {content.items.map((item, index) => (
            <motion.div
              key={index}
              className="glass"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              style={{
                overflow: 'hidden',
                borderRadius: '16px',
                cursor: 'pointer',
                position: 'relative',
                height: '250px'
              }}
              whileHover={{ y: -5, boxShadow: '0 15px 40px rgba(0, 240, 255, 0.2)' }}
            >
              <div style={{
                width: '100%',
                height: '100%',
                background: `url(${item.image}) center/cover no-repeat`,
                transition: 'transform 0.5s ease'
              }} className="portfolio-bg" />
              
              <div style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(transparent, rgba(10, 10, 15, 0.9))',
                padding: '2rem 1.5rem 1.5rem',
                transform: 'translateY(20px)',
                opacity: 0,
                transition: 'all 0.3s ease'
              }} className="portfolio-content">
                <h3 style={{ margin: 0, color: 'var(--accent-blue)' }}>{item.title}</h3>
                <p style={{ margin: '0.5rem 0 0', color: '#fff', fontSize: '0.9rem' }}>{item.category}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        .glass:hover .portfolio-bg { transform: scale(1.1); }
        .glass:hover .portfolio-content { transform: translateY(0); opacity: 1; }
      `}</style>
    </section>
  );
};

export default PortfolioBlock;
