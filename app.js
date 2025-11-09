import { auth, db } from "./config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";


window.signUp = (event)=>{
    event.preventDefault();
    let email = document.getElementById("email")
    let password = document.getElementById("password")
    let firstName = document.getElementById("firstName")
    let lastName = document.getElementById("lastName")
    let phoneNumber = document.getElementById("phoneNumber")
    console.log(email.value, password.value, firstName.value, lastName.value , password.value)
    createUserWithEmailAndPassword(auth, email.value, password.value)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    savedDatadb(firstName , lastName , phoneNumber , user.uid)
    console.log("ya wo user ha jo a gaya ha", user );
      window.location.href = "login.html"
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage);
    // ..
  });
}
debugger
async function savedDatadb(firstName , lastName , phoneNumber , userId){
await setDoc(doc(db, "users", userId),{
  firstName: firstName.value,
  lastName: lastName.value,
  phoneNumber: phoneNumber.value,
  userId: userId,
});
}

