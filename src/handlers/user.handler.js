import sequelize from 'sequelize';
import model from '../models/index.js';
import APIError from '../apiError.js';
import { hash, hashCompare } from '../utils.js';
import { sendToken } from '../middleware/protect.middleware.js';

const { Op } = sequelize;

export default {
  async register(req, res) {
    const { email, password, firstName, lastName, role } = req.body;
    try {
      const user = await model.User.findOne({ where: { [Op.or]: [{ email }] } });
      if (user) {
        return new APIError('User with that email already exists', 422, true);
      }

      const saveData = {
        email,
        firstName,
        lastName,
        is_active: true,
        password: hash(password),
      };
      if (role) {
        const roleData = await model.Role.findOne({
          where: { name: role },
          attributes: ['role_id'],
        });
        const { role_id } = roleData.toJSON();
        saveData.role_id = role_id;
      }

      const userData = await model.User.create(saveData);
      console.log('Data saved successfully');
      console.dir(userData);
      return res.status(201).json({ success: true, message: 'Account created successfully' });
    } catch (error) {
      console.error(error);
      return res.send(error);
    }
  },

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await model.User.findOne({ where: { email } });
      if (!user) {
        throw new APIError('Invalid Username/Password.', 422, true);
      }

      const userData = user.toJSON();
      if (hashCompare(hash(password), userData.password)) {
        const tokenData = `${userData.user_id}|${userData.email}`;
        return sendToken(tokenData, res);
      } else {
        throw new APIError('Invalid Username/Password.', 400, true);
      }
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  async getUsers(req, res) {
    const { query } = req;
    const filter = { where: {}, include: 'userRoles' };
    try {
      if (query.role || query.date) {
        if (query.role) {
          filter.where.role = query.role;
        }
        if (query.date) {
          filter.where.createdAt = {
            [Op.gt]: new Date(query.date),
          };
        }
      } else {
        filter.where = { is_active: false };
      }
      const filteredUsers = await filterUsersByFilter(filter);
      const userList = getUserFirstAndLastNameAppended(filteredUsers);
      console.log('[GET USERS]');
      console.dir(JSON.stringify(userList));
      const result = {
        success: true,
        data: {
          users: userList,
        },
      };
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return error;
    }
  },
};

async function filterUsersByFilter(filter) {
  try {
    const usersList = await model.User.findAll(filter);
    if (usersList.length) {
      return usersList;
    } else {
      throw new ApiError('No deactivated Users found', 400, true);
    }
  } catch (error) {
    console.error(error);
    let apiError = error;
    if (!(apiError instanceof APIError)) {
      apiError = new APIError(error.message, error.status || error.statusCode || 500, true);
    }
    throw apiError;
  }
}

function getUserFirstAndLastNameAppended(usersList) {
  return usersList.map((user) => {
    const elem = {
      firstName: user.firstName,
      lastName: user.lastName,
      name: `${user.firstName} ${user.lastName}`,
      role: user.userRoles,
      registeredAt: user.createdAt,
    };
    return { ...elem };
  });
}
