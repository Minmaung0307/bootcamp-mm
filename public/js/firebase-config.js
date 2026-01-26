// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCfjWK8f_fIBZ6jlfr14d13xZQ-cHnmBm8",
  authDomain: "bootcamp-mm.firebaseapp.com",
  projectId: "bootcamp-mm",
  storageBucket: "bootcamp-mm.firebasestorage.app",
  messagingSenderId: "515051697270",
  appId: "1:515051697270:web:8f0b0a2c9fb1754d0cdb57",
  measurementId: "G-1D241HKFMD"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// နောက်ပိုင်းမှာ Data တွေကို js/data.js ထဲမှာ hardcode မရေးတော့ဘဲ 
// db.collection('courses').get() ဆိုပြီး Firebase ကနေ ဆွဲယူလို့ရပါတယ်