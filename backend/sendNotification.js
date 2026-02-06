// This file is NOT part of the React frontend bundle.
// Run this on a Node.js server or deploy as a Firebase Cloud Function.
// Prerequisites: npm install firebase-admin

const admin = require("firebase-admin");

// 1. Initialize Firebase Admin SDK
// You need a Service Account Key JSON file from Firebase Console > Project Settings > Service Accounts
// Save it as serviceAccountKey.json in the same directory
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://zia-blood-default-rtdb.firebaseio.com"
});

const db = admin.database();
const messaging = admin.messaging();

/**
 * Sends an emergency notice to all subscribed users.
 * @param {string} noticeTitle 
 * @param {string} noticeBody 
 */
async function sendEmergencyNotice(noticeTitle, noticeBody) {
  try {
    console.log("Fetching tokens...");
    // 1. Fetch all tokens from Realtime Database
    const tokensSnapshot = await db.ref('fcm_tokens').once('value');
    if (!tokensSnapshot.exists()) {
      console.log('No devices subscribed.');
      return;
    }

    const tokensData = tokensSnapshot.val();
    // Extract just the token strings from the objects
    const registrationTokens = Object.values(tokensData).map(t => t.token);

    if (registrationTokens.length === 0) {
        console.log('No tokens found.');
        return;
    }

    console.log(`Found ${registrationTokens.length} tokens. Sending message...`);

    // 2. Construct the message
    const message = {
      notification: {
        title: `🔴 জরুরি নোটিশ: ${noticeTitle}`,
        body: noticeBody,
      },
      // You can send to up to 500 tokens at once via multicast. 
      // If you have more, you need to loop through them in batches of 500.
      tokens: registrationTokens,
    };

    // 3. Send Multicast Message
    const response = await messaging.sendMulticast(message);
    
    console.log(`${response.successCount} messages were sent successfully.`);

    // 4. Clean up invalid tokens
    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(registrationTokens[idx]);
        }
      });
      console.log('List of invalid tokens:', failedTokens);
      
      // Optional: Remove invalid tokens from DB
      // Note: Since we use sanitized tokens as keys, this requires reverse mapping or 
      // simply attempting to find and delete. 
    }

  } catch (error) {
    console.error('Error sending message:', error);
  }
}

// Example Usage:
// Uncomment the line below to test
// sendEmergencyNotice("জরুরি রক্তের প্রয়োজন", "ঢাকা মেডিকেলে ২ ব্যাগ B+ রক্ত প্রয়োজন। যোগাযোগ: 01xxxxxxxxx");

module.exports = { sendEmergencyNotice };