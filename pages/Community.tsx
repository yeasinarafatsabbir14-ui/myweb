import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import { CommunityData } from '../types';
import { Users, Briefcase, Handshake, Globe, ArrowRight, Heart, ShieldCheck, Network } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Community: React.FC = () => {
  const [data, setData] = useState<CommunityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const communityRef = ref(db, 'community');
    onValue(communityRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        setData(val);
      } else {
        setData({ partners: [] });
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-blood-200 border-t-blood-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium animate-pulse">কমিউনিটি লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-12 animate-fade-in">
      
      {/* --- Hero Section --- */}
      <section className="relative bg-gradient-to-br from-blood-900 to-gray-900 text-white rounded-3xl overflow-hidden shadow-2xl mx-2 md:mx-0">
        <div className="absolute inset-0 opacity-20">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                <circle cx="20" cy="20" r="20" fill="white" fillOpacity="0.1" />
                <circle cx="80" cy="80" r="15" fill="white" fillOpacity="0.1" />
            </svg>
        </div>
        
        <div className="relative z-10 px-6 py-16 md:py-24 text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full backdrop-blur-md mb-2 shadow-inner border border-white/10">
                <Globe className="text-blood-300" size={32} />
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                একতাই বল, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blood-400 to-orange-400">মানবতাই ধর্ম</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
                আমাদের এই মহৎ যাত্রায় সহযোগী হিসেবে যারা পাশে আছেন। বিভিন্ন সংগঠন এবং স্বেচ্ছাসেবী গোষ্ঠীর সম্মিলিত প্রচেষ্টায় আমরা গড়ে তুলেছি এক বিশাল মানবিক নেটওয়ার্ক।
            </p>
        </div>
      </section>

      {/* --- Why Community Matters --- */}
      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition group">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition duration-300">
                    <Network size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">শক্তিশালী নেটওয়ার্ক</h3>
                <p className="text-gray-600 leading-relaxed">
                    সারা দেশজুড়ে আমাদের স্বেচ্ছাসেবক এবং পার্টনারদের মাধ্যমে আমরা দ্রুততম সময়ে রক্তের চাহিদা মেটাতে সক্ষম।
                </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition group">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition duration-300">
                    <Handshake size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">পারস্পরিক সহযোগিতা</h3>
                <p className="text-gray-600 leading-relaxed">
                    বিভিন্ন সংগঠনের সাথে এক হয়ে কাজ করার ফলে আমরা আরও বেশি মানুষের কাছে সেবা পৌঁছে দিতে পারছি।
                </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition group">
                <div className="w-16 h-16 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition duration-300">
                    <Heart size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">সামাজিক দায়বদ্ধতা</h3>
                <p className="text-gray-600 leading-relaxed">
                    শুধুমাত্র রক্তদান নয়, সামাজিক সচেতনতা এবং মানবিক মূল্যবোধ জাগ্রত করাই আমাদের কমিউনিটির লক্ষ্য।
                </p>
            </div>
        </div>
      </section>

      {/* --- Partners Grid --- */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12">
            <div className="flex items-center gap-2 text-blood-600 bg-blood-50 px-4 py-1 rounded-full text-sm font-bold mb-3">
                <Briefcase size={16} />
                <span>আমাদের পার্টনার</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">
               সহযোগী সংগঠনসমূহ
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-blood-600 to-blood-400 mt-4 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {data?.partners && data.partners.length > 0 ? (
            data.partners.map((partner, idx) => (
              <div key={idx} className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-200 to-gray-200 group-hover:from-blood-500 group-hover:to-blood-600 transition-all duration-500"></div>
                
                <div className="h-24 w-full flex items-center justify-center mb-6 bg-gray-50 rounded-xl p-4 group-hover:bg-blood-50 transition duration-300">
                    <img 
                      src={partner.imageUrl || 'https://via.placeholder.com/100?text=Logo'} 
                      alt={partner.name} 
                      className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition duration-300 transform group-hover:scale-110" 
                      onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/100?text=Logo')}
                    />
                </div>
                
                <h3 className="text-base md:text-lg font-bold text-gray-800 group-hover:text-blood-700 transition line-clamp-2">
                    {partner.name}
                </h3>
              </div>
            ))
          ) : (
              <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-gray-200">
                 <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Users size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-gray-600 mb-2">কোনো সংগঠন পাওয়া যায়নি</h3>
                 <p className="text-gray-500">শীঘ্রই নতুন পার্টনার যুক্ত করা হবে।</p>
              </div>
          )}
        </div>
      </section>

      {/* --- Join CTA --- */}
      <section className="container mx-auto px-4">
        <div className="bg-gray-900 rounded-3xl p-8 md:p-16 text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-10">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blood-600/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl"></div>

            <div className="relative z-10 text-center md:text-left max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    আপনার সংগঠন যুক্ত করতে চান?
                </h2>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    আমরা বিশ্বাস করি একসাথে কাজ করলে পৃথিবীটা আরও সুন্দর হবে। যদি আপনার কোনো স্বেচ্ছাসেবী সংগঠন থাকে এবং আমাদের সাথে কাজ করতে চান, তবে যোগাযোগ করুন।
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <a href="mailto:ziablood.info@gmail.com" className="bg-white text-gray-900 px-8 py-3.5 rounded-xl font-bold hover:bg-gray-100 transition flex items-center gap-2 shadow-lg">
                        যোগাযোগ করুন <ArrowRight size={20} />
                    </a>
                </div>
            </div>

            <div className="relative z-10 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 max-w-xs w-full text-center transform md:rotate-3 hover:rotate-0 transition duration-500">
                <ShieldCheck size={48} className="text-blood-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">বিশ্বস্ত পার্টনারশিপ</h3>
                <p className="text-sm text-gray-400">স্বচ্ছতা এবং সততার সাথে আমরা দীর্ঘমেয়াদী সম্পর্কে বিশ্বাসী।</p>
            </div>
        </div>
      </section>

    </div>
  );
};