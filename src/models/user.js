import sequelize from 'sequelize';

const { Model } = sequelize;
const PROTECTED_ATTRIBUTES = ['password'];

export default (sequelize, DataTypes) => {
  class User extends Model {
    toJSON() {
      // hide protected fields
      const attributes = { ...this.get() };
      // eslint-disable-next-line no-restricted-syntax
      for (const a of PROTECTED_ATTRIBUTES) {
        delete attributes[a];
      }
      return attributes;
    }
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Role, {
        foreignKey: 'role_id',
        as: 'userRoles',
        onDelete: 'CASCADE',
      });
    }
  }
  User.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      role_id: DataTypes.INTEGER,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: {
          args: false,
          msg: 'Please enter your email address',
        },
        unique: {
          args: true,
          msg: 'Email already exists',
        },
        validate: {
          isEmail: {
            args: true,
            msg: 'Please enter a valid email address',
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        set(value) {
          // Storing passwords in plaintext in the database is terrible.
          // Hashing the value with an appropriate cryptographic hash function is better.
          this.setDataValue('password', hash(value));
        },
      },
      is_active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'User',
      timestamps: true,
    }
  );
  return User;
};
