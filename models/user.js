const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate() {
    }
  }
  user.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
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
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    tableName: 'users',
    timestamps: false,
  });
  return user;
};
