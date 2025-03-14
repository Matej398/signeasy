const express = require('express');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

const app = express();
const uploadDir = path.join(os.tmpdir(), 'uploads');
const signedDir = path.join(os.tmpdir(), 'signed');
const upload = multer({ dest: uploadDir });

// Add CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://codelabhaven.com'); // Allow Hostinger origin
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

async function ensureDirs() {
    await fs.mkdir(uploadDir, { recursive: true }).catch(err => console.log('Upload dir exists:', err));
    await fs.mkdir(signedDir, { recursive: true }).catch(err => console.log('Signed dir exists:', err));
}
ensureDirs();

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.get('/pricing.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'pricing.html'));
});

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
            x: 400,
            y: 50,
            width: 100,
            height: 50
        });
        console.log('Signature drawn');

        const signedPdfBytes = await pdfDoc.save();
        const signedPath = path.join(signedDir, `signed-${Date.now()}.pdf`);
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));