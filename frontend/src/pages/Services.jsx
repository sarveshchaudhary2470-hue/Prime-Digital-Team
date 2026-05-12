import React from 'react';
import { motion } from 'framer-motion';
import ServicesBlock from '../components/blocks/ServicesBlock';
import { mockHomePageConfig } from '../data/mockCms';
import SEO from '../components/SEO';

const Services = () => {
  const [servicesContent, setServicesContent] = React.useState(null);

  React.useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        const block = data.find(b => b.type === 'services');
        setServicesContent(block ? block.content : mockHomePageConfig.find(b => b.type === 'services').content);
      })
      .catch(() => {
        setServicesContent(mockHomePageConfig.find(b => b.type === 'services').content);
      });
  }, []);

  if (!servicesContent) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ paddingTop: '120px', paddingBottom: '4rem' }}
    >
      <SEO title="Services" description="Explore our comprehensive digital services including web development, social media marketing, SEO optimization, branding, and UI/UX design at Prime Digital." />
      <div style={{ textAlign: 'center', padding: '0 2rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Our Services</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1.2rem' }}>
          We provide end-to-end digital solutions for local businesses. From high-retention video editing to daily social media growth, we do it all so you can focus on your business.
        </p>
      </div>
      
      <ServicesBlock content={servicesContent} />

      {/* Extended Details Section */}
      <section style={{ maxWidth: '1000px', margin: '4rem auto 0', padding: '0 2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        <div className="glass" style={{ padding: '3rem', borderLeft: '4px solid var(--accent-blue)' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#fff' }}>Why Our Video Editing Converts</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
            In today's fast-paced digital world, attention is the most valuable currency. Our video editing team specializes in creating high-retention content. Whether it's a 60-second YouTube Short, an Instagram Reel, or a 10-minute corporate documentary, we use advanced pacing techniques, dynamic typography, B-roll integration, and psychological hooks to ensure your audience watches until the very end and takes action.
          </p>
        </div>

        <div className="glass" style={{ padding: '3rem', borderLeft: '4px solid var(--accent-purple)' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#fff' }}>The Power of Daily Posting</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
            Consistency is key. Social media algorithms reward accounts that post frequently and consistently. Our "Daily Social Media Management" package ensures that your brand stays top-of-mind for your local customers. We handle the entire pipeline: content ideation, graphic design, copywriting, hashtags, and the daily scheduling across Instagram, Facebook, and LinkedIn.
          </p>
        </div>

        <div className="glass" style={{ padding: '3rem', borderLeft: '4px solid var(--accent-blue)' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#fff' }}>Award-Winning Presentations (PPTs)</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
            A powerful presentation can secure your next big contract or investor. We transform boring slides into cinematic, highly engaging pitch decks. We focus on visual storytelling, data visualization, custom infographics, and modern layouts to ensure your message is delivered with maximum impact. 
          </p>
        </div>

        <div className="glass" style={{ padding: '3rem', borderLeft: '4px solid var(--accent-purple)' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#fff' }}>Dominating Google with Local SEO</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
            When someone in your city searches for your services, you need to be number one. We optimize your website and Google Business Profile to rank at the top of local search results. From keyword research and on-page optimization to building high-quality local backlinks, we ensure customers find you before they find your competitors.
          </p>
        </div>

        <div className="glass" style={{ padding: '3rem', borderLeft: '4px solid var(--accent-blue)' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#fff' }}>High-Converting Web Development</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
            Your website is your digital storefront. We build ultra-fast, mobile-responsive, and beautifully designed websites tailored for conversion. Using the latest web technologies, we create platforms that not only look award-winning but are fundamentally designed to turn casual visitors into paying leads.
          </p>
        </div>

        <div className="glass" style={{ padding: '3rem', borderLeft: '4px solid var(--accent-purple)' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#fff' }}>Data-Driven Ad Campaigns</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
            Stop wasting money on ads that don't convert. Our media buying team creates laser-targeted ad campaigns on Facebook, Instagram, and Google. We continuously A/B test creatives, ad copy, and targeting parameters to drive down your Cost Per Acquisition (CPA) and maximize your Return on Ad Spend (ROAS).
          </p>
        </div>

      </section>
    </motion.div>
  );
};

export default Services;
