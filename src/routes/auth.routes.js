const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticación y gestión de usuarios
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "gustavo"
 *               password:
 *                 type: string
 *                 example: "123456"
 *               role:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: Usuario registrado exitosamente
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "gustavo"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login exitoso con token JWT
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/admin:
 *   get:
 *     summary: Ruta protegida solo para administradores
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bienvenido ADMIN
 */
router.get('/admin', verifyToken, checkRole(['admin']), (req, res) => {
  res.json({ message: 'Bienvenido ADMIN' });
});

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del perfil del usuario
 */
router.get('/profile', verifyToken, (req, res) => {
  res.json({ message: `Perfil del usuario ${req.user.id}`, role: req.user.role });
});

/**
 * @swagger
 * /auth/users:
 *   get:
 *     summary: Listar todos los usuarios (solo admin)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get('/users', verifyToken, checkRole(['admin']), authController.getAllUsers);

/**
 * @swagger
 * /auth/users/{id}:
 *   put:
 *     summary: Actualizar un usuario por ID (solo admin)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "nuevo_nombre"
 *               password:
 *                 type: string
 *                 example: "nueva123"
 *               role:
 *                 type: string
 *                 example: "user"
 *     responses:
 *       200:
 *         description: Usuario actualizado
 */
router.put('/users/:id', verifyToken, checkRole(['admin']), authController.updateUser);

/**
 * @swagger
 * /auth/users/{id}:
 *   delete:
 *     summary: Eliminar un usuario por ID (solo admin)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado
 */
router.delete('/users/:id', verifyToken, checkRole(['admin']), authController.deleteUser);

module.exports = router;
