let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-item');
const totalSlides = slides.length;
let carrito = [];

document.addEventListener('DOMContentLoaded', function() {
    cargarCarritoDesdeStorage();
    inicializarCarrito();
    actualizarVistaCarrito();
    actualizarContadorCarrito();
    actualizarCarousel();
    const botonCompra = document.getElementById('realizar-compra');
    if (botonCompra) {
        botonCompra.onclick = function() {
            realizarCompra();
        };
    }
});

document.getElementById('next').addEventListener('click', function() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
});

document.getElementById('prev').addEventListener('click', function() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
});

function updateCarousel() {
    const carouselInner = document.querySelector('.carousel-inner');
    carouselInner.style.transform = `translateX(-${currentSlide * 100}%)`;
    document.getElementById('current-slide').innerText = `${currentSlide + 1} / ${totalSlides}`;
}

function goToCart() {
    window.location.href = 'carrito.html';
}

document.querySelector('.menu-icon').addEventListener('click', toggleMenu);

function toggleMenu() {
    var menu = document.getElementById("side-menu");
    if (menu.style.width === "250px") {
        menu.style.width = "0";
    } else {
        menu.style.width = "250px";
    }
}

function cargarCarritoDesdeStorage() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
}

function guardarCarritoEnStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function inicializarCarrito() {
    const botonesAgregar = document.querySelectorAll('.agregar-carrito');
    
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.producto-card');
            
            if (card) {
                const nombre = card.getAttribute('data-nombre');
                const precio = parseInt(card.getAttribute('data-precio'));
                
                if (nombre && precio) {
                    agregarAlCarrito(nombre, precio);
                }
            }
        });
    });

    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            toggleCart();
        });
    }

    const btnComprar = document.getElementById('realizar-compra');
    if (btnComprar) {
        btnComprar.addEventListener('click', realizarCompra);
    }
}

function toggleCart() {
    const carritoPanel = document.querySelector('.carrito-panel');
    if (carritoPanel) {
        carritoPanel.classList.toggle('visible');
        
        if (carritoPanel.classList.contains('visible')) {
            carritoPanel.style.right = '0';
            carritoPanel.style.visibility = 'visible';
            carritoPanel.style.opacity = '1';
        } else {
            carritoPanel.style.right = '-100%';
            carritoPanel.style.visibility = 'hidden';
            carritoPanel.style.opacity = '0';
        }
    }
}

function agregarAlCarrito(nombre, precio) {
    const itemExistente = carrito.find(item => item.nombre === nombre);
    
    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({
            nombre: nombre,
            precio: precio,
            cantidad: 1
        });
    }
    
    guardarCarritoEnStorage();
    actualizarVistaCarrito();
    const carritoPanel = document.querySelector('.carrito-panel');
    
    if (carritoPanel && !carritoPanel.classList.contains('visible')) {
        toggleCart();
    }
}

function actualizarVistaCarrito() {
    const contenedorCarrito = document.getElementById('productos-carrito');
    const totalElement = document.getElementById('precio-total');
    
    if (contenedorCarrito && totalElement) {
        contenedorCarrito.innerHTML = '';
        let total = 0;

        carrito.forEach((item, index) => {
            total += item.precio * item.cantidad;
            contenedorCarrito.innerHTML += `
                <div class="item-carrito">
                    <div class="item-info">
                        <h4>${item.nombre}</h4>
                        <p>$${item.precio.toLocaleString('es-AR')}</p>
                    </div>
                    <div class="cantidad-controles">
                        <button onclick="cambiarCantidad(${index}, -1)">-</button>
                        <span>${item.cantidad}</span>
                        <button onclick="cambiarCantidad(${index}, 1)">+</button>
                    </div>
                </div>
            `;
        });

        totalElement.textContent = total.toLocaleString('es-AR');
        actualizarContadorCarrito();
    }
}

function cambiarCantidad(index, cambio) {
    if (carrito[index]) {
        carrito[index].cantidad += cambio;
        if (carrito[index].cantidad <= 0) {
            carrito.splice(index, 1);
        }
        guardarCarritoEnStorage();
        actualizarVistaCarrito();
    }
}

function actualizarContadorCarrito() {
    const contador = document.getElementById('cart-count');
    if (contador) {
        const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        contador.textContent = total;
    }
}


function realizarCompra() {
    
    if (typeof Swal === 'undefined') {
        alert('Error: SweetAlert no está cargado');
        return;
    }

   
    if (carrito.length === 0) {
        Swal.fire({
            title: '¡Carrito vacío!',
            text: 'Agrega algunos productos antes de realizar la compra',
            icon: 'warning',
            confirmButtonText: 'Entendido'
        });
        return;
    }

    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

    Swal.fire({
        title: '¡Gracias por tu compra!',
        text: `Total: $${total}`,
        icon: 'success',
        confirmButtonText: 'Cerrar'
    }).then(() => {
        
        carrito = [];
        guardarCarritoEnStorage();
        actualizarVistaCarrito();
        toggleCart();
    });
}

function handleNewsletter() {
    const emailInput = document.querySelector('.newsletter-input');
    const email = emailInput.value.trim();
    
    const modalConfig = {
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#ddba84',
        background: '#f5f5f5',
        backdrop: `rgba(0,0,0,0.8)`,
        position: 'center',
        heightAuto: false,
        customClass: {
            container: 'swal-container',
            popup: 'swal-popup'
        }
    };

    if (!email) {
        Swal.fire({
            ...modalConfig,
            title: '¡Error!',
            text: 'Por favor, ingresa tu email',
            icon: 'error'
        });
        return;
    }

    if (!email.includes('@')) {
        Swal.fire({
            ...modalConfig,
            title: '¡Error!',
            text: 'El email debe contener un "@"',
            icon: 'error'
        });
        return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        Swal.fire({
            ...modalConfig,
            title: '¡Error!',
            text: 'Por favor, ingresa un email válido',
            icon: 'error'
        });
        return;
    }

    Swal.fire({
        ...modalConfig,
        title: '¡Suscripción exitosa!',
        text: 'Gracias por suscribirte a nuestro newsletter.',
        icon: 'success'
    });

    emailInput.value = '';
}