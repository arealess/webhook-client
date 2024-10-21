import { initializeApp } from "firebase/app";
//import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getMessaging, onMessage } from "firebase/messaging";
import { firebaseConfig } from "@/consts/firebase_config";
// import {writeData} from './firestore_write';
//import { resolve } from "path";

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// export const requestNotificationPermission = async () => {
//     try{
//         const token = await getToken(messaging, {vapidKey: "BNnj9AX0Pp8UIJESDKZ8EDcdCMzNCD1Y0RXIo8tVuemwAItDxtQHzjJ1wccwBsCI0fmkncW1xQ31JKUPWX1fML8"});
//         if(token){
//             //tokenをfirestoreへ保存
//             writeData(token);
//             console.log("FCM token:", token);
//         }else{
//             console.log("No registeration token available, Request permission to generate one.");
//         }
//     }catch(error){
//         console.error('Error getting token:', error);
//         if(Notification.permission === 'denied'){
//             alert('you have blocked notifications. Please enable them in your browser settings to receive updates.')
//         }
//     }
// };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const onMessageListener = (): Promise<any> => {
    return new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });
}