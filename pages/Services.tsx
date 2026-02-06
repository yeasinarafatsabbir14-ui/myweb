import React from 'react';
import { Truck, Users, Calendar } from 'lucide-react';

export const Services: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800">আমাদের সেবাসমূহ</h2>
        <p className="text-gray-600 mt-2">আমরা সর্বদা মানবতার সেবায় নিয়োজিত</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition border-t-4 border-blood-500">
          <Truck className="w-12 h-12 text-blood-600 mb-4" />
          <h3 className="text-xl font-bold mb-3">রক্ত সংগ্রহ</h3>
          <p className="text-gray-600">
            স্বেচ্ছাসেবী রক্তদাতাদের থেকে রক্ত সংগ্রহ করে ব্লাড ব্যাংকে সংরক্ষণ বা সরাসরি রোগীর কাছে পৌঁছে দেওয়ার ব্যবস্থা করা।
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition border-t-4 border-blood-500">
          <Users className="w-12 h-12 text-blood-600 mb-4" />
          <h3 className="text-xl font-bold mb-3">জরুরি রক্ত সহায়তা</h3>
          <p className="text-gray-600">
            ২৪/৭ জরুরি ভিত্তিতে রক্তের প্রয়োজনে ডোনার ম্যানেজ করে দেওয়া এবং রোগীদের পাশে দাঁড়ানো।
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition border-t-4 border-blood-500">
          <Calendar className="w-12 h-12 text-blood-600 mb-4" />
          <h3 className="text-xl font-bold mb-3">ব্লাড ক্যাম্পেইন</h3>
          <p className="text-gray-600">
            বিভিন্ন শিক্ষা প্রতিষ্ঠান ও জনসমাগম এলাকায় ফ্রি ব্লাড গ্রুপিং ও রক্তদান কর্মসূচির আয়োজন করা।
          </p>
        </div>
      </div>
    </div>
  );
};