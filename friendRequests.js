import { arrayRemove, arrayUnion, auth, collection, db, doc, getDoc, getDocs, onAuthStateChanged, query, signOut, updateDoc, where } from "./config.js";
let mains = document.getElementById("mains");
let friendRequestsContainer = document.getElementById("friendRequests")
function getUser() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/auth.user
            const uid = user.uid;
            console.log("ye user login he abhi", user)
              currentUsersData(uid)
            // ...
        } else {
            // User is signed out
            console.log("ye user login nahi he abhi")
            window.location.href = "./login.html"
            // ...
        }
    });
}
async function currentUsersData(currentUserId) {
    try {
        const docRef = doc(db, "users", currentUserId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const { firstName, lastName } = data;

            // Yahan hum Header set kar rahe hain aur neeche "users" ka div bana rahe hain
            // Taake baad mein getUsers function us div mein cards daal sake
            mains.innerHTML = `
                <!-- HEADER START -->
                <header class="flex items-center justify-between bg-white px-4 py-3 border-b mb-6">
                    <div class="flex items-center gap-4">
                        <button id="mobile-menu-btn" class="md:hidden p-2 rounded-md hover:bg-gray-100">☰</button>
                        <h2 class="text-lg font-semibold">Users</h2>
                    </div>

                    <div class="flex items-center gap-4">
                        <div class="relative">
                            <input type="text" placeholder="Search..." class="hidden sm:block w-64 px-3 py-2 border rounded-md focus:outline-none focus:ring" />
                        </div>
                        <button class="p-2 rounded-full hover:bg-gray-100">🔔</button>
                        <div class="flex items-center gap-2">
                            <img src="https://avatars.githubusercontent.com/u/53353729?v=4" alt="avatar" class="w-8 h-8 rounded-full" />
                            <!-- YAHAN HUMNE NAAM CHANGE KIYA HAI -->
                            <span class="hidden sm:inline-block text-sm ">${firstName} ${lastName}</span>
                        </div>
                    </div>
                </header>

                <!-- USERS LIST CONTAINER (Jahan cards ayenge) -->
                <div id="users" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"></div>
            `;

            // Header banne ke baad ab hum baaki users ko load karenge
            getFriendRequest(currentUserId);

        } else {
            console.log("Current user ka data nahi mila");
        }
    } catch (error) {
        console.log("Error getting current user:", error);
    }
}
async function getFriendRequest(currentUserId){
const docRef = doc(db, "users", currentUserId);
const docSnap = await getDoc(docRef);
let currentUserData = null
if (docSnap.exists()) {  
  currentUserData = docSnap.data()
  console.log(currentUserData)
} else {

  console.log("No such document!");
}

const {friendRequest} = currentUserData
console.log(friendRequest)
if (!friendRequest || friendRequest.length === 0) {
        console.log("No friend requests, skipping query.");
        friendRequestsContainer.innerHTML = `<p class="text-center text-gray-500">Koi friend request nahi hai.</p>`;
        return; 
    }
friendRequestsContainer.innerHTML = ""
 const usersRef = collection(db, "users");
    const q = query(usersRef, where('userId', 'in', friendRequest));
const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const data = doc.data()
        const { firstName , lastName} = data|| {}
        console.log(data , doc.id)
  friendRequestsContainer.innerHTML += `<article id="Friend-cards" class="friend-card bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow" data-user-id="2">
<div class="flex items-center gap-3">
<div class="avatar w-16 h-16 rounded-xl flex-shrink-0 avatar-gradient overflow-hidden flex items-center justify-center text-white font-semibold text-lg">
<img src="https://i.pravatar.cc/160?img=56" alt="User avatar" class="w-full h-full object-cover rounded-xl" loading="lazy">
</div>
<div class="flex-1 min-w-0">
<div class="flex items-center justify-between">
<div>
<h3 class="text-gray-900 font-medium truncate">${firstName+" " +lastName}</h3>
<p class="text-xs text-gray-500 truncate">Frontend Dev · Islamabad</p>
</div>
<div class="text-right">
<span class="text-xs text-gray-400 font-medium status-badge">Not friends</span>
</div>
</div>


<p class="mt-2 text-sm text-gray-500 truncate">2 mutual friends</p>


<div class="mt-3 flex items-center gap-2">
<button onClick="handleAcceptFriend('${doc.id}' , '${currentUserId}')" class="btn-add inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-indigo-600 text-indigo-600 text-sm font-medium shadow-sm hover:bg-indigo-50 transition" aria-pressed="false">
<!-- add icon -->
<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
Accept
</button>


<button onClick="handleDeclineFriend('${doc.id}' , '${currentUserId}')"  class="btn-message inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 text-sm text-gray-700 hover:bg-gray-200 transition">
Declear
</button>
</div>
</div>
</div>
</article>`
    });
}

window.handleAcceptFriend=async(friendId , currentUserId)=>{
try{
   const usersRef = doc(db, "users", friendId );


await updateDoc(usersRef, {
    Friends: arrayUnion(currentUserId)
});
const myRef = doc(db, "users", currentUserId );
// Atomically remove a region from the "regions" array field.
await updateDoc(myRef, {
    friendRequest: arrayRemove(friendId),
    friends: arrayUnion(friendId)
});

}catch(error){
console.log(error)
}
 let friendRequestsContainer = document.getElementById("friendRequests");
 friendRequestsContainer.innerHTML = ""

}
window.handleDeclineFriend = async (friendId, currentUserId) => {
    try {
        const myRef = doc(db, "users", currentUserId);

        // Sirf 1 kaam: Apne document se 'friendRequest' ko remove karna hai.
        await updateDoc(myRef, {
            friendRequest: arrayRemove(friendId)
        });

        console.log(`Friend request from ${friendId} declined successfully.`);

         let friendRequestsContainer = document.getElementById("friendRequests");
 friendRequestsContainer.innerHTML = "" 

    } catch (error) {
        console.error("Error declining friend request:", error);
    }
};
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
getUser()
