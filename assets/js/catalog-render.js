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
            // Добавляем id для каждого продукта, если его нет
            products.forEach((product, index) => {
                if (!product.id) {
                    product.id = index + 1;
                }
                // Преобразуем поля для совместимости
                product.name = product.title || product.name;
                product.image_path = product.image || product.image_path;
                product.has_aroma = product.has_aroma || product.has_scent || false;
            });

            const categories = [...new Set(products.map(p => p.category))].filter(Boolean);

            // Если нет категорий, создаем одну секцию для всех товаров
            if (categories.length === 0) {
                const section = document.createElement('section');
                section.style.marginBottom = '60px';
                section.innerHTML = `<h2 style="margin-bottom: 30px;">Все товары</h2><div class="product-grid"></div>`;
                mainContainer.appendChild(section);

                const productGrid = section.querySelector('.product-grid');
                products.forEach(product => {
                    renderProductCard(product, productGrid);
                });
            } else {
                // Иначе создаем секции по категориям
                categories.forEach(category => {
                    const section = document.createElement('section');
                    section.style.marginBottom = '60px';
                    section.innerHTML = `<h2 style="margin-bottom: 30px;">${category}</h2><div class="product-grid"></div>`;
                    mainContainer.appendChild(section);

                    const productGrid = section.querySelector('.product-grid');
                    products.filter(p => p.category === category).forEach(product => {
                        renderProductCard(product, productGrid);
                    });
                });
            }
        });

    function renderProductCard(product, container) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.productId = product.id;

        const aromaOptions = (product.aroma_options || []).map(aroma => `<option value="${aroma}">${aroma}</option>`).join('');
        const colorOptions = (product.color_options || []).map(color => `<div class="color-swatch" role="button" tabindex="0" style="background:${colorMap[color.toLowerCase()] || '#ccc'}" title="${color}"></div>`).join('');

        card.innerHTML = `
            <img src="${product.image_path}" alt="${product.name}" 
                 onerror="this.src='https://images.unsplash.com/photo-1602874801063-f29003855a33?auto=format&fit=crop&q=80&w=400'; this.onerror=null;"
                 style="width: 100%; height: 250px; object-fit: contain; border-radius: 8px; margin-bottom: 15px; background: #fdfdfd;">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            
            ${product.has_aroma ? `<div style="margin-bottom: 15px;"><label style="font-size: 0.8rem; display:block; margin-bottom: 5px;">Выберите аромат:</label><select class="aroma-select"><option value="" disabled selected>Выберите аромат</option>${aromaOptions}</select></div>` : ''}
            
            ${product.has_color ? `<div style="margin-bottom: 15px;"><label style="font-size: 0.8rem; display:block; margin-bottom: 5px;">Выбери цвет:</label><div class="color-list">${colorOptions}</div><p class="selected-color" style="font-size: 0.7rem; color: #997950; margin-top:5px;"></p></div>` : ''}
            
            <p class="product-price">${product.price} ₽</p>
            <button class="btn add-to-cart-btn" data-product-id="${product.id}">В корзину</button>
        `;
        card.querySelector('.aroma-select')?.addEventListener('change', (e) => {
            window.selectAromaFromDropdown(e.target, e.target.value);
        });
        card.querySelector('.color-list')?.addEventListener('click', (e) => {
            const swatch = e.target.closest('.color-swatch');
            if (swatch && card.querySelector('.color-list').contains(swatch)) {
                window.selectColor(swatch, swatch.title);
            }
        });
        const btn = card.querySelector('.add-to-cart-btn');
        btn.addEventListener('click', () => {
            const color = card.dataset.selectedColor;
            console.log('Выбранный цвет:', color);
            window.addToCart(product.id);
        });
        container.appendChild(card);
    }
});

window.selectAromaFromDropdown = (el, aroma) => {
    const parent = el.closest('.product-card');
    parent.dataset.selectedAroma = aroma;
    console.log('Selected Aroma:', aroma);
};

window.selectColor = (el, color) => {
    const parent = el.closest('.product-card');
    parent.querySelectorAll('.color-swatch').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    parent.querySelector('.selected-color').textContent = `Цвет: ${color}`;
    parent.dataset.selectedColor = color;
    console.log('Selected Color:', color);
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
