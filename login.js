import { auth, onAuthStateChanged, signInWithEmailAndPassword,  } from "./config.js";

window.signIn = (event) => {
    event.preventDefault()
    let email = document.getElementById("email")
    let password = document.getElementById("password")
    signInWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log("user", user)
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage)
        });
}

function getUser() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/auth.user
            const uid = user.uid;
            console.log("ye user login he abhi", user)
            setTimeout(() => {
                window.location.href = "./dashboard.html"
            }, 2000);
            // ...
        } else {
            // User is signed out
            console.log("ye user login nahi he abhi")
            // ...
        }
    });
}



getUser()

export{
    getUser
}