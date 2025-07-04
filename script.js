// Global variables
let allTools = [];
let filteredTools = [];
let currentPage = 1;
const toolsPerPage = 12;
let currentCategory = 'all';
let currentPriceFilter = 'all';
let currentRatingFilter = 'all';
let currentSort = 'popular';

// DOM elements
const toolsGrid = document.getElementById('tools-grid');
const loadMoreBtn = document.getElementById('load-more');
const searchInput = document.getElementById('search-input');
const categoryBtns = document.querySelectorAll('.category-btn');
const priceFilter = document.getElementById('price-filter');
const ratingFilter = document.getElementById('rating-filter');
const sortSelect = document.getElementById('sort-by');
const modal = document.getElementById('tool-modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.querySelector('.close-modal');
const loadingSpinner = document.getElementById('loading-spinner');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadToolsData();
    initializeEventListeners();
    updateStats();
});

// Load tools data from XML
async function loadToolsData() {
    try {
        showLoading(true);
        const response = await fetch('tools-data.xml');
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        allTools = parseXMLToTools(xmlDoc);
        filteredTools = [...allTools];
        displayTools();
        updateToolCount();
        
    } catch (error) {
        console.error('Error loading tools data:', error);
        showError('Failed to load tools data. Please try again later.');
    } finally {
        showLoading(false);
    }
}

// Parse XML document to tools array
function parseXMLToTools(xmlDoc) {
    const toolElements = xmlDoc.querySelectorAll('tool');
    const tools = [];
    
    toolElements.forEach(toolEl => {
        const tool = {
            id: toolEl.getAttribute('id'),
            name: getTextContent(toolEl, 'name'),
            category: getTextContent(toolEl, 'category'),
            icon: getTextContent(toolEl, 'icon'),
            iconBg: getTextContent(toolEl, 'icon_bg'),
            description: getTextContent(toolEl, 'description'),
            link: getTextContent(toolEl, 'link'),
            price: getTextContent(toolEl, 'price'),
            rating: parseFloat(getTextContent(toolEl, 'rating')),
            reviews: parseInt(getTextContent(toolEl, 'reviews')),
            popular: getTextContent(toolEl, 'popular') === 'true',
            featured: getTextContent(toolEl, 'featured') === 'true',
            tags: getTextContent(toolEl, 'tags').split(',')
        };
        tools.push(tool);
    });
    
    return tools;
}

// Helper function to get text content from XML element
function getTextContent(parent, tagName) {
    const element = parent.querySelector(tagName);
    return element ? element.textContent.trim() : '';
}

// Initialize event listeners
function initializeEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    document.querySelector('.search-btn').addEventListener('click', handleSearch);
    
    // Category filters
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentCategory = e.target.dataset.category;
            updateCategoryButtons();
            applyFilters();
        });
    });
    
    // Price and rating filters
    priceFilter.addEventListener('change', (e) => {
        currentPriceFilter = e.target.value;
        applyFilters();
    });
    
    ratingFilter.addEventListener('change', (e) => {
        currentRatingFilter = e.target.value;
        applyFilters();
    });
    
    // Sort functionality
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        sortTools();
        displayTools();
    });
    
    // Load more functionality
    loadMoreBtn.addEventListener('click', loadMoreTools);
    
    // Modal functionality
    closeModal.addEventListener('click', closeToolModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeToolModal();
    });
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    
    // Mobile navigation
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Search functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredTools = [...allTools];
    } else {
        filteredTools = allTools.filter(tool => 
            tool.name.toLowerCase().includes(searchTerm) ||
            tool.description.toLowerCase().includes(searchTerm) ||
            tool.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
            tool.category.toLowerCase().includes(searchTerm)
        );
    }
    
    applyCurrentFilters();
    currentPage = 1;
    displayTools();
    updateToolCount();
}

// Apply all current filters
function applyFilters() {
    let filtered = [...allTools];
    
    // Apply search filter
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm) {
        filtered = filtered.filter(tool => 
            tool.name.toLowerCase().includes(searchTerm) ||
            tool.description.toLowerCase().includes(searchTerm) ||
            tool.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
            tool.category.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply category filter
    if (currentCategory !== 'all') {
        filtered = filtered.filter(tool => tool.category === currentCategory);
    }
    
    // Apply price filter
    if (currentPriceFilter !== 'all') {
        filtered = filtered.filter(tool => tool.price === currentPriceFilter);
    }
    
    // Apply rating filter
    if (currentRatingFilter !== 'all') {
        const minRating = parseInt(currentRatingFilter);
        filtered = filtered.filter(tool => tool.rating >= minRating);
    }
    
    filteredTools = filtered;
    sortTools();
    currentPage = 1;
    displayTools();
    updateToolCount();
}

// Apply current filters without search
function applyCurrentFilters() {
    let filtered = [...filteredTools];
    
    // Apply category filter
    if (currentCategory !== 'all') {
        filtered = filtered.filter(tool => tool.category === currentCategory);
    }
    
    // Apply price filter
    if (currentPriceFilter !== 'all') {
        filtered = filtered.filter(tool => tool.price === currentPriceFilter);
    }
    
    // Apply rating filter
    if (currentRatingFilter !== 'all') {
        const minRating = parseInt(currentRatingFilter);
        filtered = filtered.filter(tool => tool.rating >= minRating);
    }
    
    filteredTools = filtered;
    sortTools();
}

// Sort tools based on current sort option
function sortTools() {
    switch (currentSort) {
        case 'popular':
            filteredTools.sort((a, b) => {
                if (a.popular && !b.popular) return -1;
                if (!a.popular && b.popular) return 1;
                return b.reviews - a.reviews;
            });
            break;
        case 'rating':
            filteredTools.sort((a, b) => b.rating - a.rating);
            break;
        case 'name':
            filteredTools.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'newest':
            // For demo purposes, reverse the array to simulate newest first
            filteredTools.sort((a, b) => parseInt(b.id) - parseInt(a.id));
            break;
        default:
            break;
    }
}

// Display tools in the grid
function displayTools() {
    const startIndex = (currentPage - 1) * toolsPerPage;
    const endIndex = currentPage * toolsPerPage;
    const toolsToShow = filteredTools.slice(0, endIndex);
    
    if (currentPage === 1) {
        toolsGrid.innerHTML = '';
    }
    
    const newTools = filteredTools.slice(startIndex, endIndex);
    
    newTools.forEach((tool, index) => {
        setTimeout(() => {
            const toolCard = createToolCard(tool);
            toolsGrid.appendChild(toolCard);
            toolCard.classList.add('fade-in');
        }, index * 50);
    });
    
    // Update load more button
    if (endIndex >= filteredTools.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
    
    // Show no results message if needed
    if (filteredTools.length === 0) {
        showNoResults();
    }
}

// Create tool card HTML
function createToolCard(tool) {
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.onclick = () => openToolModal(tool);
    
    const stars = generateStars(tool.rating);
    const priceClass = tool.price === 'free' ? 'free' : tool.price === 'paid' ? 'paid' : 'freemium';
    const priceText = tool.price === 'free' ? 'Free' : tool.price === 'paid' ? 'Paid' : 'Freemium';
    
    card.innerHTML = `
        <div class="tool-header">
            <div class="tool-icon" style="background: ${tool.iconBg}">
                <i class="${tool.icon}"></i>
            </div>
            <div class="tool-info">
                <h3>${tool.name}</h3>
                <span class="tool-category">${getCategoryDisplayName(tool.category)}</span>
            </div>
        </div>
        <p class="tool-description">${tool.description}</p>
        <div class="tool-meta">
            <div class="tool-rating">
                <div class="stars">${stars}</div>
                <span class="rating-text">${tool.rating} (${tool.reviews.toLocaleString()})</span>
            </div>
            <div class="tool-price ${priceClass}">${priceText}</div>
        </div>
        <div class="tool-footer">
            <a href="${tool.link}" target="_blank" class="tool-link" onclick="event.stopPropagation()">Visit Site</a>
            <button class="tool-link primary" onclick="event.stopPropagation(); openToolModal(this.dataset)" data-tool='${JSON.stringify(tool)}'>Learn More</button>
        </div>
    `;
    
    return card;
}

// Generate star rating HTML
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Get display name for category
function getCategoryDisplayName(category) {
    const categoryNames = {
        'writing': 'Writing & Editing',
        'seo': 'SEO & Analytics',
        'design': 'Design & Graphics',
        'social': 'Social Media',
        'email': 'Email Marketing',
        'monetization': 'Monetization',
        'hosting': 'Hosting & Domain',
        'productivity': 'Productivity',
        'plugins': 'WordPress Plugins',
        'security': 'Security',
        'backup': 'Backup & Recovery'
    };
    
    return categoryNames[category] || category;
}

// Open tool modal
function openToolModal(tool) {
    if (typeof tool === 'string') {
        tool = JSON.parse(tool);
    }
    
    const stars = generateStars(tool.rating);
    const priceClass = tool.price === 'free' ? 'free' : tool.price === 'paid' ? 'paid' : 'freemium';
    const priceText = tool.price === 'free' ? 'Free' : tool.price === 'paid' ? 'Paid' : 'Freemium';
    
    modalBody.innerHTML = `
        <div class="tool-modal-header">
            <div class="tool-icon" style="background: ${tool.iconBg}">
                <i class="${tool.icon}"></i>
            </div>
            <div>
                <h2>${tool.name}</h2>
                <span class="tool-category">${getCategoryDisplayName(tool.category)}</span>
            </div>
        </div>
        
        <div class="tool-modal-meta">
            <div class="tool-rating">
                <div class="stars">${stars}</div>
                <span class="rating-text">${tool.rating} (${tool.reviews.toLocaleString()} reviews)</span>
            </div>
            <div class="tool-price ${priceClass}">${priceText}</div>
        </div>
        
        <div class="tool-modal-description">
            <h3>About ${tool.name}</h3>
            <p>${tool.description}</p>
        </div>
        
        <div class="tool-modal-tags">
            <h3>Features</h3>
            <div class="tag-list">
                ${tool.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
        
        <div class="tool-modal-actions">
            <a href="${tool.link}" target="_blank" class="tool-link primary">Visit ${tool.name}</a>
            <button class="tool-link" onclick="shareTool('${tool.name}', '${tool.link}')">Share Tool</button>
        </div>
    `;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close tool modal
function closeToolModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Share tool functionality
function shareTool(name, link) {
    if (navigator.share) {
        navigator.share({
            title: `Check out ${name}`,
            text: `I found this amazing tool for bloggers: ${name}`,
            url: link
        });
    } else {
        // Fallback: copy to clipboard
        const text = `Check out ${name}: ${link}`;
        navigator.clipboard.writeText(text).then(() => {
            showMessage('Tool link copied to clipboard!');
        });
    }
}

// Load more tools
function loadMoreTools() {
    currentPage++;
    displayTools();
}

// Update category buttons
function updateCategoryButtons() {
    categoryBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === currentCategory) {
            btn.classList.add('active');
        }
    });
}

// Update tool count display
function updateToolCount() {
    const totalToolsElement = document.getElementById('total-tools');
    if (totalToolsElement) {
        totalToolsElement.textContent = `${allTools.length}+`;
    }
}

// Show/hide loading spinner
function showLoading(show) {
    loadingSpinner.style.display = show ? 'flex' : 'none';
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const container = document.querySelector('.container');
    container.insertBefore(errorDiv, container.firstChild);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Show success message
function showMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.textContent = message;
    
    const container = document.querySelector('.container');
    container.insertBefore(messageDiv, container.firstChild);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Show no results
function showNoResults() {
    toolsGrid.innerHTML = `
        <div class="no-results">
            <div class="no-results-icon">
                <i class="fas fa-search"></i>
            </div>
            <h3>No tools found</h3>
            <p>Try adjusting your search terms or filters.</p>
            <button class="load-more-btn" onclick="clearAllFilters()">Clear Filters</button>
        </div>
    `;
    loadMoreBtn.style.display = 'none';
}

// Clear all filters
function clearAllFilters() {
    searchInput.value = '';
    currentCategory = 'all';
    currentPriceFilter = 'all';
    currentRatingFilter = 'all';
    currentSort = 'popular';
    
    // Reset UI elements
    priceFilter.value = 'all';
    ratingFilter.value = 'all';
    sortSelect.value = 'popular';
    updateCategoryButtons();
    
    // Reset data and display
    filteredTools = [...allTools];
    sortTools();
    currentPage = 1;
    displayTools();
    updateToolCount();
}

// Handle newsletter form submission
function handleNewsletterSubmit(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    // Simulate newsletter subscription
    showMessage('Thanks for subscribing! You\'ll receive updates about new tools.');
    e.target.reset();
}

// Update stats on page
function updateStats() {
    // Animate numbers on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
            }
        });
    });
    
    document.querySelectorAll('.stat-number').forEach(el => {
        observer.observe(el);
    });
}

// Animate number counter
function animateNumber(element) {
    const target = parseInt(element.textContent.replace(/\D/g, ''));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        const suffix = element.textContent.includes('+') ? '+' : '';
        const prefix = element.textContent.includes('K') ? 'K' : '';
        element.textContent = Math.floor(current) + prefix + suffix;
    }, 16);
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scroll animation for better UX
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Add intersection observer for animations
document.addEventListener('DOMContentLoaded', function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-up');
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe elements for animation
    document.querySelectorAll('.tool-card').forEach(card => {
        observer.observe(card);
    });
});

// Service Worker registration for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}