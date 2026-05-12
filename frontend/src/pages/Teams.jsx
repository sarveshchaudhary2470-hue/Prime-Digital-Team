import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const Teams = () => {
  const [teamContent, setTeamContent] = useState(null);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        const block = data.find(b => b.type === 'team');
        if (block) setTeamContent(block.content);
      })
      .catch(err => console.error(err));
  }, []);

  if (!teamContent) return <div style={{ paddingTop: '120px', textAlign: 'center', color: '#fff' }}>Loading Team...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ paddingTop: '120px', paddingBottom: '6rem', minHeight: '100vh' }}
    >
      <SEO title="Our Team" description="Meet the creative minds at Prime Digital. Our expert team of designers, developers, and marketers is dedicated to your brand's success." />

      <div style={{ textAlign: 'center', padding: '0 2rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>{teamContent.title || 'Meet The Team'}</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 4rem', fontSize: '1.2rem' }}>
          {teamContent.subtitle || 'The creative minds behind the award-winning campaigns.'}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
          {teamContent.members?.map((member, i) => (
            <motion.div 
              key={i}
              className="glass"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              style={{ padding: '3rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}
            >
              {member.image ? (
                <img src={member.image} alt={member.name} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem' }} />
              ) : (
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(138,43,226,0.2)', marginBottom: '1rem' }} />
              )}
              <h3 style={{ fontSize: '1.5rem', margin: 0, color: '#fff' }}>{member.name}</h3>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Teams;
