import React from 'react';
import { motion } from 'framer-motion';
import MagneticButton from '../MagneticButton';

const HeroBlock = ({ content }) => {
  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '6rem 2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Dynamic Background Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '-10%',
        width: '60vw',
        height: '60vw',
        background: 'radial-gradient(circle, rgba(0,240,255,0.1) 0%, rgba(0,0,0,0) 70%)',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        right: '-10%',
        width: '70vw',
        height: '70vw',
        background: 'radial-gradient(circle, rgba(138,43,226,0.15) 0%, rgba(0,0,0,0) 70%)',
        zIndex: 0
      }} />

      {/* Grid Pattern Overlay */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        zIndex: 0,
        opacity: 0.5
      }} />

      <div style={{
        maxWidth: '1200px',
        width: '100%',
        zIndex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'center'
      }} className="hero-grid">
        
        {/* Left: Text Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'flex-start' }}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{ 
              padding: '0.5rem 1rem', 
              background: 'rgba(0, 240, 255, 0.1)', 
              borderRadius: '20px',
              border: '1px solid rgba(0, 240, 255, 0.2)',
              color: 'var(--accent-blue)',
              fontWeight: 600,
              fontSize: '0.9rem',
              display: 'inline-block'
            }}
          >
            Award-Winning Digital Agency
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ fontSize: 'clamp(3.5rem, 6vw, 5.5rem)', lineHeight: 1.05, margin: 0 }}
            dangerouslySetInnerHTML={{ __html: content.headline }}
          />
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '500px', margin: 0, lineHeight: 1.8 }}
          >
            {content.subheadline}
          </motion.p>
          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
          >
            <MagneticButton>
              <button 
                onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary" 
                style={{ padding: '15px 35px', fontSize: '1.1rem', cursor: 'pointer' }}
              >
                Start Dominating
              </button>
            </MagneticButton>
            <MagneticButton>
              <button 
                onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-secondary" 
                style={{ padding: '15px 35px', fontSize: '1.1rem', cursor: 'pointer' }}
              >
                View Our Work
              </button>
            </MagneticButton>
          </motion.div>
        </div>

        {/* Right: Visual Element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          style={{ position: 'relative', height: '500px' }}
          className="hero-visual"
        >
          <div className="glass" style={{
            position: 'absolute',
            top: '10%', right: '0%',
            width: '80%', height: '80%',
            background: 'rgba(138, 43, 226, 0.1)',
            border: '1px solid rgba(138, 43, 226, 0.3)',
            borderRadius: '30px',
            transform: 'rotate(5deg)'
          }} />
          <div className="glass" style={{
            position: 'absolute',
            top: '5%', left: '5%',
            width: '85%', height: '85%',
            background: `url(${content.heroImage || 'https://res.cloudinary.com/dck8w9hng/image/upload/v1778499094/prime_digital_cms/i9qctvrvj4mtlx3srhho.jpg'}) center/cover`,
            borderRadius: '30px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            transform: 'rotate(-2deg)'
          }} />
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .hero-grid { grid-template-columns: 1fr !important; text-align: center; }
          .hero-grid > div:first-child { alignItems: center !important; }
          .hero-visual { height: 400px !important; margin-top: 3rem; }
        }
      `}</style>
    </section>
  );
};

export default HeroBlock;
