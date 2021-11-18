import express from 'express';
import expressValidation from 'express-validation';
import validationSchema from '../middleware/validate.schema.js';
import UserController from '../handlers/user.handler.js';

const router = express.Router(); // eslint-disable-line new-cap

router
  .route('/register')
  .post(expressValidation.validate(validationSchema.register), UserController.register);
router.route('/users').get(UserController.getUsers);
router.route('/users/role/count').get(UserController.getUsers);
router.route('/users?').get(UserController.getUsers);
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
