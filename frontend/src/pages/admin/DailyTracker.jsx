import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DailyTracker = () => {
  const [currentDate, setCurrentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // For new task input
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('Medium');

  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    fetchDiary();
  }, [currentDate]);

  const fetchDiary = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/diary')
      .then(res => res.json())
      .then(data => {
        const todayData = data[currentDate];
        if (todayData) {
          setNotes(todayData.notes || '');
          setTasks(todayData.tasks || []);
        } else {
          setNotes('');
          setTasks([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load diary', err);
        setLoading(false);
      });
  };

  const saveDiary = (newNotes, newTasks) => {
    setSaving(true);
    const dataToSave = {
      notes: newNotes,
      tasks: newTasks
    };

    fetch('http://localhost:5000/api/diary/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: currentDate, data: dataToSave })
    })
    .then(res => res.json())
    .then(() => setSaving(false))
    .catch(err => {
      console.error('Failed to save', err);
      setSaving(false);
    });
  };

  // Auto-save logic for notes
  const handleNotesChange = (e) => {
    const val = e.target.value;
    setNotes(val);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      saveDiary(val, tasks);
    }, 1000); // Auto-save after 1s of no typing
  };

  const clearNotes = () => {
    if (window.confirm("Are you sure you want to delete today's notes?")) {
      setNotes('');
      saveDiary('', tasks);
    }
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const newTasks = [...tasks, { id: Date.now(), text: newTaskText, priority: newTaskPriority, completed: false }];
    setTasks(newTasks);
    setNewTaskText('');
    setNewTaskPriority('Medium');
    saveDiary(notes, newTasks);
  };

  const toggleTaskCompletion = (id) => {
    const newTasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(newTasks);
    saveDiary(notes, newTasks);
  };

  const deleteTask = (id) => {
    const newTasks = tasks.filter(t => t.id !== id);
    setTasks(newTasks);
    saveDiary(notes, newTasks);
  };

  const getPriorityColor = (priority) => {
    if (priority === 'High') return '#ff4d4f'; // Red
    if (priority === 'Medium') return '#faad14'; // Yellow
    if (priority === 'Low') return '#52c41a'; // Green
    return '#fff';
  };

  // Sort tasks: High -> Medium -> Low, and incomplete -> complete
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    
    const pVal = { 'High': 3, 'Medium': 2, 'Low': 1 };
    return pVal[b.priority] - pVal[a.priority];
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: '1400px', margin: '0 auto', height: 'calc(100vh - 150px)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', margin: '0 0 0.5rem' }}>Daily Tracker</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Your personal digital diary and priority checklist.</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: saving ? 'var(--text-muted)' : 'var(--accent-blue)', fontSize: '0.9rem', transition: '0.3s' }}>
            {saving ? 'Saving...' : 'Saved'}
          </span>
          <input 
            type="date" 
            value={currentDate} 
            onChange={(e) => setCurrentDate(e.target.value)} 
            style={{ 
              background: 'rgba(0,0,0,0.5)', 
              color: '#fff', 
              border: '1px solid rgba(255,255,255,0.1)', 
              padding: '10px 15px', 
              borderRadius: '8px',
              fontFamily: 'inherit',
              colorScheme: 'dark'
            }} 
            className="date-picker-input"
          />
        </div>
      </div>

      <style>{`
        .date-picker-input::-webkit-calendar-picker-indicator {
          cursor: pointer;
        }
      `}</style>

      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Loading Diary...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem', flex: 1, minHeight: 0 }}>
          
          {/* LEFT PANEL: DIARY / NOTEPAD */}
          <div className="glass" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>📝 Daily Notes & Thoughts</h2>
              <button 
                onClick={clearNotes}
                style={{ background: 'transparent', border: 'none', color: '#ff4d4f', cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}
                title="Delete Notes"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                <span style={{ fontSize: '0.9rem' }}>Delete</span>
              </button>
            </div>
            <textarea
              value={notes}
              onChange={handleNotesChange}
              placeholder="Start typing your thoughts, rough schedules, or meeting notes here... (It saves automatically)"
              style={{
                flex: 1,
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                fontSize: '1.1rem',
                lineHeight: '1.6',
                padding: '2rem',
                resize: 'none',
                outline: 'none',
                fontFamily: 'monospace'
              }}
            />
          </div>

          {/* RIGHT PANEL: PRIORITY CHECKLIST */}
          <div className="glass" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>✅ Priority Checklist</h2>
            </div>
            
            {/* Add Task Form */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                  type="text"
                  placeholder="What needs to be done?"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', outline: 'none' }}
                />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <select 
                    value={newTaskPriority} 
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', outline: 'none' }}
                  >
                    <option value="High">🔴 High Priority</option>
                    <option value="Medium">🟡 Medium Priority</option>
                    <option value="Low">🟢 Low Priority</option>
                  </select>
                  <button type="submit" className="btn-primary" style={{ padding: '0 1.5rem' }}>Add</button>
                </div>
              </form>
            </div>

            {/* Task List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <AnimatePresence>
                {sortedTasks.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
                    No tasks for today.
                  </motion.div>
                )}
                
                {sortedTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem',
                      background: 'rgba(0,0,0,0.4)',
                      borderRadius: '8px',
                      borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
                      opacity: task.completed ? 0.5 : 1,
                      transition: '0.3s'
                    }}
                  >
                    <input 
                      type="checkbox" 
                      checked={task.completed} 
                      onChange={() => toggleTaskCompletion(task.id)}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                    <div style={{ flex: 1, textDecoration: task.completed ? 'line-through' : 'none', color: '#fff' }}>
                      {task.text}
                    </div>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      style={{ background: 'transparent', border: 'none', color: '#ff4d4f', cursor: 'pointer', padding: '5px' }}
                      title="Delete Task"
                    >
                      ✕
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DailyTracker;
