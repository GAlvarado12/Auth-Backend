const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario, Rol } = require('../models');

const registrar = async (req, res) => {
  try {
    const { nombre, correo, clave, rolInicial } = req.body;

    if (!nombre || !correo || !clave) {
      return res.status(400).json({ mensaje: 'nombre, correo y clave son obligatorios' });
    }

    const hash = await bcrypt.hash(clave, 10);
    const usuario = await Usuario.create({ nombre, correo, clave: hash, activo: true });

    if (rolInicial) {
      const rol = await Rol.findOne({ where: { nombre: rolInicial } });
      if (rol) await usuario.addRol(rol);
    }

    res.json({
      mensaje: 'Usuario registrado',
      usuario: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, activo: usuario.activo }
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar', detalle: error.message });
  }
};

const iniciarSesion = async (req, res) => {
  try {
    const { nombre, correo, clave } = req.body;
    if ((!nombre && !correo) || !clave) {
      return res.status(400).json({ mensaje: 'Debe enviar nombre o correo, y la clave' });
    }

    const where = nombre ? { nombre } : { correo };
    const usuario = await Usuario.findOne({ where });
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    if (!usuario.activo) return res.status(403).json({ mensaje: 'Usuario inactivo' });

    const ok = await bcrypt.compare(clave, usuario.clave);
    if (!ok) return res.status(401).json({ mensaje: 'Credenciales inválidas' });

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ mensaje: 'Login exitoso', token });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al iniciar sesión', detalle: error.message });
  }
};

/**
 * Utilidad: perfil básico (requiere JWT)
 */
const perfil = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: ['id', 'nombre', 'correo', 'activo', 'createdAt'],
      include: { model: Rol, as: 'roles', attributes: ['id', 'nombre'] }
    });
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener perfil', detalle: error.message });
  }
};

/**
 * Admin: listar usuarios (requiere permiso/rol).
 */
const listarUsuarios = async (_req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id', 'nombre', 'correo', 'activo', 'createdAt'],
      include: { model: Rol, as: 'roles', attributes: ['id', 'nombre'] }
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al listar usuarios', detalle: error.message });
  }
};

/**
 * Admin: actualizar usuario por id
 */
const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo, clave, activo, roles } = req.body;

    const usuario = await Usuario.findByPk(id, { include: { model: Rol, as: 'roles' } });
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    if (nombre) usuario.nombre = nombre;
    if (correo) usuario.correo = correo;
    if (typeof activo === 'boolean') usuario.activo = activo;
    if (clave) usuario.clave = await bcrypt.hash(clave, 10);

    await usuario.save();

    // Actualización de roles (por nombres)
    if (Array.isArray(roles)) {
      const rolesBD = await Rol.findAll({ where: { nombre: roles } });
      await usuario.setRoles(rolesBD);
    }

    res.json({ mensaje: 'Usuario actualizado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar', detalle: error.message });
  }
};

/**
 * Admin: eliminar usuario por id
 */
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    await usuario.destroy();
    res.json({ mensaje: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar', detalle: error.message });
  }
};

module.exports = {
  registrar,
  iniciarSesion,
  perfil,
  listarUsuarios,
  actualizarUsuario,
  eliminarUsuario
};
