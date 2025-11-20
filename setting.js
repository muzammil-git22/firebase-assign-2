import { auth, db, doc, getDoc, onAuthStateChanged } from "./config.js";
let mains = document.getElementById("mains")
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


        } else {
            console.log("Current user ka data nahi mila");
        }
    } catch (error) {
        console.log("Error getting current user:", error);
    }
}
getUser()