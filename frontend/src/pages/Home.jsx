import React from 'react';
import Navbar from '../components/Navbar';
import HeroBlock from '../components/blocks/HeroBlock';
import ServicesBlock from '../components/blocks/ServicesBlock';
import PortfolioBlock from '../components/blocks/PortfolioBlock';
import ClientsBlock from '../components/blocks/ClientsBlock';
import ProcessBlock from '../components/blocks/ProcessBlock';
import CtaBlock from '../components/blocks/CtaBlock';
import SEO from '../components/SEO';
import { mockHomePageConfig } from '../data/mockCms';

// A registry mapping block types to their React Components
const BlockRegistry = {
  hero: HeroBlock,
  services: ServicesBlock,
  portfolio: PortfolioBlock,
  clients: ClientsBlock,
  process: ProcessBlock,
  cta: CtaBlock,
  // More blocks (portfolio, testimonials) will go here
};

const Home = () => {
  const [pageConfig, setPageConfig] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('http://localhost:5000/api/content')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setPageConfig(data);
        } else {
          setPageConfig(mockHomePageConfig);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Backend not running, falling back to local data:", err);
        setPageConfig(mockHomePageConfig);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Loading Award-Winning Experience...</div>;
  }

  return (
    <>
      <SEO title="Home" description="Prime Digital — Award-winning digital agency delivering expert web development, social media marketing, SEO, branding, and UI/UX design solutions." />
      <main>
        {pageConfig
          .sort((a, b) => a.order - b.order) // Ensure blocks are ordered correctly
          .map((block) => {
            const BlockComponent = BlockRegistry[block.type];
            if (!BlockComponent) {
              return null; // Skip blocks not meant for homepage (team, footer, pricing, etc.)
            }
            return <BlockComponent key={block.id} content={block.content} />;
        })}
      </main>
    </>
  );
};

export default Home;
