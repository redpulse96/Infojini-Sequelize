import Joi from 'joi';

export default {
  // POST /api/v1/register
  register: {
    body: Joi.object({
      email: Joi.string().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      password: Joi.string().required(),
      role: Joi.string().required(),
    }),
  },

  // GET /api/v1/users?
  getUsersByFilter: {
    params: Joi.object({
      role: Joi.string().required(),
    }),
  },

  // POST /api/v1/auth/login
  login: {
    body: Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  },
};
