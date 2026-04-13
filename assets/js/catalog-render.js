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
                    <img src="${product.image_path}" alt="${product.name}" style="width: 100%; height: auto; margin-bottom: 15px;">
                    <p style="font-size: 0.8rem; color: #997950; text-transform: uppercase; letter-spacing: 1px;">${product.category}</p>
                    <h3 style="font-size: 1.2rem; margin-bottom: 10px;">${product.name}</h3>
                    <p style="margin-bottom: 15px; color: #666;">${product.description}</p>
                    <p style="font-weight: 700; margin-bottom: 20px;">${product.price} ₽</p>
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
