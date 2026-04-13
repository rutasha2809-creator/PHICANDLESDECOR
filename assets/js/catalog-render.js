document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.querySelector('main.container');

    fetch('./data/catalog.json')
        .then(response => response.json())
        .then(products => {
            const categories = [...new Set(products.map(p => p.category))];

            categories.forEach(category => {
                const section = document.createElement('section');
                section.style.marginBottom = '60px';
                section.innerHTML = `<h2 style="margin-bottom: 30px;">${category}</h2><div class="product-grid" id="grid-${category.replace(/\s+/g, '-')}"></div>`;
                mainContainer.appendChild(section);

                const productGrid = section.querySelector('.product-grid');
                products.filter(p => p.category === category).forEach(product => {
                    const card = document.createElement('div');
                    card.className = 'product-card';
                    const aromaOptions = product.aroma_options.map(aroma => `<option value="${aroma}">${aroma}</option>`).join('');
                    card.innerHTML = `
                        <img src="${product.image_path}" 
                             alt="${product.name}" 
                             onerror="this.src='https://images.unsplash.com/photo-1602874801063-f29003855a33?auto=format&fit=crop&q=80&w=400'; this.onerror=null;"
                             style="width: 100%; height: 250px; object-fit: cover; border-radius: 8px; margin-bottom: 15px;">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-description">${product.description}</p>
                        <div style="margin-bottom: 15px;">
                            <select id="aroma-${product.id}" class="aroma-select">
                                ${aromaOptions}
                            </select>
                        </div>
                        <p class="product-price">${product.price} ₽</p>
                        <button class="btn" onclick="showDetails(${product.id})">Подробнее</button>
                    `;
                    productGrid.appendChild(card);
                });
            });
        })
        .catch(err => console.error('Error loading products:', err));
});

window.showDetails = function (productId) {
    fetch('./data/catalog.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === productId);
            if (!product) return;

            const modal = document.createElement('div');
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.background = 'rgba(0,0,0,0.5)';
            modal.style.display = 'flex';
            modal.style.justifyContent = 'center';
            modal.style.alignItems = 'center';
            modal.style.zIndex = '1000';

            modal.innerHTML = `
                <div style="background: #fff; padding: 40px; border-radius: 8px; max-width: 500px; width: 90%; position: relative;">
                    <button onclick="this.parentElement.parentElement.remove()" style="position: absolute; top: 10px; right: 10px; background: none; border: none; cursor: pointer;">✕</button>
                    <h2 style="color: #997950;">${product.name}</h2>
                    <p style="margin: 20px 0;">${product.description}</p>
                    <p style="font-weight: 700; margin-bottom: 20px;">Цена: ${product.price} ₽</p>
                    <button class="btn" onclick="addToCart(${product.id}); this.parentElement.parentElement.remove()">В корзину</button>
                </div>
            `;
            document.body.appendChild(modal);
        });
}

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
