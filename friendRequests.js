
import { auth, db, doc, getDoc, onAuthStateChanged } from "./config.js";

function getUser() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/auth.user
            const uid = user.uid;
            console.log("ye user login he abhi", user)
            getFriendRequests(uid)
            // ...
        } else {
            // User is signed out
            console.log("ye user login nahi he abhi")
            // ...
        }
    });
}

async function getFriendRequests(currentUserId) {

    const docRef = doc(db, "users", currentUserId);
    const docSnap = await getDoc(docRef);
    let currentUserData = null

    if (docSnap.exists()) {
        currentUserData = docSnap.data()
    } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
    }

    const {friendRequest} = currentUserData
    console.log(friendRequest)
    // const usersRef = collection(db, "users" , currentUserId , "friendRequest");
    // const q = query(usersRef, where('userId', 'in', ['USA', 'Japan']));
}


getUser()
