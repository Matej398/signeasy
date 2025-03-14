let signaturesLeft = 3;

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('signaturePad');
    const ctx = canvas.getContext('2d');
    let drawing = false;

    document.getElementById('status').innerHTML = `Signatures left this month: <span class="signature-count">${signaturesLeft}</span>`;

    canvas.addEventListener('mousedown', (e) => {
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    });
    canvas.addEventListener('mouseup', () => drawing = false);
    canvas.addEventListener('mousemove', draw);
    document.getElementById('clearBtn').addEventListener('click', () => ctx.clearRect(0, 0, canvas.width, canvas.height));
    document.getElementById('signBtn').addEventListener('click', signDoc);

    function draw(e) {
        if (!drawing) return;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000000';
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    }

    async function signDoc() {
        const fileInput = document.getElementById('docUpload');
        const file = fileInput.files[0];
        if (!file) {
            alert('Please upload a PDF first!');
            return;
        }
        if (signaturesLeft <= 0) {
            alert('Sorry, you’ve used all your free signatures this month! Upgrade to Pro for unlimited signing.');
            return;
        }

        const sigDataUrl = canvas.toDataURL('image/png');
        const sigBlob = await (await fetch(sigDataUrl)).blob();

        const formData = new FormData();
        formData.append('pdf', file);
        formData.append('signature', sigBlob, 'signature.png');

        try {
            const response = await fetch('https://signeasy-backend.onrender.com/upload-and-sign', {  // Replace with YOUR Render URL
                method: 'POST',
                body: formData,
            });
            if (!response.ok) throw new Error('Signing failed');

            const signedBlob = await response.blob();
            const url = window.URL.createObjectURL(signedBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'signed.pdf';
            a.click();
            window.URL.revokeObjectURL(url);

            if (signaturesLeft > 0) {
                signaturesLeft--;
                document.getElementById('status').innerHTML = `Signatures left this month: <span class="signature-count">${signaturesLeft}</span>`;
            }
        } catch (err) {
            alert('Error: ' + err.message);
        }
    }
});