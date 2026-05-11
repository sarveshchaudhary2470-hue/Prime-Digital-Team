import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MagneticButton from '../MagneticButton';

const CtaBlock = ({ content }) => {
  const navigate = useNavigate();
  return (
    <section id="cta" style={{ padding: '4rem 2rem 8rem' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="glass"
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '5rem 3rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.1), rgba(138, 43, 226, 0.1))',
          border: '1px solid rgba(138, 43, 226, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <h2 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#fff' }}>{content.title}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
          {content.subtitle}
        </p>
        <MagneticButton>
          <button 
            onClick={() => navigate('/contact')}
            className="btn-primary" 
            style={{ padding: '20px 40px', fontSize: '1.2rem', boxShadow: '0 10px 30px rgba(0, 240, 255, 0.4)', cursor: 'pointer' }}
          >
            {content.buttonText}
          </button>
        </MagneticButton>
      </motion.div>
    </section>
  );
};

export default CtaBlock;
