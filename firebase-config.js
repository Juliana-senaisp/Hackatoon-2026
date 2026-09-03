// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRwm1hMpM0k77QNHkQRAYMePI8bd8Annk",
  authDomain: "hackatoon-2026.firebaseapp.com",
  projectId: "hackatoon-2026",
  storageBucket: "hackatoon-2026.firebasestorage.app",
  messagingSenderId: "763687085803",
  appId: "1:763687085803:web:5e3ea935d68c402582c0ae",
  measurementId: "G-RWMLLQ2D9L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);