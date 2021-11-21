import model from '../models/index.js';
import APIError from '../apiError.js';

const { Op } = sequelize;

export default {
  async getRoleCount(req, res) {
    const filter = { order: [['createdAt', 'ASC']], attributes: ['role_id', 'name'] };
    try {
      const fetchRoleIds = await model.Role.findAll(filter);
      if (fetchRoleIds.length) {
        console.dir(fetchRoleIds);
        const roleIds = fetchRoleIds.map((val) => val.role_id);
        const groupedRoles = await model.User.findAndCountAll({
          where: { role_id: { [Op.isIn]: roleIds } },
          group: 'role_id',
        });
        console.dir(groupedRoles);
        const { count, rows } = groupedRoles;
        const data = {};
        fetchRoleIds.map((val, index) => {
          data[val.name] = count[index].count;
        });
        const result = {
          success: true,
          data,
        };
        return res.status(200).json(result);
      } else {
        throw new APIError('No Roles available', 400, true);
      }
    } catch (error) {
      console.error(error);
      let apiError = error;
      if (!(apiError instanceof APIError)) {
        apiError = new APIError(error.message, error.status || error.statusCode || 500, true);
      }
      return apiError;
    }
  },
};
