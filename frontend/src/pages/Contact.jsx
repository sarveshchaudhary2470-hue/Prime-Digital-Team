import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const Contact = () => {
  const [contactData, setContactData] = useState({
    email: 'hello@primedigital.in',
    phone: '+91 98765 43210',
    address: '402, Digital Tower, Andheri West<br />Mumbai, Maharashtra 400053'
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/content')
      .then(res => res.json())
      .then(data => {
        const block = data.find(b => b.type === 'footer');
        if (block) setContactData(block.content);
      })
      .catch(err => console.error(err));
  }, []);

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill all fields');
      return;
    }
    setIsSubmitting(true);
    fetch('http://localhost:5000/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    })
    .catch(err => {
      console.error(err);
      setIsSubmitting(false);
      alert('Failed to send message');
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 2rem 2rem'
      }}
    >
      <SEO title="Contact Us" description="Get in touch with Prime Digital for expert digital solutions. Send us a message and our team will respond within 24 hours." />
      <div className="glass" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        maxWidth: '1000px',
        width: '100%',
        overflow: 'hidden'
      }}>
        {/* Left Side Info */}
        <div style={{
          padding: '4rem 3rem',
          background: 'rgba(0, 240, 255, 0.05)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }} className="contact-info">
          <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Let's Talk.</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>
            Ready to elevate your digital presence? Send us a message and our team will get back to you within 24 hours.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: 'var(--text-main)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✉️</div>
              <div>
                <h4 style={{ color: '#fff', margin: '0 0 0.2rem' }}>Email Us</h4>
                <p style={{ margin: 0 }}>{contactData.email}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📍</div>
              <div>
                <h4 style={{ color: '#fff', margin: '0 0 0.2rem' }}>Our Office</h4>
                <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: contactData.address }} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📞</div>
              <div>
                <h4 style={{ color: '#fff', margin: '0 0 0.2rem' }}>Call Us</h4>
                <p style={{ margin: 0 }}>{contactData.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div style={{ padding: '4rem 3rem' }} className="contact-form">
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚀</div>
              <h3 style={{ color: '#fff', fontSize: '1.5rem' }}>Message Sent!</h3>
              <p style={{ color: 'var(--text-muted)' }}>We'll get back to you soon.</p>
              <button className="btn-secondary" onClick={() => setSubmitted(false)} style={{ marginTop: '1.5rem' }}>Send Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="John Doe" 
                  className="custom-input" 
                  required
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="john@company.com" 
                  className="custom-input" 
                  required
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Message</label>
                <textarea 
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  placeholder="Tell us about your project..." 
                  rows="4" 
                  className="custom-input"
                  required
                ></textarea>
              </div>
              <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ marginTop: '1rem' }}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .custom-input {
          padding: 1rem;
          border-radius: 8px;
          background: rgba(0,0,0,0.5);
          border: 1px solid var(--border-color);
          color: var(--text-main);
          outline: none;
          font-family: inherit;
          transition: border-color 0.3s;
        }
        .custom-input:focus {
          border-color: var(--accent-blue);
        }
        @media (max-width: 768px) {
          .glass { grid-template-columns: 1fr !important; }
          .contact-info { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.05); }
        }
      `}</style>
    </motion.div>
  );
};

export default Contact;
