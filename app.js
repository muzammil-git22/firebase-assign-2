import { auth, createUserWithEmailAndPassword, db, doc, setDoc } from "./config.js";
// import { getUser } from "./login.js"; // Note: Signup page par iski zarurat shayad na ho, agar ye auto-redirect karta hai to isse hata dein.

let email = document.getElementById("email");
let password = document.getElementById("password");
let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let phoneNumber = document.getElementById("phoneNumber");
let signupBtn = document.getElementById("signup-btn"); // Apne button ko id="signup-btn" lazmi dein HTML ma

window.signUp = async (event) => {
    event.preventDefault(); // Form ko refresh hone se rokta hai

    // 1. Button ko disable karein taake user bar bar click na kare
    if(signupBtn) {
        signupBtn.innerText = "Loading...";
        signupBtn.disabled = true;
    }

    try {
        console.log("Account create ho raha hai...");
        
        // 2. Pehle Authentication complete hone ka wait karein
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;
        
        console.log("User create ho gaya:", user.uid);

        // 3. Ab Database mein data save hone ka WAIT karein (await lagana zaroori hai)
        await saveDataToDb(firstName, lastName, email, phoneNumber, user.uid);

        // 4. Jab upar wali line complete ho jaye, tab hi redirect karein
        console.log("Sab kuch sahi chal gaya, ab redirect kar rahe hain...");
        window.location.href = "./dashboard.html";

    } catch (error) {
        // Agar koi error aye to yahan pakra jayega
        const errorMessage = error.message;
        console.log("Masla agaya hai:", errorMessage);
        alert(errorMessage); // User ko batayen ke error aya hai

        // Button ko wapis normal karein taake user dobara try kar sake
        if(signupBtn) {
            signupBtn.innerText = "Signup";
            signupBtn.disabled = false;
        }
    }
}

async function saveDataToDb(firstName, lastName, email, phoneNumber, userId) {
    console.log("Database mein data ja raha hai...");
    
    // Yahan await ensure karega ke jab tak data write na ho jaye, code aage na barhe
    await setDoc(doc(db, "users", userId), {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        phoneNumber: phoneNumber.value,
        userId: userId,
        profilePic: "" // Future ke liye khali field
    });

    console.log("Data saved successfully!");
}