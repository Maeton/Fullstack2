const productos = [
    {
        id: "FR001",
        nombre: "Manzanas Fuji",
        precio: 1200,
        stock: 150,
        categoria: "Frutas Frescas",
        img: "assets/img/manzanasfuji.jpg",
        descripcion: "Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule."
    },
    {
        id: "FR002",
        nombre: "Naranjas Valencia",
        precio: 1000,
        stock: 200,
        categoria: "Frutas Frescas",
        img: "assets/img/naranja.jpg",
        descripcion: "Jugosas y ricas en vitamina C, ideales para zumos frescos."
    },
    {
        id: "FR003",
        nombre: "Plátanos Cavendish",
        precio: 800,
        stock: 250,
        categoria: "Frutas Frescas",
        img: "assets/img/platanos.jpg",
        descripcion: "Plátanos maduros y dulces, ideales para el desayuno."
    },
    {
        id: "VR001",
        nombre: "Zanahorias Orgánicas",
        precio: 900,
        stock: 100,
        categoria: "Verduras Orgánicas",
        img: "assets/img/zanahoria.jpg",
        descripcion: "Zanahorias crujientes cultivadas sin pesticidas en O'Higgins."
    },
    {
        id: "VR002",
        nombre: "Espinacas Frescas",
        precio: 700,
        stock: 80,
        categoria: "Verduras Orgánicas",
        img: "assets/img/espinaca.jpg",
        descripcion: "Espinacas frescas y nutritivas para ensaladas o batidos."
    },
    {
        id: "VR003",
        nombre: "Pimientos Tricolores",
        precio: 1500,
        stock: 120,
        categoria: "Verduras Orgánicas",
        img: "assets/img/pimientos.jpg",
        descripcion: "Pimientos rojos, amarillos y verdes, ricos en antioxidantes."
    },
    {
        id: "PO001",
        nombre: "Miel Orgánica",
        precio: 5000,
        stock: 50,
        categoria: "Productos Orgánicos",
        img: "assets/img/miel.jpg",
        descripcion: "Miel pura y orgánica producida por apicultores locales."
    },

    {
        id: "FR004",
        nombre: "Pomelo",
        precio: 2150,
        stock: 50,
        categoria: "Frutas Frescas",
        img: "assets/img/pomelo.jpg",
        descripcion: "Pomelo fresco y jugoso, ideal para zumos y ensaladas."
    },

    {
        id: "VR004",
        nombre: "Champiñones Bandeja",
        precio: 1590,
        stock: 50,
        categoria: "Verduras Orgánicas",
        img: "assets/img/champiñones.jpg",
        descripcion: "Champiñones frescos y sabrosos, ideales para ensaladas y platos principales."
    },

    {
        id: "FR005",
        nombre: "Aguacate",
        precio: 6290,
        stock: 50,
        categoria: "Frutas Frescas",
        img: "assets/img/aguacate.jpg",
        descripcion: "Aguacate fresco y cremoso, ideal para ensaladas y guacamole."
    },

    {
        id: "FR006",
        nombre: "Mango",
        precio: 2990,
        stock: 50,
        categoria: "Frutas Frescas",
        img: "assets/img/mango.jpg",
        descripcion: "Mango fresco y jugoso, ideal para postres y ensaladas."
    },

    {
        id: "VR005",
        nombre: "Champiñones Shitake Bandeja",
        precio: 1490,
        stock: 50,
        categoria: "Verduras Orgánicas",
        img: "assets/img/champiñones-shitake.jpg",
        descripcion: "Champiñones Shitake frescos y sabrosos, ideales para ensaladas y platos principales."
    },

];

document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('huerto_cart')) || [];

    const saveCart = () => {
        localStorage.setItem('huerto_cart', JSON.stringify(cart));
        updateCartBadge();
    };

    const updateCartBadge = () => {
        const cartLink = document.querySelector('nav a[href="carrito.html"]');
        if (!cartLink) return;
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        cartLink.textContent = totalItems > 0 ? `Carrito (${totalItems})` : 'Carrito';
    };

    const renderCatalog = () => {
        const catalogContainer = document.getElementById('contenedor-productos');
        if (!catalogContainer) return;

        catalogContainer.innerHTML = '';

        productos.forEach(prod => {
            const article = document.createElement('article');
            article.innerHTML = `
                <img src="${prod.img}" alt="${prod.nombre}">
                <h3>${prod.nombre}</h3>
                <p>${prod.descripcion}</p>
                <p>$${prod.precio.toLocaleString('es-CL')}</p>
                <button data-id="${prod.id}">Agregar al Carrito</button>
            `;
            catalogContainer.appendChild(article);
        });

        const addButtons = catalogContainer.querySelectorAll('button');
        addButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const prodId = e.target.getAttribute('data-id');
                const selectedProd = productos.find(p => p.id === prodId);
                if (!selectedProd) return;

                const existingItem = cart.find(item => item.id === prodId);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        id: selectedProd.id,
                        name: selectedProd.nombre,
                        price: selectedProd.precio,
                        img: selectedProd.img,
                        quantity: 1
                    });
                }

                saveCart();
                alert(`${selectedProd.nombre} agregado al carrito`);
            });
        });
    };

    const renderCart = () => {
        if (!window.location.pathname.includes('carrito.html')) return;

        const cartContainer = document.querySelector('main section:first-child > div');
        const totalHeading = document.querySelector('main section:nth-child(2) h3');

        if (!cartContainer) return;

        if (cart.length === 0) {
            cartContainer.innerHTML = '<p>El carrito está vacío.</p>';
            if (totalHeading) totalHeading.textContent = 'Total: $0';
            return;
        }

        cartContainer.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const subtotal = item.price * item.quantity;
            total += subtotal;

            const article = document.createElement('article');
            article.innerHTML = `
                <img src="${item.img}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>Cantidad: ${item.quantity}</p>
                <p>$${subtotal.toLocaleString('es-CL')}</p>
                <button data-index="${index}" class="btn-remove">Eliminar</button>
            `;
            cartContainer.appendChild(article);
        });

        if (totalHeading) {
            totalHeading.textContent = `Total: $${total.toLocaleString('es-CL')}`;
        }

        const removeButtons = cartContainer.querySelectorAll('.btn-remove');
        removeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'), 10);
                cart.splice(index, 1);
                saveCart();
                renderCart();
            });
        });
    };

    const normalizarTexto = (texto) => {
        return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    const setupSearch = () => {
        const searchForm = document.getElementById('form-busqueda');
        if (!searchForm) return;

        const searchInput = searchForm.querySelector('input[type="text"]');
        if (!searchInput) return;

        searchForm.addEventListener('submit', (e) => e.preventDefault());

        searchInput.addEventListener('input', (e) => {
            const query = normalizarTexto(e.target.value.toLowerCase().trim());
            const articles = document.querySelectorAll('#contenedor-productos article');

            articles.forEach(article => {
                const title = normalizarTexto(article.querySelector('h3')?.innerText.toLowerCase() || '');
                if (title.includes(query)) {
                    article.style.display = '';
                } else {
                    article.style.display = 'none';
                }
            });
        });
    };



    const setupCheckout = () => {
        if (!window.location.pathname.includes('carrito.html')) return;

        const checkoutBtn = document.querySelector('main section:nth-child(2) div article button');
        if (!checkoutBtn) return;

        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Tu carrito está vacío.');
                return;
            }
            alert('¡Gracias por tu compra! Tu pedido fue procesado.');
            cart = [];
            saveCart();
            renderCart();
        });
    };

    const setupRegistrationForm = () => {
        const form = document.getElementById('form-registro');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombreInput = document.getElementById('nombre');
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const telefonoInput = document.getElementById('telefono');
            const direccionInput = document.getElementById('direccion');

            const errorNombre = document.getElementById('error-nombre');
            const errorPassword = document.getElementById('error-password');

            const nombre = nombreInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const telefono = telefonoInput.value.trim();
            const direccion = direccionInput ? direccionInput.value.trim() : '';

            if (nombre.length < 3) {
                errorNombre.textContent = 'El nombre debe tener al menos 3 caracteres.';
                nombreInput.focus();
                passwordInput.value = '';
                return;
            } else {
                errorNombre.textContent = '';
            }

            

            if (password.length < 6) {
                errorPassword.textContent = 'La contraseña debe tener al menos 6 caracteres.';
                passwordInput.focus();
                return;
            } else {
                errorPassword.textContent = '';
            }

            const errorEmail = document.getElementById('error-email');
            if (!emailInput.checkValidity()) {
                errorEmail.textContent = 'Ingresa un correo válido (ejemplo: nombre@dominio.com).';
                emailInput.focus();
                return;
            } else {
                errorEmail.textContent = '';
            }
            const errorTelefono = document.getElementById('error-telefono');
            const regexTelefono = /^\+56[0-9]{9}$/;

            if (!regexTelefono.test(telefono)) {
                errorTelefono.textContent = 'Ingresa un teléfono válido (formato: +56912345678).';
                telefonoInput.focus();
                return;
            } else {
                errorTelefono.textContent = '';
            }
            
            const errorDireccion = document.getElementById('error-direccion');
            if (direccion.length < 5) {
                errorDireccion.textContent = 'La dirección debe tener al menos 5 caracteres.';
                direccionInput.focus();
                return;
            } else {
                errorDireccion.textContent = '';
            }

          

            const userData = { nombre, email, telefono, direccion };
            localStorage.setItem('huerto_user', JSON.stringify(userData));

            alert('Registro completado con éxito.');
            form.reset();
        });
    };

    updateCartBadge();
    renderCatalog();
    renderCart();
    setupSearch();
    setupCheckout();
    setupRegistrationForm();
});