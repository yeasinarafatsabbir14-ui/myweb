import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyCK3ClpMPVliVAKzZp7WYXRET_o5gMuchk",
  authDomain: "zia-blood.firebaseapp.com",
  databaseURL: "https://zia-blood-default-rtdb.firebaseio.com",
  projectId: "zia-blood",
  storageBucket: "zia-blood.appspot.com",
  messagingSenderId: "14333213380",
  appId: "1:14333213380:web:afed3da653c8115af72791",
  measurementId: "G-5PEYXSMZ45"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app);