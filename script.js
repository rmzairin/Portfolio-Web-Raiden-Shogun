// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const pageContainer = document.getElementById('pageContainer');
const heroButtons = document.querySelectorAll('.hero-buttons .btn');
const contactForm = document.querySelector('.contact-form');
const lightningCanvas = document.getElementById('lightningCanvas');
const particlesContainer = document.getElementById('particlesContainer');

// Current page tracker
let currentPage = 'home';
let isTransitioning = false;

// Lightning effect variables
let ctx;
let lightningPoints = [];
let lastLightningTime = 0;

// Initialize
function init() {
    // Set home page as active immediately
    const homePage = document.getElementById('home');
    if (homePage) {
        homePage.classList.add('active');
        homePage.style.position = 'relative';
        homePage.style.opacity = '1';
        homePage.style.visibility = 'visible';
        homePage.style.transform = 'rotateY(0deg)';
    }
    
    // Initialize lightning canvas
    initLightningCanvas();
    
    // Create floating particles
    createParticles();
    
    // Add event listeners
    addEventListeners();
    
    // Animate skill bars on page load
    setTimeout(animateSkills, 300);
    
    // Start lightning animation
    animateLightning();
}

// Initialize Lightning Canvas
function initLightningCanvas() {
    if (!lightningCanvas) return;
    
    ctx = lightningCanvas.getContext('2d');
    resizeLightningCanvas();
    
    window.addEventListener('resize', resizeLightningCanvas);
}

function resizeLightningCanvas() {
    lightningCanvas.width = window.innerWidth;
    lightningCanvas.height = window.innerHeight;
}

// Create Lightning Effect
function createLightning(x, y) {
    const lightning = {
        x: x,
        y: y,
        segments: [],
        alpha: 1,
        color: Math.random() > 0.5 ? '#d946ef' : '#a855f7'
    };
    
    // Generate lightning segments
    let currentX = x;
    let currentY = y;
    const targetY = y + 200 + Math.random() * 300;
    
    while (currentY < targetY) {
        const nextX = currentX + (Math.random() - 0.5) * 100;
        const nextY = currentY + 20 + Math.random() * 30;
        
        lightning.segments.push({
            x1: currentX,
            y1: currentY,
            x2: nextX,
            y2: nextY
        });
        
        // Add branches
        if (Math.random() > 0.7) {
            const branchLength = Math.random() * 50 + 30;
            const branchAngle = (Math.random() - 0.5) * Math.PI / 2;
            lightning.segments.push({
                x1: nextX,
                y1: nextY,
                x2: nextX + Math.cos(branchAngle) * branchLength,
                y2: nextY + Math.sin(branchAngle) * branchLength
            });
        }
        
        currentX = nextX;
        currentY = nextY;
    }
    
    return lightning;
}

function drawLightning(lightning) {
    if (!ctx) return;
    
    ctx.save();
    ctx.globalAlpha = lightning.alpha;
    ctx.shadowBlur = 20;
    ctx.shadowColor = lightning.color;
    
    lightning.segments.forEach(segment => {
        // Main lightning bolt
        ctx.strokeStyle = lightning.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(segment.x1, segment.y1);
        ctx.lineTo(segment.x2, segment.y2);
        ctx.stroke();
        
        // Glow effect
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(segment.x1, segment.y1);
        ctx.lineTo(segment.x2, segment.y2);
        ctx.stroke();
    });
    
    ctx.restore();
}

function animateLightning() {
    if (!ctx) return;
    
    ctx.clearRect(0, 0, lightningCanvas.width, lightningCanvas.height);
    
    // Create new lightning periodically
    const now = Date.now();
    if (now - lastLightningTime > 2000 && Math.random() > 0.7) {
        const x = Math.random() * lightningCanvas.width;
        const y = -50;
        lightningPoints.push(createLightning(x, y));
        lastLightningTime = now;
    }
    
    // Update and draw existing lightning
    lightningPoints = lightningPoints.filter(lightning => {
        lightning.alpha -= 0.05;
        if (lightning.alpha > 0) {
            drawLightning(lightning);
            return true;
        }
        return false;
    });
    
    requestAnimationFrame(animateLightning);
}

// Create Floating Particles
function createParticles() {
    if (!particlesContainer) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
            createParticle();
        }, i * 100);
    }
    
    // Continue creating particles
    setInterval(() => {
        if (document.querySelectorAll('.particle').length < particleCount) {
            createParticle();
        }
    }, 500);
}

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const startX = Math.random() * window.innerWidth;
    const drift = (Math.random() - 0.5) * 200;
    const duration = 3 + Math.random() * 4;
    const size = 2 + Math.random() * 3;
    const delay = Math.random() * 2;
    
    particle.style.left = startX + 'px';
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.setProperty('--drift', drift + 'px');
    particle.style.animationDuration = duration + 's';
    particle.style.animationDelay = delay + 's';
    
    particlesContainer.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        particle.remove();
    }, (duration + delay) * 1000);
}

// Trigger lightning on navigation
function triggerLightning() {
    const count = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const x = Math.random() * lightningCanvas.width;
            const y = -50;
            lightningPoints.push(createLightning(x, y));
        }, i * 100);
    }
}

// Add event listeners
function addEventListeners() {
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
    
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Hero buttons
    heroButtons.forEach(button => {
        button.addEventListener('click', handleHeroButtonClick);
    });
    
    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && !navMenu.contains(e.target) && menuToggle && !menuToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            resetMenuIcon();
        }
    });
    
    // Prevent menu close when clicking inside
    if (navMenu) {
        navMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}

// Handle navigation click
function handleNavClick(e) {
    e.preventDefault();
    e.stopPropagation();
    const targetPage = e.target.dataset.page;
    
    if (targetPage && targetPage !== currentPage && !isTransitioning) {
        navigateToPage(targetPage);
    }
    
    // Close mobile menu
    if (navMenu) {
        navMenu.classList.remove('active');
        resetMenuIcon();
    }
}

// Handle hero button click
function handleHeroButtonClick(e) {
    const targetPage = e.target.dataset.page;
    if (targetPage && !isTransitioning) {
        navigateToPage(targetPage);
    }
}

// Navigate to page with FIXED paper fold effect
function navigateToPage(targetPage) {
    if (isTransitioning || targetPage === currentPage) return;
    
    isTransitioning = true;
    
    // Trigger lightning effect
    triggerLightning();
    
    // Get current and target page elements
    const currentPageEl = document.getElementById(currentPage);
    const targetPageEl = document.getElementById(targetPage);
    
    if (!currentPageEl || !targetPageEl) {
        isTransitioning = false;
        return;
    }
    
    // Step 1: Fold out current page
    currentPageEl.classList.add('folding-out');
    
    setTimeout(() => {
        // Step 2: Hide current page completely
        currentPageEl.classList.remove('active', 'folding-out');
        currentPageEl.style.position = 'absolute';
        currentPageEl.style.opacity = '0';
        currentPageEl.style.visibility = 'hidden';
        currentPageEl.style.transform = 'rotateY(-90deg)';
        
        // Step 3: Prepare target page
        targetPageEl.style.position = 'relative';
        targetPageEl.style.opacity = '0';
        targetPageEl.style.visibility = 'visible';
        targetPageEl.style.transform = 'rotateY(90deg)';
        
        // Step 4: Fold in target page
        setTimeout(() => {
            targetPageEl.classList.add('active');
            
            // Update current page
            currentPage = targetPage;
            
            // Update navigation
            updateNavigation(targetPage);
            
            // Re-animate content if needed
            if (targetPage === 'about') {
                setTimeout(animateSkills, 400);
            }
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Reset transition flag
            setTimeout(() => {
                isTransitioning = false;
            }, 800);
        }, 50);
    }, 600);
}

// Update navigation
function updateNavigation(pageName) {
    navLinks.forEach(link => {
        if (link.dataset.page === pageName) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Update page title
    const pageTitles = {
        home: 'Home - Portfolio',
        about: 'About - Portfolio',
        education: 'Education - Portfolio',
        experience: 'Experience - Portfolio',
        project: 'Projects - Portfolio',
        contact: 'Contact - Portfolio'
    };
    
    document.title = pageTitles[pageName] || 'Portfolio';
}

// Toggle mobile menu
function toggleMobileMenu(e) {
    e.stopPropagation();
    navMenu.classList.toggle('active');
    
    // Animate hamburger icon
    const spans = menuToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(7px, 7px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
    } else {
        resetMenuIcon();
    }
}

// Reset menu icon
function resetMenuIcon() {
    const spans = menuToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
}

// Animate skill bars
function animateSkills() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach((bar, index) => {
        // Get the target width
        const targetWidth = bar.style.width;
        
        // Reset to 0
        bar.style.width = '0';
        bar.style.transition = 'none';
        
        // Force reflow
        bar.offsetHeight;
        
        // Animate with delay
        setTimeout(() => {
            bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
            bar.style.width = targetWidth;
        }, index * 100);
    });
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    
    // Validate form
    if (!data.name || !data.email || !data.message) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Show success message
    showNotification('Message sent successfully! I will get back to you soon.', 'success');
    
    // Reset form
    e.target.reset();
    
    // Log data (replace with actual API call)
    console.log('Form data:', data);
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style notification
    const bgColor = type === 'success' 
        ? 'linear-gradient(135deg, #10b981, #059669)' 
        : type === 'error'
        ? 'linear-gradient(135deg, #ef4444, #dc2626)'
        : 'linear-gradient(135deg, #7c3aed, #d946ef)';
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '1rem 1.5rem',
        background: bgColor,
        color: 'white',
        borderRadius: '0.7rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        zIndex: '9999',
        animation: 'slideInRight 0.5s ease',
        fontWeight: '600',
        maxWidth: '90%',
        wordWrap: 'break-word'
    });
    
    // Add to body
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 4000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Parallax effect for mouse movement (desktop only)
if (window.innerWidth > 768) {
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        
        // Apply parallax to blobs
        const blobs = document.querySelectorAll('.blob');
        blobs.forEach((blob, index) => {
            const speed = (index + 1) * 15;
            const currentTransform = blob.style.transform || '';
            blob.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
        });
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe timeline items
document.querySelectorAll('.timeline-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(item);
});

// Observe project cards
document.querySelectorAll('.project-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'scale(0.9) translateY(20px)';
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

// Enhanced project card hover with electric effect
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function(e) {
        this.style.transform = 'translateY(-12px) scale(1.02)';
        
        // Create electric sparks on hover
        const rect = this.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top;
        
        // Create small lightning
        if (ctx) {
            for (let i = 0; i < 2; i++) {
                setTimeout(() => {
                    const sparkX = x + (Math.random() - 0.5) * rect.width;
                    const lightning = createLightning(sparkX, y);
                    lightning.segments = lightning.segments.slice(0, 3); // Shorter lightning
                    lightningPoints.push(lightning);
                }, i * 50);
            }
        }
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Smooth scroll
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

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Console welcome message
console.log('%c ⚡ Welcome to My Portfolio! ⚡ ', 'background: linear-gradient(135deg, #7c3aed, #d946ef); color: white; padding: 12px 24px; font-size: 16px; font-weight: bold; border-radius: 8px;');
console.log('%c Built with HTML, CSS, and JavaScript ✨', 'color: #f0abfc; font-size: 14px; font-weight: 600;');
console.log('%c Powered by Electric Energy ⚡', 'color: #d946ef; font-size: 12px; font-style: italic;');