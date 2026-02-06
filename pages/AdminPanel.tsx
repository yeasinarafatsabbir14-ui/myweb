import React, { useState, useEffect } from 'react';
import { ref, get, update, remove, push, onValue } from 'firebase/database';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Donor, Notice, CommunityData, BloodGroup, Campaign } from '../types';
import { 
  Trash2, Edit, Plus, Save, X, Search, Users, Image as ImageIcon, 
  Briefcase, Calendar, MessageCircle, Heart, LayoutDashboard, 
  LogOut, Bell, Menu, Shield, ChevronRight, Activity, Link as LinkIcon, Loader, CheckCircle, AlertCircle, AlertTriangle, Info
} from 'lucide-react';

// --- Shared Types ---
interface AdminViewProps {
  notify: (msg: string, type: 'success' | 'error') => void;
  confirm: (msg: string, action: () => Promise<void> | void) => void;
  setActiveView?: (view: any) => void;
}

export const AdminPanel: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'dashboard' | 'donors' | 'notices' | 'community' | 'campaigns'>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // --- Global UI State ---
  const [toast, setToast] = useState<{show: boolean, msg: string, type: 'success' | 'error'}>({show: false, msg: '', type: 'success'});
  const [modal, setModal] = useState<{show: boolean, msg: string, action: (() => Promise<void> | void) | null}>({show: false, msg: '', action: null});
  const [isProcessing, setIsProcessing] = useState(false);

  const notify = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({show: true, msg, type});
    setTimeout(() => setToast(prev => ({...prev, show: false})), 3000);
  };

  const confirm = (msg: string, action: () => Promise<void> | void) => {
    setModal({show: true, msg, action});
  };

  const handleConfirmAction = async () => {
    if (modal.action) {
        setIsProcessing(true);
        try {
            await modal.action();
        } catch (e) {
            console.error(e);
            notify('অ্যাকশন ব্যর্থ হয়েছে', 'error');
        } finally {
            setIsProcessing(false);
            setModal({show: false, msg: '', action: null});
        }
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { id: 'donors', label: 'রক্তদাতা তালিকা', icon: Users },
    { id: 'notices', label: 'নোটিশ বোর্ড', icon: Bell },
    { id: 'community', label: 'কমিউনিটি', icon: Briefcase },
    { id: 'campaigns', label: 'ক্যাম্পেইন', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans relative">
      
      {/* --- Toast Notification --- */}
      <div className={`fixed top-4 right-4 z-[60] transition-all duration-300 transform ${toast.show ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0 pointer-events-none'}`}>
        <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${toast.type === 'success' ? 'bg-white border-green-100 text-green-700' : 'bg-white border-red-100 text-red-700'}`}>
            {toast.type === 'success' ? <CheckCircle size={20} className="text-green-500" /> : <AlertCircle size={20} className="text-red-500" />}
            <span className="font-bold">{toast.msg}</span>
        </div>
      </div>

      {/* --- Confirmation Modal --- */}
      {modal.show && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all scale-100">
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">আপনি কি নিশ্চিত?</h3>
                    <p className="text-gray-500 mb-6">{modal.msg}</p>
                    <div className="flex gap-3 w-full">
                        <button 
                            onClick={() => setModal({show: false, msg: '', action: null})}
                            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition"
                        >
                            বাতিল
                        </button>
                        <button 
                            onClick={handleConfirmAction}
                            disabled={isProcessing}
                            className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition flex justify-center items-center gap-2"
                        >
                            {isProcessing ? <Loader className="animate-spin" size={18} /> : <Trash2 size={18} />}
                            মুছে ফেলুন
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col shadow-2xl`}>
        {/* Sidebar Header */}
        <div className="h-24 flex items-center px-8 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3 text-blood-500">
            <div className="bg-white/10 p-2 rounded-lg">
                <Shield size={28} className="fill-current" />
            </div>
            <div>
                <span className="text-xl font-bold text-white tracking-tight block leading-none">Admin</span>
                <span className="text-xs text-slate-500 font-medium tracking-wider uppercase">Panel</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-8 space-y-2 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id as any);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-200 font-medium group ${
                  isActive 
                    ? 'bg-gradient-to-r from-blood-600 to-blood-700 text-white shadow-lg shadow-blood-900/40 translate-x-1' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1'
                }`}
              >
                <Icon size={22} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-white transition-colors'} />
                <span className="text-base">{item.label}</span>
                {isActive && <ChevronRight size={18} className="ml-auto opacity-80" />}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer (Logout) */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/50">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-red-400 bg-red-950/20 hover:bg-red-600 hover:text-white transition-all duration-300 border border-red-900/30 hover:border-transparent group"
          >
            <LogOut size={20} className="group-hover:animate-pulse" />
            <span className="font-bold">লগ আউট</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Bar */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-10 z-10 shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-2xl font-bold text-gray-800 hidden sm:block tracking-tight">
              {menuItems.find(i => i.id === activeView)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                System Active
            </div>
            
            <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
              <div className="text-right hidden md:block leading-tight">
                <p className="text-sm font-bold text-gray-800">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Super Admin</p>
              </div>
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blood-100 to-blood-200 flex items-center justify-center text-blood-700 border-2 border-white shadow-md">
                <Shield size={22} />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50 p-4 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto animate-fade-in space-y-6">
            {activeView === 'dashboard' && <DashboardOverview setActiveView={setActiveView} notify={notify} confirm={confirm} />}
            {activeView === 'donors' && <DonorManagement notify={notify} confirm={confirm} />}
            {activeView === 'notices' && <NoticeManagement notify={notify} confirm={confirm} />}
            {activeView === 'community' && <CommunityManagement notify={notify} confirm={confirm} />}
            {activeView === 'campaigns' && <CampaignManagement notify={notify} confirm={confirm} />}
          </div>
        </main>
      </div>
    </div>
  );
};

// --- Sub Components ---

const DashboardOverview: React.FC<AdminViewProps> = ({ setActiveView }) => {
  const [stats, setStats] = useState({ donors: 0, notices: 0, campaigns: 0, availableDonors: 0 });

  useEffect(() => {
    // Real-time listener for Users/Donors
    const usersRef = ref(db, 'users');
    const unsubscribeUsers = onValue(usersRef, (snapshot) => {
        const donors = snapshot.exists() ? Object.values(snapshot.val()) as Donor[] : [];
        const donorCount = donors.filter(d => d.role === 'donor').length;
        const available = donors.filter(d => d.role === 'donor' && d.isAvailable).length;
        
        setStats(prev => ({ 
            ...prev, 
            donors: donorCount, 
            availableDonors: available 
        }));
    });

    // Real-time listener for Notices
    const noticesRef = ref(db, 'notices');
    const unsubscribeNotices = onValue(noticesRef, (snapshot) => {
        const count = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
        setStats(prev => ({ ...prev, notices: count }));
    });

    // Real-time listener for Campaigns
    const campaignsRef = ref(db, 'campaigns');
    const unsubscribeCampaigns = onValue(campaignsRef, (snapshot) => {
        const count = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
        setStats(prev => ({ ...prev, campaigns: count }));
    });

    // Cleanup listeners on unmount
    return () => {
        unsubscribeUsers();
        unsubscribeNotices();
        unsubscribeCampaigns();
    };
  }, []);

  const StatCard = ({ title, count, icon: Icon, color, onClick, subtext }: any) => (
    <div 
        onClick={onClick}
        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden"
    >
        <div className={`absolute right-0 top-0 w-24 h-24 bg-${color}-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 opacity-50`}></div>
        <div className="relative z-10">
            <p className="text-sm font-semibold text-gray-500 mb-1">{title}</p>
            <h3 className="text-4xl font-bold text-gray-800">{count}</h3>
            {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
        </div>
        <div className={`relative z-10 w-14 h-14 bg-${color}-50 text-${color}-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={28} />
        </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="মোট রক্তদাতা" count={stats.donors} icon={Users} color="blue" onClick={() => setActiveView && setActiveView('donors')} />
        <StatCard title="Active Donors" count={stats.availableDonors} icon={Activity} color="green" onClick={() => setActiveView && setActiveView('donors')} subtext="বর্তমানে রক্তদানে প্রস্তুত" />
        <StatCard title="ক্যাম্পেইন" count={stats.campaigns} icon={Calendar} color="purple" onClick={() => setActiveView && setActiveView('campaigns')} />
        <StatCard title="নোটিশ" count={stats.notices} icon={Bell} color="orange" onClick={() => setActiveView && setActiveView('notices')} />
      </div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold mb-6 backdrop-blur-md">
             <span className="w-2 h-2 bg-blood-500 rounded-full animate-pulse"></span> Admin Dashboard v2.0
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold mb-6 tracking-tight leading-tight">
             কার্যক্রম পরিচালনা করুন <br/><span className="text-blood-400">দক্ষতার সাথে।</span>
          </h1>
          <p className="text-slate-300 text-lg mb-10 leading-relaxed max-w-xl">
            ওয়েবসাইটের সকল তথ্য হালনাগাদ, ডোনার ম্যানেজমেন্ট এবং নতুন ক্যাম্পেইন পাবলিশ করার জন্য নিচের বাটনগুলো ব্যবহার করুন।
          </p>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => setActiveView && setActiveView('donors')} className="px-8 py-4 bg-blood-600 hover:bg-blood-500 rounded-xl font-bold transition-all shadow-lg shadow-blood-900/40 hover:-translate-y-1 flex items-center gap-2">
              <Users size={20} /> ডোনার খুঁজুন
            </button>
            <button onClick={() => setActiveView && setActiveView('campaigns')} className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-xl font-bold transition-all hover:-translate-y-1 flex items-center gap-2">
              <Calendar size={20} /> নতুন ক্যাম্পেইন
            </button>
          </div>
        </div>
        
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 pointer-events-none">
           <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
              <path fill="#FF0066" d="M41.4,-70.3C52.6,-62.4,60.2,-48.9,67.8,-35.6C75.4,-22.3,83,-9.1,81.4,3.4C79.8,15.9,69,27.7,58.3,37.5C47.6,47.3,37,55.1,25.3,61.9C13.6,68.7,0.8,74.5,-12.9,74.9C-26.6,75.4,-41.2,70.5,-52.5,61.6C-63.8,52.7,-71.8,39.8,-76.3,26.1C-80.8,12.4,-81.8,-2.1,-77.2,-15.1C-72.6,-28.1,-62.4,-39.6,-50.7,-47.4C-39,-55.1,-25.8,-59.1,-13.3,-60.9C-0.8,-62.8,11.7,-62.5,23.3,-62.3" transform="translate(100 100)" />
           </svg>
        </div>
      </div>
    </div>
  );
};

const DonorManagement: React.FC<AdminViewProps> = ({ notify, confirm }) => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Donor>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => { fetchDonors(); }, []);
  const fetchDonors = async () => {
    const s = await get(ref(db, 'users'));
    if (s.exists()) setDonors(Object.values(s.val()));
  };
  const handleDelete = (uid: string) => {
    confirm('আপনি কি নিশ্চিত যে এই রক্তদাতাকে মুছে ফেলতে চান?', async () => {
        await remove(ref(db, `users/${uid}`));
        fetchDonors();
        notify('সফলভাবে মুছে ফেলা হয়েছে', 'success');
    });
  };
  const handleEdit = (d: Donor) => { setEditingId(d.uid); setEditForm(d); };
  const saveEdit = async () => {
    if (editingId && editForm) { 
        await update(ref(db, `users/${editingId}`), editForm); 
        setEditingId(null); 
        fetchDonors();
        notify('তথ্য আপডেট করা হয়েছে', 'success');
    }
  };

  const filteredDonors = donors.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (d.phone && d.phone.includes(searchTerm)) ||
                          (d.area && d.area.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesGroup = filterGroup ? d.bloodGroup === filterGroup : true;
    const matchesStatus = filterStatus === 'all' ? true : filterStatus === 'available' ? d.isAvailable : !d.isAvailable;
    return matchesSearch && matchesGroup && matchesStatus;
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-end">
            <div>
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Users className="text-blood-600" /> রক্তদাতা তালিকা
                </h3>
                <p className="text-sm text-gray-500 mt-1">মোট {filteredDonors.length} জন ডোনার পাওয়া গেছে</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
                 <input className="border p-2 rounded-lg text-sm w-full md:w-64" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                 <select className="border p-2 rounded-lg text-sm" value={filterGroup} onChange={e => setFilterGroup(e.target.value)}>
                    <option value="">Group</option>
                    {Object.values(BloodGroup).map(bg => <option key={bg} value={bg}>{bg}</option>)}
                 </select>
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700 uppercase font-bold">
                    <tr><th className="p-4">Name</th><th className="p-4">Group</th><th className="p-4">Status</th><th className="p-4">Contact</th><th className="p-4 text-center">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filteredDonors.map(d => (
                        <tr key={d.uid} className="hover:bg-gray-50 transition">
                            <td className="p-4 font-medium">
                                {editingId === d.uid ? <input className="border p-1 w-full rounded" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} /> : <div>{d.name}<div className="text-xs text-gray-400">{d.area}</div></div>}
                            </td>
                            <td className="p-4">
                                {editingId === d.uid ? <input className="border p-1 w-full rounded" value={editForm.bloodGroup} onChange={e => setEditForm({...editForm, bloodGroup: e.target.value})} /> : <span className="font-bold text-blood-700 bg-blood-50 px-2 py-1 rounded">{d.bloodGroup}</span>}
                            </td>
                            <td className="p-4">
                                {editingId === d.uid ? <input type="checkbox" checked={editForm.isAvailable} onChange={e => setEditForm({...editForm, isAvailable: e.target.checked})} /> : <span className={`px-2 py-1 rounded-full text-xs ${d.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{d.isAvailable ? 'Ready' : 'Off'}</span>}
                            </td>
                            <td className="p-4 font-mono text-gray-600">{editingId === d.uid ? <input className="border p-1 w-full rounded" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} /> : d.phone}</td>
                            <td className="p-4 flex justify-center gap-2">
                                {editingId === d.uid ? <button onClick={saveEdit} className="p-2 text-green-600 bg-green-50 rounded"><Save size={16}/></button> : <button onClick={() => handleEdit(d)} className="p-2 text-blue-600 bg-blue-50 rounded"><Edit size={16}/></button>}
                                <button onClick={() => handleDelete(d.uid)} className="p-2 text-red-600 bg-red-50 rounded"><Trash2 size={16}/></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

const NoticeManagement: React.FC<AdminViewProps> = ({ notify, confirm }) => {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [newNotice, setNewNotice] = useState({ title: '', message: '' });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Notice>>({});
    useEffect(() => { fetchNotices(); }, []);
    const fetchNotices = () => { get(ref(db, 'notices')).then(s => setNotices(s.exists() ? Object.keys(s.val()).map(k => ({id:k, ...s.val()[k]})).reverse() : [])) };
    
    const addNotice = async () => { 
        if(!newNotice.title) return; 
        await push(ref(db, 'notices'), {...newNotice, date: new Date().toLocaleDateString('bn-BD')}); 
        setNewNotice({title:'', message:''}); 
        fetchNotices(); 
        notify('নোটিশ প্রকাশিত হয়েছে', 'success');
    };
    
    const deleteNotice = (id:string) => { 
        confirm('আপনি কি এই নোটিশটি মুছে ফেলতে চান?', async () => { 
            await remove(ref(db, `notices/${id}`)); 
            fetchNotices(); 
            notify('নোটিশ মুছে ফেলা হয়েছে', 'success');
        });
    };
    
    const saveEdit = async () => { 
        if(editingId){ 
            await update(ref(db, `notices/${editingId}`), editForm); 
            setEditingId(null); 
            fetchNotices(); 
            notify('নোটিশ আপডেট হয়েছে', 'success');
        }
    };

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
                {notices.map(n => (
                    <div key={n.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative group">
                        <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition flex gap-2">
                             <button onClick={() => {setEditingId(n.id); setEditForm(n)}} className="p-1.5 bg-blue-50 text-blue-600 rounded"><Edit size={16}/></button>
                             <button onClick={() => deleteNotice(n.id)} className="p-1.5 bg-red-50 text-red-600 rounded"><Trash2 size={16}/></button>
                        </div>
                        {editingId === n.id ? (
                            <div className="space-y-2">
                                <input className="border w-full p-2 rounded" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} />
                                <textarea className="border w-full p-2 rounded" value={editForm.message} onChange={e => setEditForm({...editForm, message: e.target.value})} />
                                <button onClick={saveEdit} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Update</button>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-start mb-2 pr-16">
                                    <h4 className="font-bold text-gray-800">{n.title}</h4>
                                    <span className="text-xs text-gray-400 border px-2 py-0.5 rounded">{n.date}</span>
                                </div>
                                <p className="text-gray-600 text-sm">{n.message}</p>
                            </>
                        )}
                    </div>
                ))}
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                <h4 className="font-bold mb-4 flex items-center gap-2"><Plus size={18}/> New Notice</h4>
                <div className="space-y-3">
                    <input className="w-full border p-2 rounded-lg" placeholder="Title" value={newNotice.title} onChange={e => setNewNotice({...newNotice, title: e.target.value})} />
                    <textarea className="w-full border p-2 rounded-lg min-h-[100px]" placeholder="Message" value={newNotice.message} onChange={e => setNewNotice({...newNotice, message: e.target.value})} />
                    <button onClick={addNotice} className="w-full bg-blood-600 text-white py-2 rounded-lg font-bold">Publish</button>
                </div>
            </div>
        </div>
    )
};

const CommunityManagement: React.FC<AdminViewProps> = ({ notify, confirm }) => {
  const [data, setData] = useState<CommunityData>({ partners: [] });
  const [newPartner, setNewPartner] = useState({ name: '', imageUrl: '' });

  useEffect(() => {
    fetchCommunity();
  }, []);

  const fetchCommunity = () => {
    get(ref(db, 'community')).then(s => {
      if(s.exists()) setData(s.val());
    });
  };

  const addPartner = async () => {
    if (!newPartner.name || !newPartner.imageUrl) return;
    const currentList = data.partners || [];
    const newData = { ...data, partners: [...currentList, newPartner] };
    await update(ref(db, 'community'), newData);
    setData(newData);
    setNewPartner({ name: '', imageUrl: '' });
    notify('পার্টনার যোগ করা হয়েছে', 'success');
  };

  const deletePartner = (index: number) => {
    confirm('মুছে ফেলতে চান?', async () => {
        const updated = [...(data.partners || [])];
        updated.splice(index, 1);
        const newData = { ...data, partners: updated };
        await update(ref(db, 'community'), newData);
        setData(newData);
        notify('মুছে ফেলা হয়েছে', 'success');
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
        {/* Partners Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="font-bold text-lg mb-6 flex items-center gap-2 border-b pb-4 text-gray-800">
                <Briefcase size={20} className="text-blood-600"/> সহযোগী সংগঠন
            </h4>
            
            {/* Add Form */}
            <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <input 
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blood-500 transition" 
                    placeholder="সংগঠনের নাম" 
                    value={newPartner.name} 
                    onChange={e => setNewPartner({...newPartner, name: e.target.value})} 
                />
                <div className="flex gap-2">
                    <input 
                        className="flex-1 p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blood-500 transition" 
                        placeholder="লোগো URL" 
                        value={newPartner.imageUrl} 
                        onChange={e => setNewPartner({...newPartner, imageUrl: e.target.value})} 
                    />
                    <button onClick={addPartner} className="bg-blood-600 text-white px-4 py-2.5 rounded-lg hover:bg-blood-700 transition">
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-1">
                {data.partners?.map((p, i) => (
                    <div key={i} className="relative bg-white p-4 rounded-xl border border-gray-100 flex flex-col items-center group hover:shadow-md transition">
                        <div className="h-16 w-full flex items-center justify-center mb-2">
                            <img src={p.imageUrl} alt={p.name} className="max-h-full max-w-full object-contain" />
                        </div>
                        <span className="text-xs font-bold text-center text-gray-700 truncate w-full">{p.name}</span>
                        <button onClick={() => deletePartner(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition scale-75 group-hover:scale-100">
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

const CampaignManagement: React.FC<AdminViewProps> = ({ notify, confirm }) => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [form, setForm] = useState({ title: '', description: '', imageUrl: '' });
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        const r = ref(db, 'campaigns');
        onValue(r, (snapshot) => {
            const d = snapshot.val();
            if (d) setCampaigns(Object.keys(d).map(k => ({ id: k, ...d[k] })).reverse());
            else setCampaigns([]);
        });
    }, []);

    const handleSubmit = async () => {
        if(!form.title) { notify('ক্যাম্পেইনের নাম দিন', 'error'); return; }
        if(!form.imageUrl) { notify('ছবির URL দিন', 'error'); return; }

        try {
            const campaignData = { ...form };

            if (editingId) {
                await update(ref(db, `campaigns/${editingId}`), campaignData);
                notify('ক্যাম্পেইন আপডেট হয়েছে', 'success');
            } else {
                await push(ref(db, 'campaigns'), {
                    ...campaignData,
                    date: new Date().toISOString()
                });
                notify('ক্যাম্পেইন পোস্ট করা হয়েছে', 'success');
            }
            
            resetForm();

        } catch (error: any) {
            console.error("Campaign Upload Error:", error);
            notify('আপলোড ব্যর্থ হয়েছে: ' + (error.message || 'Unknown error'), 'error');
        }
    };

    const resetForm = () => {
        setForm({ title: '', description: '', imageUrl: '' });
        setPreviewUrl('');
        setEditingId(null);
    }

    const handleEdit = (c: Campaign) => {
        setEditingId(c.id);
        setForm({ title: c.title, description: c.description, imageUrl: c.imageUrl });
        setPreviewUrl(c.imageUrl);
        document.getElementById('campaign-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDelete = (id: string) => {
        confirm('আপনি কি এই ক্যাম্পেইনটি মুছে ফেলতে চান?', async () => {
            await remove(ref(db, `campaigns/${id}`));
            notify('ক্যাম্পেইন মুছে ফেলা হয়েছে', 'success');
        });
    };

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <div id="campaign-form" className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-4">
                    <h4 className="font-bold text-xl mb-6 text-gray-800 flex items-center gap-2 border-b pb-4">
                        {editingId ? <Edit size={22} className="text-blue-600"/> : <Plus size={22} className="text-blood-600"/>}
                        {editingId ? 'Edit Campaign' : 'New Campaign'}
                    </h4>
                    
                    <div className="space-y-5">
                        
                        <div>
                            <label className="text-sm font-bold text-gray-700 block mb-1">Image URL</label>
                            <div className="flex gap-2 relative">
                                <LinkIcon className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                <input 
                                    className="w-full border pl-10 pr-3 py-3 rounded-xl focus:ring-2 focus:ring-blood-500 outline-none font-mono text-sm text-gray-600" 
                                    value={form.imageUrl} 
                                    onChange={e => {
                                        setForm({...form, imageUrl: e.target.value});
                                        setPreviewUrl(e.target.value);
                                    }} 
                                    placeholder="https://example.com/image.jpg" 
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1 ml-1">সরাসরি ইমেজের লিংক দিন (যেমন: Google Photos, Imgur ইত্যাদি)</p>
                        </div>

                        {previewUrl && (
                             <div className="relative">
                                <img 
                                    src={previewUrl} 
                                    alt="Preview" 
                                    className="w-full h-48 object-cover rounded-lg shadow-sm bg-gray-50 border border-gray-200" 
                                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL')}
                                />
                            </div>
                        )}

                        <div>
                            <label className="text-sm font-bold text-gray-700 block mb-1">Title</label>
                            <input className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blood-500 outline-none" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Campaign Title" />
                        </div>
                        
                        <div>
                            <label className="text-sm font-bold text-gray-700 block mb-1">Description</label>
                            <textarea className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blood-500 outline-none min-h-[120px]" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Details..." />
                        </div>

                        <div className="flex gap-3">
                             {editingId && (
                                <button 
                                    onClick={resetForm}
                                    className="px-4 py-3.5 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
                                >
                                    Cancel
                                </button>
                             )}
                            <button 
                                onClick={handleSubmit} 
                                className={`flex-1 py-3.5 rounded-xl font-bold text-white shadow-lg transition flex items-center justify-center gap-2 ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blood-600 hover:bg-blood-700'}`}
                            >
                                {editingId ? 'Update' : 'Post'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
                 {campaigns.map(c => (
                    <div key={c.id} className={`bg-white border rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-lg transition group ${editingId === c.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-100'}`}>
                        <div className="w-full md:w-64 h-56 md:h-auto shrink-0 relative bg-gray-100">
                            <img src={c.imageUrl} alt={c.title} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image')} />
                             {editingId === c.id && (
                                <div className="absolute inset-0 bg-blue-900/20 flex items-center justify-center">
                                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow">Editing</span>
                                </div>
                             )}
                        </div>
                        <div className="p-6 flex flex-col justify-between w-full">
                            <div>
                                <h5 className="font-bold text-xl text-gray-800 mb-2">{c.title}</h5>
                                <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">{c.description}</p>
                            </div>
                            <div className="flex flex-wrap justify-between items-center mt-4 pt-4 border-t border-gray-50 gap-4">
                                <span className="text-xs font-mono text-gray-400">{new Date(c.date).toLocaleDateString()}</span>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleEdit(c)} 
                                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium transition"
                                    >
                                        <Edit size={16} /> Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(c.id)} 
                                        className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-medium transition"
                                    >
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {campaigns.length === 0 && (
                    <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100">
                        <Calendar size={48} className="mx-auto mb-3 opacity-50" />
                        <p>No campaigns found</p>
                    </div>
                )}
            </div>
        </div>
    )
}