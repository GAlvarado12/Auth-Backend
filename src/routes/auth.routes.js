const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/auth.controller');
const { verificarToken } = require('../middleware/auth.middleware');
const { requerirRol, requerirPermiso } = require('../middleware/role.middleware');

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Endpoints para gestión de usuarios, roles y permisos
 */

/**
 * @swagger
 * /auth/registrar:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Juan Pérez"
 *               correo:
 *                 type: string
 *                 example: "juan@example.com"
 *               clave:
 *                 type: string
 *                 example: "ClaveSegura123*"
 *               rolInicial:
 *                 type: string
 *                 example: "Cliente"
 *     responses:
 *       200:
 *         description: Usuario creado exitosamente
 */
router.post('/registrar', ctrl.registrar);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 required: [nombre, clave]
 *                 properties:
 *                   nombre:
 *                     type: string
 *                     example: "admin"
 *                   clave:
 *                     type: string
 *                     example: "Admin123*"
 *               - type: object
 *                 required: [correo, clave]
 *                 properties:
 *                   correo:
 *                     type: string
 *                     example: "admin@sistema.com"
 *                   clave:
 *                     type: string
 *                     example: "Admin123*"
 *     responses:
 *       200:
 *         description: Login exitoso con token JWT
 */
router.post('/login', ctrl.iniciarSesion);

/**
 * @swagger
 * /auth/perfil:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario autenticado
 */
router.get('/perfil', verificarToken, ctrl.perfil);

/**
 * @swagger
 * /auth/admin:
 *   get:
 *     summary: Acceso solo para administradores
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bienvenida de administrador
 */
router.get('/admin', verificarToken, requerirRol(['Administrador']), (req, res) => {
  res.json({ mensaje: 'Bienvenido ADMIN' });
});

/**
 * @swagger
 * /auth/usuarios:
 *   get:
 *     summary: Listar todos los usuarios (requiere permiso usuarios.listar)
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get('/usuarios', verificarToken, requerirPermiso('usuarios.listar'), ctrl.listarUsuarios);

/**
 * @swagger
 * /auth/usuarios/{id}:
 *   put:
 *     summary: Actualizar un usuario por ID (requiere permiso usuarios.actualizar)
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Carlos"
 *               correo:
 *                 type: string
 *                 example: "carlos@example.com"
 *               clave:
 *                 type: string
 *                 example: "NuevaClave123"
 *               activo:
 *                 type: boolean
 *                 example: true
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Empleado"]
 *     responses:
 *       200:
 *         description: Usuario actualizado
 */
router.put('/usuarios/:id', verificarToken, requerirPermiso('usuarios.actualizar'), ctrl.actualizarUsuario);

/**
 * @swagger
 * /auth/usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario por ID (requiere permiso usuarios.eliminar)
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado
 */
router.delete('/usuarios/:id', verificarToken, requerirPermiso('usuarios.eliminar'), ctrl.eliminarUsuario);

module.exports = router;
