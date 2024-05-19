// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-92a7c.firebaseapp.com",
  projectId: "mern-blog-92a7c",
  storageBucket: "mern-blog-92a7c.appspot.com",
  messagingSenderId: "862033345313",
  appId: "1:862033345313:web:eed124a48ce1151c7c5c60"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);