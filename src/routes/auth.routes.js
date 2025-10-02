const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');

// Registro y login
router.post('/register', authController.register);
router.post('/login', authController.login);

// Ruta protegida (solo admin)
router.get('/admin', verifyToken, checkRole(['admin']), (req, res) => {
  res.json({ message: 'Bienvenido ADMIN' });
});

// Ruta protegida (usuario logueado)
router.get('/profile', verifyToken, (req, res) => {
  res.json({ message: `Perfil del usuario ${req.user.id}`, role: req.user.role });
});

// Mostrar todos los usuarios (solo admin)
router.get('/users', verifyToken, checkRole(['admin']), authController.getAllUsers);

// Actualizar usuario por ID (solo admin)
router.put('/users/:id', verifyToken, checkRole(['admin']), authController.updateUser);

// Eliminar usuario por ID (solo admin)
router.delete('/users/:id', verifyToken, checkRole(['admin']), authController.deleteUser);

module.exports = router;
