emailjs.init("lxY_3luPFEJNp2_dO");

let loggedIn = false;
let bag = [];

document.getElementById("loginBtn").onclick = () => {
  const firebaseConfig = {
  apiKey: "AIzaSyC-VwmmnGZBPGctP8bWp_ozBBTw45-eYds",
  authDomain: "powderroot26.firebaseapp.com",
  projectId: "powderroot26",
  storageBucket: "powderroot26.firebasestorage.app",
  messagingSenderId: "776300724322",
  appId: "1:776300724322:web:44b8908b6ffe1f6596513b",
  measurementId: "G-3GTKBEFJ2V"
};
  loggedIn = true;
  document.getElementById("loginBtn").innerText = "Logged In ✔";
};

function addToBag(product, price) {
  if (!loggedIn) {
    alert("Login required");
    return;
  }
  bag.push({ product, price });
  alert(product + " added to bag");
}

document.getElementById("bagBtn").onclick = () => {
  if (!loggedIn) {
    alert("Login required");
    return;
  }

  document.getElementById("mainSite").style.display = "none";
  document.getElementById("bagPage").classList.remove("hidden");

  const items = document.getElementById("bagItems");
  items.innerHTML = "";
  bag.forEach(i => {
    items.innerHTML += `<p>${i.product} - ₹${i.price}</p>`;
  });
};

function checkout() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const pincode = document.getElementById("pincode").value;

  if (!name || !phone || !address || !pincode) {
    alert("All fields are mandatory");
    return;
  }

  const total = bag.reduce((s,i)=>s+i.price,0);

  emailjs.send("service_cs926jb","template_ojt95o7",{
    name, phone, address, pincode,
    items: JSON.stringify(bag),
    total
  });

  window.location.href =
    `upi://pay?pa=8788855688-2@ybl&pn=PowderRoot&am=${total}&cu=INR`;

  setTimeout(() => {
    window.open(
      `https://wa.me/919096999662?text=New Order from PowderRoot ₹${total}`
    );
    document.getElementById("bagPage").classList.add("hidden");
    document.getElementById("successPage").classList.remove("hidden");
  },2000);
}
