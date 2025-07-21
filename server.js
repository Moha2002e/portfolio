require('dotenv').config();
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Définir le dossier racine pour servir les fichiers statiques (HTML, CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json());

// Définir une route principale pour servir votre fichier HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route API pour le formulaire de contact
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Champs manquants.' });
  }
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });
    await transporter.sendMail({
      from: `Portfolio <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO || process.env.MAIL_USER,
      subject: `Nouveau message de ${name} via le portfolio`,
      text: `Nom: ${name}\nEmail: ${email}\n\n${message}`,
      replyTo: email
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Erreur lors de l\'envoi du mail:', err);
    res.status(500).json({ success: false, error: 'Erreur lors de l\'envoi.' });
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur Node.js démarré. Rendez-vous sur http://localhost:${port}`);
}); 