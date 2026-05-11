import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PortfolioBlock from '../components/blocks/PortfolioBlock';
import SEO from '../components/SEO';

const Portfolio = () => {
  const [portfolioContent, setPortfolioContent] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/content')
      .then(res => res.json())
      .then(data => {
        const block = data.find(b => b.type === 'portfolio');
        if (block) setPortfolioContent(block.content);
      })
      .catch(err => console.error(err));
  }, []);

  if (!portfolioContent) return <div style={{ paddingTop: '120px', textAlign: 'center', color: '#fff' }}>Loading Portfolio...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ paddingTop: '120px', paddingBottom: '6rem' }}
    >
      <SEO title="Portfolio" description="View our portfolio of successful digital campaigns, viral videos, and premium designs created for businesses across India." />
      <div style={{ textAlign: 'center', padding: '0 2rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>{portfolioContent.title || 'Our Work'}</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1.2rem' }}>
          Browse through some of our most successful campaigns, viral videos, and premium presentations designed for local businesses.
        </p>
      </div>
      
      <PortfolioBlock content={portfolioContent} />
    </motion.div>
  );
};

export default Portfolio;
