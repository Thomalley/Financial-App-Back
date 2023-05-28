const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate({
      developer, role, company, blog,
    }) {
      user.hasOne(developer);
      user.belongsTo(role, { foreignKey: 'roleId' });
      user.belongsTo(company, { foreignKey: 'company_id' });
      user.hasMany(blog, { foreignKey: 'userId' });
    }
  }
  user.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userTokenVerification: {
      type: DataTypes.STRING,
      field: 'user_token_verification',
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      field: 'reset_password_token',
    },
    roleId: {
      type: DataTypes.INTEGER,
      field: 'role_id',
    },
    companyId: {
      type: DataTypes.INTEGER,
      field: 'company_id',
    },
    active: {
      type: DataTypes.BOOLEAN,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('now'),
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('now'),
      field: 'updated_at',
    },
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};
