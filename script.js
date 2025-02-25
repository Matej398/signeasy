const canvas = document.getElementById('signaturePad');
const ctx = canvas.getContext('2d');
let drawing = false;

canvas.addEventListener('mousedown', () => drawing = true);
canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mousemove', draw);
document.getElementById('clearBtn').addEventListener('click', () => ctx.clearRect(0, 0, canvas.width, canvas.height));
document.getElementById('signBtn').addEventListener('click', signDoc);

function draw(e) {
    if (!drawing) return;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
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