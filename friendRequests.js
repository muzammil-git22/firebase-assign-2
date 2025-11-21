import { arrayRemove, arrayUnion, auth, collection, db, doc, getDoc, getDocs, onAuthStateChanged, query, signOut, updateDoc, where } from "./config.js";

let mains = document.getElementById("mains");
// Note: friendRequestsContainer yahan se hata diya hai, function ke andar define karenge.

function getUser() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            console.log("ye user login he abhi", user);
            currentUsersData(uid);
        } else {
            console.log("ye user login nahi he abhi");
            window.location.href = "./login.html";
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

            // HTML Structure Update: Maine yahan 'friendRequests' div add kiya hai
            mains.innerHTML = `
                <header class="flex items-center justify-between bg-white px-4 py-3 border-b">
                <div class="flex items-center gap-4">
                    <!-- Mobile menu button -->
                    <button id="mobile-menu-btn" class="md:hidden p-2 rounded-md hover:bg-gray-100">☰</button>
                    <h2 class="text-lg font-semibold">Dashboard</h2>
                </div>

                <div class="flex items-center gap-4">
                    <div class="relative">
                        <input type="text" placeholder="Search..."
                            class="hidden sm:block w-64 px-3 py-2 border rounded-md focus:outline-none focus:ring" />
                    </div>
                    <button class="p-2 rounded-full hover:bg-gray-100">🔔</button>
                    <div class="flex items-center gap-2">
                        <img onClick="Images()" src="https://avatars.githubusercontent.com/u/53353729?v=4" alt="avatar" class="w-8 h-8 rounded-full" />
                        <span id="names" class="hidden sm:inline-block text-sm">${firstName+" "+lastName}</span>
                    </div>
                </div>
            </header> <br>
                <main class="px-4">
                    <h3 class="text-xl font-bold mb-4 text-gray-700">Friend Requests</h3>
                    <div id="friendRequests" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8"></div>

                    <hr class="my-6">

                    <h3 class="text-xl font-bold mb-4 text-gray-700">All Users</h3>
                    <div id="users" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"></div>
                </main>
            `;

            // HTML banne ke baad ab hum requests fetch karenge
            getFriendRequest(currentUserId);

        } else {
            console.log("Current user data not found");
        }
    } catch (error) {
        console.log("Error getting current user:", error);
    }
}

async function getFriendRequest(currentUserId) {
    // IMP: Element ko yahan select karein kyunki HTML abhi bana hai
    let friendRequestsContainer = document.getElementById("friendRequests");
    
    const docRef = doc(db, "users", currentUserId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return;
    
    const currentUserData = docSnap.data();
    const { friendRequest } = currentUserData;

    // Agar friendRequest array nahi hai ya khali hai
    if (!friendRequest || friendRequest.length === 0) {
        friendRequestsContainer.innerHTML = `<p class="text-gray-500 col-span-3">No new friend requests.</p>`;
        return;
    }

    friendRequestsContainer.innerHTML = ""; // Purana content clear karein

    // Query: Jin users ki ID 'friendRequest' array mein hai unhe laao
    const usersRef = collection(db, "users");
    // Note: 'in' query limits to 10 items. Agar requests > 10 hain to logic change karni paregi.
    const q = query(usersRef, where('userId', 'in', friendRequest));
    
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const { firstName, lastName } = data || {};

        friendRequestsContainer.innerHTML += `
        <article class="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
            <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    ${firstName ? firstName[0] : 'U'}
                </div>
                <div class="flex-1">
                    <h3 class="font-bold text-gray-800">${firstName} ${lastName}</h3>
                    <p class="text-xs text-gray-500">Sent you a request</p>
                    
                    <div class="mt-3 flex gap-2">
                        <button onClick="handleAcceptFriend('${doc.id}', '${currentUserId}')" class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">Accept</button>
                        <button onClick="handleDeclineFriend('${doc.id}', '${currentUserId}')" class="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300">Decline</button>
                    </div>
                </div>
            </div>
        </article>`;
    });
}

window.handleAcceptFriend = async (friendId, currentUserId) => {
    try {
        // 1. Dost ke document mein mujhe add karo (friends array mein)
        const friendRef = doc(db, "users", friendId);
        await updateDoc(friendRef, {
            friends: arrayUnion(currentUserId) // Note: lowercase 'friends' use karein standard practice ke liye
        });

        // 2. Mere document mein dost ko add karo aur request se remove karo
        const myRef = doc(db, "users", currentUserId);
        await updateDoc(myRef, {
            friendRequest: arrayRemove(friendId),
            friends: arrayUnion(friendId)
        });

        console.log("Friend Request Accepted");
        
        // 3. UI Refresh karein (Dobara data fetch karein)
        getFriendRequest(currentUserId);

    } catch (error) {
        console.log("Error accepting friend:", error);
    }
}

window.handleDeclineFriend = async (friendId, currentUserId) => {
    try {
        const myRef = doc(db, "users", currentUserId);
        
        // Sirf request remove karein
        await updateDoc(myRef, {
            friendRequest: arrayRemove(friendId)
        });

        console.log("Friend Request Declined");
        
        // UI Refresh karein
        getFriendRequest(currentUserId);

    } catch (error) {
        console.error("Error declining friend request:", error);
    }
};

window.logOut = () => {
    signOut(auth).then(() => {
        window.location.href = "./login.html";
    }).catch((error) => {
        console.log(error);
    });
}

getUser();