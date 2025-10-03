module.exports = (sequelize, DataTypes) => {
 
  const Permiso = sequelize.define('Permiso', {
    nombre: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true
    },
    descripcion: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    tableName: 'permisos',
    timestamps: true
  });

  return Permiso;
};
