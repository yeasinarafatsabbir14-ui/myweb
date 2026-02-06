import React from 'react';

export const Mission: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-blood-700 mb-6 border-b pb-4">আমাদের লক্ষ্য (Our Mission)</h2>
        
        <div className="space-y-6 text-gray-700">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">মানবিক উদ্দেশ্য</h3>
            <p>
              শহীদ রাষ্ট্রপতি জিয়াউর রহমান শিখিয়েছিলেন, রাজনীতি মানেই হচ্ছে জনগণের সেবা। তাঁর সেই কালজয়ী আদর্শ এবং জনসেবার মহান দৃষ্টান্তকে ধারণ করেই 'জিয়া ব্লাড ফাউন্ডেশন'-এর জন্ম। আমরা বিশ্বাস করি, রক্তের অভাবে যেন একটি প্রাণও অকালে ঝরে না যায়। মুমূর্ষু মানুষের পাশে দাঁড়িয়ে তাদের জীবন রক্ষা করাই আমাদের মূল লক্ষ্য। শহীদ জিয়ার সৈনিক হিসেবে মানুষের বিপদে ঢাল হয়ে দাঁড়ানো এবং একটি সুস্থ সমাজ গড়ে তোলাই আমাদের অঙ্গীকার।
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">রক্তদানের গুরুত্ব</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>রক্তদান একটি মহৎ কাজ যা মানুষের জীবন বাঁচায়।</li>
              <li>নিয়মিত রক্তদান করলে দাতার শরীরে নতুন রক্তকণিকা তৈরি হয়।</li>
              <li>রক্তদান হৃদরোগ এবং স্ট্রোকের ঝুঁকি কমাতে সাহায্য করে।</li>
              <li>এটি একটি সামাজিক দায়িত্ব যা মানুষে মানুষে ভ্রাতৃত্ববোধ বৃদ্ধি করে।</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};