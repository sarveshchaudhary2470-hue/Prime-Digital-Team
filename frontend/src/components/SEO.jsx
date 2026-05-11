import { useEffect } from 'react';

const SEO = ({ title, description }) => {
  useEffect(() => {
    // Update page title
    document.title = title 
      ? `${title} | Prime Digital` 
      : 'PRIME DIGITAL | Award-Winning Digital Agency';

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && description) {
      metaDesc.setAttribute('content', description);
    }

    // Update OG title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title || 'PRIME DIGITAL | Award-Winning Digital Agency');
    }

    // Update OG description
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && description) {
      ogDesc.setAttribute('content', description);
    }
  }, [title, description]);

  return null; // Renders nothing — purely invisible
};

export default SEO;
