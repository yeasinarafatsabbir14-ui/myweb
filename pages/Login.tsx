import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, AlertCircle, ArrowLeft, Settings, LogIn, Shield, User, HeartPulse } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [configError, setConfigError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const { user } = useAuth(); // Watch global user state
  const navigate = useNavigate();

  // Automatic redirection when user state updates
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setConfigError(false);
    setLoading(true);

    try {
      // --- ADMIN LOGIN LOGIC ---
      if (isAdminMode) {
        // Check for specific hardcoded credentials from prompt
        if (email === 'jcd' && password === 'jcd43') {
          // Map short credentials to a secure Firebase Identity
          const adminEmail = 'admin@blood.org';
          const adminSecurePass = 'blood_jcd43_secure'; // Mapped password for Firebase (min 6 chars)

          try {
            // Try to login as existing admin
            await signInWithEmailAndPassword(auth, adminEmail, adminSecurePass);
          } catch (loginErr: any) {
            if (loginErr.code === 'auth/user-not-found' || loginErr.code === 'auth/invalid-credential') {
              // If admin doesn't exist yet, create them automatically
              const cred = await createUserWithEmailAndPassword(auth, adminEmail, adminSecurePass);
              // Set Admin Role in Database immediately
              await set(ref(db, `users/${cred.user.uid}`), {
                uid: cred.user.uid,
                name: 'Administrator',
                email: adminEmail,
                phone: '01XXXXXXXXX',
                bloodGroup: 'AB+',
                area: 'Headquarters',
                role: 'admin',
                isAvailable: true
              });
            } else {
              throw loginErr;
            }
          }
          // No need to navigate here; useEffect will handle it once auth state changes
          return;
        } else {
            throw new Error('অ্যাডমিন ক্রেডেনশিয়াল ভুল হয়েছে');
        }
      }

      // --- REGULAR DONOR LOGIN LOGIC ---
      await signInWithEmailAndPassword(auth, email, password);
      // No need to navigate here; useEffect will handle it once auth state changes

    } catch (err: any) {
      console.error("Login Error:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('ইমেইল বা পাসওয়ার্ড ভুল হয়েছে');
      } else if (err.code === 'auth/configuration-not-found') {
        setConfigError(true);
        setError('Firebase Authentication সক্রিয় করা হয়নি।');
      } else if (err.code === 'auth/network-request-failed') {
        setError('ইন্টারনেট সংযোগ পরীক্ষা করুন।');
      } else {
        setError('লগইন ব্যর্থ হয়েছে: ' + (err.message || 'অজানা ত্রুটি'));
      }
      setLoading(false); // Only stop loading on error, otherwise keep loading until redirect
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-10">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side - Form */}
        <div className="md:w-1/2 p-8 md:p-12 order-2 md:order-1">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-gray-400 hover:text-blood-600 transition mb-6 text-sm">
                <ArrowLeft size={16} className="mr-1" /> হোম পেজে ফিরে যান
            </Link>
            <h2 className={`text-3xl font-bold mb-2 flex items-center gap-2 ${isAdminMode ? 'text-gray-800' : 'text-gray-800'}`}>
              <span className={`p-2 rounded-lg ${isAdminMode ? 'bg-gray-800 text-white' : 'bg-blood-100 text-blood-600'}`}>
                {isAdminMode ? <Shield size={24} /> : <LogIn size={24} />}
              </span>
              {isAdminMode ? 'অ্যাডমিন লগইন' : 'লগইন করুন'}
            </h2>
            <p className="text-gray-500">
                {isAdminMode ? 'অ্যাডমিন প্যানেলে প্রবেশ করতে ক্রেডেনশিয়াল দিন' : 'জিয়া ব্লাড ফাউন্ডেশনে আপনাকে স্বাগতম'}
            </p>
          </div>

          <div className="space-y-6">
            {configError && !isAdminMode && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded animate-fade-in">
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
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded text-sm flex items-start animate-fade-in">
                    <AlertCircle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700 ml-1">
                        {isAdminMode ? 'ইউজার আইডি (User ID)' : 'ইমেইল'}
                    </label>
                    <div className="relative group">
                        {isAdminMode ? (
                            <User className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blood-600 transition" size={18} />
                        ) : (
                            <Mail className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blood-600 transition" size={18} />
                        )}
                        <input 
                            type="text" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blood-500 focus:border-transparent outline-none transition text-gray-800"
                            placeholder={isAdminMode ? "অ্যাডমিন আইডি" : "আপনার ইমেইল দিন"}
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700 ml-1">পাসওয়ার্ড</label>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blood-600 transition" size={18} />
                        <input 
                            type="password" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blood-500 focus:border-transparent outline-none transition text-gray-800"
                            placeholder="••••••"
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className={`w-full text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition duration-200 flex justify-center items-center gap-2 ${isAdminMode ? 'bg-gray-800 hover:bg-gray-900' : 'bg-gradient-to-r from-blood-700 to-blood-600'}`}
                >
                    {loading ? (
                        <>
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            অপেক্ষা করুন...
                        </>
                    ) : <>লগইন <ArrowLeft className="rotate-180" size={20} /></>}
                </button>
            </form>

            <div className="pt-4 text-center space-y-3">
                {!isAdminMode && (
                    <p className="text-gray-600 text-sm">
                        অ্যাকাউন্ট নেই?{' '}
                        <Link to="/register" className="text-blood-700 font-bold hover:underline">
                            এখনই রেজিস্ট্রেশন করুন
                        </Link>
                    </p>
                )}
                
                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">অথবা</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <button 
                    onClick={() => {
                        setIsAdminMode(!isAdminMode);
                        setEmail('');
                        setPassword('');
                        setError('');
                    }}
                    className={`text-sm font-semibold hover:underline flex items-center justify-center gap-1 mx-auto ${isAdminMode ? 'text-blood-600' : 'text-gray-500'}`}
                >
                    {isAdminMode ? (
                        <>
                            <ArrowLeft size={14} /> ডোনার লগইন-এ ফিরে যান
                        </>
                    ) : (
                        <>
                            <Shield size={14} /> অ্যাডমিন লগইন
                        </>
                    )}
                </button>
            </div>
          </div>
        </div>

        {/* Right Side - Visuals */}
        <div className={`md:w-1/2 relative overflow-hidden flex flex-col justify-center items-center p-12 text-center text-white order-1 md:order-2 transition-colors duration-500 ${isAdminMode ? 'bg-gray-900' : 'bg-blood-900'}`}>
            <div className="absolute inset-0 opacity-20">
                <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                </svg>
            </div>
            <div className="absolute top-0 right-0 p-12 opacity-10 animate-pulse">
                {isAdminMode ? <Shield size={200} /> : <HeartPulse size={200} />}
            </div>
            
            <div className="relative z-10 space-y-6 animate-fade-in">
                <div className="bg-white/10 p-6 rounded-full inline-block backdrop-blur-sm mb-4">
                    {isAdminMode ? <Shield size={64} className="text-gray-200" /> : <HeartPulse size={64} className="text-blood-300" />}
                </div>
                <h2 className="text-3xl font-bold">
                    {isAdminMode ? 'অ্যাডমিন প্যানেল' : 'রক্ত দিন, জীবন বাঁচান'}
                </h2>
                <p className="text-white/80 text-lg leading-relaxed max-w-sm mx-auto">
                    {isAdminMode 
                        ? 'সিস্টেম ম্যানেজমেন্ট এবং ডেটা আপডেটের জন্য অ্যাডমিন হিসেবে লগইন করুন।'
                        : 'আপনার এক ব্যাগ রক্ত একজন মুমূর্ষু রোগীর মুখে হাসি ফোটাতে পারে। আজই আপনার অ্যাকাউন্টে লগইন করে স্ট্যাটাস আপডেট করুন।'}
                </p>
            </div>
        </div>

      </div>
    </div>
  );
};