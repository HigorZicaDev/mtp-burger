const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("adressText");
const addressWarning = document.getElementById("adressWarning");
const radioLivraison = document.getElementById("radio-livraison");
const radioSurPlace = document.getElementById("radio-surplace");
const adressContainer = document.getElementById("adress-container");

let cart = [];

// Ouvrir modal panier
cartBtn.addEventListener("click", function () {
  cartModal.style.display = "flex";
  updatePanier();
});

cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

radioLivraison.addEventListener("click", function () {
  adressContainer.style.display = "block";
  addressInput.value = "";
});

radioSurPlace.addEventListener("click", function () {
  adressContainer.style.display = "none";
  addressInput.value = "SurPlace";
  console.log(addressInput.value);
});

menu.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".add-to-cart-btn");
  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));

    // Add to panier
    addToPanier(name, price);
  }
});

// function pour add to panier
function addToPanier(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    // se déjà exist , increment quantity
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updatePanier();
  Toastify({
    text: `${name} ajouté au panier! Merci. `,
    duration: 3000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "#2dad3c",
    },
  }).showToast();
}

// function update le panier
function updatePanier() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );
    cartItemElement.innerHTML = `
    <div class="flex items-center justify-between">
        <div>
            <p class="font-medium">${item.name}</p>
            <p>Qtd: ${item.quantity}</p>
            <p class="font-medium mt-2">${item.price.toFixed(2)} €</p>
        </div>

        <button class="border-2 border-gray-300 px-3 py-1 rounded removeBtn" data-name="${
          item.name
        }"><i class="fa fa-trash text-lg text-black"></i></button>

    </div>`;

    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement);
  });

  // update total price
  cartTotal.textContent = total.toLocaleString("fr", {
    style: "currency",
    currency: "EUR",
  });

  cartCounter.innerText = cart.length;
}

// function pour supprimer un item du panier
cartItemsContainer.addEventListener("click", function (event) {
  let parentBtnRemove = event.target.closest(".removeBtn");
  //   console.log(parentBtnRemove);
  if (parentBtnRemove) {
    const name = parentBtnRemove.getAttribute("data-name");
    // console.log(name);
    removeItemCart(name);
  }
});

function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1) {
    const itemDel = cart[index];
    // verify se déjà exist une quantity plus que 1 faire le decrement
    if (itemDel.quantity > 1) {
      itemDel.quantity -= 1;
      updatePanier();
      return;
    }
    // se non exist pas une quantity plus que 1 faire le delete du item du panier
    cart.splice(index, 1);
    updatePanier();
  }
}

addressInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;
  if (inputValue !== "") {
    addressInput.classList.remove("border-red-500");
    addressWarning.classList.add("hidden");
  }
});

checkoutBtn.addEventListener("click", function () {
  const isOpen = checkBurguerOpen();
  if (!isOpen) {
    Toastify({
      text: "Nous sommes désolés, nous sommes actuellement fermés. Revenez plus tard !",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#ef4444",
      },
    }).showToast();

    return;
  }

  if (cart.length === 0) return;

  if ((adressContainer.style.display = "block" && addressInput.value === "")) {
    addressWarning.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  }

  // envoyer au api web whatsapp
  console.log(cart);
  const cartItems = cart
    .map((item) => {
      return `${item.name} Quantity: (${item.quantity}) Prix: ${item.price} € | `;
    })
    .join("");

  const message = encodeURIComponent(cartItems);
  const phone = "648564760";

  window.open(
    `https://wa.me/${phone}?text=${message} Adresse: ${addressInput.value} Total: ${cartTotal.textContent}. `,
    "_blank"
  );

  cart = [];
  updatePanier();
});

// verify les horaires de funcionament
function checkBurguerOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 18 && hora < 24;
}

const spanItem = document.getElementById("date-span");
const isOpen = checkBurguerOpen();

if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600");
} else {
  spanItem.classList.remove("bg-green-600");
  spanItem.classList.add("bg-red-500");
}
