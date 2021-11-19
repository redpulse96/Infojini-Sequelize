import express from 'express';
import expressValidation from 'express-validation';
import validationSchema from '../middleware/validate.schema.js';
import UserController from '../handlers/user.handler.js';
import RoleController from '../handlers/role.handler.js';
import { protect } from '../middleware/protect.middleware.js';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/users/role/count').get(protect, RoleController.getRoleCount);
router.route('/users').get(protect, UserController.getUsers);
router
  .route('/users?')
  .get(
    protect,
    expressValidation.validate(validationSchema.getUsersByFilter),
    UserController.getUsers
  );
router
  .route('/register')
  .post(expressValidation.validate(validationSchema.register), UserController.register);
router
  .route('/login')
  .post(expressValidation.validate(validationSchema.login), UserController.login);

// Create a catch-all route for testing the installation.
router.all('/', (req, res) =>
  res.status(200).send({
    message: 'Hello World!',
  })
);

export default router;
