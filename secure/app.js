// ✅ SECURE CODE - SAFE TO USE IN PRODUCTION!

// ✅ UTILITY: Escape HTML (Prevent XSS)
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text; // textContent = escape otomatis
    return div.innerHTML;
}

// ✅ UTILITY: Sanitize Input
function sanitizeInput(input) {
    // Remove HTML tags & special chars
    return input.replace(/[<>]/g, '').trim().substring(0, 500);
}

// ✅ UTILITY: Validate Input
function validateComment(text) {
    if (text.length < 1 || text.length > 500) return false;
    // Check for suspicious patterns
    if (text.includes('<script') || text.includes('javascript:')) return false;
    return true;
}

// ✅ SECURE: Load welcome message dengan textContent
function loadWelcomeMessage() {
    const message = localStorage.getItem('welcome') || 
        'Selamat datang di toko online kami!';
    
    // Gunakan textContent, bukan innerHTML
    document.getElementById('welcome-message').textContent = message;
}

// ✅ SECURE: Komentar dengan sanitasi penuh
function addComment() {
    const input = document.getElementById('comment-input');
    const comment = input.value;
    
    // 1. Validasi input
    if (!validateComment(comment)) {
        alert('Komentar tidak valid atau terlalu panjang!');
        return;
    }
    
    // 2. Sanitize input
    const safe = sanitizeInput(comment);
    
    // 3. Escape HTML
    const escaped = escapeHTML(safe);
    
    // 4. Buat element dengan aman
    const container = document.getElementById('comments-container');
    const commentEl = document.createElement('div');
    commentEl.className = 'comment';
    
    const p = document.createElement('p');
    p.textContent = escaped; // textContent, bukan innerHTML
    
    const small = document.createElement('small');
    small.textContent = new Date().toLocaleString();
    
    commentEl.appendChild(p);
    commentEl.appendChild(small);
    container.appendChild(commentEl);
    
    // 5. Update storage dengan aman
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    comments.push({
        text: safe,
        date: new Date().toISOString()
    });
    localStorage.setItem('comments', JSON.stringify(comments));
    
    input.value = '';
}

// ✅ SECURE: Load products dengan validasi
function loadProducts() {
    // TIDAK mengambil dari URL parameter
    // Whitelist data saja
    const products = [
        { id: 1, name: 'Laptop', price: 5000000 },
        { id: 2, name: 'Mouse', price: 150000 },
        { id: 3, name: 'Keyboard', price: 300000 }
    ];

    const container = document.getElementById('product-list');
    container.innerHTML = ''; // Clear dulu
    
    products.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product';
        
        const h3 = document.createElement('h3');
        h3.textContent = p.name;
        
        const priceP = document.createElement('p');
        priceP.textContent = `Rp ${p.price.toLocaleString('id-ID')}`;
        
        const button = document.createElement('button');
        button.textContent = 'Beli';
        button.onclick = () => buyProduct(p.id);
        
        div.appendChild(h3);
        div.appendChild(priceP);
        div.appendChild(button);
        
        container.appendChild(div);
    });
}

function buyProduct(id) {
    // Validasi ID
    if (typeof id !== 'number' || id < 1 || id > 1000) {
        console.warn('Invalid product ID');
        return;
    }
    alert(`Produk ${id} ditambahkan ke keranjang`);
}

// ✅ SECURE: Load komentar dari storage dengan aman
function loadSavedComments() {
    try {
        const saved = localStorage.getItem('comments');
        if (!saved) return;
        
        const comments = JSON.parse(saved);
        const container = document.getElementById('comments-container');
        
        comments.forEach(comment => {
            const commentEl = document.createElement('div');
            commentEl.className = 'comment';
            
            const p = document.createElement('p');
            p.textContent = comment.text; // Sudah sanitized
            
            const small = document.createElement('small');
            small.textContent = new Date(comment.date).toLocaleString();
            
            commentEl.appendChild(p);
            commentEl.appendChild(small);
            
            container.appendChild(commentEl);
        });
    } catch (error) {
        console.error('Error loading comments:', error);
    }
}

// ✅ INIT
window.addEventListener('DOMContentLoaded', () => {
    loadWelcomeMessage();
    loadProducts();
    loadSavedComments();
});