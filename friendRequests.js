import { arrayRemove, arrayUnion, auth, collection, db, doc, getDoc, getDocs, onAuthStateChanged, query, updateDoc, where } from "./config.js";

let friendRequestsContainer = document.getElementById("friendRequests")
function getUser() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/auth.user
            const uid = user.uid;
            console.log("ye user login he abhi", user)
              getFriendRequest(uid)
            // ...
        } else {
            // User is signed out
            console.log("ye user login nahi he abhi")
            window.location.href = "./login.html"
            // ...
        }
    });
}
async function getFriendRequest(currentUserId){
const docRef = doc(db, "users", currentUserId);
const docSnap = await getDoc(docRef);
let currentUserData = null
if (docSnap.exists()) {  
  currentUserData = docSnap.data()
  console.log(currentUserData)
} else {
  // docSnap.data() will be undefined in this case
  console.log("No such document!");
}
debugger
const {friendRequest} = currentUserData
console.log(friendRequest)
 const usersRef = collection(db, "users");
    const q = query(usersRef, where('userId', 'in', friendRequest));
const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const data = doc.data()
        const { firstName , lastName ,userId} = data|| {}
        console.log(data , doc.id)
  friendRequestsContainer.innerHTML = `<article class="friend-card bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow" data-user-id="2">
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


<button id="remove" class="btn-message inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 text-sm text-gray-700 hover:bg-gray-200 transition">
Declear
</button>
</div>
</div>
</div>
</article>`
    });
}
debugger
window.handleAcceptFriend=async(friendId , currentUserId)=>{
try{
   const usersRef = doc(db, "users", friendId );

// Atomically add a new region to the "regions" array field.
await updateDoc(usersRef, {
    Friends: arrayUnion(currentUserId)
});
const myRef = doc(db, "users", currentUserId );
// Atomically remove a region from the "regions" array field.
await updateDoc(myRef, {
    friendRequest: arrayRemove(friendId),
    
});
}catch(error){
console.log(error)
}


}
getUser()