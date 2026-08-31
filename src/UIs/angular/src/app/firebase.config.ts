// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCZuV7El089Y52c6G_-O94v65EuvHL9MO0",
    authDomain: "mymedibook-6a37f.firebaseapp.com",
    projectId: "mymedibook-6a37f",
    storageBucket: "mymedibook-6a37f.firebasestorage.app",
    messagingSenderId: "1051798615532",
    appId: "1:1051798615532:web:e5bed54799d16656dcfcc9",
    measurementId: "G-90LYJ7KX8D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);	