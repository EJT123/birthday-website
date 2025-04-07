// Color palette for dynamic effects
const colorPalettes = [
    ['#ee7752', '#e73c7e', '#23a6d5', '#23d5ab'], // Default palette
    ['#FF9A9E', '#FAD0C4', '#FFA8A8', '#FCBAD3'], // Pink palette
    ['#A1C4FD', '#C2E9FB', '#96C7ED', '#BAE6FD'], // Blue palette
    ['#D4FC79', '#96E6A1', '#A8E6CF', '#B8F2D8'], // Green palette
    ['#FBC2EB', '#A6C1EE', '#E2B0FF', '#9FA4FF']  // Purple palette
];

// Balloon effect using Three.js
const container = document.getElementById('balloon-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Create balloons with dynamic colors
const balloons = [];
let currentPalette = 0;
const balloonGeometry = new THREE.SphereGeometry(0.5, 32, 32);

function getRandomColor() {
    const palette = colorPalettes[currentPalette];
    const color = palette[Math.floor(Math.random() * palette.length)];
    return new THREE.Color(color);
}

function createBalloon() {
    const material = new THREE.MeshPhongMaterial({ color: getRandomColor() });
    const balloon = new THREE.Mesh(balloonGeometry, material);
    
    // Random position
    balloon.position.x = (Math.random() - 0.5) * 20;
    balloon.position.y = Math.random() * -20;
    balloon.position.z = Math.random() * -10;
    
    // Random size
    const scale = 0.5 + Math.random() * 0.5;
    balloon.scale.set(scale, scale, scale);
    
    // Add string
    const stringGeometry = new THREE.CylinderGeometry(0.01, 0.01, 2, 8);
    const stringMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const string = new THREE.Mesh(stringGeometry, stringMaterial);
    string.position.y = -1;
    balloon.add(string);
    
    scene.add(balloon);
    return {
        mesh: balloon,
        speed: 0.02 + Math.random() * 0.03,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        wobbleOffset: Math.random() * Math.PI * 2
    };
}

// Initialize balloons
for (let i = 0; i < 30; i++) {
    balloons.push(createBalloon());
}

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

camera.position.z = 5;

// Animation loop
let time = 0;
function animate() {
    requestAnimationFrame(animate);
    time += 0.01;
    
    balloons.forEach(balloon => {
        balloon.mesh.position.y += balloon.speed;
        balloon.mesh.position.x += Math.sin(time + balloon.wobbleOffset) * 0.02;
        balloon.mesh.rotation.x += balloon.rotationSpeed;
        balloon.mesh.rotation.z += balloon.rotationSpeed;
        
        // Reset position when balloon goes too high
        if (balloon.mesh.position.y > 20) {
            balloon.mesh.position.y = -20;
            balloon.mesh.position.x = (Math.random() - 0.5) * 20;
            // Change balloon color on reset
            balloon.mesh.material.color = getRandomColor();
        }
    });
    
    renderer.render(scene, camera);
}

// Change color palette periodically
setInterval(() => {
    currentPalette = (currentPalette + 1) % colorPalettes.length;
}, 15000);

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Enhanced confetti effect with color palettes
function triggerConfetti() {
    const palette = colorPalettes[currentPalette];
    const count = 200;
    const defaults = {
        origin: { y: 0.7 },
        zIndex: 1000,
        colors: palette
    };

    function fire(particleRatio, opts) {
        confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio)
        });
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });

    fire(0.2, {
        spread: 60,
    });

    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
}

// Start animations
animate();
triggerConfetti();

// Trigger confetti periodically
setInterval(triggerConfetti, 20000);

// Add some quotes
const quotes = [
    "A father is someone you look up to no matter how tall you grow.",
    "The greatest gift I ever had came from God; I call him Dad!",
    "Dad: A son's first hero, a daughter's first love.",
    "Any man can be a father, but it takes someone special to be a dad.",
    "The older I get, the smarter my father seems to get.",
    "Thank you for always being there, supporting us, and showing us the way.",
    "Your love, guidance, and wisdom have shaped who we are today.",
    "Here's to 50 amazing years of making the world a better place!"
];

// Rotate quotes with color changes
let currentQuoteIndex = 0;
const quoteElement = document.querySelector('.quote');

function rotateQuote() {
    const palette = colorPalettes[currentPalette];
    gsap.to(quoteElement, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
            currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
            quoteElement.textContent = quotes[currentQuoteIndex];
            quoteElement.style.color = palette[Math.floor(Math.random() * palette.length)];
            gsap.to(quoteElement, {
                opacity: 1,
                duration: 0.5
            });
        }
    });
}

setInterval(rotateQuote, 5000);

// Intersection Observer for animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, {
    threshold: 0.1
});

// Observe elements
document.querySelectorAll('.timeline-item, .masonry-item, .wish-card').forEach(el => {
    observer.observe(el);
});

// Initialize loading screen
window.addEventListener('load', () => {
    const loading = document.querySelector('.loading');
    loading.style.opacity = '0';
    setTimeout(() => loading.style.display = 'none', 500);
    initializeWebsite();
});

function initializeWebsite() {
    // Initialize Particles.js
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: false },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.4, width: 1 },
            move: { enable: true, speed: 6, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: { enable: true, mode: 'repulse' },
                onclick: { enable: true, mode: 'push' },
                resize: true
            }
        }
    });

    // Initialize Vanilla-tilt
    VanillaTilt.init(document.querySelectorAll('.wish-card'), {
        max: 25,
        speed: 400,
        glare: true,
        'max-glare': 0.5
    });

    // Quote Slider
    let currentQuote = 0;
    const quotes = document.querySelectorAll('.quote-container');
    const prevBtn = document.querySelector('.prev-quote');
    const nextBtn = document.querySelector('.next-quote');

    function showQuote(index) {
        quotes.forEach(quote => quote.classList.remove('active'));
        quotes[index].classList.add('active');
    }

    prevBtn.addEventListener('click', () => {
        currentQuote = (currentQuote - 1 + quotes.length) % quotes.length;
        showQuote(currentQuote);
    });

    nextBtn.addEventListener('click', () => {
        currentQuote = (currentQuote + 1) % quotes.length;
        showQuote(currentQuote);
    });

    // Auto-rotate quotes
    setInterval(() => {
        currentQuote = (currentQuote + 1) % quotes.length;
        showQuote(currentQuote);
    }, 5000);

    // Gallery Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => item.style.opacity = '1', 10);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => item.style.display = 'none', 500);
                }
            });
        });
    });

    // Parallax Effect
    window.addEventListener('scroll', () => {
        const parallaxSections = document.querySelectorAll('.parallax-section');
        parallaxSections.forEach(section => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            section.style.transform = `translateY(${rate}px)`;
        });
    });

    // Interactive Cake
    const cake = document.querySelector('.cake-3d');
    const blowButton = document.querySelector('.blow-candles');
    let isBlown = false;

    blowButton.addEventListener('click', () => {
        if (!isBlown) {
            isBlown = true;
            // Trigger confetti
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            // Animate candle flame
            document.querySelector('.flame').style.opacity = '0';
            // Show celebration message
            const message = document.createElement('div');
            message.className = 'celebration-message';
            message.textContent = 'Happy Birthday! 🎉';
            document.body.appendChild(message);
            setTimeout(() => message.remove(), 3000);
        }
    });

    // Floating Balloons
    function createBalloon() {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.left = Math.random() * 100 + 'vw';
        balloon.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
        document.getElementById('balloon-container').appendChild(balloon);

        setTimeout(() => balloon.remove(), 10000);
    }

    // Create balloons periodically
    setInterval(createBalloon, 2000);

    // Periodic Confetti
    setInterval(() => {
        confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.9 }
        });
    }, 15000);

    // Initialize image hover effects
    const images = document.querySelectorAll('.gallery-img');
    images.forEach(img => {
        img.addEventListener('mouseover', () => {
            img.style.transform = 'scale(1.1) rotate(2deg)';
        });
        img.addEventListener('mouseout', () => {
            img.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Show birthday popup when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize popup elements
    const popup = document.getElementById('birthdayPopup');
    const passwordSection = document.getElementById('passwordSection');
    const celebrationSection = document.getElementById('celebrationSection');
    const passwordInput = document.getElementById('passwordInput');
    const submitButton = document.getElementById('submitPassword');
    const passwordError = document.getElementById('passwordError');
    const closeButton = document.querySelector('.close-popup');

    // Show popup with animation
    setTimeout(() => {
        popup.classList.add('show');
    }, 1000);

    // Password validation
    const correctPassword = "Best Dad EVER";
    
    submitButton.addEventListener('click', checkPassword);
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });

    function checkPassword() {
        if (passwordInput.value === correctPassword) {
            // Success animation
            passwordSection.style.animation = 'fadeOut 0.5s forwards';
            setTimeout(() => {
                passwordSection.style.display = 'none';
                celebrationSection.style.display = 'block';
                celebrationSection.style.animation = 'fadeIn 0.5s forwards';
                
                // Trigger celebration effects
                triggerCelebration();
            }, 500);
        } else {
            // Error animation
            passwordError.textContent = "Incorrect password. Try again!";
            passwordInput.style.animation = 'shake 0.5s';
            setTimeout(() => {
                passwordInput.style.animation = '';
            }, 500);
        }
    }

    function triggerCelebration() {
        // Trigger confetti
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });

        // Add floating balloons
        createBalloons();
    }

    // Close popup when button is clicked
    closeButton.addEventListener('click', () => {
        popup.classList.remove('show');
    });

    // Smooth scroll for all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Animate elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.gallery-item, .message-content, .photo-highlight');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Initial animation setup
    document.querySelectorAll('.gallery-item, .message-content, .photo-highlight').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease-out';
    });

    // Listen for scroll events
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check

    // Create floating balloons in the hero section
    const createBalloons = () => {
        const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96E6A1'];
        const balloonContainer = document.querySelector('.balloon-container');
        
        for (let i = 0; i < 10; i++) {
            const balloon = document.createElement('div');
            balloon.className = 'balloon';
            balloon.style.left = `${Math.random() * 100}%`;
            balloon.style.animationDelay = `${Math.random() * 3}s`;
            balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            balloonContainer.appendChild(balloon);
        }
    };

    createBalloons();

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroContent = document.querySelector('.hero-content');
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - (scrolled * 0.003);
    });

    // Add hover effect to gallery images
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Add these keyframe animations to your CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    @keyframes fadeOut {
        to { opacity: 0; }
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);
