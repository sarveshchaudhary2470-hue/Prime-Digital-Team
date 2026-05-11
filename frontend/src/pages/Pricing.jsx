import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const Pricing = () => {
  const [pricingContent, setPricingContent] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/content')
      .then(res => res.json())
      .then(data => {
        const block = data.find(b => b.type === 'pricing');
        if (block) setPricingContent(block.content);
      })
      .catch(err => console.error(err));
  }, []);

  if (!pricingContent) return <div style={{ paddingTop: '120px', textAlign: 'center', color: '#fff' }}>Loading Pricing...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ paddingTop: '120px', paddingBottom: '6rem', minHeight: '100vh' }}
    >
      <SEO title="Pricing Plans" description="Transparent pricing for premium digital services. Choose the best plan for your business growth with Prime Digital." />

      <div style={{ textAlign: 'center', padding: '0 2rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>{pricingContent.title || 'Pricing Plans'}</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 4rem', fontSize: '1.2rem' }}>
          {pricingContent.subtitle || 'Transparent pricing for local businesses. Choose the package that scales with you.'}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
          {pricingContent.plans?.map((plan, i) => (
            <div key={i} className="glass" style={{ 
              padding: '3rem 2rem', 
              textAlign: 'left', 
              borderTop: `4px solid ${plan.isPopular ? 'var(--accent-blue)' : i === 2 ? 'var(--accent-purple)' : 'var(--text-muted)'}`,
              transform: plan.isPopular ? 'scale(1.05)' : 'none',
              zIndex: plan.isPopular ? 1 : 0
            }}>
              {plan.isPopular && (
                <div style={{ background: 'var(--accent-blue)', color: '#000', padding: '0.2rem 1rem', borderRadius: '20px', display: 'inline-block', fontSize: '0.8rem', fontWeight: 800, marginBottom: '1rem' }}>MOST POPULAR</div>
              )}
              <h3 style={{ fontSize: '1.8rem', margin: '0 0 1rem' }}>{plan.name}</h3>
              <p style={{ color: 'var(--text-muted)' }}>{plan.desc}</p>
              <div style={{ fontSize: '3rem', fontWeight: 800, margin: '2rem 0' }}>{plan.price}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>{plan.period}</span></div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', color: 'var(--text-main)' }}>
                {plan.features?.map((feature, idx) => (
                  <li key={idx}>✓ {feature}</li>
                ))}
              </ul>
              <button className={plan.isPopular ? "btn-primary" : "btn-secondary"} style={{ width: '100%' }}>{plan.buttonText}</button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Pricing;
