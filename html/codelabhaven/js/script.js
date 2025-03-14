const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', (e) => {
    const x = e.pageX - 200;
    const y = e.pageY - 200;
    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';
});