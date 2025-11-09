 
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
  import { getAuth , createUserWithEmailAndPassword ,  signInWithEmailAndPassword ,onAuthStateChanged , signOut} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js";
 import { getFirestore , setDoc, doc} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

  
  const firebaseConfig = {
    apiKey: "AIzaSyD4giLD0xALu9dBiDsW2DfsH4E_aiws0Fo",
    authDomain: "saas-dashboard-f253d.firebaseapp.com",
    projectId: "saas-dashboard-f253d",
    storageBucket: "saas-dashboard-f253d.firebasestorage.app",
    messagingSenderId: "648086624467",
    appId: "1:648086624467:web:c279cd9b6c1ce1f66e9c26",
    measurementId: "G-GNKB8D2N93"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  // Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
export{
    auth,
    createUserWithEmailAndPassword,
      signInWithEmailAndPassword,
      onAuthStateChanged,
      signOut,
      db,
      setDoc,
      doc,
  }