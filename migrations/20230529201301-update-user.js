module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'role');
    await queryInterface.addColumn('users', 'deleted', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'deleted');
    await queryInterface.addColumn('users', 'role', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
