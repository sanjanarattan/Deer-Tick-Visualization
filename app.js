const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        console.log(entry)
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    })
}, { threshold: 0.2 });

const hidden = document.querySelectorAll('.hidden');

hidden.forEach((el) => observer.observe(el));
