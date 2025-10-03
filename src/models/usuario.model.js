module.exports = (sequelize, DataTypes) => {

  const Usuario = sequelize.define('Usuario', {
    nombre: {
      type: DataTypes.STRING(80),
      allowNull: false,
      validate: { len: [3, 80] }
    },
    correo: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    clave: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'usuarios',
    timestamps: true
  });

  return Usuario;
};
