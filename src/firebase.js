import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCHtFLHE3Ke0ME0ejN4vZmofd5ZIziGSBo",
  authDomain: "ssambongtaza.firebaseapp.com",
  projectId: "ssambongtaza",
  storageBucket: "ssambongtaza.appspot.com",
  messagingSenderId: "754701320763",
  appId: "1:754701320763:web:a790f400ff6f20d48ed21e",
  measurementId: "G-F0659BF37N"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
