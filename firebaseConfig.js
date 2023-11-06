import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
// import {getAuth} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtml82QkzRx-Rc3-OtIPGKkJDQY3HiNAY",
  authDomain: "todoapp-87fd0.firebaseapp.com",
  projectId: "todoapp-87fd0",
  storageBucket: "todoapp-87fd0.appspot.com",
  messagingSenderId: "75744820505",
  appId: "1:75744820505:web:9dc789e1379f05fb0b1988"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const FIREBASE_APP=initializeApp(firebaseConfig);
export const FIRESTORE_DB=getFirestore(FIREBASE_APP);
// export const FIREBASE_AUTH=getAuth(FIREBASE_APP);
