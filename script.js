// Завантаження продуктів з "products.json"
let products = [];
let favorites = [];
let cart = [];

const container = document.getElementById('product-list');
const header = document.querySelector('header');
const navButtons = {
    home: document.getElementById('btn-home'),
    favorites: document.getElementById('btn-favorites'),
    cart: document.getElementById('btn-cart')
};

function fetchProducts() {
    return fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
        });
}

function renderProducts(list) {
    container.innerHTML = '';
    if (list.length === 0) {
        container.innerHTML = '<p>Немає товарів для відображення.</p>';
        return;
    }
    list.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('card');

        const liked = favorites.some(fav => fav.id === product.id);
        const inCart = cart.some(item => item.id === product.id);

        card.innerHTML = `
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="price">${product.price}</div>
        <button class="like-btn">${liked ? 'Вподобано' : 'Вподобати'}</button>
        <button class="buy-btn">${inCart ? 'В кошику' : 'Купити'}</button>
        `;

        card.querySelector('.like-btn').addEventListener('click', () => {
            toggleFavorite(product);
            renderCurrentView();
        });

        card.querySelector('.buy-btn').addEventListener('click', () => {
            addToCart(product);
            renderCurrentView();
        });

        container.appendChild(card);
    });
}

function toggleFavorite(product) {
    const index = favorites.findIndex(fav => fav.id === product.id);
    if (index === -1) {
        favorites.push(product);
        alert(`Вподобано: ${product.name}`);
    } else {
        favorites.splice(index, 1);
        alert(`Видалено з вподобань: ${product.name}`);
    }
}

function addToCart(product) {
    if (!cart.some(item => item.id === product.id)) {
        cart.push(product);
        alert(`Додано у кошик: ${product.name}`);
    } else {
        alert(`Товар вже у кошику: ${product.name}`);
    }
}

function renderFavorites() {
    renderProducts(favorites);
}

function renderCart() {
    container.innerHTML = '';
    if (cart.length === 0) {
        container.innerHTML = '<p>Кошик порожній.</p>';
        return;
    }
    const listDiv = document.createElement('div');
    listDiv.classList.add('cart-list');

    cart.forEach(product => {
        const item = document.createElement('div');
        item.classList.add('cart-item');
        item.textContent = `${product.name} - ${product.price}`;
        listDiv.appendChild(item);
    });

    container.appendChild(listDiv);

    const form = document.createElement('form');
    form.classList.add('checkout-form');
    form.innerHTML = `
        <h3>Оформлення замовлення</h3>
        <label>Ім'я:<br><input type="text" name="name" required></label><br>
        <label>Email:<br><input type="email" name="email" required></label><br>
        <label>Телефон:<br><input type="tel" name="phone" required></label><br>
        <label>Адреса:<br><textarea name="address" required></textarea></label><br>
        <button type="submit">Підтвердити замовлення</button>
    `;

    form.addEventListener('submit', e => {
        e.preventDefault();
        alert('Дякуємо за замовлення!');
        cart = [];
        renderCurrentView();
    });

    container.appendChild(form);
}

let currentView = 'home';

function renderCurrentView() {
    switch (currentView) {
        case 'home':
            renderProducts(products);
            break;
        case 'favorites':
            renderFavorites();
            break;
        case 'cart':
            renderCart();
            break;
    }
}

navButtons.home.addEventListener('click', () => {
    currentView = 'home';
    renderCurrentView();
});
navButtons.favorites.addEventListener('click', () => {
    currentView = 'favorites';
    renderCurrentView();
});
navButtons.cart.addEventListener('click', () => {
    currentView = 'cart';
    renderCurrentView();
});

fetchProducts().then(() => {
    renderCurrentView();
});
