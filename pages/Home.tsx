import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Activity, Users, Search, ChevronRight, PhoneCall, Phone, Mail, MapPin } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col gap-16 pb-12">
      {/* Hero Section */}
      <section className="relative bg-blood-900 text-white rounded-3xl overflow-hidden shadow-2xl mx-2 md:mx-0">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=2000&auto=format&fit=crop" 
            alt="Blood Donation" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blood-900 via-blood-800/90 to-transparent"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 py-20 md:py-32 flex flex-col justify-center items-start max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blood-800/50 border border-blood-700 text-blood-100 text-sm font-medium mb-6 backdrop-blur-sm">
            <Activity size={16} className="animate-pulse" />
            <span>জরুরি রক্তের প্রয়োজন? আমরা পাশে আছি।</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            রক্ত দিন, <br/>
            <span className="text-blood-400">একটি জীবন বাঁচান</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl leading-relaxed">
          আমাদের এই পথচলা রাজনীতির ঊর্ধ্বে উঠে নিছক জীবনের টানে। আসুন, শহীদ জিয়ার আদর্শে উদ্বুদ্ধ হয়ে আমরা একে অপরের হাত ধরি এবং স্বেচ্ছায় রক্তদানের মাধ্যমে পৃথিবীকে আরও সুন্দর করি।
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              to="/register" 
              className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-white text-blood-700 font-bold rounded-xl shadow-lg hover:bg-gray-100 transform hover:-translate-y-1 transition duration-200"
            >
              <Heart className="fill-current" size={20} />
              রক্তদাতা হোন
            </Link>
            <Link 
              to="/donors" 
              className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-blood-700/50 border border-blood-500 text-white font-semibold rounded-xl hover:bg-blood-700 hover:border-blood-400 backdrop-blur-md transform hover:-translate-y-1 transition duration-200"
            >
              <Search size={20} />
              রক্তদাতা খুঁজুন
            </Link>
          </div>
        </div>
      </section>

      {/* Emergency Section */}
      <section className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-red-50 to-white border-l-8 border-blood-600 rounded-r-2xl shadow-md p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-6">
            <div className="bg-blood-100 p-4 rounded-full hidden md:block">
              <PhoneCall className="text-blood-600 w-8 h-8 animate-bounce" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span className="md:hidden"><PhoneCall size={24} className="text-blood-600 inline" /></span>
                জরুরি রক্তের প্রয়োজন?
              </h3>
              <p className="text-gray-600 text-lg">
                আমাদের ডোনার লিস্ট চেক করুন অথবা সরাসরি আমাদের হেল্পলাইনে যোগাযোগ করুন। 
                আমরা ২৪/৭ আপনার পাশে আছি।
              </p>
            </div>
          </div>
          <Link 
            to="/donors" 
            className="whitespace-nowrap px-8 py-3 bg-blood-600 text-white font-bold rounded-lg shadow hover:bg-blood-700 transition flex items-center gap-2"
          >
            ডোনার খুঁজুন <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* Features / Services Preview */}
      <section className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">আমাদের কার্যক্রম</h2>
          <p className="text-gray-600">আমরা শুধুমাত্র রক্ত সংগ্রহ করি না, বরং একটি সুস্থ ও সচেতন সমাজ গড়তে কাজ করি।</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "জীবন বাঁচান",
              desc: "নিয়মিত রক্তদান করে মুমূর্ষু রোগীর জীবন বাঁচাতে সহায়তা করুন। আপনার রক্তই পারে একটি পরিবারের হাসি ফোটাতে।",
              icon: Heart,
              color: "bg-pink-50 text-pink-600",
              link: "/register"
            },
            {
              title: "কমিউনিটি",
              desc: "আমাদের বিশাল স্বেচ্ছাসেবী নেটওয়ার্কের অংশ হয়ে উঠুন। সামাজিক দায়বদ্ধতা থেকে আমরা সবাই এক।",
              icon: Users,
              color: "bg-blue-50 text-blue-600",
              link: "/community"
            },
            {
              title: "স্বাস্থ্য সুবিধা",
              desc: "রক্তদান আপনার হৃদরোগের ঝুঁকি কমায়, নতুন রক্তকণিকা তৈরিতে সাহায্য করে এবং মানসিক প্রশান্তি দেয়।",
              icon: Activity,
              color: "bg-green-50 text-green-600",
              link: "/services"
            }
          ].map((item, idx) => (
            <div key={idx} className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-gray-100 transition duration-300">
              <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300`}>
                <item.icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {item.desc}
              </p>
              <Link to={item.link} className="inline-flex items-center text-blood-600 font-semibold hover:text-blood-700">
                আরও জানুন <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Emergency Contact Info (Replaced CTA) */}
      <section className="container mx-auto px-4 mb-8">
        <div className="bg-gray-900 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-blood-500 fill-current">
              <path d="M0 100 C 20 0 50 0 100 100 Z"></path>
            </svg>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">জরুরি যোগাযোগ</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm border border-gray-700 hover:border-blood-500 transition">
                <div className="w-12 h-12 bg-blood-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">হটলাইন</h3>
                <p className="text-gray-300 text-lg font-mono">+8801632869272</p>
              </div>
              
              <div className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm border border-gray-700 hover:border-blood-500 transition">
                <div className="w-12 h-12 bg-blood-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">ইমেইল</h3>
                <p className="text-gray-300">ziablood.info@gmail.com</p>
              </div>

              <div className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm border border-gray-700 hover:border-blood-500 transition">
                <div className="w-12 h-12 bg-blood-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">ঠিকানা</h3>
                <p className="text-gray-300">চিকিৎসা সহকারী প্রশিক্ষণ বিদ্যালয় , ম্যাটস নোয়াখালী ক্যাম্পাস । মাইজদী পৌর পার্ক সংলগ্ন , মাইজদী কোর্ট, নোয়াখালী , বাংলাদেশ</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};