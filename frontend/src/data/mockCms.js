export const mockHomePageConfig = [
  {
    id: 'block-1',
    type: 'hero',
    order: 1,
    content: {
      headlinePrefix: 'Elevate Your',
      highlightText: 'Digital Presence',
      subheadline: 'Stop blending in. We engineer viral content, high-converting websites, and data-driven marketing strategies that turn local businesses into industry leaders.',
      primaryCta: 'Start Dominating',
      secondaryCta: 'View Our Work'
    }
  },
  {
    id: 'block-2',
    type: 'services',
    order: 2,
    content: {
      title: 'Our Premium Services',
      subtitle: 'Everything you need to stand out.',
      services: [
        { icon: 'Video', title: 'Video Editing', desc: 'Engaging long & short-form content.' },
        { icon: 'Share2', title: 'Social Media', desc: 'Daily posting & community management.' },
        { icon: 'Presentation', title: 'Presentations', desc: 'Award-winning pitch decks and PPTs.' },
        { icon: 'Search', title: 'SEO Optimization', desc: 'Rank higher on Google searches.' },
        { icon: 'Monitor', title: 'Web Development', desc: 'Custom websites that convert visitors.' },
        { icon: 'Megaphone', title: 'Ad Campaigns', desc: 'Targeted Facebook & Google Ads.' }
      ]
    }
  },
  {
    id: 'block-3',
    type: 'portfolio',
    order: 3,
    content: {
      title: 'Award-Winning Work',
      items: [
        { title: 'Tech Startup Promo', category: 'Video Editing', image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80' },
        { title: 'Fitness Gym Instagram', category: 'Social Media', image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=600&q=80' },
        { title: 'Investor Pitch Deck', category: 'Presentations', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80' }
      ]
    }
  },
  {
    id: 'block-4',
    type: 'clients',
    order: 4,
    content: {
      title: 'Trusted By Local Leaders',
      subtitle: 'We help local businesses dominate their market.',
      clients: [
        { name: "Urban Fit Mumbai" },
        { name: "TechNova Delhi" },
        { name: "GreenBite Cafe" },
        { name: "Apex Real Estate Pune" }
      ]
    }
  },
  {
    id: 'block-5',
    type: 'process',
    order: 5,
    content: {
      title: 'Our Proven Process',
      subtitle: 'How we take you from invisible to industry leader.',
      steps: [
        { title: 'Discovery Call', desc: 'We analyze your current presence and identify growth gaps.' },
        { title: 'Strategy Design', desc: 'We build a custom content and SEO plan tailored for your city.' },
        { title: 'Daily Execution', desc: 'Our team edits, posts, and manages your brand every single day.' },
        { title: 'Scale & Profit', desc: 'Watch your leads and brand authority skyrocket.' }
      ]
    }
  },
  {
    id: 'block-6',
    type: 'cta',
    order: 6,
    content: {
      title: 'Ready To Dominate Your Local Market?',
      subtitle: 'Stop losing customers to competitors with better marketing.',
      buttonText: 'Get Your Free Audit'
    }
  }
];
