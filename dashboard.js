import { auth, onAuthStateChanged, signOut } from "./config.js";

window.logOut = () => {
    signOut(auth).then(() => {
        console.log("log out ho chuka he")
        window.location.href = "./login.html"
        // Sign-out successful.
    }).catch((error) => {
        console.log(error, "error agaya he ")
        // An error happened.
    });
}

function getUser() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/auth.user
            const uid = user.uid;
            console.log("ye user login he abhi", user)
           
            // ...
        } else {
            // User is signed out
            console.log("ye user login nahi he abhi")
            window.location.href = './login.html'
            // ...
        }
    });
}



getUser()

// small scripts for demo behavior
document.getElementById('year').textContent = new Date().getFullYear();
const btn = document.getElementById('mobile-menu-btn');
const mobile = document.getElementById('mobile-sidebar');
const close = document.getElementById('mobile-close');
btn?.addEventListener('click', () => mobile.classList.remove('hidden'));
close?.addEventListener('click', () => mobile.classList.add('hidden'));
mobile?.addEventListener('click', (e) => { if (e.target === mobile) mobile.classList.add('hidden') });