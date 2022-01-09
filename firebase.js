// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getStorage } from 'firebase/storage'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyAqo-npd8_kRgaqB5hFT-rETG_fyIf19p4",
    authDomain: "instagram-clone-e8858.firebaseapp.com",
    projectId: "instagram-clone-e8858",
    storageBucket: "instagram-clone-e8858.appspot.com",
    messagingSenderId: "464127582255",
    appId: "1:464127582255:web:2ce36ca2f471c80315a6da",
    measurementId: "G-NBKP590HDN"
};

// Initialize Firebase
// it will check if the firebase is initialized before, so it is checking the length of the getApp if no length then it is initializing the app alse using prev one.
// this is to restrict multiple firebase instance
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore();
const storage = getStorage();

// to use outside the components
export { app, db, storage };