import sequelize from 'sequelize';

const { Model } = sequelize;

export default (sequelize, DataTypes) => {
  class Role extends Model {
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
      name: DataTypes.STRING,
      is_active: DataTypes.BOOLEAN,
      created_at: {
        type: DataTypes.TIME,
        defaultValue: DataTypes.NOW,
        allowNull: true,
      },
      updated_at: {
        type: DataTypes.TIME,
        defaultValue: DataTypes.NOW,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Role',
    }
  );
  return Role;
};
