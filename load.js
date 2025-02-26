document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.2}s`; // 0.2s delay between each
    });
});