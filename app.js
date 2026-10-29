const products = [
  {
    id: "brasa-classico",
    name: "Brasa Clássico",
    category: "hamburguer",
    description: "Pão brioche, smash 150g, queijo prato, picles e molho da casa.",
    price: 32.9,
    tag: "O queridinho",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "duplo-cheddar",
    name: "Duplo Cheddar",
    category: "hamburguer",
    description: "Dois smash burgers, cheddar cremoso e cebola caramelizada.",
    price: 39.9,
    tag: "Pra matar a fome",
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "veggie-da-horta",
    name: "Veggie da Horta",
    category: "hamburguer",
    description: "Burger de grão-de-bico, queijo, rúcula e maionese de ervas.",
    price: 31.9,
    tag: "Sem carne",
    image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "fritas-da-casa",
    name: "Fritas da Casa",
    category: "acompanhamento",
    description: "Batatas rústicas crocantes com páprica e maionese da casa.",
    price: 18.9,
    tag: "Crocantes de verdade",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "onion-rings",
    name: "Onion Rings",
    category: "acompanhamento",
    description: "Anéis de cebola empanados, douradinhos e feitos na hora.",
    price: 17.9,
    tag: "Pra compartilhar",
    image: "https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "milkshake-chocolate",
    name: "Milk-shake de Chocolate",
    category: "bebida",
    description: "Chocolate cremoso, sorvete de baunilha e chantilly.",
    price: 19.9,
    tag: "Gelado e cremoso",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=700&q=80",
  },
];

const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const cart = new Map();
const productGrid = document.querySelector("#product-grid");
const cartDrawer = document.querySelector("#cart-drawer");
const cartBackdrop = document.querySelector("#drawer-backdrop");
const cartItems = document.querySelector("#cart-items");
const cartEmpty = document.querySelector("#cart-empty");
const cartSummary = document.querySelector("#cart-summary");
const checkoutDialog = document.querySelector("#checkout-dialog");
const successDialog = document.querySelector("#success-dialog");

function renderProducts(category = "todos") {
  const visibleProducts =
    category === "todos"
      ? products
      : products.filter((product) => product.category === category);

  productGrid.innerHTML = visibleProducts
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-card__image" role="img" aria-label="${product.name}" style="background-image: url('${product.image}')">
            <span class="product-tag">${product.tag}</span>
          </div>
          <div class="product-card__body">
            <div class="product-card__title-row">
              <h3>${product.name}</h3>
              <span class="product-price">${money.format(product.price)}</span>
            </div>
            <p class="product-description">${product.description}</p>
            <button class="add-button" type="button" data-add="${product.id}">
              Adicionar ao pedido <span aria-hidden="true">+</span>
            </button>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderCart() {
  const entries = Array.from(cart.entries());
  const itemCount = entries.reduce((sum, [, quantity]) => sum + quantity, 0);
  const subtotal = entries.reduce((sum, [id, quantity]) => {
    const product = products.find((item) => item.id === id);
    return sum + product.price * quantity;
  }, 0);

  const cartCount = document.querySelector("#cart-count");
  cartCount.textContent = String(itemCount);
  cartCount.hidden = itemCount === 0;
  document.querySelector("#cart-subtotal").textContent = money.format(subtotal);
  document.querySelector("#cart-total").textContent = money.format(subtotal);
  document.querySelector("#checkout-total").textContent = money.format(subtotal);
  document.querySelector("#success-receipt-total").textContent = money.format(subtotal);
  cartEmpty.hidden = entries.length > 0;
  cartSummary.hidden = entries.length === 0;
  cartItems.hidden = entries.length === 0;
  cartItems.innerHTML = entries
    .map(([id, quantity]) => {
      const product = products.find((item) => item.id === id);
      return `
        <article class="cart-item">
          <div class="cart-item__image" role="img" aria-label="${product.name}" style="background-image: url('${product.image}')"></div>
          <div class="cart-item__details">
            <h3>${product.name}</h3>
            <span>${money.format(product.price)} cada</span>
            <div class="quantity-control" aria-label="Quantidade de ${product.name}">
              <button type="button" data-quantity="${id}" data-change="-1" aria-label="Remover um ${product.name}">−</button>
              <span>${quantity}</span>
              <button type="button" data-quantity="${id}" data-change="1" aria-label="Adicionar um ${product.name}">+</button>
            </div>
          </div>
          <span class="cart-item__price">${money.format(product.price * quantity)}</span>
        </article>
      `;
    })
    .join("");
}

function openCart() {
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
  cartBackdrop.hidden = false;
  requestAnimationFrame(() => cartBackdrop.classList.add("is-visible"));
  document.body.classList.add("drawer-open");
  document.querySelector("#close-cart").focus();
}

function closeCart() {
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  cartBackdrop.classList.remove("is-visible");
  document.body.classList.remove("drawer-open");
  window.setTimeout(() => {
    if (!cartDrawer.classList.contains("is-open")) {
      cartBackdrop.hidden = true;
    }
  }, 230);
}

document.querySelector("#product-grid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;

  const id = button.dataset.add;
  cart.set(id, (cart.get(id) || 0) + 1);
  renderCart();
  button.innerHTML = "Adicionado! <span aria-hidden=\"true\">✓</span>";
  window.setTimeout(() => {
    if (button.isConnected) {
      button.innerHTML = "Adicionar ao pedido <span aria-hidden=\"true\">+</span>";
    }
  }, 1100);
});

document.querySelector(".category-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  document.querySelectorAll(".category-button").forEach((categoryButton) => {
    categoryButton.classList.toggle("is-active", categoryButton === button);
  });
  renderProducts(button.dataset.category);
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-quantity]");
  if (!button) return;

  const id = button.dataset.quantity;
  const nextQuantity = cart.get(id) + Number(button.dataset.change);
  if (nextQuantity <= 0) {
    cart.delete(id);
  } else {
    cart.set(id, nextQuantity);
  }
  renderCart();
});

document.querySelector("#open-cart").addEventListener("click", openCart);
document.querySelector("#close-cart").addEventListener("click", closeCart);
cartBackdrop.addEventListener("click", closeCart);

document.querySelector("#browse-menu").addEventListener("click", () => {
  closeCart();
  document.querySelector("#cardapio").scrollIntoView({ behavior: "smooth" });
});

document.querySelector("#checkout-button").addEventListener("click", () => {
  closeCart();
  checkoutDialog.showModal();
  document.querySelector("#customer-name").focus();
});

document.querySelector("#close-checkout").addEventListener("click", () => {
  checkoutDialog.close();
});

document.querySelector("#checkout-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.querySelector("#customer-name").value.trim();
  if (!name) return;

  document.querySelector("#success-name").textContent = name.split(/\s+/)[0];
  checkoutDialog.close();
  successDialog.showModal();
});

document.querySelector("#finish-demo").addEventListener("click", () => {
  successDialog.close();
  cart.clear();
  renderCart();
  document.querySelector("#checkout-form").reset();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

renderProducts();
renderCart();
