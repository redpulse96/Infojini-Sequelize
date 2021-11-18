import Joi from 'joi';

export default {
  // POST /api/v1/register
  register: {
    body: {
      email: Joi.string().required(),
      password: Joi.string().required(),
    },
  },

  // GET /api/v1/users?
  getUsersByFilter: {
    params: {
      role: Joi.string().required(),
    },
  },

  // POST /api/v1/auth/login
  login: {
    body: {
      email: Joi.string().required(),
      password: Joi.string().required(),
    },
  },
};
