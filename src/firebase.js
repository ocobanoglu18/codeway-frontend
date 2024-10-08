import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA8TU5MHLxg8TVxKIFL37emoceKV8gbZn4",
    authDomain: "codeway-project-c947e.firebaseapp.com",
    projectId: "codeway-project-c947e",
    storageBucket: "codeway-project-c947e.appspot.com",
    messagingSenderId: "1067558021731",
    appId: "1:1067558021731:web:653412cf53e632a89de656",
    measurementId: "G-P9SJTLPQPC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
console.log("Firebase initialized:", app);
export { auth, app };
