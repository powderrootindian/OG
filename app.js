let cart = [];
let total = 0;
let currentUser = null;

function addToCart(name, price){
  cart.push({name, price});
  total += price;
  renderCart();
}

function renderCart(){
  const div = document.getElementById("cartItems");
  div.innerHTML = "";
  cart.forEach(i=>{
    div.innerHTML += `<p>${i.name} - ₹${i.price}</p>`;
  });
  document.getElementById("total").innerText = total;
}

function payNow(){
  const address = document.getElementById("address").value.trim();
  if(address === "") return alert("Please enter delivery address");
  if(total === 0) return alert("Cart is empty");

  const upi = "8788855688-2@ybl";
  const url = `upi://pay?pa=${upi}&pn=PowderRoot&am=${total}&cu=INR`;
  window.location.href = url;
}

function confirmPaid(){
  if(!currentUser) return alert("Please login first");

  const address = document.getElementById("address").value.trim();
  if(address === "") return alert("Address is required");

  let items = cart.map(i => `${i.name} - ₹${i.price}`).join("<br>");

  emailjs.send("service_cs926jb","template_ojt95o7",{
    name: currentUser.displayName,
    email: currentUser.email,
    address: address,
    items: items,
    total: total
  }).then(()=>{
    alert("Order placed! Invoice sent to your email.");
    cart = [];
    total = 0;
    document.getElementById("address").value = "";
    renderCart();
  });
}

function login(){
  signInWithPopup(auth, provider).then(result=>{
    currentUser = result.user;
    document.getElementById("loginBtn").innerText = currentUser.displayName;
  });
}
