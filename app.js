// 1. MOBİL MENÜ
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// 2. DARK MODE TEMA SİSTEMİ
const darkModeToggle = document.getElementById('dark-mode-toggle');
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    if (document.body.classList.contains('dark-theme')) {
        darkModeToggle.classList.replace('bx-moon', 'bx-sun');
        showToast('Dark Mode Enabled', 'info');
    } else {
        darkModeToggle.classList.replace('bx-sun', 'bx-moon');
        showToast('Light Mode Enabled', 'info');
    }
});

// 3. TOAST BİLDİRİM SİSTEMİ (Özel Alert)
window.showToast = function(msg, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.classList.add('toast', type);
    
    // Tipe göre ikon seç
    const icon = type === 'success' ? 'bx-check-circle' : 'bx-info-circle';
    
    toast.innerHTML = `<i class='bx ${icon}'></i> <span>${msg}</span>`;
    toastContainer.appendChild(toast);
    
    // Küçük bir gecikme ile giriş animasyonu ekle
    setTimeout(() => toast.classList.add('show'), 50);
    
    // 3 Saniye sonra bildirimi sil
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// 4. KATEGORİ FİLTRELEME SİSTEMİ
const filterBtns = document.querySelectorAll('.filter-btn');
const menuCards = document.querySelectorAll('.card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Aktif butonu değiştir
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filtre değerini al
        const filterValue = btn.getAttribute('data-filter');

        // Kartları filtrele ve animasyon oynat
        menuCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// 5. SEPET SİSTEMİ
const cartBtns = document.querySelectorAll('.cart-btn'); 
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const closeCart = document.getElementById('close-cart');
const cartContent = document.querySelector('.cart-content');
const cartTotalDisplay = document.querySelector('.cart-footer h3');

let cart = []; 

window.openCart = function() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
}

function closeCartSidebar() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
}

closeCart.addEventListener('click', closeCartSidebar);
cartOverlay.addEventListener('click', closeCartSidebar);

cartBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        const title = card.querySelector('.food-title h1').innerText;
        const priceText = card.querySelector('.price span').innerText;
        const price = parseFloat(priceText.replace('$', '')); 
        const imgSrc = card.querySelector('img').src;

        cart.push({ title, price, imgSrc });
        updateCartUI();
        
        // Sepeti zorla açmak yerine sağ alttan yeşil bildirim çıkar!
        showToast(`${title} added to cart!`, 'success');
    });
});

function updateCartUI() {
    if(cart.length === 0) {
        cartContent.innerHTML = '<p class="empty-msg">Your cart is currently empty.</p>';
        cartTotalDisplay.innerText = 'Total: $0.00';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        // İçerik CSS'inde ufak tema uyumlulukları
        html += `
            <div style="display:flex; align-items:center; margin-bottom:15px; border-bottom:1px solid #ddd; padding-bottom:10px;">
                <img src="${item.imgSrc}" style="width:60px; height:60px; border-radius:10px; object-fit:cover; margin-right:15px;">
                <div style="flex:1;">
                    <h4 style="font-size:15px; margin-bottom:5px; font-family:sans-serif;">${item.title}</h4>
                    <span style="color:#ff511c; font-weight:bold; font-size:14px; font-family:sans-serif;">$${item.price.toFixed(2)}</span>
                </div>
                <i class='bx bx-trash' style="color:#ff511c; font-size:22px; cursor:pointer;" onclick="removeFromCart(${index})"></i>
            </div>
        `;
    });

    cartContent.innerHTML = html;
    cartTotalDisplay.innerText = `Total: $${total.toFixed(2)}`;
}

window.removeFromCart = function(index) {
    cart.splice(index, 1); 
    updateCartUI(); 
}

// 6. SCROLL ANİMASYONLARI
const reveals = document.querySelectorAll('.reveal');
const revealOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };

const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('active');
        observer.unobserve(entry.target); 
    });
}, revealOptions);

reveals.forEach(reveal => {
    revealOnScroll.observe(reveal);
});