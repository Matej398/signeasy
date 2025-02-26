const express = require('express');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const upload = multer({ dest: '../uploads/' }); // Saves files in uploads folder

// Serve static files from public folder
app.use(express.static(path.join(__dirname, '../public')));

// Handle specific routes for HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.get('/pricing.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'pricing.html'));
});

// Serve header.html and footer.html explicitly if needed (optional fallback)
app.get('/header.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'header.html'));
});

app.get('/footer.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'footer.html'));
});

app.post('/upload-and-sign', upload.fields([{ name: 'pdf' }, { name: 'signature' }]), async (req, res) => {
    try {
        console.log('Received files:', req.files);
        const pdfFile = req.files['pdf'][0];
        const sigFile = req.files['signature'][0];
        console.log('PDF path:', pdfFile.path, 'Sig path:', sigFile.path);

        const pdfBytes = await fs.readFile(pdfFile.path);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        console.log('PDF loaded');

        const sigBytes = await fs.readFile(sigFile.path);
        const sigImage = await pdfDoc.embedPng(sigBytes);
        console.log('Signature embedded');

        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        firstPage.drawImage(sigImage, {
            x: 400, // Right side
            y: 50,
            width: 100,
            height: 50
        });
        console.log('Signature drawn');

        const signedPdfBytes = await pdfDoc.save();
        const signedPath = path.join(__dirname, '../signed', `signed-${Date.now()}.pdf`);
        await fs.writeFile(signedPath, signedPdfBytes);
        console.log('Signed PDF saved:', signedPath);

        await fs.unlink(pdfFile.path);
        await fs.unlink(sigFile.path);

        res.download(signedPath, 'signed.pdf', async (err) => {
            if (!err) await fs.unlink(signedPath);
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error signing PDF');
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));