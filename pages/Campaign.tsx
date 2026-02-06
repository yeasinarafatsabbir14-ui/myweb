import React, { useEffect, useState } from 'react';
import { ref, onValue, push, update } from 'firebase/database';
import { db } from '../firebase';
import { Campaign, Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import { Heart, MessageCircle, Send, AlertCircle, LogIn, X, Share2, Calendar, User, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BloodCampaign: React.FC = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [newComment, setNewComment] = useState<{[key: string]: string}>({});
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    const campaignsRef = ref(db, 'campaigns');
    onValue(campaignsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setCampaigns(list.reverse());
      }
    });
  }, []);

  const triggerLoginPrompt = () => {
    setShowLoginPrompt(true);
    setTimeout(() => setShowLoginPrompt(false), 5000);
  };

  const handleReact = async (campaignId: string, currentLikes: Record<string, boolean> = {}) => {
    if (!user) {
        triggerLoginPrompt();
        return;
    }
    const userLiked = currentLikes[user.uid];
    const updates: any = {};
    if (userLiked) {
        updates[`campaigns/${campaignId}/likes/${user.uid}`] = null;
    } else {
        updates[`campaigns/${campaignId}/likes/${user.uid}`] = true;
    }
    await update(ref(db), updates);
  };

  const handleComment = async (campaignId: string) => {
    if (!user) {
         triggerLoginPrompt();
         return;
    }
    const text = newComment[campaignId];
    if (!text?.trim()) return;

    const commentData: Comment = {
      userName: user.name,
      text: text,
      timestamp: Date.now()
    };

    await push(ref(db, `campaigns/${campaignId}/comments`), commentData);
    setNewComment({ ...newComment, [campaignId]: '' });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 relative pb-12">
      
      {/* Login Prompt Banner */}
      <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${showLoginPrompt ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <div className="bg-slate-900 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-4 border border-slate-700 backdrop-blur-md bg-opacity-95">
            <AlertCircle className="text-yellow-400" size={24} />
            <div>
                <p className="font-bold text-sm">অনুগ্রহ করে লগইন করুন</p>
                <p className="text-xs text-slate-300">প্রতিক্রিয়া জানাতে লগইন প্রয়োজন</p>
            </div>
            <Link to="/login" className="bg-blood-600 hover:bg-blood-500 px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1 shadow-lg shadow-blood-900/50">
                <LogIn size={14} /> লগইন
            </Link>
            <button onClick={() => setShowLoginPrompt(false)} className="text-slate-400 hover:text-white p-1">
                <X size={18} />
            </button>
        </div>
      </div>

      {/* Header */}
      <div className="text-center pt-4 pb-4">
         <div className="inline-flex items-center justify-center p-3 bg-red-50 rounded-full mb-3 ring-4 ring-red-50/50">
            <Heart className="text-blood-600 fill-current" size={28} />
         </div>
         <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 tracking-tight">ক্যাম্পেইন গ্যালারি</h2>
         <p className="text-gray-500 font-medium">আমাদের সাম্প্রতিক কার্যক্রম এবং সামাজিক উদ্যোগ</p>
      </div>
      
      {campaigns.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-700">কোনো ক্যাম্পেইন নেই</h3>
            <p className="text-gray-500 mt-2">বর্তমানে কোনো ক্যাম্পেইন চালু নেই, শীঘ্রই আপডেট আসবে।</p>
        </div>
      ) : (
        <div className="space-y-8">
            {campaigns.map(campaign => {
                const likesCount = campaign.likes ? Object.keys(campaign.likes).length : 0;
                const commentsList: Comment[] = campaign.comments ? Object.values(campaign.comments) : [];
                const isLiked = user && campaign.likes && campaign.likes[user.uid];

                return (
                    <div key={campaign.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                        {/* Card Header */}
                        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-50/50">
                             <div className="flex items-center gap-3">
                                <div className="w-11 h-11 bg-gradient-to-br from-blood-600 to-blood-800 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md border-2 border-white">
                                    ZF
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-gray-900">Zia Blood Foundation</h4>
                                    <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                        <Calendar size={10} />
                                        {formatDate(campaign.date)}
                                    </p>
                                </div>
                             </div>
                             <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-50 transition">
                                <MoreHorizontal size={20} />
                             </button>
                        </div>

                        {/* Description */}
                        <div className="px-6 py-4 pb-2">
                             <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{campaign.title}</h3>
                             <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{campaign.description}</p>
                        </div>

                        {/* Image */}
                        <div className="relative group bg-gray-100 mt-2">
                            <img 
                                src={campaign.imageUrl} 
                                alt={campaign.title} 
                                className="w-full h-auto max-h-[500px] object-cover object-center" 
                                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/600x400?text=Image+Load+Error')}
                            />
                        </div>

                        {/* Content & Interactions */}
                        <div className="p-6">
                            {/* Stats */}
                            <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pb-3 border-b border-gray-100">
                                <div className="flex items-center gap-1">
                                    <span className="font-bold text-gray-900">{likesCount}</span> 
                                    <span>Likes</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div><span className="font-bold text-gray-900">{commentsList.length}</span> Comments</div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 mb-6">
                                <button 
                                    onClick={() => handleReact(campaign.id, campaign.likes)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all duration-200 ${isLiked ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <Heart 
                                        className={`transition-transform duration-300 ${isLiked ? "fill-current scale-110" : "scale-100"}`} 
                                        size={20} 
                                    />
                                    <span className="font-bold text-sm">{isLiked ? 'Liked' : 'Like'}</span>
                                </button>
                                
                                <button 
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all duration-200"
                                    onClick={() => document.getElementById(`comment-input-${campaign.id}`)?.focus()}
                                >
                                    <MessageCircle size={20} />
                                    <span className="font-bold text-sm">Comment</span>
                                </button>
                            </div>

                            {/* Comments Area */}
                            <div className="space-y-4 mb-5">
                                {commentsList.length > 0 ? (
                                    <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar pr-2 pl-1">
                                        {commentsList.map((c, i) => (
                                            <div key={i} className="flex gap-3 items-start animate-fade-in group">
                                                <div className="w-8 h-8 bg-gradient-to-tr from-blue-100 to-blue-200 text-blue-700 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-1 shadow-sm border border-white">
                                                    {c.userName.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none inline-block max-w-[90%] group-hover:bg-gray-200 transition-colors">
                                                        <div className="flex items-baseline justify-between gap-4 mb-0.5">
                                                            <span className="font-bold text-xs text-gray-900">{c.userName}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-800 leading-snug">{c.text}</p>
                                                    </div>
                                                    <div className="ml-2 mt-1 text-[10px] text-gray-400 font-medium">
                                                        {new Date(c.timestamp).toLocaleDateString()} at {new Date(c.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <p className="text-xs text-gray-400">এখনো কোনো মন্তব্য নেই। আপনার মতামত জানান!</p>
                                    </div>
                                )}
                            </div>

                            {/* Input Area */}
                            <div className="relative flex items-center gap-3 pt-2">
                                <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 flex-shrink-0 border border-gray-200">
                                    <User size={18} />
                                </div>
                                <div className="flex-grow relative">
                                    <input 
                                        id={`comment-input-${campaign.id}`}
                                        type="text"
                                        placeholder="মতামত লিখুন..."
                                        className="w-full bg-gray-100 border-transparent focus:border-blood-300 focus:bg-white focus:ring-4 focus:ring-blood-50 rounded-full px-5 py-3 text-sm transition-all outline-none pr-12"
                                        value={newComment[campaign.id] || ''}
                                        onChange={(e) => setNewComment({...newComment, [campaign.id]: e.target.value})}
                                        onKeyPress={(e) => e.key === 'Enter' && handleComment(campaign.id)}
                                    />
                                    <button 
                                        onClick={() => handleComment(campaign.id)}
                                        disabled={!newComment[campaign.id]}
                                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full transition-all ${newComment[campaign.id] ? 'bg-blood-600 text-white hover:bg-blood-700 shadow-md hover:scale-110' : 'text-gray-300 cursor-not-allowed'}`}
                                    >
                                        <Send size={16} className={newComment[campaign.id] ? 'ml-0.5' : ''} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
      )}
    </div>
  );
};