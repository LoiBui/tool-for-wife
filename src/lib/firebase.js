import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

let firebaseConfig = {
    apiKey: "AIzaSyBMrDIZGVCW2eIrmqX0poRSvyE5k9tFJug",
    authDomain: "cau-long.firebaseapp.com",
    databaseURL:
        "https://cau-long-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "cau-long",
    storageBucket: "cau-long.appspot.com",
    messagingSenderId: "964589922905",
    appId: "1:964589922905:web:428a6345e042d18151df48",
    measurementId: "G-THGEQ9SMK8",
};

//dev
// firebaseConfig = {
//     apiKey: "AIzaSyCXU32bWUkjlF7HzzE5WXPTYBU29IQswt4",
//     authDomain: "vuetest198.firebaseapp.com",
//     databaseURL: "https://vuetest198.firebaseio.com",
//     projectId: "vuetest198",
//     storageBucket: "vuetest198.appspot.com",
//     messagingSenderId: "734760301478",
//     appId: "1:734760301478:web:773ebc876fb879b028d567",
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
