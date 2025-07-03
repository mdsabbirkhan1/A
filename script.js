// Global State Management
class ToolHub {
    constructor() {
        this.currentCategory = 'all';
        this.currentQuery = '';
        this.currentSort = 'name';
        this.currentView = 'grid';
        this.displayedTools = 0;
        this.toolsPerPage = 12;
        this.filteredTools = [];
        this.isLoading = false;
        
        this.init();
    }
    
    // Initialize the application
    init() {
        this.cacheElements();
        this.bindEvents();
        this.loadInitialData();
        this.setupIntersectionObserver();
    }
    
    // Cache DOM elements for better performance
    cacheElements() {
        // Search elements
        this.searchInput = document.getElementById('searchInput');
        this.clearSearchBtn = document.getElementById('clearSearch');
        
        // Filter elements
        this.categoryFilters = document.getElementById('categoryFilters');
        this.toolCount = document.getElementById('toolCount');
        
        // Tools elements
        this.toolsGrid = document.getElementById('toolsGrid');
        this.sortSelect = document.getElementById('sortSelect');
        this.viewButtons = document.querySelectorAll('.view__btn');
        this.loadMoreBtn = document.getElementById('loadMoreBtn');
        this.loadMoreContainer = document.getElementById('loadMoreContainer');
        
        // State elements
        this.loading = document.getElementById('loading');
        this.noResults = document.getElementById('noResults');
        
        // Modal elements
        this.modal = document.getElementById('toolModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalBody = document.getElementById('modalBody');
        this.modalClose = document.getElementById('modalClose');
        this.modalOverlay = document.getElementById('modalOverlay');
        
        // Navigation elements
        this.submitToolBtn = document.getElementById('submitTool');
        this.subscribeBtn = document.getElementById('subscribe');
        this.clearFiltersBtn = document.getElementById('clearFilters');
    }
    
    // Bind event listeners
    bindEvents() {
        // Search events
        this.searchInput.addEventListener('input', this.debounce(this.handleSearch.bind(this), 300));
        this.clearSearchBtn.addEventListener('click', this.clearSearch.bind(this));
        
        // Filter events
        this.sortSelect.addEventListener('change', this.handleSort.bind(this));
        
        // View toggle events
        this.viewButtons.forEach(btn => {
            btn.addEventListener('click', this.handleViewChange.bind(this));
        });
        
        // Load more events
        this.loadMoreBtn.addEventListener('click', this.loadMoreTools.bind(this));
        
        // Modal events
        this.modalClose.addEventListener('click', this.closeModal.bind(this));
        this.modalOverlay.addEventListener('click', this.closeModal.bind(this));
        
        // Clear filters
        this.clearFiltersBtn.addEventListener('click', this.clearAllFilters.bind(this));
        
        // Navigation events
        this.submitToolBtn.addEventListener('click', this.handleSubmitTool.bind(this));
        this.subscribeBtn.addEventListener('click', this.handleSubscribe.bind(this));
        
        // Keyboard events
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
        
        // Resize events
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
    }
    
    // Load initial data and render
    loadInitialData() {
        this.showLoading();
        
        // Simulate loading delay for better UX
        setTimeout(() => {
            this.renderCategories();
            this.updateTools();
            this.hideLoading();
        }, 500);
    }
    
    // Render category filters
    renderCategories() {
        const categories = ToolsData.getCategories();
        
        this.categoryFilters.innerHTML = categories.map(category => `
            <button 
                class="filter__btn ${category.id === this.currentCategory ? 'filter__btn--active' : ''}"
                data-category="${category.id}"
                onclick="toolHub.handleCategoryFilter('${category.id}')"
            >
                <span class="filter__icon">
                    <i class="${category.icon}"></i>
                </span>
                <span class="filter__name">${category.name}</span>
                <span class="filter__count">${category.count}</span>
            </button>
        `).join('');
    }
    
    // Handle category filtering
    handleCategoryFilter(categoryId) {
        this.currentCategory = categoryId;
        this.displayedTools = 0;
        this.updateActiveCategory();
        this.updateTools();
        this.scrollToTools();
    }
    
    // Update active category visual state
    updateActiveCategory() {
        const filterButtons = this.categoryFilters.querySelectorAll('.filter__btn');
        filterButtons.forEach(btn => {
            btn.classList.toggle('filter__btn--active', 
                btn.dataset.category === this.currentCategory);
        });
    }
    
    // Handle search functionality
    handleSearch(event) {
        this.currentQuery = event.target.value;
        this.displayedTools = 0;
        this.updateTools();
        this.updateSearchClearButton();
    }
    
    // Update search clear button visibility
    updateSearchClearButton() {
        if (this.currentQuery.trim()) {
            this.clearSearchBtn.style.opacity = '1';
            this.clearSearchBtn.style.pointerEvents = 'auto';
        } else {
            this.clearSearchBtn.style.opacity = '0';
            this.clearSearchBtn.style.pointerEvents = 'none';
        }
    }
    
    // Clear search
    clearSearch() {
        this.searchInput.value = '';
        this.currentQuery = '';
        this.displayedTools = 0;
        this.updateTools();
        this.updateSearchClearButton();
        this.searchInput.focus();
    }
    
    // Handle sorting
    handleSort(event) {
        this.currentSort = event.target.value;
        this.displayedTools = 0;
        this.updateTools();
    }
    
    // Handle view change (grid/list)
    handleViewChange(event) {
        const newView = event.target.closest('.view__btn').dataset.view;
        if (newView === this.currentView) return;
        
        this.currentView = newView;
        this.updateViewButtons();
        this.updateToolsDisplay();
    }
    
    // Update view buttons state
    updateViewButtons() {
        this.viewButtons.forEach(btn => {
            btn.classList.toggle('view__btn--active', 
                btn.dataset.view === this.currentView);
        });
    }
    
    // Update tools display and filtering
    updateTools() {
        // Get filtered tools
        this.filteredTools = ToolsData.searchTools(this.currentQuery, this.currentCategory);
        this.filteredTools = ToolsData.sortTools(this.filteredTools, this.currentSort);
        
        // Update tool count
        this.updateToolCount();
        
        // Reset display
        this.displayedTools = 0;
        this.toolsGrid.innerHTML = '';
        
        // Show tools or no results
        if (this.filteredTools.length === 0) {
            this.showNoResults();
        } else {
            this.hideNoResults();
            this.loadMoreTools();
        }
    }
    
    // Update tool count display
    updateToolCount() {
        const count = this.filteredTools.length;
        this.toolCount.textContent = count.toLocaleString();
        
        // Update page title
        if (this.currentQuery) {
            document.title = `${count} tools found - ToolHub`;
        } else if (this.currentCategory !== 'all') {
            const categoryName = ToolsData.getCategories()
                .find(cat => cat.id === this.currentCategory)?.name || 'Tools';
            document.title = `${categoryName} - ToolHub`;
        } else {
            document.title = 'ToolHub - Discover the Best Tools';
        }
    }
    
    // Load more tools (pagination)
    loadMoreTools() {
        const startIndex = this.displayedTools;
        const endIndex = Math.min(startIndex + this.toolsPerPage, this.filteredTools.length);
        const toolsToShow = this.filteredTools.slice(startIndex, endIndex);
        
        // Render tools with animation
        toolsToShow.forEach((tool, index) => {
            setTimeout(() => {
                const toolElement = this.createToolCard(tool);
                this.toolsGrid.appendChild(toolElement);
                
                // Trigger animation
                requestAnimationFrame(() => {
                    toolElement.style.opacity = '0';
                    toolElement.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        toolElement.style.transition = 'all 0.3s ease-out';
                        toolElement.style.opacity = '1';
                        toolElement.style.transform = 'translateY(0)';
                    }, 10);
                });
            }, index * 50);
        });
        
        this.displayedTools = endIndex;
        this.updateLoadMoreButton();
        this.updateToolsDisplay();
    }
    
    // Create tool card element
    createToolCard(tool) {
        const card = document.createElement('div');
        card.className = `tool__card ${this.currentView === 'list' ? 'tool__card--list' : ''}`;
        card.setAttribute('data-tool-id', tool.id);
        
        const stars = this.generateStars(tool.rating);
        const badge = tool.badge ? `<div class="tool__badge tool__badge--${tool.badge}">${tool.badge}</div>` : '';
        
        card.innerHTML = `
            ${badge}
            <div class="tool__header">
                <div class="tool__icon">
                    <i class="${tool.icon}"></i>
                </div>
                <div class="tool__info">
                    <h3 class="tool__name">${tool.name}</h3>
                    <div class="tool__category">
                        <i class="${TOOL_CATEGORIES[tool.category].icon}"></i>
                        ${TOOL_CATEGORIES[tool.category].name}
                    </div>
                </div>
            </div>
            <p class="tool__description">${tool.description}</p>
            <div class="tool__footer">
                <a href="${tool.link}" class="tool__link" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">
                    Visit Tool <i class="fas fa-external-link-alt"></i>
                </a>
                <div class="tool__meta">
                    <div class="tool__rating">
                        <div class="tool__stars">${stars}</div>
                        <span>${tool.rating}</span>
                    </div>
                    <span class="tool__pricing">${tool.pricing}</span>
                </div>
            </div>
        `;
        
        // Add click event for modal
        card.addEventListener('click', () => this.openToolModal(tool));
        
        return card;
    }
    
    // Generate star rating HTML
    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let starsHTML = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star tool__star"></i>';
        }
        
        // Half star
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt tool__star"></i>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star tool__star tool__star--empty"></i>';
        }
        
        return starsHTML;
    }
    
    // Update tools display layout
    updateToolsDisplay() {
        this.toolsGrid.className = `tools__grid ${this.currentView === 'list' ? 'tools__grid--list' : ''}`;
        
        // Update existing cards
        const cards = this.toolsGrid.querySelectorAll('.tool__card');
        cards.forEach(card => {
            card.className = `tool__card ${this.currentView === 'list' ? 'tool__card--list' : ''}`;
        });
    }
    
    // Update load more button
    updateLoadMoreButton() {
        if (this.displayedTools >= this.filteredTools.length) {
            this.loadMoreContainer.style.display = 'none';
        } else {
            this.loadMoreContainer.style.display = 'block';
            const remaining = this.filteredTools.length - this.displayedTools;
            this.loadMoreBtn.innerHTML = `
                <i class="fas fa-plus"></i>
                Load ${Math.min(remaining, this.toolsPerPage)} More Tools
            `;
        }
    }
    
    // Open tool modal
    openToolModal(tool) {
        this.modalTitle.textContent = tool.name;
        this.modalBody.innerHTML = this.generateModalContent(tool);
        this.modal.classList.add('modal--active');
        document.body.style.overflow = 'hidden';
        
        // Track modal open event
        this.trackEvent('modal_open', { tool_id: tool.id, tool_name: tool.name });
    }
    
    // Generate modal content
    generateModalContent(tool) {
        const stars = this.generateStars(tool.rating);
        const features = tool.features.map(feature => 
            `<span class="feature__tag">${feature}</span>`
        ).join('');
        
        return `
            <div class="modal__tool">
                <div class="modal__tool-header">
                    <div class="modal__tool-icon">
                        <i class="${tool.icon}"></i>
                    </div>
                    <div class="modal__tool-info">
                        <div class="modal__tool-category">
                            <i class="${TOOL_CATEGORIES[tool.category].icon}"></i>
                            ${TOOL_CATEGORIES[tool.category].name}
                        </div>
                        <div class="modal__tool-rating">
                            <div class="tool__stars">${stars}</div>
                            <span>${tool.rating} out of 5</span>
                        </div>
                    </div>
                </div>
                
                <div class="modal__tool-description">
                    <h4>About ${tool.name}</h4>
                    <p>${tool.description}</p>
                </div>
                
                <div class="modal__tool-features">
                    <h4>Key Features</h4>
                    <div class="features__list">
                        ${features}
                    </div>
                </div>
                
                <div class="modal__tool-pricing">
                    <h4>Pricing</h4>
                    <p class="pricing__info">${tool.pricing}</p>
                </div>
                
                <div class="modal__tool-actions">
                    <a href="${tool.link}" class="btn btn--primary btn--large" target="_blank" rel="noopener noreferrer">
                        <i class="fas fa-external-link-alt"></i>
                        Visit ${tool.name}
                    </a>
                    <button class="btn btn--outline btn--large" onclick="toolHub.shareTool('${tool.id}')">
                        <i class="fas fa-share"></i>
                        Share Tool
                    </button>
                </div>
            </div>
            
            <style>
                .modal__tool { }
                .modal__tool-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
                .modal__tool-icon { width: 80px; height: 80px; border-radius: 1rem; background: var(--gray-100); display: flex; align-items: center; justify-content: center; font-size: 2rem; color: var(--primary-color); border: 2px solid var(--gray-200); }
                .modal__tool-info { flex: 1; }
                .modal__tool-category { color: var(--gray-600); font-size: 0.875rem; margin-bottom: 0.5rem; }
                .modal__tool-rating { display: flex; align-items: center; gap: 0.5rem; }
                .modal__tool-description, .modal__tool-features, .modal__tool-pricing { margin-bottom: 1.5rem; }
                .modal__tool-description h4, .modal__tool-features h4, .modal__tool-pricing h4 { margin-bottom: 0.75rem; color: var(--gray-900); }
                .features__list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
                .feature__tag { padding: 0.25rem 0.75rem; background: var(--primary-color); color: white; border-radius: 1rem; font-size: 0.75rem; font-weight: 500; }
                .pricing__info { color: var(--gray-600); font-weight: 500; }
                .modal__tool-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
                @media (max-width: 640px) {
                    .modal__tool-header { flex-direction: column; text-align: center; }
                    .modal__tool-actions { flex-direction: column; }
                }
            </style>
        `;
    }
    
    // Close modal
    closeModal() {
        this.modal.classList.remove('modal--active');
        document.body.style.overflow = '';
    }
    
    // Clear all filters
    clearAllFilters() {
        this.currentCategory = 'all';
        this.currentQuery = '';
        this.searchInput.value = '';
        this.displayedTools = 0;
        this.updateActiveCategory();
        this.updateSearchClearButton();
        this.updateTools();
    }
    
    // Show loading state
    showLoading() {
        this.loading.style.display = 'block';
        this.toolsGrid.style.display = 'none';
        this.loadMoreContainer.style.display = 'none';
    }
    
    // Hide loading state
    hideLoading() {
        this.loading.style.display = 'none';
        this.toolsGrid.style.display = 'grid';
    }
    
    // Show no results state
    showNoResults() {
        this.noResults.style.display = 'block';
        this.toolsGrid.style.display = 'none';
        this.loadMoreContainer.style.display = 'none';
    }
    
    // Hide no results state
    hideNoResults() {
        this.noResults.style.display = 'none';
        this.toolsGrid.style.display = 'grid';
    }
    
    // Handle keyboard events
    handleKeyboard(event) {
        // ESC key closes modal
        if (event.key === 'Escape' && this.modal.classList.contains('modal--active')) {
            this.closeModal();
        }
        
        // Ctrl/Cmd + K focuses search
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
            event.preventDefault();
            this.searchInput.focus();
        }
    }
    
    // Handle window resize
    handleResize() {
        // Adjust grid layout if needed
        this.updateToolsDisplay();
    }
    
    // Scroll to tools section
    scrollToTools() {
        const toolsSection = document.querySelector('.tools');
        if (toolsSection) {
            toolsSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    // Handle submit tool
    handleSubmitTool() {
        alert('Tool submission feature coming soon! Please check back later.');
        this.trackEvent('submit_tool_click');
    }
    
    // Handle subscribe
    handleSubscribe() {
        const email = prompt('Enter your email to subscribe to our newsletter:');
        if (email && this.isValidEmail(email)) {
            alert('Thank you for subscribing! We\'ll keep you updated with the latest tools.');
            this.trackEvent('newsletter_subscribe', { email: email });
        } else if (email) {
            alert('Please enter a valid email address.');
        }
    }
    
    // Share tool functionality
    shareTool(toolId) {
        const tool = ToolsData.getToolById(toolId);
        if (!tool) return;
        
        const shareData = {
            title: `Check out ${tool.name}`,
            text: tool.description,
            url: `${window.location.origin}${window.location.pathname}?tool=${toolId}`
        };
        
        if (navigator.share) {
            navigator.share(shareData).catch(console.error);
        } else {
            // Fallback: copy to clipboard
            const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Tool information copied to clipboard!');
            }).catch(() => {
                alert('Share functionality not available on this browser.');
            });
        }
        
        this.trackEvent('tool_share', { tool_id: toolId, tool_name: tool.name });
    }
    
    // Setup intersection observer for analytics
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const toolId = entry.target.dataset.toolId;
                    if (toolId) {
                        this.trackEvent('tool_view', { tool_id: toolId });
                    }
                }
            });
        }, { threshold: 0.5 });
        
        // Observe tool cards as they're added
        const observeCards = () => {
            const cards = this.toolsGrid.querySelectorAll('.tool__card:not([data-observed])');
            cards.forEach(card => {
                card.setAttribute('data-observed', 'true');
                observer.observe(card);
            });
        };
        
        // Run initially and after tool updates
        setInterval(observeCards, 1000);
    }
    
    // Utility: Debounce function
    debounce(func, wait) {
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
    
    // Utility: Email validation
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Analytics tracking
    trackEvent(eventName, data = {}) {
        // Basic analytics - replace with your analytics service
        console.log('Analytics Event:', eventName, data);
        
        // Example: Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }
        
        // Example: Custom analytics
        if (typeof analytics !== 'undefined') {
            analytics.track(eventName, data);
        }
    }
}

// URL parameter handling
function handleURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const toolId = urlParams.get('tool');
    
    if (toolId) {
        const tool = ToolsData.getToolById(toolId);
        if (tool) {
            // Open tool modal after initialization
            setTimeout(() => {
                toolHub.openToolModal(tool);
            }, 1000);
        }
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize ToolHub
    window.toolHub = new ToolHub();
    
    // Handle URL parameters
    handleURLParameters();
    
    // Add loading performance metrics
    window.addEventListener('load', () => {
        if ('performance' in window) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
            
            if (toolHub && typeof toolHub.trackEvent === 'function') {
                toolHub.trackEvent('page_load_time', { load_time: loadTime });
            }
        }
    });
});

// Service Worker registration for PWA capabilities
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

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ToolHub;
}