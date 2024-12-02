// Asegurarse de que todo el código se ejecute cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Modal de detalles del producto
    const pl = document.getElementById('productModal');
    const viewDetailsButtons = document.querySelectorAll('.view-details');
    const closeModal = document.getElementById('closeModal');
    const modalContent = document.getElementById('modal-content-details');

    // Abre el modal con detalles cuando se hace clic en "Ver detalles"
    if (viewDetailsButtons && closeModal && modalContent) {
        viewDetailsButtons.forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.getAttribute('data-product');
                const precio = button.getAttribute('data-price');
                const editorial = button.getAttribute('data-editorial');
                const imageSrc = button.getAttribute('data-image'); // Imagen del producto

                modalContent.innerHTML = `
                    <p><strong>${productId}</strong></p>
                    <p>Detalles adicionales de ${productId}.</p>
                    <p><strong>Precio:</strong> S/.${precio}</p>
                    <p><strong>Editorial:</strong> ${editorial}</p>                    
                    <img src="${imageSrc}" alt="Imagen de ${productId}" class="thumbnail" style="max-width: 100px; cursor: pointer;"/>
                `;

                // Abrir la imagen en tamaño grande al hacer clic
                const thumbnail = modalContent.querySelector('.thumbnail');
                if (thumbnail) {
                    thumbnail.addEventListener('click', () => {
                        const fullSizeModal = document.createElement('div');
                        fullSizeModal.style.position = 'fixed';
                        fullSizeModal.style.top = '0';
                        fullSizeModal.style.left = '0';
                        fullSizeModal.style.width = '100%';
                        fullSizeModal.style.height = '100%';
                        fullSizeModal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                        fullSizeModal.style.display = 'flex';
                        fullSizeModal.style.justifyContent = 'center';
                        fullSizeModal.style.alignItems = 'center';
                        fullSizeModal.style.zIndex = '1000';

                        const fullSizeImage = document.createElement('img');
                        fullSizeImage.src = imageSrc;
                        fullSizeImage.style.maxWidth = '90%';
                        fullSizeImage.style.maxHeight = '90%';
                        fullSizeImage.style.border = '2px solid white';

                        fullSizeModal.appendChild(fullSizeImage);

                        // Cerrar el modal de imagen grande al hacer clic fuera de la imagen
                        fullSizeModal.addEventListener('click', (e) => {
                            if (e.target === fullSizeModal) {
                                fullSizeModal.remove();
                            }
                        });

                        document.body.appendChild(fullSizeModal);
                    });
                }

                pl.style.display = 'flex'; // Muestra el modal
            });
        });

        // Cierra el modal al hacer clic en el botón de cierre
        closeModal.addEventListener('click', () => {
            pl.style.display = 'none'; // Oculta el modal
        });
    } else {
        console.warn("Elementos del modal de detalles no encontrados.");
    }

    ///////////////////////////////////////////////////////////////////////
    // Filtrado de productos por barra de búsqueda
    const searchBar = document.querySelector('.search-bar input');
    const productCards = document.querySelectorAll('.product-card');

    if (searchBar && productCards) {
        searchBar.addEventListener('input', (event) => {
            const searchQuery = event.target.value.toLowerCase(); // Valor de búsqueda en minúsculas
            productCards.forEach(card => {
                const productName = card.querySelector('h3').textContent.toLowerCase();
                if (productName.includes(searchQuery)) {
                    card.style.display = 'block'; // Mostrar si hay coincidencia
                } else {
                    card.style.display = 'none'; // Ocultar si no hay coincidencia
                }
            });
        });
    } else {
        console.warn("Barra de búsqueda o tarjetas de producto no encontrados.");
    }

    ///////////////////////////////////////////////////////////////////////
    // Carrito de compras
    const cart = document.getElementById('cart');
    const cartItemsList = document.getElementById('cart-items');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const checkoutModal = document.getElementById('checkoutModal');
    const closeCheckoutModal = document.getElementById('closeCheckoutModal');
    const confirmPurchaseButton = document.getElementById('confirmPurchase');
    const cancelPurchaseButton = document.getElementById('cancelPurchase');
    const totalDisplay = document.createElement('p');
    totalDisplay.id = 'total-price';
    totalDisplay.textContent = "Total: S/.0";

    if (cart) {
        cart.appendChild(totalDisplay);
        const cartItems = {};
        let total = 0;

        // Añadir productos al carrito
        if (addToCartButtons) {
            addToCartButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const productId = button.getAttribute('data-product');
                    const price = parseFloat(button.getAttribute('data-price'));

                    if (cartItems[productId]) {
                        cartItems[productId].quantity += 1;
                    } else {
                        cartItems[productId] = {
                            quantity: 1,
                            price: price,
                            element: createCartItemElement(productId)
                        };
                    }

                    total += price;
                    updateCartItemDisplay(productId);
                    updateTotalDisplay();
                });
            });
        }

        function updateTotalDisplay() {
            totalDisplay.textContent = `Total: S/.${total.toFixed(2)}`;
        }

        function createCartItemElement(productId) {
            const cartItem = document.createElement('li');
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Eliminar';
            removeButton.addEventListener('click', () => removeFromCart(productId));
            cartItem.appendChild(removeButton);
            cartItemsList.appendChild(cartItem);
            return cartItem;
        }

        function updateCartItemDisplay(productId) {
            const cartItem = cartItems[productId].element;
            cartItem.textContent = `${cartItems[productId].quantity} - ${productId}`;
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Eliminar';
            removeButton.addEventListener('click', () => removeFromCart(productId));
            cartItem.appendChild(removeButton);
        }

        function removeFromCart(productId) {
            if (cartItems[productId]) {
                const price = cartItems[productId].price;
                if (cartItems[productId].quantity > 1) {
                    cartItems[productId].quantity -= 1;
                    updateCartItemDisplay(productId);
                } else {
                    total -= price;
                    cartItems[productId].element.remove();
                    delete cartItems[productId];
                }
                updateTotalDisplay();
            }
        }

        // Mostrar el modal de confirmación de compra
checkoutModal.addEventListener('click', (e) => {
    if (e.target === checkoutModal) {
        checkoutModal.style.display = 'none'; // Cierra el modal si se hace clic fuera del contenido
    }
});

// Cancelar o confirmar la compra
cancelPurchaseButton.addEventListener('click', () => {
    checkoutModal.style.display = 'none'; // Cierra el modal
});

confirmPurchaseButton.addEventListener('click', () => {
    alert('Compra confirmada'); // Muestra alerta de confirmación
    cartItemsList.innerHTML = ''; // Vacia el carrito
    total = 0; // Reiniciar el total
    updateTotalDisplay(); // Actualizar el total mostrado
    checkoutModal.style.display = 'none'; // Cierra el modal
});

// Mostrar el modal de confirmación al hacer clic en "Confirmar Compra"
const checkoutButton = document.getElementById('checkout');
checkoutButton.addEventListener('click', () => {
    checkoutModal.style.display = 'flex'; // Muestra el modal
});
    }

    ///////////////////////////////////////////////////////////////////////
    // Botón para mostrar/ocultar el carrito
    const cartToggle = document.getElementById('cartToggle');
    if (cart && cartToggle) {
        let isCartVisible = true;

        cartToggle.addEventListener('click', () => {
            isCartVisible = !isCartVisible;
            if (isCartVisible) {
                cart.classList.add('visible');
                cart.classList.remove('hidden');
                cartToggle.innerHTML = '&gt;';
            } else {
                cart.classList.add('hidden');
                cart.classList.remove('visible');
                cartToggle.innerHTML = '&lt;';
            }
        });

        cart.classList.add('visible'); // Inicia el carrito visible
    } else {
        console.warn("El carrito o el botón de alternar no existen en el DOM.");
    }

    document.getElementById('confirmPurchase').addEventListener('click', function() {
        // Abrir el enlace de MercadoPago en una nueva pestaña
        window.open("https://link.mercadopago.com.pe/aromadecafe", "_blank");
    });

});



function sendMail() {
    let parms = {
        nombre: document.getElementById('nombre').value,
        correo: document.getElementById('correo').value,
        titulo: document.getElementById('titulo').value,
        autor: document.getElementById('autor').value,
    };

    // Validación manual
    if (!parms.nombre || !parms.correo || !parms.titulo || !parms.autor) {
        alert("Todos los campos son obligatorios. Por favor, completa el formulario.");
        return;
    }

    // Validación del formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(parms.correo)) {
        alert("Por favor, ingrese un correo electrónico válido.");
        return;
    }

    // Envía el formulario a EmailJS
    emailjs.send('service_ybg2gtp', 'template_8z2a4rt', parms).then(alert("Enviado!!"))
       
}
