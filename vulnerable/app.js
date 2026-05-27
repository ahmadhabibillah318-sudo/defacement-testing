// ❌ VULNERABLE CODE - JANGAN GUNAKAN DI PRODUCTION!

// 1. XSS VULNERABILITY - innerHTML dengan user input
function loadWelcomeMessage() {
    const message = localStorage.getItem('welcome') || 
        'Selamat datang di toko online kami!';
    document.getElementById('welcome-message').innerHTML = message;
}

// 2. XSS VULNERABILITY - Komentar tanpa sanitasi
function addComment() {
    const input = document.getElementById('comment-input');
    const comment = input.value;
    
    // ❌ LANGSUNG MASUK KE DOM TANPA VALIDASI
    const container = document.getElementById('comments-container');
    container.innerHTML += `<div class="comment">
        <p>${comment}</p>
        <small>${new Date().toLocaleString()}</small>
    </div>`;
    
    input.value = '';
    localStorage.setItem('comments', container.innerHTML);
}

// 3. INSECURE - Ambil data dari URL parameter
function loadProducts() {
    const urlParams = new URLSearchParams(window.location.search);
    const style = urlParams.get('style');
    
    const products = [
        { id: 1, name: 'Laptop', price: 5000000 },
        { id: 2, name: 'Mouse', price: 150000 },
        { id: 3, name: 'Keyboard', price: 300000 }
    ];

    let html = '';
    products.forEach(p => {
        html += `
            <div class="product">
                <h3>${p.name}</h3>
                <p>Rp ${p.price.toLocaleString('id-ID')}</p>
                <button onclick="buyProduct('${p.id}')">Beli</button>
            </div>
        `;
    });

    const container = document.getElementById('product-list');
    // ❌ Jika ada style injection
    if(style) {
        document.head.innerHTML += `<style>${style}</style>`;
    }
    container.innerHTML = html;
}

function buyProduct(id) {
    alert(`Produk ${id} ditambahkan ke keranjang`);
}

// Load saat halaman terbuka
window.addEventListener('DOMContentLoaded', () => {
    loadWelcomeMessage();
    loadProducts();
    
    // Load komentar dari storage
    const saved = localStorage.getItem('comments');
    if(saved) {
        document.getElementById('comments-container').innerHTML = saved;
    }
});