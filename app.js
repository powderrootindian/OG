/*************************************************
 * FIREBASE GOOGLE AUTH
 *************************************************/
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

auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    document.getElementById("userBox").classList.remove("hidden");
    document.getElementById("userPic").src = user.photoURL;
  } else {
    currentUser = null;
    document.getElementById("userBox").classList.add("hidden");
  }
});

function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch(e => alert(e.message));
}

document.getElementById("logoutBtn").onclick = () => auth.signOut();

/*************************************************
 * CART
 *************************************************/
let cart = [];

function toggleCart() {
  document.getElementById("cart").classList.toggle("hidden");
}

function addToCart(name, price) {
  if (!currentUser) return alert("Login required");

  const item = cart.find(i => i.name === name);
  item ? item.qty++ : cart.push({ name, price, qty: 1 });
  updateUI();
}

function changeQty(i, d) {
  cart[i].qty += d;
  if (cart[i].qty <= 0) cart.splice(i, 1);
  updateUI();
}

function updateUI() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById("cartCount").innerText = count;

  let html = "";
  let total = 0;
  cart.forEach((i, idx) => {
    total += i.price * i.qty;
    html += `
      <div class="cart-row">
        <span>${i.name}</span>
        <div class="qty">
          <button onclick="changeQty(${idx},-1)">−</button>
          ${i.qty}
          <button onclick="changeQty(${idx},1)">+</button>
        </div>
        ₹${i.price * i.qty}
      </div>`;
  });

  document.getElementById("cartItems").innerHTML = html;
  document.getElementById("totalAmount").innerText = "₹" + total;
}

/*************************************************
 * PAYMENT + EMAILJS + WHATSAPP
 *************************************************/
function placeOrder() {
  if (!currentUser) return alert("Login required");
  if (!cart.length) return alert("Cart empty");

  // 🔹 OPEN DIRECT PAYMENT
  window.open("upi://pay?pa=8788855688-2@ybl&pn=PowderRoot", "_blank");

  let orderText = "";
  let total = 0;

  cart.forEach(i => {
    orderText += `${i.name} x${i.qty} = ₹${i.price * i.qty}\n`;
    total += i.price * i.qty;
  });

  // 🔹 SEND EMAIL (EMAILJS)
  emailjs.send("service_cs926jb", "template_ojt95o7", {
    user_name: currentUser.displayName,
    user_email: currentUser.email,
    order_details: orderText,
    total_amount: total
  });

  // 🔹 WHATSAPP ORDER
  setTimeout(() => {
    window.open(
      `https://wa.me/919096999662?text=${encodeURIComponent(
        "Paid Order – PowderRoot\n\n" + orderText + "\nTotal: ₹" + total
      )}`,
      "_blank"
    );

    document.getElementById("success").classList.remove("hidden");
    cart = [];
    updateUI();
  }, 1200);
}
