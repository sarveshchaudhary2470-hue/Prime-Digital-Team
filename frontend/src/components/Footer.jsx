import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Footer = () => {
  const [footerData, setFooterData] = useState({
    email: 'hello@primedigital.com',
    phone: '+91 98765 43210',
    address: '402, Digital Tower, Andheri West<br/>Mumbai, MH 400053',
    description: 'We transform local businesses into industry leaders through high-retention content, daily social management, and data-driven strategies.'
  });

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        const footerBlock = data.find(b => b.type === 'footer');
        if (footerBlock) {
          setFooterData(footerBlock.content);
        }
      })
      .catch(err => console.error('Error fetching footer data:', err));
  }, []);

  return (
    <footer id="contact" style={{
      background: 'linear-gradient(to bottom, var(--bg-dark), #050508)',
      position: 'relative',
      marginTop: 'auto',
      overflow: 'hidden'
    }}>
      {/* Decorative top border */}
      <div style={{
        height: '2px',
        width: '100%',
        background: 'linear-gradient(90deg, transparent, var(--accent-blue), var(--accent-purple), transparent)',
        opacity: 0.5
      }} />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '6rem 2rem 3rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '4rem',
      }}>
        
        {/* Brand Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img src="/logo.png" alt="Prime Digital" style={{ height: '35px', borderRadius: '6px' }} />
            <h2 className="text-gradient" style={{ fontSize: '1.4rem', margin: 0, fontWeight: 800, letterSpacing: '1px' }}>PRIME DIGITAL</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '300px' }}>
            {footerData.description}
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            {['IG', 'TW', 'IN', 'FB'].map((platform, i) => (
              <div key={i} className="social-icon" style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                {platform}
              </div>
            ))}
          </div>
        </div>

        {/* Links Column */}
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#fff', fontWeight: 600 }}>Explore</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: 0, margin: 0 }}>
            {['Home', 'Services', 'Portfolio', 'Pricing', 'Teams'].map(link => (
              <li key={link}>
                <Link 
                  to={link === 'Home' ? '/' : `/${link.toLowerCase()}`} 
                  className="footer-link"
                >
                  <ArrowRight size={14} style={{ marginRight: '8px', opacity: 0.5 }} />
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Column */}
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#fff', fontWeight: 600 }}>Contact</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: 0, margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            <li style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.5, marginBottom: '4px' }}>Email Us</span>
              <a href={`mailto:${footerData.email}`} className="footer-link" style={{ color: '#fff' }}>{footerData.email}</a>
            </li>
            <li style={{ display: 'flex', flexDirection: 'column', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.5, marginBottom: '4px' }}>Call Us</span>
              <a href={`tel:${footerData.phone}`} className="footer-link" style={{ color: '#fff' }}>{footerData.phone}</a>
            </li>
            <li style={{ display: 'flex', flexDirection: 'column', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.5, marginBottom: '4px' }}>Visit Us</span>
              <span style={{ color: '#fff' }} dangerouslySetInnerHTML={{ __html: footerData.address }} />
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        background: 'rgba(0,0,0,0.3)',
        padding: '1.5rem 2rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          color: 'var(--text-muted)',
          fontSize: '0.85rem'
        }}>
          <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} Prime Digital Team. Built for Local Leaders.</p>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <span style={{ cursor: 'pointer' }} className="footer-link">Privacy Policy</span>
            <span style={{ cursor: 'pointer' }} className="footer-link">Terms of Service</span>
          </div>
        </div>
      </div>

      <style>{`
        .footer-link {
          color: var(--text-muted);
          text-decoration: none;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
        }
        .footer-link:hover { 
          color: var(--accent-blue) !important; 
          transform: translateX(5px);
        }
        .social-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .social-icon:hover {
          background: var(--accent-gradient);
          color: #fff;
          border-color: transparent;
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(138, 43, 226, 0.4);
        }
      `}</style>
    </footer>
  );
};

export default Footer;
