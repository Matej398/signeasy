const canvas = document.getElementById('signaturePad');
const ctx = canvas.getContext('2d');
let drawing = false;

canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    ctx.beginPath(); // Reset path on start
    ctx.moveTo(e.offsetX, e.offsetY); // Start at click point
});
canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    drawing = true;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
}, { passive: false });
canvas.addEventListener('touchend', () => drawing = false);
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!drawing) return;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    draw({ offsetX: touch.clientX - rect.left, offsetY: touch.clientY - rect.top });
}, { passive: false });
document.getElementById('clearBtn').addEventListener('click', () => ctx.clearRect(0, 0, canvas.width, canvas.height));
document.getElementById('signBtn').addEventListener('click', signDoc);

function draw(e) {
    if (!drawing) return;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#fff'; /* White signature */
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
}

function signDoc() {
    const file = document.getElementById('docUpload').files[0];
    if (!file) {
        alert('Upload a PDF first!');
        return;
    }
    alert('Signed! (Pretend download here—real PDF signing needs backend.)');
    document.getElementById('status').textContent = 'Signatures left this month: 2';
}