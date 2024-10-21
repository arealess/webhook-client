import { firebaseConfig } from "@/consts/firebase_config";
import { initializeApp } from "firebase/app";
//import { getAuth, GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, getDoc, doc } from "firebase/firestore";

//firebase
const app = initializeApp(firebaseConfig);
//firebase authentication
const auth = getAuth(app);
//firestore
const firestore = getFirestore(app);

function convertString(value: string | undefined): string {
    return value ?? '';
}

//read deviceId from firestore
export async function readData(deviceId: string): Promise<string | undefined> {
    let user = auth.currentUser;
    if(!user){
        //login
        const googleAuthProvider = new GoogleAuthProvider();
        await signInWithPopup(auth, googleAuthProvider);

        //get login user
        user = auth.currentUser;
    }

    //get deviceId from firestore
    try{
        const docRef = doc(firestore, 'UserData', convertString(user?.uid));
        const querySnapshot = await getDoc(docRef);
        if(querySnapshot.exists()){
            const data = querySnapshot.data();
            return data ? data[deviceId] as string : undefined;
        }else{
            return undefined;
        }
    }catch(error){
        console.error(error);
        return undefined;
    }
}