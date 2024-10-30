import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDfrc7WQTEIpFKAhTeAVX7gmJkAMFOY3oc",
  authDomain: "finance-9158b.firebaseapp.com",
  projectId: "finance-9158b",
  storageBucket: "finance-9158b.appspot.com",
  messagingSenderId: "645836832506",
  appId: "1:645836832506:web:f919593acecfcdb4f05343",
  measurementId: "G-FMFHQEBSPD",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); 

export { app, auth, db };
