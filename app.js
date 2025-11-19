import { auth, createUserWithEmailAndPassword, db, doc, setDoc } from "./config.js"
import { getUser} from "./login.js"
let email = document.getElementById("email")
let password = document.getElementById("password")
let firstName = document.getElementById("firstName")
let lastName = document.getElementById("lastName")
let phoneNumber = document.getElementById("phoneNumber")

window.signUp = async (event) => { 
    event.preventDefault()

    console.log(email.value, password.value)

    createUserWithEmailAndPassword(auth, email.value, password.value)
        .then(async (userCredential) => { 
            const user = userCredential.user;
            await saveDataToDb(firstName, lastName, email, phoneNumber, user.uid);
            console.log(user, 'sahi chal gaya')
            
            // setTimeout(() => {
            //     window.location.href = "./dashboard.html"
            // }, 4000);
            
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage, "masla agaya he ")
            // ..
        });

    }
    

 async function saveDataToDb(firstName, lastName, email, phoneNumber, userId) {
    console.log("running");
    await setDoc(doc(db, "users", userId), {
        firstName: firstName.value,
        lastName: lastName.value,
        email:email.value,
        phoneNumber:phoneNumber.value,
        userId:userId
    });
    console.log("Data saved successfully!");
}


getUser()