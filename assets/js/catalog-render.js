document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.querySelector('.product-grid');

    fetch('./data/catalog.json')
        .then(response => response.json())
        .then(products => {
            productGrid.innerHTML = '';
            products.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    <img src="${product.image_path}" 
                         alt="${product.name}" 
                         onerror="this.src='assets/placeholder.png'; this.onerror=null;"
                         style="width: 100%; height: 250px; object-fit: cover; margin-bottom: 15px;">
                    <p class="product-category">${product.category}</p>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <p class="product-price">${product.price} ₽</p>
                    <button class="btn" onclick="addToCart(${product.id})">В корзину</button>
                `;
                productGrid.appendChild(card);
            });
        })
        .catch(err => console.error('Error loading products:', err));
});

function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (!cart.includes(productId)) {
        cart.push(productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Товар добавлен в корзину');
    } else {
        alert('Товар уже в корзине');
    }
}
