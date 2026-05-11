import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, BarChart2, Settings, LogOut, Menu, X, ExternalLink, Users, Mail, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Force desktop viewport on admin pages
  useEffect(() => {
    const viewport = document.querySelector('meta[name="viewport"]');
    const originalContent = viewport ? viewport.getAttribute('content') : '';
    
    if (viewport) {
      viewport.setAttribute('content', 'width=1280');
    }

    // Restore responsive viewport when leaving admin
    return () => {
      if (viewport) {
        viewport.setAttribute('content', originalContent || 'width=device-width, initial-scale=1.0');
      }
    };
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Messages', path: '/admin/messages', icon: Mail },
    { name: 'Manage Clients', path: '/admin/clients', icon: Users },
    { name: 'Manage Admins', path: '/admin/admins', icon: ShieldCheck },
    { name: 'Daily Tracker', path: '/admin/tracker', icon: BarChart2 },
    { name: 'Content Manager', path: '/admin/content', icon: FileText }
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {!sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(true)}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 40,
              display: 'var(--mobile-overlay-display, none)'
            }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? '260px' : '80px' }}
        style={{
          background: 'rgba(0,0,0,0.8)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 50,
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden'
        }}
        className="admin-sidebar"
      >
        <div style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center' }}>
          {sidebarOpen && <h2 className="text-gradient" style={{ fontSize: '1.2rem', margin: 0 }}>PRIME ADMIN</h2>}
          <div onClick={() => setSidebarOpen(!sidebarOpen)} style={{ cursor: 'pointer', color: 'var(--accent-blue)' }}>
            <Menu size={24} />
          </div>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  borderRadius: '12px',
                  background: isActive ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                  color: isActive ? 'var(--accent-blue)' : 'var(--text-muted)',
                  transition: 'all 0.3s',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center'
                }}
              >
                <Icon size={20} />
                {sidebarOpen && <span style={{ fontWeight: isActive ? 600 : 400 }}>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '1rem' }}>
          <div
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              borderRadius: '12px',
              color: '#ff4d4f',
              cursor: 'pointer',
              transition: 'all 0.3s',
              justifyContent: sidebarOpen ? 'flex-start' : 'center'
            }}
            className="hover-bg-red"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        {/* Top Header */}
        <header style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: '1.5rem 2rem',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(10px)',
          position: 'sticky',
          top: 0,
          zIndex: 30
        }}>
          <Link to="/" target="_blank" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '8px 16px', fontSize: '0.9rem' }}>
            <span>View Live Site</span>
            <ExternalLink size={16} />
          </Link>
        </header>

        {/* Dynamic Route Content */}
        <div style={{ padding: '2rem', flex: 1 }}>
          <Outlet />
        </div>
      </main>

      <style>{`
        .hover-bg-red:hover { background: rgba(255, 77, 79, 0.1); }
        @media (max-width: 768px) {
          .admin-sidebar { position: fixed !important; }
          :root { --mobile-overlay-display: block; }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
