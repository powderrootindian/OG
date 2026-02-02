const firebaseConfig = {
  apiKey: "AIzaSyC-VwmmnGZBPGctP8bWp_ozBBTw45-eYds",
  authDomain: "powderroot26.firebaseapp.com",
  projectId: "powderroot26",
  storageBucket: "powderroot26.firebasestorage.app",
  messagingSenderId: "776300724322",
  appId: "1:776300724322:web:44b8908b6ffe1f6596513b"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

let currentUser = null;
let bag = [];

/* LOGIN */
document.getElementById("loginBtn").onclick = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
};

document.getElementById("logoutBtn").onclick = () => {
  auth.signOut();
  bag = [];
  document.getElementById("cartCount").innerText = "0";
};

/* AUTH STATE */
auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    document.getElementById("loginBtn").style.display = "none";
    document.getElementById("logoutBtn").style.display = "inline-block";
    document.getElementById("userPic").src = user.photoURL;
    document.getElementById("userPic").style.display = "block";
  } else {
    currentUser = null;
    document.getElementById("loginBtn").style.display = "inline-block";
    document.getElementById("logoutBtn").style.display = "none";
    document.getElementById("userPic").style.display = "none";
  }
});

/* CART */
function addToBag(name, price) {
  if (!currentUser) return alert("Please login first");

  bag.push({ name, price });
  const count = document.getElementById("cartCount");
  count.innerText = bag.length;
  count.style.animation = "none";
  count.offsetHeight;
  count.style.animation = "pop 0.3s ease";
}

function toggleBag() {
  document.getElementById("bagSection").classList.toggle("hidden");
}

/* CHECKOUT */
function checkout() {
  if (!currentUser) return alert("Login required");

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const pincode = document.getElementById("pincode").value.trim();

  if (!name || !phone || !address || !pincode) {
    alert("Fill all details");
    return;
  }

  if (bag.length === 0) return alert("Bag empty");

  const total = bag.reduce((s, i) => s + i.price, 0);

  /* UPI — MUST BE FIRST */
  window.location.href =
    `upi://pay?pa=8788855688-2@ybl&pn=PowderRoot&am=${total}&cu=INR`;

  /* BACKGROUND TASKS */
  setTimeout(() => {
    emailjs.send(
      "service_cs926jb",
      "template_ojt95o7",
      {
        user_name: name,
        user_email: currentUser.email,
        order_details: bag.map(i => i.name).join(", "),
        total_amount: total,
        shipping_address: `${address}, ${pincode}, Phone: ${phone}`
      }
    );

    const msg =
`New Order - PowderRoot 🌱
Name: ${name}
Phone: ${phone}
Address: ${address}
Pincode: ${pincode}
Total: ₹${total}`;

    window.open(`https://wa.me/919096999662?text=${encodeURIComponent(msg)}`);
  }, 1200);
}
