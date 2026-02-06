import { getToken, onMessage } from "firebase/messaging";
import { ref, set } from "firebase/database";
import { messaging, db } from "../firebase";

// Generated from Firebase Console > Project Settings > Cloud Messaging > Web Configuration
const VAPID_KEY = "BNjePPdiM80prgrCCYXif-92ZBTmO1WfC_kZbjzXKgGdV9_iSNaayVMVUuChY5Xdnh0Epzb1NGQzGS_SzLclKyk";

export const requestForToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
      if (currentToken) {
        // Save token to database to subscribe the user
        // We use the token itself as the key (replacing illegal chars) to ensure uniqueness and avoid duplicates.
        // Firebase keys cannot contain '.', '#', '$', '[', or ']'.
        const sanitizedToken = currentToken.replace(/[.#$/[\]]/g, '_');
        
        await set(ref(db, `fcm_tokens/${sanitizedToken}`), {
           token: currentToken,
           lastUpdated: Date.now(),
           deviceInfo: navigator.userAgent // Optional: helpful for debugging
        });
        console.log("FCM Token Generated and Saved:", currentToken);
      } else {
        console.log("No registration token available. Request permission to generate one.");
      }
    } else {
      console.log("Notification permission denied.");
    }
  } catch (err) {
    console.log("An error occurred while retrieving token. ", err);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });