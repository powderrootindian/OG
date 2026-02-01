// 🔥 FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyC-VwmmnGZBPGctP8bWp_ozBBTw45-eYds",
  authDomain: "powderroot26.firebaseapp.com",
  projectId: "powderroot26",
  storageBucket: "powderroot26.firebasestorage.app",
  messagingSenderId: "776300724322",
  appId: "1:776300724322:web:44b8908b6ffe1f6596513b",
  measurementId: "G-3GTKBEFJ2V"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

let currentUser = null;
let bag = [];

// 🔐 LOGIN
document.getElementById("loginBtn").onclick = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch(err => alert(err.message));
};

auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    document.getElementById("loginBtn").innerText = "✔ Logged In";
  }
});

// 🛒 ADD TO BAG
function addToBag(name, price) {
  if (!currentUser) {
    alert("Please login to continue");
    return;
  }
  bag.push({ name, price });
  alert(name + " added to bag");
}

// 💳 CHECKOUT + EMAIL + WHATSAPP
function checkout() {
  if (!currentUser) return alert("Login required");

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const pincode = document.getElementById("pincode").value;

  if (!name || !phone || !address || !pincode) {
    alert("Please fill all details");
    return;
  }

  const total = bag.reduce((sum, item) => sum + item.price, 0);
  if (total <= 0) return alert("Your bag is empty");

  // 📧 EMAILJS SEND
  emailjs.send(
    "service_cs926jb",       // 🔁 replace
    "template_ojt95o7",      // 🔁 replace
    {
      user_name: name,
      user_email: currentUser.email,
      order_details: bag.map(i => `${i.name} - ₹${i.price}`).join(", "),
      total_amount: total,
      shipping_address: `${address}, ${pincode}, Phone: ${phone}`
    },
    "lxY_3luPFEJNp2_dO"      // 🔁 replace
  );

  // 📱 UPI PAYMENT
  const upiUrl = `upi://pay?pa=8788855688-2@ybl&pn=PowderRoot&am=${total}&cu=INR`;
  window.location.href = upiUrl;

  // 📲 WHATSAPP CONFIRMATION
  setTimeout(() => {
    const message =
`New Order - PowderRoot 🌱

Name: ${name}
Phone: ${phone}
Address: ${address}
Pincode: ${pincode}

Total: ₹${total}`;

    window.open(
      `https://wa.me/919096999662?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }, 2000);
}
