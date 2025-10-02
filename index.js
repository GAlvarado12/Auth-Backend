require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');

// Importar rutas
const authRoutes = require('./src/routes/auth.routes');

// Inicializar app
const app = express();
app.use(express.json());
app.use(cookieParser());

// Rutas principales
app.use('/api/auth', authRoutes);

// Puerto desde .env
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
