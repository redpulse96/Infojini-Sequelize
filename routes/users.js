import express from 'express';
import usersHandler from '../src/handlers/users.js';

const router = express.Router();

router.get('/', usersHandler.list);
router.post('/', usersHandler.create);
router.get('/:userId', usersHandler.get);
router.put('/:userId', usersHandler.update);
router.delete('/:userId', usersHandler.remove);
router.param('userId', usersHandler.load);

export default router;
