// Tool Categories Configuration
const TOOL_CATEGORIES = {
    'all': {
        name: 'All Tools',
        icon: 'fas fa-th',
        color: '#6366f1'
    },
    'productivity': {
        name: 'Productivity',
        icon: 'fas fa-rocket',
        color: '#10b981'
    },
    'development': {
        name: 'Developer Tools',
        icon: 'fas fa-code',
        color: '#3b82f6'
    },
    'design': {
        name: 'Design',
        icon: 'fas fa-palette',
        color: '#f59e0b'
    },
    'marketing': {
        name: 'Marketing',
        icon: 'fas fa-bullhorn',
        color: '#ef4444'
    },
    'ai': {
        name: 'AI & Machine Learning',
        icon: 'fas fa-brain',
        color: '#8b5cf6'
    },
    'communication': {
        name: 'Communication',
        icon: 'fas fa-comments',
        color: '#06b6d4'
    },
    'analytics': {
        name: 'Analytics',
        icon: 'fas fa-chart-line',
        color: '#84cc16'
    },
    'security': {
        name: 'Security',
        icon: 'fas fa-shield-alt',
        color: '#f97316'
    },
    'education': {
        name: 'Education',
        icon: 'fas fa-graduation-cap',
        color: '#ec4899'
    },
    'finance': {
        name: 'Finance',
        icon: 'fas fa-dollar-sign',
        color: '#14b8a6'
    },
    'automation': {
        name: 'Automation',
        icon: 'fas fa-cogs',
        color: '#6366f1'
    }
};

// Tools Database - All tool content managed here
const TOOLS_DATABASE = [
    // Productivity Tools
    {
        id: 'notion',
        name: 'Notion',
        category: 'productivity',
        description: 'All-in-one workspace for notes, tasks, wikis, and databases. Perfect for teams and individuals looking to organize their work and life.',
        icon: 'fas fa-sticky-note',
        link: 'https://notion.so',
        rating: 4.8,
        badge: 'popular',
        features: ['Note-taking', 'Database management', 'Team collaboration', 'Templates'],
        pricing: 'Freemium',
        dateAdded: '2024-01-15'
    },
    {
        id: 'todoist',
        name: 'Todoist',
        category: 'productivity',
        description: 'Task management app that helps you organize your work and life. Features natural language processing and smart scheduling.',
        icon: 'fas fa-check-circle',
        link: 'https://todoist.com',
        rating: 4.6,
        badge: 'featured',
        features: ['Task management', 'Natural language input', 'Project organization', 'Team collaboration'],
        pricing: 'Freemium',
        dateAdded: '2024-01-10'
    },
    {
        id: 'obsidian',
        name: 'Obsidian',
        category: 'productivity',
        description: 'Knowledge management app that creates a network of linked notes. Perfect for researchers, writers, and knowledge workers.',
        icon: 'fas fa-project-diagram',
        link: 'https://obsidian.md',
        rating: 4.7,
        features: ['Linked notes', 'Graph view', 'Plugin ecosystem', 'Markdown support'],
        pricing: 'Free',
        dateAdded: '2024-01-08'
    },
    {
        id: 'calendly',
        name: 'Calendly',
        category: 'productivity',
        description: 'Scheduling automation platform that eliminates the back-and-forth emails to find the perfect time to meet.',
        icon: 'fas fa-calendar-alt',
        link: 'https://calendly.com',
        rating: 4.5,
        features: ['Automated scheduling', 'Calendar integration', 'Meeting preferences', 'Team scheduling'],
        pricing: 'Freemium',
        dateAdded: '2024-01-12'
    },
    
    // Development Tools
    {
        id: 'github',
        name: 'GitHub',
        category: 'development',
        description: 'Development platform for version control and collaboration. Host and review code, manage projects, and build software alongside millions of developers.',
        icon: 'fab fa-github',
        link: 'https://github.com',
        rating: 4.9,
        badge: 'popular',
        features: ['Version control', 'Code collaboration', 'Issue tracking', 'CI/CD', 'Package hosting'],
        pricing: 'Freemium',
        dateAdded: '2024-01-20'
    },
    {
        id: 'vscode',
        name: 'Visual Studio Code',
        category: 'development',
        description: 'Free, lightweight, and powerful code editor with built-in support for JavaScript, TypeScript, and Node.js. Extensive extension ecosystem.',
        icon: 'fas fa-code',
        link: 'https://code.visualstudio.com',
        rating: 4.8,
        badge: 'featured',
        features: ['IntelliSense', 'Debugging', 'Extensions', 'Git integration', 'Terminal'],
        pricing: 'Free',
        dateAdded: '2024-01-18'
    },
    {
        id: 'postman',
        name: 'Postman',
        category: 'development',
        description: 'Collaboration platform for API development. Design, mock, debug, test, document, monitor, and publish your APIs.',
        icon: 'fas fa-satellite-dish',
        link: 'https://postman.com',
        rating: 4.6,
        features: ['API testing', 'Documentation', 'Collaboration', 'Monitoring', 'Mock servers'],
        pricing: 'Freemium',
        dateAdded: '2024-01-16'
    },
    {
        id: 'docker',
        name: 'Docker',
        category: 'development',
        description: 'Platform for developing, shipping, and running applications using containerization technology. Simplifies deployment and scaling.',
        icon: 'fab fa-docker',
        link: 'https://docker.com',
        rating: 4.7,
        features: ['Containerization', 'Application deployment', 'Microservices', 'DevOps', 'Orchestration'],
        pricing: 'Freemium',
        dateAdded: '2024-01-14'
    },
    {
        id: 'vercel',
        name: 'Vercel',
        category: 'development',
        description: 'Frontend cloud platform for deploying and hosting modern web applications. Optimized for frameworks like Next.js, React, and Vue.',
        icon: 'fas fa-cloud',
        link: 'https://vercel.com',
        rating: 4.8,
        badge: 'new',
        features: ['Serverless deployment', 'Edge functions', 'Analytics', 'Preview deployments', 'CDN'],
        pricing: 'Freemium',
        dateAdded: '2024-01-22'
    },
    
    // Design Tools
    {
        id: 'figma',
        name: 'Figma',
        category: 'design',
        description: 'Collaborative interface design tool for creating user interfaces, prototypes, and design systems. Browser-based with real-time collaboration.',
        icon: 'fas fa-pen-nib',
        link: 'https://figma.com',
        rating: 4.8,
        badge: 'popular',
        features: ['UI/UX design', 'Prototyping', 'Real-time collaboration', 'Design systems', 'Developer handoff'],
        pricing: 'Freemium',
        dateAdded: '2024-01-19'
    },
    {
        id: 'canva',
        name: 'Canva',
        category: 'design',
        description: 'Graphic design platform with drag-and-drop interface. Create presentations, social media graphics, posters, documents and other visual content.',
        icon: 'fas fa-images',
        link: 'https://canva.com',
        rating: 4.7,
        badge: 'featured',
        features: ['Templates', 'Drag & drop editor', 'Brand kit', 'Team collaboration', 'Stock photos'],
        pricing: 'Freemium',
        dateAdded: '2024-01-17'
    },
    {
        id: 'sketch',
        name: 'Sketch',
        category: 'design',
        description: 'Digital design platform for creating user interfaces, websites, and icons. Mac-native with powerful vector editing capabilities.',
        icon: 'fas fa-vector-square',
        link: 'https://sketch.com',
        rating: 4.5,
        features: ['Vector design', 'Symbols & libraries', 'Prototyping', 'Plugin ecosystem', 'Cloud sync'],
        pricing: 'Paid',
        dateAdded: '2024-01-13'
    },
    {
        id: 'adobe-xd',
        name: 'Adobe XD',
        category: 'design',
        description: 'Vector-based user experience design tool for web and mobile apps. Features design, prototype, and share capabilities in one platform.',
        icon: 'fas fa-cube',
        link: 'https://adobe.com/products/xd.html',
        rating: 4.4,
        features: ['UI design', 'Prototyping', 'Voice prototyping', 'Auto-animate', 'Creative Cloud integration'],
        pricing: 'Freemium',
        dateAdded: '2024-01-11'
    },
    
    // Marketing Tools
    {
        id: 'mailchimp',
        name: 'Mailchimp',
        category: 'marketing',
        description: 'All-in-one marketing platform for email marketing, automation, and audience management. Helps grow your business with targeted campaigns.',
        icon: 'fas fa-envelope',
        link: 'https://mailchimp.com',
        rating: 4.5,
        badge: 'popular',
        features: ['Email marketing', 'Automation', 'Audience insights', 'Landing pages', 'Social media ads'],
        pricing: 'Freemium',
        dateAdded: '2024-01-21'
    },
    {
        id: 'hootsuite',
        name: 'Hootsuite',
        category: 'marketing',
        description: 'Social media management platform for scheduling posts, monitoring conversations, and measuring performance across multiple networks.',
        icon: 'fas fa-share-alt',
        link: 'https://hootsuite.com',
        rating: 4.3,
        features: ['Social scheduling', 'Content curation', 'Analytics', 'Team collaboration', 'Social listening'],
        pricing: 'Freemium',
        dateAdded: '2024-01-09'
    },
    {
        id: 'google-analytics',
        name: 'Google Analytics',
        category: 'marketing',
        description: 'Web analytics service that tracks and reports website traffic. Provides insights into user behavior and marketing performance.',
        icon: 'fas fa-chart-bar',
        link: 'https://analytics.google.com',
        rating: 4.6,
        badge: 'featured',
        features: ['Website analytics', 'Audience insights', 'Conversion tracking', 'Real-time reporting', 'E-commerce tracking'],
        pricing: 'Free',
        dateAdded: '2024-01-07'
    },
    
    // AI & Machine Learning Tools
    {
        id: 'chatgpt',
        name: 'ChatGPT',
        category: 'ai',
        description: 'AI-powered conversational assistant for writing, coding, analysis, and creative tasks. Advanced language model with broad knowledge.',
        icon: 'fas fa-robot',
        link: 'https://chat.openai.com',
        rating: 4.9,
        badge: 'popular',
        features: ['Natural conversation', 'Code generation', 'Writing assistance', 'Problem solving', 'Creative tasks'],
        pricing: 'Freemium',
        dateAdded: '2024-01-25'
    },
    {
        id: 'midjourney',
        name: 'Midjourney',
        category: 'ai',
        description: 'AI art generator that creates stunning images from text descriptions. Perfect for concept art, illustrations, and creative projects.',
        icon: 'fas fa-magic',
        link: 'https://midjourney.com',
        rating: 4.7,
        badge: 'new',
        features: ['Text-to-image', 'Style variations', 'High-resolution output', 'Commercial use', 'Community gallery'],
        pricing: 'Paid',
        dateAdded: '2024-01-23'
    },
    {
        id: 'claude',
        name: 'Claude',
        category: 'ai',
        description: 'AI assistant by Anthropic focused on being helpful, harmless, and honest. Excellent for analysis, writing, and complex reasoning tasks.',
        icon: 'fas fa-brain',
        link: 'https://claude.ai',
        rating: 4.8,
        features: ['Advanced reasoning', 'Document analysis', 'Coding assistance', 'Creative writing', 'Research help'],
        pricing: 'Freemium',
        dateAdded: '2024-01-24'
    },
    
    // Communication Tools
    {
        id: 'slack',
        name: 'Slack',
        category: 'communication',
        description: 'Business communication platform that brings team conversations into organized channels. Integrates with hundreds of tools.',
        icon: 'fab fa-slack',
        link: 'https://slack.com',
        rating: 4.6,
        badge: 'popular',
        features: ['Team messaging', 'File sharing', 'App integrations', 'Voice/video calls', 'Workflow automation'],
        pricing: 'Freemium',
        dateAdded: '2024-01-06'
    },
    {
        id: 'discord',
        name: 'Discord',
        category: 'communication',
        description: 'Voice, video, and text communication platform designed for creating communities. Popular among gamers and online communities.',
        icon: 'fab fa-discord',
        link: 'https://discord.com',
        rating: 4.5,
        features: ['Voice channels', 'Text messaging', 'Screen sharing', 'Server management', 'Bot integration'],
        pricing: 'Freemium',
        dateAdded: '2024-01-05'
    },
    {
        id: 'zoom',
        name: 'Zoom',
        category: 'communication',
        description: 'Video conferencing platform for virtual meetings, webinars, and online events. Reliable and feature-rich communication solution.',
        icon: 'fas fa-video',
        link: 'https://zoom.us',
        rating: 4.4,
        badge: 'featured',
        features: ['Video conferencing', 'Screen sharing', 'Recording', 'Breakout rooms', 'Webinars'],
        pricing: 'Freemium',
        dateAdded: '2024-01-04'
    },
    
    // Analytics Tools
    {
        id: 'mixpanel',
        name: 'Mixpanel',
        category: 'analytics',
        description: 'Product analytics platform for tracking user interactions and measuring engagement. Helps optimize user experience and retention.',
        icon: 'fas fa-chart-pie',
        link: 'https://mixpanel.com',
        rating: 4.5,
        features: ['Event tracking', 'Funnel analysis', 'Cohort analysis', 'A/B testing', 'User segmentation'],
        pricing: 'Freemium',
        dateAdded: '2024-01-03'
    },
    {
        id: 'hotjar',
        name: 'Hotjar',
        category: 'analytics',
        description: 'Website heatmaps and behavior analytics tool. Understand how users interact with your website through recordings and heatmaps.',
        icon: 'fas fa-fire',
        link: 'https://hotjar.com',
        rating: 4.6,
        badge: 'featured',
        features: ['Heatmaps', 'Session recordings', 'Surveys', 'Feedback polls', 'Conversion funnels'],
        pricing: 'Freemium',
        dateAdded: '2024-01-02'
    },
    
    // Security Tools
    {
        id: 'bitwarden',
        name: 'Bitwarden',
        category: 'security',
        description: 'Open-source password manager for individuals, teams, and businesses. Secure password storage and sharing with end-to-end encryption.',
        icon: 'fas fa-lock',
        link: 'https://bitwarden.com',
        rating: 4.8,
        badge: 'featured',
        features: ['Password management', 'Secure sharing', 'Two-factor auth', 'Password generator', 'Vault auditing'],
        pricing: 'Freemium',
        dateAdded: '2024-01-01'
    },
    {
        id: 'cloudflare',
        name: 'Cloudflare',
        category: 'security',
        description: 'Web performance and security company providing CDN, DDoS protection, and security services for websites and applications.',
        icon: 'fas fa-cloud-upload-alt',
        link: 'https://cloudflare.com',
        rating: 4.7,
        features: ['CDN', 'DDoS protection', 'SSL certificates', 'DNS management', 'Security analytics'],
        pricing: 'Freemium',
        dateAdded: '2023-12-30'
    },
    
    // Education Tools
    {
        id: 'coursera',
        name: 'Coursera',
        category: 'education',
        description: 'Online learning platform offering courses, specializations, and degrees from top universities and companies worldwide.',
        icon: 'fas fa-university',
        link: 'https://coursera.org',
        rating: 4.5,
        badge: 'popular',
        features: ['University courses', 'Professional certificates', 'Degree programs', 'Skill assessments', 'Career services'],
        pricing: 'Freemium',
        dateAdded: '2023-12-29'
    },
    {
        id: 'duolingo',
        name: 'Duolingo',
        category: 'education',
        description: 'Language learning platform that makes learning new languages fun and effective through gamified lessons and exercises.',
        icon: 'fas fa-language',
        link: 'https://duolingo.com',
        rating: 4.6,
        features: ['40+ languages', 'Gamified learning', 'Personalized lessons', 'Progress tracking', 'Community features'],
        pricing: 'Freemium',
        dateAdded: '2023-12-28'
    },
    
    // Finance Tools
    {
        id: 'stripe',
        name: 'Stripe',
        category: 'finance',
        description: 'Online payment processing platform for businesses. Accept payments, manage subscriptions, and handle financial operations.',
        icon: 'fas fa-credit-card',
        link: 'https://stripe.com',
        rating: 4.8,
        badge: 'popular',
        features: ['Payment processing', 'Subscription billing', 'Marketplace payments', 'Financial reporting', 'Fraud prevention'],
        pricing: 'Pay-per-use',
        dateAdded: '2023-12-27'
    },
    {
        id: 'quickbooks',
        name: 'QuickBooks',
        category: 'finance',
        description: 'Accounting software for small and medium businesses. Manage invoices, expenses, payroll, and financial reporting.',
        icon: 'fas fa-calculator',
        link: 'https://quickbooks.intuit.com',
        rating: 4.4,
        features: ['Invoicing', 'Expense tracking', 'Payroll', 'Tax preparation', 'Financial reports'],
        pricing: 'Paid',
        dateAdded: '2023-12-26'
    },
    
    // Automation Tools
    {
        id: 'zapier',
        name: 'Zapier',
        category: 'automation',
        description: 'Automation platform that connects apps and automates workflows. No coding required to integrate 5000+ popular apps.',
        icon: 'fas fa-bolt',
        link: 'https://zapier.com',
        rating: 4.7,
        badge: 'popular',
        features: ['App integration', 'Workflow automation', 'Multi-step workflows', 'Conditional logic', 'Webhooks'],
        pricing: 'Freemium',
        dateAdded: '2023-12-25'
    },
    {
        id: 'ifttt',
        name: 'IFTTT',
        category: 'automation',
        description: 'Simple automation platform that connects devices and services. Create custom automations with if-this-then-that logic.',
        icon: 'fas fa-link',
        link: 'https://ifttt.com',
        rating: 4.3,
        features: ['Device automation', 'Service integration', 'Location triggers', 'Time-based triggers', 'Custom applets'],
        pricing: 'Freemium',
        dateAdded: '2023-12-24'
    }
];

// Utility functions for data manipulation
const ToolsData = {
    // Get all categories with tool counts
    getCategories() {
        const categoryCounts = {};
        
        // Initialize all categories with count 0
        Object.keys(TOOL_CATEGORIES).forEach(categoryId => {
            categoryCounts[categoryId] = 0;
        });
        
        // Count tools in each category
        TOOLS_DATABASE.forEach(tool => {
            if (categoryCounts.hasOwnProperty(tool.category)) {
                categoryCounts[tool.category]++;
            }
        });
        
        // Count all tools for 'all' category
        categoryCounts.all = TOOLS_DATABASE.length;
        
        return Object.keys(TOOL_CATEGORIES).map(categoryId => ({
            id: categoryId,
            name: TOOL_CATEGORIES[categoryId].name,
            icon: TOOL_CATEGORIES[categoryId].icon,
            color: TOOL_CATEGORIES[categoryId].color,
            count: categoryCounts[categoryId]
        }));
    },
    
    // Get tools by category
    getToolsByCategory(categoryId = 'all') {
        if (categoryId === 'all') {
            return TOOLS_DATABASE;
        }
        return TOOLS_DATABASE.filter(tool => tool.category === categoryId);
    },
    
    // Search tools by query
    searchTools(query, categoryId = 'all') {
        let tools = this.getToolsByCategory(categoryId);
        
        if (!query || query.trim() === '') {
            return tools;
        }
        
        const searchTerm = query.toLowerCase().trim();
        
        return tools.filter(tool => {
            return (
                tool.name.toLowerCase().includes(searchTerm) ||
                tool.description.toLowerCase().includes(searchTerm) ||
                tool.features.some(feature => feature.toLowerCase().includes(searchTerm)) ||
                TOOL_CATEGORIES[tool.category].name.toLowerCase().includes(searchTerm)
            );
        });
    },
    
    // Sort tools
    sortTools(tools, sortBy = 'name') {
        const sortedTools = [...tools];
        
        switch (sortBy) {
            case 'name':
                return sortedTools.sort((a, b) => a.name.localeCompare(b.name));
            case 'category':
                return sortedTools.sort((a, b) => {
                    const categoryA = TOOL_CATEGORIES[a.category].name;
                    const categoryB = TOOL_CATEGORIES[b.category].name;
                    return categoryA.localeCompare(categoryB);
                });
            case 'rating':
                return sortedTools.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            case 'newest':
                return sortedTools.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            case 'popular':
                // Sort by badge priority: popular > featured > new, then by rating
                const badgePriority = { 'popular': 3, 'featured': 2, 'new': 1, undefined: 0 };
                return sortedTools.sort((a, b) => {
                    const priorityA = badgePriority[a.badge] || 0;
                    const priorityB = badgePriority[b.badge] || 0;
                    
                    if (priorityA !== priorityB) {
                        return priorityB - priorityA;
                    }
                    return (b.rating || 0) - (a.rating || 0);
                });
            default:
                return sortedTools;
        }
    },
    
    // Get tool by ID
    getToolById(id) {
        return TOOLS_DATABASE.find(tool => tool.id === id);
    },
    
    // Get featured tools
    getFeaturedTools(limit = 6) {
        return TOOLS_DATABASE
            .filter(tool => tool.badge === 'featured' || tool.badge === 'popular')
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, limit);
    },
    
    // Get tools statistics
    getStats() {
        const totalTools = TOOLS_DATABASE.length;
        const categories = Object.keys(TOOL_CATEGORIES).length - 1; // Exclude 'all'
        const avgRating = TOOLS_DATABASE.reduce((sum, tool) => sum + (tool.rating || 0), 0) / totalTools;
        const newestTool = TOOLS_DATABASE.reduce((newest, tool) => {
            return new Date(tool.dateAdded) > new Date(newest.dateAdded) ? tool : newest;
        });
        
        return {
            totalTools,
            categories,
            averageRating: Math.round(avgRating * 10) / 10,
            newestTool: newestTool.name,
            lastUpdate: newestTool.dateAdded
        };
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TOOL_CATEGORIES, TOOLS_DATABASE, ToolsData };
}