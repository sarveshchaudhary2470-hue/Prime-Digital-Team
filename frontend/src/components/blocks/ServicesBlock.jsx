import React from 'react';
import { motion } from 'framer-motion';
import { Video, Share2, Presentation, Search, Monitor, Megaphone } from 'lucide-react';

const iconMap = {
  Video: Video,
  Share2: Share2,
  Presentation: Presentation,
  Search: Search,
  Monitor: Monitor,
  Megaphone: Megaphone
};

const ServicesBlock = ({ content }) => {
  return (
    <section id="services" style={{
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

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {content.services.map((service, index) => {
            const Icon = iconMap[service.icon];
            return (
              <motion.div
                key={index}
                className="glass"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                style={{
                  padding: '2.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer'
                }}
                whileHover={{
                  y: -10,
                  boxShadow: '0 15px 40px rgba(138, 43, 226, 0.2)'
                }}
              >
                <div style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  background: 'var(--bg-card-hover)',
                  display: 'inline-flex',
                  color: 'var(--accent-blue)'
                }}>
                  {Icon && <Icon size={28} />}
                </div>
                <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0 0' }}>{service.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  {service.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesBlock;
