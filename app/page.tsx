'use client'

//import {onMessageListener} from '../lib/firebase';
import { useEffect } from "react";
//import firebase from "firebase/compat/app";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { firebaseConfig } from "@/consts/firebase_config";
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
//import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getMessaging, getToken } from "firebase/messaging";
import { onMessage } from "firebase/messaging";

export default function Home() {
  useEffect(() => {
    //service worker registration
    if(typeof navigator !== 'undefined' && 'serviceWorker' in navigator){
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
      .then((registration) => {
        console.log('service worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.log('service worker registration failed:', error);
      })
    }

    const requestPermission = async () => {
      const app = initializeApp(firebaseConfig);
      const messaging = getMessaging(app);

      try{
        const permission = await Notification.permission;
        if(permission === 'granted'){
          const token = await getToken(messaging, {vapidKey: "BNnj9AX0Pp8UIJESDKZ8EDcdCMzNCD1Y0RXIo8tVuemwAItDxtQHzjJ1wccwBsCI0fmkncW1xQ31JKUPWX1fML8"});
          console.log('token is: ', token);

          await saveTokenToFirestore(token);
        }
      }catch(error){
        console.log('error occured:', error);
      }
    }

    requestPermission();

    //listen message from FCM
    //onMessageListener().then((payload) => {
    //  console.log('Message received:', payload);
    //}).catch((error) => console.log('failed:', error));
    if(typeof window !== 'undefined'){
      const app = initializeApp(firebaseConfig);
      const messaging = getMessaging(app);
      onMessage(messaging, (payload)=>{
          console.log('Message received:', payload);
      });
    }
    
  }, []);

  function convertString(value: string | undefined): string {
    return value ?? '';
  }

  const saveTokenToFirestore = async (token: string) => {
    const app = initializeApp(firebaseConfig);
    const firestore = getFirestore(app);
    const auth = getAuth(app);
    const user = auth.currentUser;
    if(user){
      try{
        //savr userId to session in webhook server
        const userId = convertString(user?.uid);
        await fetch('https://nft-webhook2.vercel.app/api/session/set', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({userId})
        });

        await setDoc(doc(firestore, 'UserData', convertString(user?.uid)), {
          deviceId: token,
          updateTime: new Date(),
          updateUser: user?.uid
      });
      console.log('success to save');
      }catch(error){
        console.log('failed to save:', error);
      }
    }
  }

  const login = async () => {
    const provider = new GoogleAuthProvider();
    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);
    const auth = getAuth(app);
    try{
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      alert(user);
      console.log('user logged in:', user);

      const token = await getToken(messaging, {vapidKey: "BNnj9AX0Pp8UIJESDKZ8EDcdCMzNCD1Y0RXIo8tVuemwAItDxtQHzjJ1wccwBsCI0fmkncW1xQ31JKUPWX1fML8"});
      await saveTokenToFirestore(token);

    }catch(error){
      console.log('failed to login:', error);
    }
  }

  return (
    <div>
      <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={login}>login</button>
    </div>
  );
}
