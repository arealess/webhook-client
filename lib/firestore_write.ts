import { firebaseConfig } from "@/consts/firebase_config";
import { initializeApp } from "firebase/app";
//import { getAuth, GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { getAuth} from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";

//firebase
const app = initializeApp(firebaseConfig);
//firebase authentication
const auth = getAuth(app);
//firestore
const firestore = getFirestore(app);

function convertString(value: string | undefined): string {
    return value ?? '';
}

//write deviceId to firestore
export async function writeData(deviceId: string): Promise<boolean> {
    const user = auth.currentUser;
    if(!user){
        console.log('user is not login in');
        return false;
    }

    //save deviceId to firestore
    try{
        await setDoc(doc(firestore, 'UserData', convertString(user?.uid)), {
            deviceId: deviceId,
            updateTime: new Date(),
            updateUser: user?.uid
        });
        return true;
    }catch(error){
        console.error(error);
        return false;
    }
}