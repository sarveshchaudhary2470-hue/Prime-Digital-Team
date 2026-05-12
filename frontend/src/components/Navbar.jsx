import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Clients', path: '/clients' },
    { name: 'Teams', path: '/teams' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 100,
        padding: '1rem 2rem',
      }}
    >
      <div className="glass" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.8rem 1.5rem',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src="/logo.png" alt="Prime Digital Logo" style={{ height: '40px', borderRadius: '8px' }} />
          <h2 className="text-gradient" style={{ fontSize: '1.4rem', margin: 0, fontWeight: 800 }}>PRIME DIGITAL</h2>
        </Link>

        {/* Desktop Menu */}
        <ul className="desktop-menu" style={{ display: 'flex', gap: '2rem', margin: 0, padding: 0 }}>
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link 
                to={link.path} 
                style={{ 
                  fontWeight: location.pathname === link.path ? 700 : 500, 
                  color: location.pathname === link.path ? 'var(--accent-blue)' : 'var(--text-main)',
                  transition: 'color 0.3s' 
                }}
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/login" style={{ fontWeight: 600, color: 'var(--accent-purple)' }}>Login</Link>
          </li>
        </ul>

        {/* Mobile Hamburger Toggle */}
        <div className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
          {isOpen ? <X size={28} color="var(--accent-blue)" /> : <Menu size={28} color="var(--accent-blue)" />}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass"
            style={{
              position: 'absolute',
              top: '80px',
              left: '2rem',
              right: '2rem',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              overflow: 'hidden'
            }}
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path} 
                onClick={() => setIsOpen(false)}
                style={{ 
                  padding: '1rem', 
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  fontWeight: location.pathname === link.path ? 700 : 500, 
                  color: location.pathname === link.path ? 'var(--accent-blue)' : 'var(--text-main)',
                }}
              >
                {link.name}
              </Link>
            ))}
            <Link 
                to="/login" 
                onClick={() => setIsOpen(false)}
                style={{ padding: '1rem', fontWeight: 600, color: 'var(--accent-purple)' }}
              >
                Login
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .mobile-toggle { display: none !important; }
        .desktop-menu { display: flex !important; }
      `}</style>

    </motion.nav>
  );
};

export default Navbar;
