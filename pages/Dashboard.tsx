import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { ref, update, onValue } from 'firebase/database';
import { Notice } from '../types';
import { AlertTriangle, User, Calendar, MapPin, Phone, Droplet, Clock, Heart, CheckCircle, ShieldCheck, Activity, AlertCircle } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [newDate, setNewDate] = useState('');
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [updateError, setUpdateError] = useState('');

  // Helper to calculate availability
  const calculateAvailability = (lastDateStr: string) => {
    if (!lastDateStr) return { isAvailable: true, daysRemaining: 0 };
    
    const lastDate = new Date(lastDateStr);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    const gap = 90; // 90 days rule

    if (diffDays >= gap) {
      return { isAvailable: true, daysRemaining: 0 };
    } else {
      return { isAvailable: false, daysRemaining: gap - diffDays };
    }
  };

  useEffect(() => {
    if (!user) return;
    
    // Fetch notices
    const noticesRef = ref(db, 'notices');
    const unsubscribe = onValue(noticesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const noticesList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setNotices(noticesList.reverse());
      } else {
        setNotices([]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Sync DB status with calculated status
  useEffect(() => {
    if (user && user.role === 'donor') {
      const { isAvailable } = calculateAvailability(user.lastDonationDate);
      // Only update if DB status is different from calculated status to avoid loops
      if (user.isAvailable !== isAvailable) {
        update(ref(db, `users/${user.uid}`), { isAvailable })
          .catch(err => console.error("Auto-update status failed", err));
      }
    }
  }, [user]);

  const handleDateUpdate = async () => {
    if (!user || !newDate) return;
    setUpdateError('');
    try {
      await update(ref(db, `users/${user.uid}`), {
        lastDonationDate: newDate
      });
      setIsEditingDate(false);
      // Determine new status immediately for UI feedback (optional, as useEffect will catch it)
      const { isAvailable } = calculateAvailability(newDate);
      await update(ref(db, `users/${user.uid}`), { isAvailable });
      window.location.reload(); // Simple reload to refresh context
    } catch (err) {
      console.error(err);
      setUpdateError('আপডেট ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  if (!user) return <div className="p-10 text-center">লোড হচ্ছে...</div>;

  const { isAvailable, daysRemaining } = calculateAvailability(user.lastDonationDate);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blood-800 to-blood-600 rounded-2xl p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">স্বাগতম, {user.name}</h1>
          <p className="text-blood-100 opacity-90">রক্তদান একটি মহৎ কাজ, আপনার অবদান অনস্বীকার্য।</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-4">
             <div className="text-center px-6 py-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                <span className="block text-2xl font-bold">{user.bloodGroup}</span>
                <span className="text-xs text-blood-100">ব্লাড গ্রুপ</span>
             </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile & Status */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Status Card */}
          <div className={`rounded-xl shadow-lg overflow-hidden border-t-4 ${isAvailable ? 'border-green-500 bg-white' : 'border-red-500 bg-white'}`}>
             <div className={`p-4 text-center ${isAvailable ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2 ${isAvailable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {isAvailable ? <CheckCircle size={32} /> : <Clock size={32} />}
                </div>
                <h3 className={`text-xl font-bold ${isAvailable ? 'text-green-800' : 'text-red-800'}`}>
                  {isAvailable ? 'আপনি রক্তদানে সক্ষম' : 'সাময়িক বিরতি'}
                </h3>
                {!isAvailable && (
                  <p className="text-sm text-red-600 mt-1">
                    আরো {daysRemaining} দিন অপেক্ষা করতে হবে
                  </p>
                )}
             </div>
             
             <div className="p-6">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                   <div className="text-gray-600 flex items-center gap-2">
                      <Calendar size={18} /> শেষ দান:
                   </div>
                   <div className="font-bold text-gray-800">{user.lastDonationDate || 'কখনো না'}</div>
                </div>

                {isEditingDate ? (
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 animate-fade-in">
                    <label className="text-xs text-gray-500 block mb-1">তারিখ নির্বাচন করুন:</label>
                    <input 
                      type="date" 
                      className="w-full border rounded p-2 text-sm mb-2"
                      onChange={(e) => setNewDate(e.target.value)}
                    />
                    {updateError && (
                      <div className="flex items-center gap-1 text-red-600 text-xs mb-2">
                        <AlertCircle size={12} /> {updateError}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button 
                        onClick={handleDateUpdate}
                        className="flex-1 bg-blood-600 text-white py-1.5 rounded text-sm hover:bg-blood-700"
                      >
                        আপডেট
                      </button>
                      <button 
                        onClick={() => { setIsEditingDate(false); setUpdateError(''); }}
                        className="flex-1 bg-gray-200 text-gray-700 py-1.5 rounded text-sm hover:bg-gray-300"
                      >
                        বাতিল
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsEditingDate(true)}
                    className="w-full py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition text-sm font-medium"
                  >
                    সর্বশেষ রক্তদানের তারিখ আপডেট করুন
                  </button>
                )}
                
                <p className="text-xs text-center text-gray-400 mt-3">
                  * তারিখ পরিবর্তনের সাথে সাথে আপনার স্ট্যাটাস অটোমেটিক আপডেট হবে।
                </p>
             </div>
          </div>

          {/* Profile Details */}
          <div className="bg-white rounded-xl shadow-lg p-6">
             <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                <User size={20} className="text-blood-600" /> ব্যক্তিগত তথ্য
             </h3>
             <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                   <MapPin size={16} className="text-gray-400 mt-0.5" />
                   <div>
                      <span className="block text-gray-500 text-xs">ঠিকানা / এলাকা</span>
                      <span className="font-medium text-gray-800">{user.area}</span>
                   </div>
                </div>
                <div className="flex items-start gap-3">
                   <Phone size={16} className="text-gray-400 mt-0.5" />
                   <div>
                      <span className="block text-gray-500 text-xs">মোবাইল</span>
                      <span className="font-medium text-gray-800">{user.phone}</span>
                   </div>
                </div>
                {user.institution && (
                   <div className="flex items-start gap-3">
                      <div className="mt-0.5"><Activity size={16} className="text-gray-400" /></div>
                      <div>
                         <span className="block text-gray-500 text-xs">প্রতিষ্ঠান</span>
                         <span className="font-medium text-gray-800">{user.institution}</span>
                      </div>
                   </div>
                )}
             </div>
          </div>
        </div>

        {/* Center & Right: Notices & Instructions */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Notices */}
          <div className="bg-white rounded-xl shadow-lg p-6 min-h-[250px]">
            <h3 className="text-xl font-bold mb-6 flex items-center text-gray-800 border-b pb-4">
              <AlertTriangle className="text-orange-500 mr-2" />
              জরুরি নোটিশ বোর্ড
            </h3>

            <div className="space-y-4">
              {notices.length > 0 ? (
                notices.map((notice) => (
                  <div key={notice.id} className="bg-red-50 border-l-4 border-red-500 p-4 rounded hover:bg-red-100 transition">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-red-800">{notice.title}</h4>
                      <span className="text-xs bg-white px-2 py-1 rounded text-red-500 font-mono shadow-sm">{notice.date}</span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">{notice.message}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 opacity-50">
                   <ShieldCheck size={48} className="mx-auto text-gray-300 mb-2" />
                   <p className="text-gray-500">বর্তমানে কোনো জরুরি নোটিশ নেই।</p>
                </div>
              )}
            </div>
          </div>

          {/* Why Donate Blood Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
               <Heart className="text-blood-600 fill-current" />
               রক্তদান কেন করবেন?
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-6">
               <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 text-pink-600">
                     <Heart size={24} />
                  </div>
                  <div>
                     <h4 className="font-bold text-gray-800 mb-1">জীবন বাঁচায়</h4>
                     <p className="text-sm text-gray-600 leading-relaxed">আপনার এক ব্যাগ রক্ত একজন মুমূর্ষু রোগীর জীবন বাঁচাতে পারে। এটি মানবতার সর্বোচ্চ সেবা।</p>
                  </div>
               </div>
               
               <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                     <Activity size={24} />
                  </div>
                  <div>
                     <h4 className="font-bold text-gray-800 mb-1">হার্ট অ্যাটাকের ঝুঁকি কমায়</h4>
                     <p className="text-sm text-gray-600 leading-relaxed">নিয়মিত রক্তদান রক্তে আয়রনের ভারসাম্য বজায় রাখে, যা হৃদরোগ ও স্ট্রোকের ঝুঁকি কমায়।</p>
                  </div>
               </div>

               <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-600">
                     <Droplet size={24} />
                  </div>
                  <div>
                     <h4 className="font-bold text-gray-800 mb-1">নতুন রক্তকণিকা তৈরি</h4>
                     <p className="text-sm text-gray-600 leading-relaxed">রক্তদানের পর শরীরে নতুন লোহিত রক্তকণিকা তৈরি হয়, যা শরীরকে সুস্থ ও সতেজ রাখে।</p>
                  </div>
               </div>

               <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 text-purple-600">
                     <ShieldCheck size={24} />
                  </div>
                  <div>
                     <h4 className="font-bold text-gray-800 mb-1">বিনামূল্যে স্বাস্থ্য পরীক্ষা</h4>
                     <p className="text-sm text-gray-600 leading-relaxed">রক্তদানের আগে আপনার পালস, প্রেশার, হিমোগ্লোবিন এবং কিছু ভাইরাস স্ক্রিনিং বিনামূল্যে করা হয়।</p>
                  </div>
               </div>
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-500 italic">
               "রক্তদান করলে শরীরের কোনো ক্ষতি হয় না, বরং মানসিক তৃপ্তি পাওয়া যায়।"
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};