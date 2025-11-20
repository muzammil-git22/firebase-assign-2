import { arrayRemove, arrayUnion, auth, collection, db, doc, getDoc, getDocs, onAuthStateChanged, query, signOut, updateDoc, where } from "./config.js";

let mains = document.getElementById("mains");

function getUser() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            console.log("User login hai:", user);
            currentUsersData(uid);
            
        } else {
            console.log("User login nahi hai");
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
            getUsers(currentUserId);

        } else {
            console.log("Current user ka data nahi mila");
        }
    } catch (error) {
        console.log("Error getting current user:", error);
    }
}
// Baki imports wese hi rahenge...

// 1. GET USERS FUNCTION (Isme check laga diya hai ke button kab dikhana hai)
async function getUsers(currentUserId) {
    let userContainer = document.getElementById("users");
    userContainer.innerHTML = ""; 
    
    const q = query(collection(db, "users"), where("userId", "!=", currentUserId));
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const { firstName, lastName, friendRequest } = data || {};

        // CHECK: Kya current user ne pehle se request bheji hui hai?
        // Agar friendRequest array exist karta hai aur usme currentUserId hai, to true
        const isRequestAlreadySent = friendRequest && friendRequest.includes(currentUserId);

        // Agar request nahi bheji, tabhi button banayenge
        // Humne button code ko ek variable mein rakha hai
        let actionButton = "";
        
        if (!isRequestAlreadySent) {
            // Agar request nahi bheji to Button show karo
            // Note: Button ko ek unique ID di hai: id="btn-add-${doc.id}"
            actionButton = `
            <button id="btn-add-${doc.id}" onClick="handleAddFriend('${doc.id}' , '${currentUserId}')" class="btn-add inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-indigo-600 text-indigo-600 text-sm font-medium shadow-sm hover:bg-indigo-50 transition">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Add Friend
            </button>`;
        } else {
            // Agar request bheji hui hai to 'Request Sent' likha aye (Optional)
            actionButton = `<span class="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">Request Sent</span>`;
        }

        userContainer.innerHTML += `
        <div class="friend-card bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow" data-user-id="${doc.id}">
            <div class="flex items-center gap-3">
                <div class="avatar w-16 h-16 rounded-xl flex-shrink-0 avatar-gradient overflow-hidden flex items-center justify-center text-white font-semibold text-lg">
                    <img src="https://i.pravatar.cc/160?img=${Math.floor(Math.random() * 5)}" alt="User avatar" class="w-full h-full object-cover rounded-xl" loading="lazy">
                </div>

                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-gray-900 font-medium truncate">${firstName} ${lastName}</h3>
                            <p class="text-xs text-gray-500 truncate">Frontend Dev · Islamabad</p>
                        </div>
                        <div class="text-right">
                            <span class="text-xs text-gray-400 font-medium status-badge">Not friends</span>
                        </div>
                    </div>

                    <p class="mt-2 text-sm text-gray-500 truncate">2 mutual friends</p>

                    <div class="mt-3 flex items-center gap-2">
                        <!-- Yahan wo variable use kiya hai -->
                        ${actionButton}

                        <button onClick="handleRemoveFriend('${doc.id}' , '${currentUserId}')" class="btn-message inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 text-sm text-gray-700 hover:bg-gray-200 transition">
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
    });
}

// 2. HANDLE ADD FRIEND (Button click par remove karne wala logic)
window.handleAddFriend = (friendId, currentUserId) => {
    console.log(`Sending friend request from ${currentUserId} to ${friendId}`);
    
    // UI Optimization: Click karte hi button disable kar dein taake user double click na kare
    const btn = document.getElementById(`btn-add-${friendId}`);
    if(btn) {
        btn.innerText = "Sending...";
        btn.disabled = true;
    }

    const userRef = doc(db, 'users', friendId);
    
    updateDoc(userRef, { friendRequest: arrayUnion(currentUserId) })
    .then(() => {
        // Success hone par alert
        alert("Friend Request Sent Successfully!");

        // --- MAIN LOGIC: Button ko remove karna ---
        if (btn) {
            // Button ki jagah text likh dein ya poora remove kar dein
            // Option A: Poora Remove karna:
            // btn.remove(); 
            
            // Option B (Behtar): Button ki jagah "Request Sent" likhna
            btn.outerHTML = `<span class="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">Request Sent</span>`;
        }
    })
    .catch((error) => {
        console.error("Error sending request: ", error);
        alert("Failed to send request.");
        // Agar fail ho jaye to button wapis sahi kar dein
        if(btn) {
            btn.innerText = "Add Friend";
            btn.disabled = false;
        }
    });
}

window.handleRemoveFriend = async (friendId, currentUserId) => {
    console.log(`Removing friend/request: Current User ID: ${currentUserId}, Target ID: ${friendId}`);
    try {
        const friendRef = doc(db, 'users', currentUserId);
        await updateDoc(friendRef, {
            friendRequest: arrayRemove(friendId)
        });

        console.log("Database updated successfully");
        const cardToRemove = document.querySelector(`.friend-card[data-user-id='${friendId}']`);
        if (cardToRemove) {
            cardToRemove.remove();
            alert("Friend request canceled / User removed.");
        } else {
            alert("Database updated, but card element not found.");
        }
    } catch (error) {
        console.error("Error removing friend/request: ", error);
        alert("Failed to remove friend/request.");
    }
}

window.logOut = () => {
    signOut(auth).then(() => {
        console.log("log out ho chuka he")
        window.location.href = "./login.html"
    }).catch((error) => {
        console.log(error, "error agaya he ")
    });
}

// START APP
getUser();