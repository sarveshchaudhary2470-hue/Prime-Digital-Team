import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroBlock from '../../components/blocks/HeroBlock';
import ServicesBlock from '../../components/blocks/ServicesBlock';
import PortfolioBlock from '../../components/blocks/PortfolioBlock';
import ClientsBlock from '../../components/blocks/ClientsBlock';

const ContentManager = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hero');
  const [saving, setSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Content States
  const [heroContent, setHeroContent] = useState({ headline: '', subheadline: '', heroImage: '' });
  const [heroImagePreview, setHeroImagePreview] = useState(null);
  const [footerContent, setFooterContent] = useState({ email: '', phone: '', address: '', description: '' });
  const [servicesContent, setServicesContent] = useState({ title: '', subtitle: '', services: [] });
  const [portfolioContent, setPortfolioContent] = useState({ title: '', items: [] });
  const [teamContent, setTeamContent] = useState({ title: '', subtitle: '', members: [] });
  const [clientsContent, setClientsContent] = useState({ title: '', subtitle: '', clients: [] });
  const [pricingContent, setPricingContent] = useState({ title: '', subtitle: '', plans: [] });

  const fileInputRef = useRef(null);
  const [uploadingImageFor, setUploadingImageFor] = useState(null); // e.g. { type: 'team', index: 0 }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('/api/content')
      .then(res => res.json())
      .then(dbData => {
        setData(dbData);
        dbData.forEach(block => {
          if (block.type === 'hero') setHeroContent(block.content);
          if (block.type === 'footer') setFooterContent(block.content);
          if (block.type === 'services') setServicesContent(block.content);
          if (block.type === 'portfolio') setPortfolioContent(block.content);
          if (block.type === 'team') setTeamContent(block.content);
          if (block.type === 'clients') setClientsContent(block.content);
          if (block.type === 'pricing') setPricingContent(block.content);
        });
        setLoading(false);
      })
      .catch(err => { console.error(err); setLoading(false); });
  };

  const handleSave = () => {
    setSaving(true);
    
    // Only update the active tab's content in the global data array
    const updatedData = data.map(block => {
      if (block.type === activeTab) {
        if (activeTab === 'hero') return { ...block, content: heroContent };
        if (activeTab === 'footer') return { ...block, content: footerContent };
        if (activeTab === 'services') return { ...block, content: servicesContent };
        if (activeTab === 'portfolio') return { ...block, content: portfolioContent };
        if (activeTab === 'team') return { ...block, content: teamContent };
        if (activeTab === 'clients') return { ...block, content: clientsContent };
        if (activeTab === 'pricing') return { ...block, content: pricingContent };
      }
      return block;
    });

    fetch('/api/content/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    })
    .then(res => res.json())
    .then(() => { 
      setData(updatedData); // Update local state to match saved data
      alert(`${activeTab.toUpperCase()} updated successfully!`); 
      setSaving(false); 
    })
    .catch(() => { alert("Failed to update."); setSaving(false); });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    fetch('/api/upload', { method: 'POST', body: formData })
      .then(res => res.json())
      .then(data => {
        if (uploadingImageFor) {
          const { type, index } = uploadingImageFor;
          if (type === 'portfolio') {
            const newItems = [...portfolioContent.items];
            newItems[index].image = data.url;
            setPortfolioContent({ ...portfolioContent, items: newItems });
          } else if (type === 'team') {
            const newMembers = [...teamContent.members];
            newMembers[index].image = data.url;
            setTeamContent({ ...teamContent, members: newMembers });
          } else if (type === 'clients') {
            const newClients = [...clientsContent.clients];
            newClients[index].image = data.url;
            setClientsContent({ ...clientsContent, clients: newClients });
          } else if (type === 'hero') {
            setHeroContent({ ...heroContent, heroImage: data.url });
            setHeroImagePreview(null);
          }
        }
        setUploadingImageFor(null);
      })
      .catch(err => { console.error(err); alert('Upload failed'); });
  };

  const triggerImageUpload = (type, index) => {
    setUploadingImageFor({ type, index });
    fileInputRef.current.click();
  };

  if (loading) return <div style={{ color: '#fff' }}>Loading CMS...</div>;

  const tabs = [
    { id: 'hero', label: 'Hero Section' },
    { id: 'services', label: 'Services' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'team', label: 'Team' },
    { id: 'clients', label: 'Client Logos' },
    { id: 'pricing', label: 'Pricing Plans' },
    { id: 'footer', label: 'Footer & Contact' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: '1000px', paddingBottom: '100px' }}>
      <h1 className="text-gradient" style={{ fontSize: '2.5rem', margin: '0 0 2rem' }}>Content Manager</h1>
      
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleImageUpload} />

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? 'var(--accent-blue)' : 'rgba(255,255,255,0.05)',
              color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
              fontWeight: activeTab === tab.id ? 600 : 400
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="glass" style={{ padding: '2rem' }}>
        
        {/* HERO SECTION */}
        {activeTab === 'hero' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ color: '#fff', margin: '0 0 1rem' }}>Edit Hero Section</h2>
            <div className="form-group">
              <label>Main Headline (HTML Supported)</label>
              <input type="text" value={heroContent.headline} onChange={e => setHeroContent({ ...heroContent, headline: e.target.value })} className="admin-input" />
            </div>
            <div className="form-group">
              <label>Subheadline</label>
              <textarea rows="4" value={heroContent.subheadline} onChange={e => setHeroContent({ ...heroContent, subheadline: e.target.value })} className="admin-input" />
            </div>

            {/* Hero Image Upload */}
            <div className="form-group">
              <label>Hero Image</label>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {/* Current Image */}
                <div style={{ flex: '1 1 250px' }}>
                  <p style={{ color: 'var(--text-muted)', margin: '0 0 0.5rem', fontSize: '0.85rem' }}>Current Image</p>
                  <div style={{
                    width: '100%', height: '200px',
                    background: `url(${heroContent.heroImage || ''}) center/cover no-repeat`,
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }} />
                </div>

                {/* Preview (if new image selected) */}
                {heroImagePreview && (
                  <div style={{ flex: '1 1 250px' }}>
                    <p style={{ color: '#52c41a', margin: '0 0 0.5rem', fontSize: '0.85rem' }}>✨ New Image Preview</p>
                    <div style={{
                      width: '100%', height: '200px',
                      background: `url(${heroImagePreview}) center/cover no-repeat`,
                      borderRadius: '12px',
                      border: '2px solid #52c41a'
                    }} />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <label style={{
                  padding: '10px 20px',
                  background: 'rgba(0, 240, 255, 0.1)',
                  border: '1px solid rgba(0, 240, 255, 0.3)',
                  borderRadius: '8px',
                  color: 'var(--accent-blue)',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  display: 'inline-block'
                }}>
                  📁 Choose New Image
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      // Show local preview first
                      const reader = new FileReader();
                      reader.onload = (ev) => setHeroImagePreview(ev.target.result);
                      reader.readAsDataURL(file);
                      // Store file for upload on save
                      setUploadingImageFor({ type: 'hero', index: 0, file });
                    }}
                  />
                </label>

                {heroImagePreview && (
                  <>
                    <button
                      className="btn-primary"
                      style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                      onClick={() => {
                        if (!uploadingImageFor || !uploadingImageFor.file) return;
                        const formData = new FormData();
                        formData.append('image', uploadingImageFor.file);
                        fetch('/api/upload', { method: 'POST', body: formData })
                          .then(res => res.json())
                          .then(data => {
                            setHeroContent({ ...heroContent, heroImage: data.url });
                            setHeroImagePreview(null);
                            setUploadingImageFor(null);
                            alert('Image uploaded! Click Save to apply.');
                          })
                          .catch(() => alert('Upload failed'));
                      }}
                    >
                      ✅ Confirm & Upload
                    </button>
                    <button
                      style={{ padding: '10px 20px', background: 'rgba(255,77,79,0.1)', border: '1px solid rgba(255,77,79,0.3)', borderRadius: '8px', color: '#ff4d4f', cursor: 'pointer', fontSize: '0.9rem' }}
                      onClick={() => { setHeroImagePreview(null); setUploadingImageFor(null); }}
                    >
                      ✕ Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SERVICES SECTION */}
        {activeTab === 'services' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: '#fff', margin: 0 }}>Manage Services</h2>
              <button className="btn-secondary" onClick={() => setServicesContent({...servicesContent, services: [...(servicesContent.services || []), {title:'', desc:'', icon:'Star'}]})}>+ Add Service</button>
            </div>
            
            {servicesContent.services?.map((service, i) => (
              <div key={i} style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', position: 'relative' }}>
                <button 
                  onClick={() => { const newS = [...servicesContent.services]; newS.splice(i, 1); setServicesContent({...servicesContent, services: newS}); }}
                  style={{ position: 'absolute', top: '10px', right: '10px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >Remove</button>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Service Title</label>
                    <input type="text" value={service.title} onChange={e => { const newS = [...servicesContent.services]; newS[i].title = e.target.value; setServicesContent({...servicesContent, services: newS}); }} className="admin-input" />
                  </div>
                  <div className="form-group">
                    <label>Lucide Icon Name (e.g. Video, Monitor)</label>
                    <input type="text" value={service.icon} onChange={e => { const newS = [...servicesContent.services]; newS[i].icon = e.target.value; setServicesContent({...servicesContent, services: newS}); }} className="admin-input" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Short Description</label>
                    <textarea rows="2" value={service.desc} onChange={e => { const newS = [...servicesContent.services]; newS[i].desc = e.target.value; setServicesContent({...servicesContent, services: newS}); }} className="admin-input" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CLIENT LOGOS SECTION */}
        {activeTab === 'clients' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: '#fff', margin: 0 }}>Public Client Logos</h2>
              <button className="btn-secondary" onClick={() => setClientsContent({...clientsContent, clients: [...(clientsContent.clients || []), {name:'', image:''}]})}>+ Add Client Logo</button>
            </div>
            
            {clientsContent.clients?.map((client, i) => (
              <div key={i} style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', position: 'relative' }}>
                <button 
                  onClick={() => { const newC = [...clientsContent.clients]; newC.splice(i, 1); setClientsContent({...clientsContent, clients: newC}); }}
                  style={{ position: 'absolute', top: '10px', right: '10px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >Remove</button>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Client Name (Alt Text)</label>
                    <input type="text" value={client.name} onChange={e => { const newC = [...clientsContent.clients]; newC[i].name = e.target.value; setClientsContent({...clientsContent, clients: newC}); }} className="admin-input" />
                  </div>
                  <div className="form-group">
                    <label>Logo URL or Upload</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <input type="text" value={client.image || ''} onChange={e => { const newC = [...clientsContent.clients]; newC[i].image = e.target.value; setClientsContent({...clientsContent, clients: newC}); }} className="admin-input" style={{ flex: 1 }} />
                      <button onClick={() => triggerImageUpload('clients', i)} style={{ padding: '10px', background: 'var(--accent-purple)', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer' }}>Upload Logo</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PRICING SECTION */}
        {activeTab === 'pricing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: '#fff', margin: 0 }}>Manage Pricing Plans</h2>
              <button className="btn-secondary" onClick={() => setPricingContent({...pricingContent, plans: [...(pricingContent.plans || []), {name:'', desc:'', price:'', period:'', features:[], isPopular:false, buttonText:''}]})}>+ Add Plan</button>
            </div>
            
            {pricingContent.plans?.map((plan, i) => (
              <div key={i} style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', position: 'relative' }}>
                <button 
                  onClick={() => { const newP = [...pricingContent.plans]; newP.splice(i, 1); setPricingContent({...pricingContent, plans: newP}); }}
                  style={{ position: 'absolute', top: '10px', right: '10px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >Remove</button>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Plan Name</label>
                    <input type="text" value={plan.name} onChange={e => { const newP = [...pricingContent.plans]; newP[i].name = e.target.value; setPricingContent({...pricingContent, plans: newP}); }} className="admin-input" />
                  </div>
                  <div className="form-group">
                    <label>Price</label>
                    <input type="text" value={plan.price} onChange={e => { const newP = [...pricingContent.plans]; newP[i].price = e.target.value; setPricingContent({...pricingContent, plans: newP}); }} className="admin-input" placeholder="e.g. ₹14,999 or Custom" />
                  </div>
                  <div className="form-group">
                    <label>Period</label>
                    <input type="text" value={plan.period} onChange={e => { const newP = [...pricingContent.plans]; newP[i].period = e.target.value; setPricingContent({...pricingContent, plans: newP}); }} className="admin-input" placeholder="e.g. /mo" />
                  </div>
                  <div className="form-group">
                    <label>Button Text</label>
                    <input type="text" value={plan.buttonText} onChange={e => { const newP = [...pricingContent.plans]; newP[i].buttonText = e.target.value; setPricingContent({...pricingContent, plans: newP}); }} className="admin-input" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Short Description</label>
                    <input type="text" value={plan.desc} onChange={e => { const newP = [...pricingContent.plans]; newP[i].desc = e.target.value; setPricingContent({...pricingContent, plans: newP}); }} className="admin-input" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Features (Comma separated)</label>
                    <input type="text" value={plan.features?.join(', ')} onChange={e => { const newP = [...pricingContent.plans]; newP[i].features = e.target.value.split(',').map(f=>f.trim()); setPricingContent({...pricingContent, plans: newP}); }} className="admin-input" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1', flexDirection: 'row', alignItems: 'center' }}>
                    <input type="checkbox" checked={plan.isPopular} onChange={e => { const newP = [...pricingContent.plans]; newP[i].isPopular = e.target.checked; setPricingContent({...pricingContent, plans: newP}); }} style={{ width: '20px', height: '20px' }} />
                    <label style={{ margin: 0 }}>Mark as Most Popular (Highlighted)</label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FOOTER SECTION */}
        {activeTab === 'footer' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ color: '#fff', margin: '0 0 1rem' }}>Edit Footer & Contact Info</h2>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={footerContent.email} onChange={e => setFooterContent({ ...footerContent, email: e.target.value })} className="admin-input" />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" value={footerContent.phone} onChange={e => setFooterContent({ ...footerContent, phone: e.target.value })} className="admin-input" />
            </div>
            <div className="form-group">
              <label>Office Address (HTML supported)</label>
              <textarea rows="3" value={footerContent.address} onChange={e => setFooterContent({ ...footerContent, address: e.target.value })} className="admin-input" />
            </div>
            <div className="form-group">
              <label>Company Description</label>
              <textarea rows="3" value={footerContent.description} onChange={e => setFooterContent({ ...footerContent, description: e.target.value })} className="admin-input" />
            </div>
          </div>
        )}

        {/* TEAM SECTION */}
        {activeTab === 'team' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: '#fff', margin: 0 }}>Manage Team Members</h2>
              <button className="btn-secondary" onClick={() => setTeamContent({...teamContent, members: [...teamContent.members, {name:'', role:'', image:''}]})}>+ Add Member</button>
            </div>
            
            {teamContent.members.map((member, i) => (
              <div key={i} style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', position: 'relative' }}>
                <button 
                  onClick={() => { const newM = [...teamContent.members]; newM.splice(i, 1); setTeamContent({...teamContent, members: newM}); }}
                  style={{ position: 'absolute', top: '10px', right: '10px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >Remove</button>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Name</label>
                    <input type="text" value={member.name} onChange={e => { const newM = [...teamContent.members]; newM[i].name = e.target.value; setTeamContent({...teamContent, members: newM}); }} className="admin-input" />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <input type="text" value={member.role} onChange={e => { const newM = [...teamContent.members]; newM[i].role = e.target.value; setTeamContent({...teamContent, members: newM}); }} className="admin-input" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Profile Image URL or Upload</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <input type="text" value={member.image} onChange={e => { const newM = [...teamContent.members]; newM[i].image = e.target.value; setTeamContent({...teamContent, members: newM}); }} className="admin-input" style={{ flex: 1 }} />
                      <button onClick={() => triggerImageUpload('team', i)} style={{ padding: '10px', background: 'var(--accent-purple)', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer' }}>Upload Image</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PORTFOLIO SECTION */}
        {activeTab === 'portfolio' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: '#fff', margin: 0 }}>Award Winning Work</h2>
              <button className="btn-secondary" onClick={() => setPortfolioContent({...portfolioContent, items: [...portfolioContent.items, {title:'', category:'', image:''}]})}>+ Add Project</button>
            </div>
            
            {portfolioContent.items.map((item, i) => (
              <div key={i} style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', position: 'relative' }}>
                <button 
                  onClick={() => { const newP = [...portfolioContent.items]; newP.splice(i, 1); setPortfolioContent({...portfolioContent, items: newP}); }}
                  style={{ position: 'absolute', top: '10px', right: '10px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >Remove</button>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Project Title</label>
                    <input type="text" value={item.title} onChange={e => { const newP = [...portfolioContent.items]; newP[i].title = e.target.value; setPortfolioContent({...portfolioContent, items: newP}); }} className="admin-input" />
                  </div>
                  <div className="form-group">
                    <label>Category (e.g., Video Editing)</label>
                    <input type="text" value={item.category} onChange={e => { const newP = [...portfolioContent.items]; newP[i].category = e.target.value; setPortfolioContent({...portfolioContent, items: newP}); }} className="admin-input" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Thumbnail URL or Upload</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <input type="text" value={item.image} onChange={e => { const newP = [...portfolioContent.items]; newP[i].image = e.target.value; setPortfolioContent({...portfolioContent, items: newP}); }} className="admin-input" style={{ flex: 1 }} />
                      <button onClick={() => triggerImageUpload('portfolio', i)} style={{ padding: '10px', background: 'var(--accent-purple)', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer' }}>Upload Image</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button onClick={() => setIsPreviewOpen(true)} className="btn-secondary" style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}>
            Preview Changes
          </button>
          <button onClick={handleSave} className="btn-primary" disabled={saving} style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}>
            {saving ? 'Saving...' : `Save ${tabs.find(t => t.id === activeTab)?.label} Changes`}
          </button>
        </div>

      </div>

      {/* PREVIEW MODAL */}
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', zIndex: 9999, overflowY: 'auto', padding: '2rem' }}
          >
            <div style={{ maxWidth: '1200px', margin: '0 auto', background: 'var(--bg-main)', borderRadius: '12px', overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: 'rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ margin: 0, color: '#fff' }}>Live Preview: {tabs.find(t => t.id === activeTab)?.label}</h3>
                <button onClick={() => setIsPreviewOpen(false)} style={{ background: '#ff4d4f', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Close Preview</button>
              </div>

              <div style={{ padding: '2rem 0' }}>
                {activeTab === 'hero' && <HeroBlock content={heroContent} />}
                {activeTab === 'services' && <ServicesBlock content={servicesContent} />}
                {activeTab === 'portfolio' && <PortfolioBlock content={portfolioContent} />}
                {activeTab === 'clients' && <ClientsBlock content={clientsContent} />}
                
                {activeTab === 'team' && (
                  <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>{teamContent.title || 'Meet The Team'}</h1>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 4rem', fontSize: '1.2rem' }}>{teamContent.subtitle}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
                      {teamContent.members?.map((member, i) => (
                        <div key={i} className="glass" style={{ padding: '3rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                          {member.image ? <img src={member.image} alt={member.name} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }} /> : <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(138,43,226,0.2)' }} />}
                          <h3 style={{ fontSize: '1.5rem', margin: 0, color: '#fff' }}>{member.name}</h3>
                          <p style={{ color: 'var(--text-muted)', margin: 0 }}>{member.role}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'pricing' && (
                  <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>{pricingContent.title}</h1>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 4rem', fontSize: '1.2rem' }}>{pricingContent.subtitle}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
                      {pricingContent.plans?.map((plan, i) => (
                        <div key={i} className="glass" style={{ padding: '3rem 2rem', textAlign: 'left', borderTop: `4px solid ${plan.isPopular ? 'var(--accent-blue)' : i === 2 ? 'var(--accent-purple)' : 'var(--text-muted)'}`, transform: plan.isPopular ? 'scale(1.05)' : 'none' }}>
                          {plan.isPopular && <div style={{ background: 'var(--accent-blue)', color: '#000', padding: '0.2rem 1rem', borderRadius: '20px', display: 'inline-block', fontSize: '0.8rem', fontWeight: 800, marginBottom: '1rem' }}>MOST POPULAR</div>}
                          <h3 style={{ fontSize: '1.8rem', margin: '0 0 1rem' }}>{plan.name}</h3>
                          <p style={{ color: 'var(--text-muted)' }}>{plan.desc}</p>
                          <div style={{ fontSize: '3rem', fontWeight: 800, margin: '2rem 0' }}>{plan.price}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>{plan.period}</span></div>
                          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', color: 'var(--text-main)' }}>
                            {plan.features?.map((feature, idx) => <li key={idx}>✓ {feature}</li>)}
                          </ul>
                          <button className={plan.isPopular ? "btn-primary" : "btn-secondary"} style={{ width: '100%' }}>{plan.buttonText}</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'footer' && (
                  <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '4rem 2rem 2rem' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
                      <div>
                        <h2 className="text-gradient" style={{ fontSize: '2rem', margin: '0 0 1rem' }}>PRIME.</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{footerContent.description}</p>
                      </div>
                      <div>
                        <h4 style={{ color: '#fff', fontSize: '1.2rem', margin: '0 0 1.5rem' }}>Contact Us</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <li>Email: {footerContent.email}</li>
                          <li>Phone: {footerContent.phone}</li>
                          <li dangerouslySetInnerHTML={{ __html: footerContent.address }} />
                        </ul>
                      </div>
                    </div>
                  </footer>
                )}

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .form-group { display: flex; flexDirection: column; gap: 0.5rem; }
        .form-group label { color: var(--text-muted); font-size: 0.9rem; }
        .admin-input { padding: 1rem; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 8px; width: 100%; outline: none; transition: 0.3s; }
        .admin-input:focus { border-color: var(--accent-blue); }
      `}</style>
    </motion.div>
  );
};

export default ContentManager;
