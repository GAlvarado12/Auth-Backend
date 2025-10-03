const { Usuario, Rol, Permiso } = require('../models');

const requerirRol = (rolesRequeridos = []) => {
  return async (req, res, next) => {
    try {
      const usuario = await Usuario.findByPk(req.usuario.id, {
        include: { model: Rol, as: 'roles', include: { model: Permiso, as: 'permisos' } }
      });
      if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

      const nombresRol = usuario.roles.map(r => r.nombre);
      const autorizado = rolesRequeridos.some(r => nombresRol.includes(r));
      if (!autorizado) return res.status(403).json({ mensaje: 'No tienes permisos de rol requeridos' });

      next();
    } catch (e) {
      res.status(500).json({ mensaje: 'Error validando rol', detalle: e.message });
    }
  };
};

const requerirPermiso = (permisoNecesario) => {
  return async (req, res, next) => {
    try {
      const usuario = await Usuario.findByPk(req.usuario.id, {
        include: { model: Rol, as: 'roles', include: { model: Permiso, as: 'permisos' } }
      });
      if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

      const permisosDelUsuario = new Set(
        usuario.roles.flatMap(r => r.permisos.map(p => p.nombre))
      );
      if (!permisosDelUsuario.has(permisoNecesario)) {
        return res.status(403).json({ mensaje: 'No cuentas con el permiso requerido' });
      }

      next();
    } catch (e) {
      res.status(500).json({ mensaje: 'Error validando permiso', detalle: e.message });
    }
  };
};

module.exports = { requerirRol, requerirPermiso };
