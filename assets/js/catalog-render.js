document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.querySelector('main.container');

    const colorMap = {
        'белый': '#ffffff',
        'бежевый': '#f5f5dc',
        'желтый': '#ffff00',
        'розовый': '#ffc0cb',
        'пудровый': '#f4c2c2',
        'салатовый': '#90ee90',
        'зеленый': '#008000',
        'абрикосовый': '#fbceb1',
        'фиолетовый': '#800080'
    };

    fetch('./data/catalog.json')
        .then(response => response.json())
        .then(products => {
            const categories = [...new Set(products.map(p => p.category))];

            categories.forEach(category => {
                const section = document.createElement('section');
                section.style.marginBottom = '60px';
                section.innerHTML = `<h2 style="margin-bottom: 30px;">${category}</h2><div class="product-grid"></div>`;
                mainContainer.appendChild(section);

                const productGrid = section.querySelector('.product-grid');
                products.filter(p => p.category === category).forEach(product => {
                    const card = document.createElement('div');
                    card.className = 'product-card';
                    card.dataset.productId = product.id;

                    const aromaOptions = (product.aroma_options || []).map(aroma => `<div class="aroma-chip" onclick="selectAroma(this, '${aroma}')">${aroma}</div>`).join('');
                    const colorOptions = (product.color_options || []).map(color => `<div class="color-swatch" style="background:${colorMap[color.toLowerCase()] || '#ccc'}" onclick="selectColor(this, '${color}')" title="${color}"></div>`).join('');

                    card.innerHTML = `
                        <img src="${product.image_path}" alt="${product.name}" 
                             onerror="this.src='https://images.unsplash.com/photo-1602874801063-f29003855a33?auto=format&fit=crop&q=80&w=400'; this.onerror=null;"
                             style="width: 100%; height: 250px; object-fit: contain; border-radius: 8px; margin-bottom: 15px; background: #fdfdfd;">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-description">${product.description}</p>
                        
                        ${product.has_aroma ? `<div style="margin-bottom: 15px;"><label style="font-size: 0.8rem; display:block; margin-bottom: 5px;">Выберите аромат:</label><div class="aroma-list">${aromaOptions}</div><p class="selected-aroma" style="font-size: 0.7rem; color: #997950; margin-top:5px;"></p></div>` : ''}
                        
                        ${product.has_color ? `<div style="margin-bottom: 15px;"><label style="font-size: 0.8rem; display:block; margin-bottom: 5px;">Выбери цвет:</label><div class="color-list">${colorOptions}</div><p class="selected-color" style="font-size: 0.7rem; color: #997950; margin-top:5px;"></p></div>` : ''}
                        
                        <p class="product-price">${product.price} ₽</p>
                        <button class="btn" onclick="addToCart(${product.id})">В корзину</button>
                    `;
                    productGrid.appendChild(card);
                });
            });
        });
});

window.selectAroma = (el, aroma) => {
    const parent = el.closest('.product-card');
    parent.querySelectorAll('.aroma-chip').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    parent.querySelector('.selected-aroma').textContent = `Аромат: ${aroma}`;
    parent.dataset.selectedAroma = aroma;
};

window.selectColor = (el, color) => {
    const parent = el.closest('.product-card');
    parent.querySelectorAll('.color-swatch').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    parent.querySelector('.selected-color').textContent = `Цвет: ${color}`;
    parent.dataset.selectedColor = color;
};

window.addToCart = (productId) => {
    const card = document.querySelector(`[data-product-id="${productId}"]`);
    const aroma = card.dataset.selectedAroma;
    const color = card.dataset.selectedColor;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ productId, aroma, color });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`Товар добавлен: ${card.querySelector('.product-name').textContent}${aroma ? ' / ' + aroma : ''}${color ? ' / ' + color : ''}`);
};
