import FIREBASE_APP from "firebase/app";

import "firebase/auth";
import "firebase/firestore";

//TODO MOVE THIS TO ENV
if (FIREBASE_APP.apps.length === 0) {
  const firebaseConfig =
    process.env.NODE_ENV === "production"
      ? {
          apiKey: "AIzaSyA9uBCWtAQs9dKsHkt_K3sEfaqN5JcRUGg",
          authDomain: "mojosms-prod.firebaseapp.com",
          projectId: "mojosms-prod",
          storageBucket: "mojosms-prod.appspot.com",
          messagingSenderId: "1015763571995",
          appId: "1:1015763571995:web:d06dee46a507ea2e3c2fbe",
          measurementId: "G-RF9QTGFSNN",
        }
      : {
          apiKey: "AIzaSyB9eT2acDvMsEzjuP9Iepi6g98_yuTxvoo",
          authDomain: "mojosms-dev.firebaseapp.com",
          projectId: "mojosms-dev",
          storageBucket: "mojosms-dev.appspot.com",
          messagingSenderId: "978605131111",
          appId: "1:978605131111:web:0ee1efbfa60d73bf07dbc2",
          measurementId: "G-JR2R6MKCLS",
        };

  FIREBASE_APP.initializeApp(firebaseConfig);
}

export const FIRESTORE = FIREBASE_APP.firestore();

export const AUTH = FIREBASE_APP.auth();

export { FIREBASE_APP };
