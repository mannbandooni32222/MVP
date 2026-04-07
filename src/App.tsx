import React, { useState, useEffect } from 'react';
import { format, isSameDay, startOfToday } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Filter, HelpCircle, LogOut, ChevronRight, Send, CheckCircle2 } from 'lucide-react';
import { Task, User, Filters, Status } from './types';
import { parseBrainDump } from './utils/parser';
import Calendar from './components/Calendar';
import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';
import Onboarding from './components/Onboarding';

export default function App() {
  // State
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [isAuthReady, setIsAuthReady] = useState(false);
  
  // UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBrainDumpOpen, setIsBrainDumpOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [brainDumpText, setBrainDumpText] = useState('');
  const [filters, setFilters] = useState<Filters>({
    status: 'all',
    priority: 'all',
    category: 'all'
  });

  // Load persistence
  useEffect(() => {
    const savedUser = localStorage.getItem('sp_user');
    const savedTasks = localStorage.getItem('sp_tasks');
    
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    
    setIsAuthReady(true);
  }, []);

  // Save persistence
  useEffect(() => {
    if (user) localStorage.setItem('sp_user', JSON.stringify(user));
    localStorage.setItem('sp_tasks', JSON.stringify(tasks));
  }, [user, tasks]);

  const handleOnboarding = (username: string) => {
    setUser({ username });
  };

  const handleToggleStatus = (id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const statuses: Status[] = ['pending', 'in-progress', 'completed'];
        const currentIndex = statuses.indexOf(task.status);
        const nextStatus = statuses[(currentIndex + 1) % statuses.length];
        return { ...task, status: nextStatus };
      }
      return task;
    }));
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...taskData } : t));
    } else {
      // This path is used for single manual adds if needed, but we focus on brain dump
    }
    setEditingTask(null);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleConvertBrainDump = () => {
    if (!brainDumpText.trim()) return;
    const newTasks = parseBrainDump(brainDumpText, selectedDate.toISOString().split('T')[0]);
    setTasks(prev => [...prev, ...newTasks]);
    setBrainDumpText('');
    setIsBrainDumpOpen(false);
  };

  // Logic
  const today = startOfToday();
  const isPastDate = selectedDate < today && !isSameDay(selectedDate, today);
  
  const filteredTasks = tasks.filter(task => {
    const dateMatch = task.date === selectedDate.toISOString().split('T')[0];
    const statusMatch = filters.status === 'all' || task.status === filters.status;
    const priorityMatch = filters.priority === 'all' || task.priority === filters.priority;
    const categoryMatch = filters.category === 'all' || task.category === filters.category;
    return dateMatch && statusMatch && priorityMatch && categoryMatch;
  });

  const dailyTasks = tasks.filter(t => t.date === selectedDate.toISOString().split('T')[0]);
  const completedCount = dailyTasks.filter(t => t.status === 'completed').length;
  const progress = dailyTasks.length > 0 ? (completedCount / dailyTasks.length) * 100 : 0;

  if (!isAuthReady) return null;
  if (!user) return <Onboarding onComplete={handleOnboarding} />;

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-[#14181f] font-sans pb-24">
      {/* Header */}
      <header className="bg-white px-6 pt-8 pb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
            {format(selectedDate, 'MMMM yyyy')}
          </p>
          <h1 className="text-2xl font-black">Hello, {user.username}!</h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsSupportOpen(true)}
            className="p-2 text-gray-400 hover:text-[#2a6df4] transition-colors"
          >
            <HelpCircle size={24} />
          </button>
          <button 
            onClick={() => {
              localStorage.removeItem('sp_user');
              setUser(null);
            }}
            className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
          >
            <LogOut size={24} />
          </button>
        </div>
      </header>

      {/* Calendar */}
      <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />

      {/* Progress Bar */}
      <div className="px-6 mt-6">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Daily Progress
            </span>
            <span className="text-xs font-black text-[#2a6df4]">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-[#2a6df4]"
            />
          </div>
        </div>
      </div>

      {/* Filters & List Header */}
      <div className="px-6 mt-8 flex items-center justify-between">
        <h2 className="text-lg font-black">Tasks</h2>
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full text-xs font-bold text-gray-500 shadow-sm border border-gray-100 hover:bg-gray-50"
        >
          <Filter size={14} />
          Filters
        </button>
      </div>

      {/* Task List */}
      <div className="px-6 mt-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                isReadOnly={isPastDate}
                onToggleStatus={handleToggleStatus}
                onEdit={(t) => {
                  setEditingTask(t);
                  setIsModalOpen(true);
                }}
              />
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-gray-300" size={32} />
              </div>
              <p className="text-gray-400 font-medium">No tasks found for this day.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Button */}
      {!isPastDate && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsBrainDumpOpen(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-[#2a6df4] text-white rounded-2xl shadow-2xl shadow-[#2a6df4]/40 flex items-center justify-center z-40"
        >
          <Plus size={32} />
        </motion.button>
      )}

      {/* Brain Dump Modal */}
      <AnimatePresence>
        {isBrainDumpOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBrainDumpOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="relative w-full max-w-lg bg-white rounded-t-3xl p-6 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
              <h2 className="text-xl font-black mb-2">Brain Dump</h2>
              <p className="text-xs text-gray-400 mb-6">
                Enter your messy thoughts. We'll structure them for you.
              </p>
              <textarea
                value={brainDumpText}
                onChange={(e) => setBrainDumpText(e.target.value)}
                placeholder='e.g., "Gym at 6am high priority, call mom 5pm work"'
                rows={5}
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#2a6df4] transition-all text-sm mb-6 resize-none"
                autoFocus
              />
              <button
                onClick={handleConvertBrainDump}
                className="w-full py-4 bg-[#2a6df4] text-white font-bold rounded-2xl shadow-lg shadow-[#2a6df4]/30 hover:bg-[#1e5ad4] transition-all"
              >
                Convert to Tasks
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Filter Modal */}
      <AnimatePresence>
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="relative w-full max-w-lg bg-white rounded-t-3xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black">Filters</h2>
                <button 
                  onClick={() => {
                    setFilters({ status: 'all', priority: 'all', category: 'all' });
                    setIsFilterOpen(false);
                  }}
                  className="text-xs font-bold text-[#2a6df4]"
                >
                  Reset All
                </button>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Status</label>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'pending', 'in-progress', 'completed'].map(s => (
                      <button
                        key={s}
                        onClick={() => setFilters(f => ({ ...f, status: s as any }))}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                          filters.status === s ? 'bg-[#2a6df4] text-white' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Priority</label>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'low', 'medium', 'high'].map(p => (
                      <button
                        key={p}
                        onClick={() => setFilters(f => ({ ...f, priority: p as any }))}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                          filters.priority === p ? 'bg-[#2a6df4] text-white' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'work', 'personal', 'health'].map(c => (
                      <button
                        key={c}
                        onClick={() => setFilters(f => ({ ...f, category: c as any }))}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                          filters.category === c ? 'bg-[#2a6df4] text-white' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-full py-4 bg-[#2a6df4] text-white font-bold rounded-2xl shadow-lg shadow-[#2a6df4]/30"
              >
                Apply Filters
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Support Modal */}
      <AnimatePresence>
        {isSupportOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSupportOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-black mb-2">Help & Support</h2>
              <p className="text-sm text-gray-500 mb-6">We'd love to hear from you.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Name</label>
                  <input type="text" className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none text-sm" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Message</label>
                  <textarea className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none text-sm resize-none" rows={4} placeholder="How can we help?" />
                </div>
                <button className="w-full py-4 bg-[#2a6df4] text-white font-bold rounded-xl flex items-center justify-center gap-2">
                  <Send size={18} />
                  Send Message
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Task Edit Modal */}
      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
}
