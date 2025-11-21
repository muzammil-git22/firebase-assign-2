import { auth, db, doc, getDoc, onAuthStateChanged, signOut } from "./config.js";

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
let mains = document.getElementById("mains")
function getUser() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            const uid = user.uid;
            console.log("ye user login he abhi", user);
            currentUsersData(uid);
        } else {
            // User is signed out
            console.log("ye user login nahi he abhi");
            window.location.href = './login.html';
        }
    });
}

async function currentUsersData(currentUserId) {
    try {
        
        const docRef = doc(db, "users", currentUserId);
        const docSnap = await getDoc(docRef); 
        if (docSnap.exists()) {
            const currentUserData = docSnap.data();
            const { firstName, lastName } = currentUserData;
            mains.innerHTML  +=  `<div class="flex-1 flex flex-col">
            <!-- Topbar -->
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
            </header>
            <!-- Content container -->
            <main class="p-6 overflow-auto">

                <!-- Stats cards -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div class="bg-white p-4 rounded-lg shadow-sm border">
                        <p class="text-sm text-gray-500">Total Users</p>
                        <p class="text-2xl font-bold mt-1">4,532</p>
                        <p class="text-xs text-green-600 mt-2">▲ 12% since last week</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-sm border">
                        <p class="text-sm text-gray-500">Active Projects</p>
                        <p class="text-2xl font-bold mt-1">128</p>
                        <p class="text-xs text-red-600 mt-2">▼ 3% since last week</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-sm border">
                        <p class="text-sm text-gray-500">Revenue</p>
                        <p class="text-2xl font-bold mt-1">$24,310</p>
                        <p class="text-xs text-green-600 mt-2">▲ 8% since last week</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-sm border">
                        <p class="text-sm text-gray-500">Server Uptime</p>
                        <p class="text-2xl font-bold mt-1">99.98%</p>
                        <p class="text-xs text-green-600 mt-2">Stable</p>
                    </div>
                </div>

                <!-- Main grid: chart area + table -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Chart / Activity panel (placeholder) -->
                    <section class="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm border">
                        <h3 class="font-semibold mb-3">Activity</h3>
                        <div
                            class="h-48 rounded-md bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-center text-gray-400">
                            Chart placeholder</div>
                    </section>

                    <!-- Recent users table -->
                    <section class="bg-white p-4 rounded-lg shadow-sm border">
                        <h3 class="font-semibold mb-3">Recent Users</h3>
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm text-left">
                                <thead class="text-gray-600">
                                    <tr>
                                        <th class="py-2">Name</th>
                                        <th class="py-2">Email</th>
                                        <th class="py-2">Role</th>
                                        <th class="py-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y">
                                    <tr>
                                        <td class="py-2">Sara Ali</td>
                                        <td class="py-2">sara@example.com</td>
                                        <td class="py-2">Admin</td>
                                        <td class="py-2"><span class="text-green-600">Active</span></td>
                                    </tr>
                                    <tr>
                                        <td class="py-2">Hamza Khan</td>
                                        <td class="py-2">hamza@example.com</td>
                                        <td class="py-2">Editor</td>
                                        <td class="py-2"><span class="text-yellow-600">Invited</span></td>
                                    </tr>
                                    <tr>
                                        <td class="py-2">Aisha Noor</td>
                                        <td class="py-2">aisha@example.com</td>
                                        <td class="py-2">Member</td>
                                        <td class="py-2"><span class="text-gray-500">Pending</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="mt-3 text-right">
                            <a href="#" class="text-sm text-blue-600">View all</a>
                        </div>
                    </section>
                </div>

                <!-- Footer area -->
                <footer class="mt-6 text-sm text-gray-500">
                    © <span id="year"></span> MyApp — All rights reserved.
                </footer>

            </main>
        </div>`
            console.log("Data Found:", firstName + " " + lastName);
            
        } else {
            // Agar document nahi mila
            console.log("No such document! User ka data database ma nahi ha.");
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
  
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