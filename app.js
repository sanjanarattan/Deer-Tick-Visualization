const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show')
        } else {
            entry.target.classList.remove('show')
        }
    });
}, { threshold: 0.2 });

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => sectionObserver.observe(el));
const highlightObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show-animation')
        } else {
            entry.target.classList.remove('show-animation')
        }
    });
}, { threshold: 0.5 });

const highlightElements = document.querySelectorAll('.heading-highlight');
highlightElements.forEach((el) => highlightObserver.observe(el));

document.addEventListener('DOMContentLoaded', function() {
    const tickImage = document.getElementById('tick-image')
    const tickLifecycle = document.getElementById('tick-lifecycle')
    const nyMapPreview = document.getElementById('ny-map-preview')
        const styleElement = document.createElement('style')
    styleElement.textContent = `
        #tick-image, #tick-lifecycle, #ny-map-preview {
            opacity: 0;
            position: absolute;
            transition: opacity 1.2s ease-in-out, transform 1.2s ease-out;
            transform: scale(0.95);
        }
        
        .image-active {
            opacity: 1 !important;
            transform: scale(1) !important;
        }
        
        .image-inactive {
            opacity: 0 !important;
            transform: scale(0.95) !important;
        }
    `;
    document.head.appendChild(styleElement);
    
    const stepImageMap = {
        'tick-intro': 'tick-image',
        'lifecycle': 'tick-lifecycle',
        'distribution': 'ny-map-preview',
        'final': 'tick-image',
        '2': 'tick-image',
        '3': 'tick-image',
        '5': 'tick-image'
    };
    let currentActiveStep = null;
    function showImageForStep(stepId) {
        if (stepId === currentActiveStep) {
            return;
        }
        console.log(`Transitioning to step: ${stepId}`);
        currentActiveStep = stepId;
        const allImages = [tickImage, tickLifecycle, nyMapPreview];
        const targetImageId = stepImageMap[stepId];
        const targetImage = document.getElementById(targetImageId);
        allImages.forEach(img => {
            if (!img) return;
            
            if (img.id === targetImageId) {
                img.style.display = 'block';
                setTimeout(() => {
                    img.classList.add('image-active');
                    img.classList.remove('image-inactive')
                }, 50);
            } else {
                img.classList.remove('image-active');
                img.classList.add('image-inactive');
                setTimeout(() => {
                    if (img.classList.contains('image-inactive')) {
                        img.style.display = 'none'
                    }
                }, 1200);
            }
        });
    }
    
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    const handleScroll = throttle(function() {
        const steps = document.querySelectorAll('.step')
        let mostVisibleStep = null;
        let maxVisibility = 0;
        
        steps.forEach(step => {
            const rect = step.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
            const visibility = visibleHeight / step.offsetHeight;
            
            if (visibility > maxVisibility && visibility > 0.3) { 
                maxVisibility = visibility;
                mostVisibleStep = step
            }
        });
        
        if (mostVisibleStep) {
            const stepId = mostVisibleStep.getAttribute('data-step');
            showImageForStep(stepId)
        }
    }, 150); 
    
    window.addEventListener('scroll', handleScroll)
    setTimeout(() => {
        handleScroll()
    }, 300)
})