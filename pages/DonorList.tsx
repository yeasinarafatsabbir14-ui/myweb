import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../firebase';
import { Donor, BloodGroup } from '../types';
import { Search, Phone, Calendar, MapPin, User, CheckCircle, XCircle, Droplet, Filter, Briefcase } from 'lucide-react';

export const DonorList: React.FC = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [selectedGroup, setSelectedGroup] = useState<string>('');

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const snapshot = await get(ref(db, 'users'));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const donorList: Donor[] = Object.values(data);
          // Only show donors, not admins (though admin is a role, admin might not want to donate)
          const publicDonors = donorList.filter(d => d.role === 'donor');
          setDonors(publicDonors);
          setFilteredDonors(publicDonors);
        }
      } catch (error) {
        console.error("Error fetching donors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDonors();
  }, []);

  useEffect(() => {
    let result = donors;

    // Filter by Blood Group
    if (selectedGroup) {
      result = result.filter(d => d.bloodGroup === selectedGroup);
    }

    setFilteredDonors(result);
  }, [selectedGroup, donors]);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header & Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <Search className="text-blood-600" /> রক্তদাতা খুঁজুন
                </h2>
                <p className="text-gray-500 mt-1">প্রয়োজনীয় রক্তের গ্রুপ নির্বাচন করুন</p>
            </div>
            <div className="bg-blood-50 text-blood-700 px-4 py-2 rounded-full font-bold text-sm shadow-sm">
                মোট ডোনার: {filteredDonors.length} জন
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Blood Group Select */}
            <div className="relative group md:col-span-3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Droplet className="h-5 w-5 text-blood-500" />
                </div>
                <select 
                    className="block w-full pl-10 pr-4 py-3 border-gray-200 border-2 rounded-xl focus:ring-blood-500 focus:border-blood-500 transition appearance-none bg-white font-semibold text-gray-700 cursor-pointer hover:border-blood-300"
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                >
                    <option value="">সকল গ্রুপ</option>
                    {Object.values(BloodGroup).map(group => (
                    <option key={group} value={group}>{group}</option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">▼</div>
            </div>
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-blood-200 border-t-blood-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">ডোনার তালিকা লোড হচ্ছে...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonors.map((donor) => (
            <div key={donor.uid} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden relative flex flex-col h-full">
              {/* Top Decor Bar */}
              <div className={`h-2 w-full ${donor.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
              
              <div className="p-6 flex-grow relative">
                {/* Blood Group Badge */}
                <div className="absolute top-6 right-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-blood-600 to-blood-800 rounded-br-2xl rounded-tl-2xl rounded-tr-md rounded-bl-md shadow-lg flex items-center justify-center text-white font-bold text-xl border-2 border-white ring-2 ring-blood-100 transform group-hover:scale-110 transition duration-300">
                        {donor.bloodGroup}
                    </div>
                </div>

                {/* Header Info */}
                <div className="mb-5 pr-14">
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-1 mb-1">{donor.name}</h3>
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${donor.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {donor.isAvailable ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {donor.isAvailable ? 'রক্তদানে প্রস্তুত' : 'বর্তমানে অক্ষম'}
                    </div>
                </div>

                {/* Details List */}
                <div className="space-y-3">
                    <div className="flex items-start gap-3 text-sm text-gray-600 bg-gray-50 p-2.5 rounded-lg group-hover:bg-blood-50 transition-colors duration-300">
                        <MapPin size={16} className="text-blood-500 mt-0.5 flex-shrink-0" />
                        <span className="font-medium line-clamp-2">{donor.area || 'ঠিকানা দেওয়া হয়নি'}</span>
                    </div>
                    
                    {donor.institution && (
                        <div className="flex items-start gap-3 text-sm text-gray-600 bg-gray-50 p-2.5 rounded-lg group-hover:bg-blood-50 transition-colors duration-300">
                            <Briefcase size={16} className="text-blood-500 mt-0.5 flex-shrink-0" />
                            <span className="font-medium line-clamp-1">{donor.institution}</span>
                        </div>
                    )}

                    <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-2.5 rounded-lg group-hover:bg-blood-50 transition-colors duration-300">
                        <Calendar size={16} className="text-blood-500 flex-shrink-0" />
                        <span className="font-medium">
                            শেষ দান: {donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString('bn-BD') : 'তথ্য নেই'}
                        </span>
                    </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                <a 
                    href={`tel:${donor.phone}`}
                    className="flex items-center justify-center w-full gap-2 bg-white border-2 border-blood-600 text-blood-700 hover:bg-blood-600 hover:text-white font-bold py-2.5 rounded-xl transition duration-300 shadow-sm hover:shadow-md active:scale-95"
                >
                    <Phone size={18} className="fill-current" />
                    কল করুন: <span className="font-mono text-base">{donor.phone}</span>
                </a>
              </div>
            </div>
          ))}
          
          {filteredDonors.length === 0 && (
            <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Filter size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">কোনো ফলাফল পাওয়া যায়নি</h3>
                <p className="text-gray-500">অন্য কোনো ব্লাড গ্রুপ নির্বাচন করুন।</p>
                <button 
                    onClick={() => { setSelectedGroup(''); }}
                    className="mt-6 text-blood-600 font-bold hover:underline"
                >
                    ফিল্টার রিসেট করুন
                </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};