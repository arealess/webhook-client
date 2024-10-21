//importScripts('https://www.gstatic.com/firebasejs/10.5.2/firebase-app-compat.js')
//importScripts('https://www.gstatic.com/firebasejs/10.5.2/firebase-messaging-compat.js')
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging/sw";

//firebase init
//firebase.initializeApp({
//    apiKey: "AIzaSyDBTMv1nPOPnWtz7v0eyIHBDnU5FYft_2M",
//    authDomain: "nttditial--sff.firebaseapp.com",
//    projectId: "nttditial--sff",
//    storageBucket: "nttditial--sff.appspot.com",
//    messagingSenderId: "633790392845",
//    appId: "1:633790392845:web:4316fa37b819260f798344",
//});

const firebaseApp = initializeApp({
    apiKey: "AIzaSyDBTMv1nPOPnWtz7v0eyIHBDnU5FYft_2M",
    authDomain: "nttditial--sff.firebaseapp.com",
    projectId: "nttditial--sff",
    storageBucket: "nttditial--sff.appspot.com",
    messagingSenderId: "633790392845",
    appId: "1:633790392845:web:4316fa37b819260f798344",
});

//get FCM
//const messaging = firebase.messaging();
const messaging = getMessaging(firebaseApp);

//run in background
messaging.onBackgroundMessage((payload) => {
    console.log('received background message', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: ''
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});