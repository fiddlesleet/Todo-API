module.exports = function (sequelize, DataTypes) {
  return sequelize.define('todo', {
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        // length less than 250 chars
        len: [1,250]
      }
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  });
};
