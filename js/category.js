// Category page functionality
let currentPage = 1;
const articlesPerPage = 6;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('cat');
    
    if (category && categories[category]) {
        displayCategoryInfo(category);
        displayCategoryArticles(category);
    } else {
        // Redirect to home if invalid category
        window.location.href = 'index.html';
    }
    
    setupSearch();
});

// Display category information
function displayCategoryInfo(category) {
    const categoryInfo = categories[category];
    const titleElement = document.getElementById('categoryTitle');
    const descElement = document.getElementById('categoryDescription');
    
    if (titleElement) {
        titleElement.textContent = categoryInfo.name;
    }
    
    if (descElement) {
        descElement.textContent = categoryInfo.description;
    }
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.href.includes(`cat=${category}`)) {
            link.classList.add('active');
        }
    });
}

// Display articles for category
function displayCategoryArticles(category, page = 1) {
    currentPage = page;
    const articlesGrid = document.getElementById('articlesGrid');
    const pagination = document.getElementById('pagination');
    
    if (!articlesGrid) return;
    
    // Filter articles by category
    const categoryArticles = articles.filter(article => article.category === category);
    
    // Calculate pagination
    const startIndex = (page - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const displayedArticles = categoryArticles.slice(startIndex, endIndex);
    const totalPages = Math.ceil(categoryArticles.length / articlesPerPage);
    
    // Clear grid
    articlesGrid.innerHTML = '';
    
    if (displayedArticles.length === 0) {
        articlesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 3rem;">No articles in this category yet. Check back soon!</p>';
        if (pagination) pagination.innerHTML = '';
        return;
    }
    
    // Display articles
    displayedArticles.forEach(article => {
        const articleCard = createArticleCard(article);
        articlesGrid.appendChild(articleCard);
    });
    
    // Create pagination
    createPagination(pagination, totalPages, page, category);
}

// Create article card element
function createArticleCard(article) {
    const card = document.createElement('div');
    card.className = 'article-card';
    card.onclick = () => {
        window.location.href = `article.html?id=${article.id}`;
    };
    
    card.innerHTML = `
        <img src="${article.image}" alt="${article.title}" class="article-image" onerror="this.style.background='linear-gradient(135deg, #e0f2fe 0%, #f0e6ff 100%)'">
        <div class="article-content">
            <div class="article-category">${article.categoryName}</div>
            <h2 class="article-title">${article.title}</h2>
            <p class="article-excerpt">${article.excerpt}</p>
            <div class="article-meta">
                <span>${article.date}</span>
            </div>
        </div>
    `;
    
    return card;
}

// Create pagination buttons
function createPagination(container, totalPages, currentPage, category) {
    if (!container) return;
    
    container.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Previous';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            displayCategoryArticles(category, currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    container.appendChild(prevBtn);
    
    // Page number buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.className = i === currentPage ? 'active' : '';
        pageBtn.onclick = () => {
            displayCategoryArticles(category, i);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        container.appendChild(pageBtn);
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            displayCategoryArticles(category, currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    container.appendChild(nextBtn);
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('cat');
        
        if (searchTerm === '') {
            displayCategoryArticles(category, 1);
            return;
        }
        
        // Filter articles by category and search term
        const categoryArticles = articles.filter(article => article.category === category);
        const filteredArticles = categoryArticles.filter(article => 
            article.title.toLowerCase().includes(searchTerm) ||
            article.excerpt.toLowerCase().includes(searchTerm)
        );
        
        // Display filtered results
        const articlesGrid = document.getElementById('articlesGrid');
        const pagination = document.getElementById('pagination');
        
        if (!articlesGrid) return;
        
        articlesGrid.innerHTML = '';
        
        if (filteredArticles.length === 0) {
            articlesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 3rem;">No articles found matching your search.</p>';
            if (pagination) pagination.innerHTML = '';
            return;
        }
        
        filteredArticles.forEach(article => {
            const articleCard = createArticleCard(article);
            articlesGrid.appendChild(articleCard);
        });
        
        if (pagination) pagination.innerHTML = '';
    });
}

