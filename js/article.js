// Article detail page functionality
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = parseInt(urlParams.get('id'));
    
    if (articleId) {
        const article = articles.find(a => a.id === articleId);
        if (article) {
            displayArticle(article);
        } else {
            // Article not found, redirect to home
            window.location.href = 'index.html';
        }
    } else {
        // No article ID, redirect to home
        window.location.href = 'index.html';
    }
    
    setupSearch();
});

// Display article content
function displayArticle(article) {
    // Set page title
    document.title = `${article.title} - VibeCart`;
    
    // Update header
    const categoryElement = document.getElementById('articleCategory');
    const dateElement = document.getElementById('articleDate');
    const titleElement = document.getElementById('articleTitle');
    const excerptElement = document.getElementById('articleExcerpt');
    const imageElement = document.getElementById('articleImage');
    const contentElement = document.getElementById('articleContent');
    
    if (categoryElement) {
        categoryElement.textContent = article.categoryName;
    }
    
    if (dateElement) {
        dateElement.textContent = article.date;
    }
    
    if (titleElement) {
        titleElement.textContent = article.title;
    }
    
    if (excerptElement) {
        excerptElement.textContent = article.excerpt;
    }
    
    if (imageElement) {
        imageElement.src = article.image;
        imageElement.alt = article.title;
        imageElement.onerror = function() {
            this.style.background = 'linear-gradient(135deg, #e0f2fe 0%, #f0e6ff 100%)';
            this.style.minHeight = '400px';
        };
    }
    
    if (contentElement) {
        contentElement.innerHTML = article.content;
    }
    
    // Display recommended products
    displayRecommendedProducts(article.products);
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.href.includes(`cat=${article.category}`)) {
            link.classList.add('active');
        }
    });
}

// Display recommended products
function displayRecommendedProducts(products) {
    const productsGrid = document.getElementById('recommendedProducts');
    
    if (!productsGrid || !products || products.length === 0) {
        if (productsGrid) {
            productsGrid.parentElement.style.display = 'none';
        }
        return;
    }
    
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.style.background='linear-gradient(135deg, #e0f2fe 0%, #f0e6ff 100%)'">
            <h3 class="product-name">${product.name}</h3>
            ${product.price ? `<p class="product-price">${product.price}</p>` : ''}
            ${product.description ? `<p class="product-description">${product.description}</p>` : ''}
        `;
        
        productsGrid.appendChild(productCard);
    });
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = e.target.value.toLowerCase().trim();
            if (searchTerm) {
                // Search and redirect to home with search
                window.location.href = `index.html?search=${encodeURIComponent(searchTerm)}`;
            }
        }
    });
}

