// Main page functionality
let currentPage = 1;
const articlesPerPage = 6;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    displayArticles();
    setupSearch();
});

// Display articles with pagination
function displayArticles(page = 1) {
    currentPage = page;
    const articlesGrid = document.getElementById('articlesGrid');
    const pagination = document.getElementById('pagination');
    
    if (!articlesGrid) return;
    
    // Calculate pagination
    const startIndex = (page - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const displayedArticles = articles.slice(startIndex, endIndex);
    const totalPages = Math.ceil(articles.length / articlesPerPage);
    
    // Clear grid
    articlesGrid.innerHTML = '';
    
    // Display articles
    displayedArticles.forEach(article => {
        const articleCard = createArticleCard(article);
        articlesGrid.appendChild(articleCard);
    });
    
    // Create pagination (only if more than one page)
    if (totalPages > 1) {
        createPagination(pagination, totalPages, page);
    } else {
        pagination.innerHTML = '';
    }
}

// Create article card element
function createArticleCard(article) {
    const card = document.createElement('div');
    card.className = 'article-card';
    card.onclick = () => {
        window.location.href = `article.html?slug=${article.slug}`;
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
function createPagination(container, totalPages, currentPage) {
    if (!container) return;
    
    container.innerHTML = '';
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Previous';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            displayArticles(currentPage - 1);
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
            displayArticles(i);
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
            displayArticles(currentPage + 1);
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
        
        if (searchTerm === '') {
            displayArticles(1);
            return;
        }
        
        // Filter articles
        const filteredArticles = articles.filter(article => 
            article.title.toLowerCase().includes(searchTerm) ||
            article.excerpt.toLowerCase().includes(searchTerm) ||
            article.categoryName.toLowerCase().includes(searchTerm)
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

