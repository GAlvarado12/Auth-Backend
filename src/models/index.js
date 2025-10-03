const sequelize = require('../config/db.config');
const { DataTypes } = require('sequelize');

// Importar definiciones
const Usuario = require('./usuario.model')(sequelize, DataTypes);
const Rol = require('./rol.model')(sequelize, DataTypes);
const Permiso = require('./permiso.model')(sequelize, DataTypes);

// Tablas pivote (N:M)
const UsuarioRol = sequelize.define('UsuarioRol', {}, { tableName: 'usuario_rol', timestamps: false });
const RolPermiso = sequelize.define('RolPermiso', {}, { tableName: 'rol_permiso', timestamps: false });

// Asociaciones N:M
Usuario.belongsToMany(Rol, { through: UsuarioRol, as: 'roles', foreignKey: 'usuarioId' });
Rol.belongsToMany(Usuario, { through: UsuarioRol, as: 'usuarios', foreignKey: 'rolId' });

Rol.belongsToMany(Permiso, { through: RolPermiso, as: 'permisos', foreignKey: 'rolId' });
Permiso.belongsToMany(Rol, { through: RolPermiso, as: 'roles', foreignKey: 'permisoId' });

module.exports = {
  sequelize,
  Usuario,
  Rol,
  Permiso,
  UsuarioRol,
  RolPermiso
};
