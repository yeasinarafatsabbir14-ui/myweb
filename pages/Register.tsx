import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, db } from '../firebase';
import { BloodGroup } from '../types';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, GraduationCap, Calendar, Lock, Droplet, ArrowRight, Activity, AlertCircle, Settings } from 'lucide-react';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bloodGroup: 'A+',
    area: '',
    institution: '',
    lastDonationDate: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [configError, setConfigError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setConfigError(false);
    
    if (formData.password !== formData.confirmPassword) {
      setError('পাসওয়ার্ড মিলছে না');
      return;
    }

    if (formData.password.length < 6) {
      setError('পাসওয়ার্ড কমপক্ষে ৬ সংখ্যার হতে হবে');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Save additional data to Realtime DB
      await set(ref(db, 'users/' + user.uid), {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        bloodGroup: formData.bloodGroup,
        area: formData.area,
        institution: formData.institution,
        lastDonationDate: formData.lastDonationDate,
        isAvailable: true,
        role: 'donor'
      });

      navigate('/dashboard');
    } catch (err: any) {
      console.error("Registration Error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('এই ইমেইল ইতিমধ্যে ব্যবহৃত হয়েছে');
      } else if (err.code === 'auth/configuration-not-found') {
        setConfigError(true);
        setError('Firebase Authentication সক্রিয় করা হয়নি।');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('রেজিস্ট্রেশন সাময়িকভাবে বন্ধ আছে। (Email/Password Provider Disabled)');
      } else if (err.code === 'auth/weak-password') {
        setError('পাসওয়ার্ডটি খুব দুর্বল। কমপক্ষে ৬ সংখ্যার শক্তিশালী পাসওয়ার্ড দিন।');
      } else {
        setError('নিবন্ধন ব্যর্থ হয়েছে। আবার চেষ্টা করুন। (' + err.message + ')');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 flex items-center justify-center">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side - Banner/Info */}
        <div className="md:w-1/3 bg-blood-900 text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <Activity size={400} className="absolute -right-20 -bottom-20" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">স্বাগতম!</h2>
            <p className="text-blood-200 mb-8 leading-relaxed">
              রক্তদাতা হিসেবে নিবন্ধন করুন এবং মানবতার সেবায় অংশ নিন। আপনার রক্তে বাঁচবে একটি প্রাণ।
            </p>
            
            <div className="space-y-4">
               <div className="flex items-center space-x-3 text-sm text-blood-100">
                  <div className="bg-blood-800 p-2 rounded-full"><Droplet size={16} /></div>
                  <span>সহজ ডোনেশন প্রসেস</span>
               </div>
               <div className="flex items-center space-x-3 text-sm text-blood-100">
                  <div className="bg-blood-800 p-2 rounded-full"><Activity size={16} /></div>
                  <span>হেলথ চেকআপ সুবিধা</span>
               </div>
               <div className="flex items-center space-x-3 text-sm text-blood-100">
                  <div className="bg-blood-800 p-2 rounded-full"><User size={16} /></div>
                  <span>কমিউনিটি নেটওয়ার্কিং</span>
               </div>
            </div>
          </div>

          <div className="relative z-10 mt-12">
            <p className="text-sm text-blood-300">ইতিমধ্যে অ্যাকাউন্ট আছে?</p>
            <Link to="/login" className="inline-block mt-2 font-bold hover:text-white transition flex items-center gap-1">
              লগইন করুন <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-2/3 p-8 md:p-12 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="bg-blood-100 text-blood-600 p-2 rounded-lg"><User size={24} /></span>
            ডোনার রেজিস্ট্রেশন
          </h2>
          
          {configError && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded">
                <div className="flex items-center gap-2 text-yellow-800 font-bold mb-2">
                  <Settings size={20} />
                  <span>সেটআপ প্রয়োজন</span>
                </div>
                <div className="text-sm text-yellow-800 space-y-2">
                  <p>এই প্রজেক্টের জন্য Firebase Authentication চালু নেই।</p>
                  <ol className="list-decimal list-inside space-y-1 ml-1">
                    <li>Firebase Console এ যান</li>
                    <li><strong>Authentication</strong> মেনুতে ক্লিক করুন</li>
                    <li><strong>Sign-in method</strong> ট্যাবে যান</li>
                    <li><strong>Email/Password</strong> সিলেক্ট করে <strong>Enable</strong> করুন</li>
                  </ol>
                </div>
              </div>
          )}

          {!configError && error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 text-sm flex items-start animate-fade-in">
               <AlertCircle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
               <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Personal Info */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-4 border-b pb-2">ব্যক্তিগত তথ্য</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative group">
                  <User className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blood-600 transition" size={18} />
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="পুরো নাম" 
                    required 
                    onChange={handleChange} 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blood-500 focus:border-transparent transition text-gray-700 outline-none" 
                  />
                </div>
                <div className="relative group">
                  <Droplet className="absolute left-3 top-3 text-blood-500 group-focus-within:text-blood-600 transition" size={18} />
                  <select 
                    name="bloodGroup" 
                    onChange={handleChange} 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blood-500 focus:border-transparent transition text-gray-700 outline-none appearance-none cursor-pointer"
                  >
                    {Object.values(BloodGroup).map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                  <div className="absolute right-3 top-3 pointer-events-none text-gray-400">▼</div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-4 border-b pb-2">যোগাযোগের তথ্য</h3>
              <div className="grid md:grid-cols-2 gap-4">
                 <div className="relative group">
                  <Phone className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blood-600 transition" size={18} />
                  <input 
                    type="tel" 
                    name="phone" 
                    placeholder="মোবাইল নম্বর" 
                    required 
                    onChange={handleChange} 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blood-500 focus:border-transparent transition text-gray-700 outline-none" 
                  />
                </div>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blood-600 transition" size={18} />
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="ইমেইল অ্যাড্রেস" 
                    required 
                    onChange={handleChange} 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blood-500 focus:border-transparent transition text-gray-700 outline-none" 
                  />
                </div>
                <div className="relative group">
                  <MapPin className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blood-600 transition" size={18} />
                  <input 
                    type="text" 
                    name="area" 
                    placeholder="বর্তমান ঠিকানা / এলাকা" 
                    required 
                    onChange={handleChange} 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blood-500 focus:border-transparent transition text-gray-700 outline-none" 
                  />
                </div>
                <div className="relative group">
                  <GraduationCap className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blood-600 transition" size={18} />
                  <input 
                    type="text" 
                    name="institution" 
                    placeholder="শিক্ষা প্রতিষ্ঠান / পেশা" 
                    required 
                    onChange={handleChange} 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blood-500 focus:border-transparent transition text-gray-700 outline-none" 
                  />
                </div>
              </div>
            </div>

            {/* Other Info */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-4 border-b pb-2">অন্যান্য</h3>
              <div className="grid md:grid-cols-2 gap-4">
                 <div className="relative group">
                  <Calendar className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blood-600 transition" size={18} />
                  <div className="absolute left-10 top-0.5 text-[10px] text-gray-400 font-bold">শেষ রক্তদানের তারিখ</div>
                  <input 
                    type="date" 
                    name="lastDonationDate" 
                    onChange={handleChange} 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blood-500 focus:border-transparent transition text-gray-700 outline-none pt-4" 
                  />
                </div>
              </div>
            </div>

            {/* Security */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-4 border-b pb-2">নিরাপত্তা</h3>
              <div className="grid md:grid-cols-2 gap-4">
                 <div className="relative group">
                  <Lock className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blood-600 transition" size={18} />
                  <input 
                    type="password" 
                    name="password" 
                    placeholder="পাসওয়ার্ড" 
                    required 
                    onChange={handleChange} 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blood-500 focus:border-transparent transition text-gray-700 outline-none" 
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blood-600 transition" size={18} />
                  <input 
                    type="password" 
                    name="confirmPassword" 
                    placeholder="পাসওয়ার্ড নিশ্চিত করুন" 
                    required 
                    onChange={handleChange} 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blood-500 focus:border-transparent transition text-gray-700 outline-none" 
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
                <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-blood-700 to-blood-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition duration-200 flex justify-center items-center gap-2 text-lg"
                >
                {loading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                    <>নিবন্ধন সম্পন্ন করুন <ArrowRight size={20} /></>
                )}
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};