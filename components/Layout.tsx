import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Droplet, User, LogOut, Shield, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'হোম', path: '/' },
    { name: 'আমাদের লক্ষ্য', path: '/mission' },
    { name: 'সেবা', path: '/services' },
    { name: 'রক্তদাতার তালিকা', path: '/donors' },
    { name: 'কমিউনিটি', path: '/community' },
    { name: 'ক্যাম্পেইন', path: '/campaign' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="bg-blood-600/95 backdrop-blur-sm text-white shadow-lg sticky top-0 z-50 border-b border-blood-700">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-white p-1.5 rounded-full group-hover:scale-110 transition duration-300">
                <Droplet className="h-6 w-6 text-blood-600 fill-current" />
              </div>
              <span className="font-bold text-xl md:text-2xl tracking-tight">জিয়া ব্লাড ফাউন্ডেশন</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive(link.path) 
                      ? 'bg-blood-800 text-white shadow-inner' 
                      : 'hover:bg-blood-500 text-blood-50 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {user ? (
                <div className="flex items-center space-x-3 ml-6 border-l border-blood-400 pl-6">
                  <Link
                    to={isAdmin ? "/admin" : "/dashboard"}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-blood-700 transition"
                  >
                     {isAdmin ? <Shield size={18} /> : <User size={18} />}
                     <span className="text-sm font-semibold">{user.name.split(' ')[0]}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 hover:bg-blood-800 rounded-lg text-blood-100 hover:text-white transition"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3 ml-6">
                  <Link
                    to="/login"
                    className="px-5 py-2 text-blood-100 font-medium hover:text-white transition"
                  >
                    লগইন
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2 bg-white text-blood-600 rounded-lg font-bold hover:bg-blood-50 shadow-sm transition transform hover:-translate-y-0.5"
                  >
                    নিবন্ধন
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-blood-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-blood-800 border-t border-blood-700 animate-fade-in">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-lg ${
                    isActive(link.path) ? 'bg-blood-900 font-bold' : 'hover:bg-blood-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className="border-t border-blood-700 p-4 bg-blood-900/50">
              {user ? (
                <div className="space-y-3">
                  <Link
                    to={isAdmin ? "/admin" : "/dashboard"}
                    className="flex items-center space-x-3 w-full p-3 bg-blood-800 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {isAdmin ? <Shield size={20} /> : <User size={20} />}
                    <span className="font-semibold">{user.name}</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full p-3 hover:bg-blood-800 rounded-lg text-blood-200"
                  >
                    <LogOut size={20} />
                    <span>লগ আউট</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to="/login"
                    className="block w-full text-center py-3 bg-blood-800 text-white rounded-lg font-bold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    লগইন
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full text-center py-3 bg-white text-blood-800 rounded-lg font-bold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    নিবন্ধন
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {children}
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            
            {/* Brand Column */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-white">
                <div className="bg-blood-600 p-1.5 rounded-full">
                  <Droplet className="h-6 w-6 fill-current" />
                </div>
                <span className="text-2xl font-bold">জিয়া ব্লাড ফাউন্ডেশন</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                স্বেচ্ছায় রক্তদান কর্মসূচির মাধ্যমে মুমূর্ষু রোগীর জীবন বাঁচাতে আমরা প্রতিজ্ঞাবদ্ধ। 
                আপনার এক ফোঁটা রক্ত, একটি জীবন।
              </p>
              <div className="flex space-x-4 pt-4">
                <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blood-600 hover:text-white transition"><Facebook size={20} /></a>
                <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blood-600 hover:text-white transition"><Twitter size={20} /></a>
                <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blood-600 hover:text-white transition"><Instagram size={20} /></a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white text-lg font-bold mb-6 border-b border-gray-700 pb-2 inline-block">দ্রুত লিঙ্ক</h3>
              <ul className="space-y-3">
                <li><Link to="/mission" className="hover:text-blood-500 transition flex items-center gap-2"><span className="h-1.5 w-1.5 bg-blood-500 rounded-full"></span>আমাদের সম্পর্কে</Link></li>
                <li><Link to="/donors" className="hover:text-blood-500 transition flex items-center gap-2"><span className="h-1.5 w-1.5 bg-blood-500 rounded-full"></span>রক্তদাতা খুঁজুন</Link></li>
                <li><Link to="/register" className="hover:text-blood-500 transition flex items-center gap-2"><span className="h-1.5 w-1.5 bg-blood-500 rounded-full"></span>ডোনার রেজিস্ট্রেশন</Link></li>
                <li><Link to="/campaign" className="hover:text-blood-500 transition flex items-center gap-2"><span className="h-1.5 w-1.5 bg-blood-500 rounded-full"></span>ক্যাম্পেইন গ্যালারি</Link></li>
                <li><Link to="/login" className="hover:text-blood-500 transition flex items-center gap-2"><span className="h-1.5 w-1.5 bg-gray-500 rounded-full"></span>অ্যাডমিন লগইন</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white text-lg font-bold mb-6 border-b border-gray-700 pb-2 inline-block">যোগাযোগ</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <MapPin className="text-blood-500 mt-1 flex-shrink-0" size={20} />
                  <span>চিকিৎসা সহকারী প্রশিক্ষণ বিদ্যালয় , ম্যাটস নোয়াখালী ক্যাম্পাস ।<br/>মাইজদী পৌর পার্ক সংলগ্ন , মাইজদী কোর্ট, নোয়াখালী , বাংলাদেশ</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="text-blood-500 flex-shrink-0" size={20} />
                  <span>+8801632869272</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail className="text-blood-500 flex-shrink-0" size={20} />
                  <span>ziablood.info@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} জিয়া ব্লাড ফাউন্ডেশন। সর্বস্বত্ব সংরক্ষিত।</p>
            <p className="mt-2">Developed with ❤️ for Humanity.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};