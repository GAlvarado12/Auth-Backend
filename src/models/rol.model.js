module.exports = (sequelize, DataTypes) => {
  
  const Rol = sequelize.define('Rol', {
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    descripcion: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    tableName: 'roles',
    timestamps: true
  });

  return Rol;
};
