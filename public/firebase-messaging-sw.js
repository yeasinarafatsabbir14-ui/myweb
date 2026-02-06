importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// 1. Initialize the Firebase app in the service worker by passing in the messagingSenderId.
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

firebase.initializeApp(firebaseConfig);

// 2. Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'https://cdn-icons-png.flaticon.com/512/206/206024.png', // Logo URL
    badge: 'https://cdn-icons-png.flaticon.com/512/206/206024.png' // Small Icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});