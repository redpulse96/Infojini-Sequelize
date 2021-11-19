import sequelize from 'sequelize';

const { Model } = sequelize;

export default (sequelize, DataTypes) => {
  class Role extends Model {
    toJSON() {
      // hide protected fields
      const attributes = { ...this.get() };
      return attributes;
    }
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Role.belongsTo(models.User, {
        foreignKey: 'role_id',
        as: 'user',
        onDelete: 'CASCADE',
      });
    }
  }
  Role.init(
    {
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        values: ['admin', 'student', 'superAdmin'],
      },
      is_active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Role',
    }
  );
  return Role;
};
