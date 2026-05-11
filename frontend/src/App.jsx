import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import Clients from './pages/Clients';
import Teams from './pages/Teams';
import Pricing from './pages/Pricing';
import AdminLogin from './pages/admin/AdminLogin';
import ResetPassword from './pages/admin/ResetPassword';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ContentManager from './pages/admin/ContentManager';
import ClientManager from './pages/admin/ClientManager';
import DailyTracker from './pages/admin/DailyTracker';
import Messages from './pages/admin/Messages';
import AdminManager from './pages/admin/AdminManager';
import Footer from './components/Footer';

// A layout wrapper for public pages
const PublicLayout = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar />
    <div style={{ flex: 1 }}>{children}</div>
    <Footer />
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
        <Route path="/portfolio" element={<PublicLayout><Portfolio /></PublicLayout>} />
        <Route path="/clients" element={<PublicLayout><Clients /></PublicLayout>} />
        <Route path="/teams" element={<PublicLayout><Teams /></PublicLayout>} />
        <Route path="/pricing" element={<PublicLayout><Pricing /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><AdminLogin /></PublicLayout>} />
        <Route path="/reset-password/:token" element={<PublicLayout><ResetPassword /></PublicLayout>} />

        {/* Admin Routes with Private Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="content" element={<ContentManager />} />
          <Route path="clients" element={<ClientManager />} />
          <Route path="tracker" element={<DailyTracker />} />
          <Route path="messages" element={<Messages />} />
          <Route path="admins" element={<AdminManager />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
