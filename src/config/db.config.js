const { Sequelize } = require('sequelize');

// SQLite local (luego migras a Postgres cambiando el constructor)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './src/database/auth.sqlite',
  logging: false
});

async function initDB() {
  const { Usuario, Rol, Permiso } = require('../models'); // después de definir sequelize
  await sequelize.sync({ alter: true }); // mantener estructura actualizando columnas si cambian

  // ------ SEED BÁSICO (idempotente) ------
  const [adminRole] = await Rol.findOrCreate({
    where: { nombre: 'Administrador' },
    defaults: { descripcion: 'Acceso total al sistema' }
  });
  const [empleadoRole] = await Rol.findOrCreate({
    where: { nombre: 'Empleado' },
    defaults: { descripcion: 'Acceso operativo' }
  });
  const [clienteRole] = await Rol.findOrCreate({
    where: { nombre: 'Cliente' },
    defaults: { descripcion: 'Acceso limitado' }
  });

  // Permisos (define los que realmente usarás)
  const permisosNecesarios = [
    { nombre: 'usuarios.listar', descripcion: 'Listar usuarios' },
    { nombre: 'usuarios.crear', descripcion: 'Crear usuarios' },
    { nombre: 'usuarios.actualizar', descripcion: 'Actualizar usuarios' },
    { nombre: 'usuarios.eliminar', descripcion: 'Eliminar usuarios' }
  ];
  for (const p of permisosNecesarios) {
    await Permiso.findOrCreate({ where: { nombre: p.nombre }, defaults: { descripcion: p.descripcion } });
  }

  // Relación Rol-Permisos: Admin tiene todos
  const permisos = await Permiso.findAll();
  await adminRole.setPermisos(permisos);

  // Empleado solo lectura
  const permListar = await Permiso.findOne({ where: { nombre: 'usuarios.listar' } });
  if (permListar) await empleadoRole.setPermisos([permListar]);

  // Usuario admin por defecto (si no existe)
  const bcrypt = require('bcrypt');
  const [adminUser] = await Usuario.findOrCreate({
    where: { correo: 'admin@sistema.com' },
    defaults: {
      nombre: 'admin',
      correo: 'admin@sistema.com',
      clave: await bcrypt.hash('Admin123*', 10),
      activo: true
    }
  });
  // Admin con rol Administrador
  await adminUser.addRol(adminRole);
  console.log('Base de datos sincronizada y seed aplicado');
}

initDB().catch(err => {
  console.error('Error al inicializar DB:', err);
});

module.exports = sequelize;

