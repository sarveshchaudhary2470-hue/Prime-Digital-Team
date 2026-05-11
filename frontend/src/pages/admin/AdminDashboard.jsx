import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Briefcase, CheckSquare } from 'lucide-react';

const AdminDashboard = () => {
  const [dataStats, setDataStats] = useState({
    portfolioCount: 0,
    servicesCount: 0,
    crmClients: 0,
    pendingTasks: 0
  });
  
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      let pCount = 0, sCount = 0, clientCount = 0;
      let pendingT = [];

      try {
        const contentRes = await fetch('http://localhost:5000/api/content');
        const content = await contentRes.json();
        console.log('Content API response:', content);
        if (Array.isArray(content)) {
          content.forEach(block => {
            if (block.type === 'portfolio' && block.content && block.content.items) pCount = block.content.items.length;
            if (block.type === 'services' && block.content && block.content.services) sCount = block.content.services.length;
          });
        }
      } catch (err) {
        console.error('Content fetch failed:', err);
      }

      try {
        const clientsRes = await fetch('http://localhost:5000/api/clients');
        const clients = await clientsRes.json();
        console.log('Clients API response:', clients);
        clientCount = Array.isArray(clients) ? clients.length : 0;
      } catch (err) {
        console.error('Clients fetch failed:', err);
      }

      try {
        const diaryRes = await fetch('http://localhost:5000/api/diary');
        const diary = await diaryRes.json();
        console.log('Diary API response:', diary);
        const todayDate = new Date().toISOString().split('T')[0];
        const todayDiary = diary[todayDate] || {};
        pendingT = Array.isArray(todayDiary.tasks) ? todayDiary.tasks.filter(t => !t.completed) : [];
      } catch (err) {
        console.error('Diary fetch failed:', err);
      }

      console.log('Final stats:', { pCount, sCount, clientCount, pendingTasks: pendingT.length });

      setDataStats({
        portfolioCount: pCount,
        servicesCount: sCount,
        crmClients: clientCount,
        pendingTasks: pendingT.length
      });
      
      setTodaysTasks(pendingT);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <div style={{ color: '#fff', paddingTop: '2rem' }}>Loading Dashboard Data...</div>;

  const stats = [
    { title: "Portfolio Projects", value: dataStats.portfolioCount, subtitle: "Live on website", icon: Briefcase, color: "var(--accent-blue)" },
    { title: "Services Offered", value: dataStats.servicesCount, subtitle: "Configured in CMS", icon: FileText, color: "var(--accent-purple)" },
    { title: "CRM Clients", value: dataStats.crmClients, subtitle: "Total managed clients", icon: Users, color: "var(--text-main)" },
    { title: "Pending Tasks", value: dataStats.pendingTasks, subtitle: "For today", icon: CheckSquare, color: "#ff4d4f" }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: '1000px' }}>
      <h1 className="text-gradient" style={{ fontSize: '2.5rem', margin: '0 0 2rem' }}>Overview</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ color: 'var(--text-muted)', margin: '0 0 0.5rem', fontSize: '0.9rem' }}>{stat.title}</p>
                  <h3 style={{ fontSize: '2rem', margin: 0, color: '#fff' }}>{stat.value}</h3>
                </div>
                <div style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                  <Icon size={24} color={stat.color} />
                </div>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {stat.subtitle}
              </div>
            </div>
          );
        })}
      </div>

      <div className="glass" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', margin: '0 0 1.5rem', color: '#fff' }}>Today's Action Items</h2>
        
        {todaysTasks.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {todaysTasks.map(task => (
              <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', borderLeft: `4px solid ${task.priority === 'High' ? '#ff4d4f' : task.priority === 'Medium' ? '#faad14' : '#52c41a'}` }}>
                <span style={{ color: '#fff', flex: 1 }}>{task.text}</span>
                <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', color: 'var(--text-muted)' }}>
                  {task.priority} Priority
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)', padding: '2rem 0', textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
            No pending tasks for today! Great job.
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
