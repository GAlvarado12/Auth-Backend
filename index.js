require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');

// Importar rutas
const authRoutes = require('./src/routes/auth.routes');
const swaggerDocs = require('./src/config/swagger'); // 👈 nuevo

// Inicializar app
const app = express();
app.use(express.json());
app.use(cookieParser());

// Rutas principales
app.use('/api/auth', authRoutes);

// Swagger Docs
swaggerDocs(app); //activamos swagger en /api/docs

// Puerto desde .env
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Documentación Swagger en http://localhost:${PORT}/api/docs`);
});
