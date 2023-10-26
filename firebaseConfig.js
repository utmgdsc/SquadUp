
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDq9O6KrkJ8Nur9JJQM4wbytSZ7kx7bwXc",
  authDomain: "squadup-de981.firebaseapp.com",
  projectId: "squadup-de981",
  storageBucket: "squadup-de981.appspot.com",
  messagingSenderId: "793452515375",
  appId: "1:793452515375:web:da02e13cf1cd7affe136da"
};


export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
