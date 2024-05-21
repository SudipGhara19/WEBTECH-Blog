

import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "webtech-blog-a5a49.firebaseapp.com",
  projectId: "webtech-blog-a5a49",
  storageBucket: "webtech-blog-a5a49.appspot.com",
  messagingSenderId: "1051967085818",
  appId: "1:1051967085818:web:388bee7710093beffebd43",
  measurementId: "G-4XS60VHLM7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
