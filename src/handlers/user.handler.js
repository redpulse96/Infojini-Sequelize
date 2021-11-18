import sequelize from 'sequelize';
import model from '../models/index.js';
import APIError from '../apiError.js';
import { hash, hashCompare } from '../utils.js';

const { Op } = sequelize;
const { User } = model;

export default {
  async register(req, res) {
    const { email, password, firstname, lastname } = req.body;
    try {
      const user = await User.findOne({ where: { [Op.or]: [{ email }] } });
      if (user) {
        throw new APIError('User with that email already exists', 422, true);
      }

      await User.create({
        email,
        firstname,
        lastname,
        password: hash(password),
      });
      return res.status(201).send({ message: 'Account created successfully' });
    } catch (error) {
      console.error(error);
      return res.send(error);
    }
  },

  async login(req, res) {
    const { firstname, lastname, email, password } = req.body;
    try {
      const user = await User.findOne({ where: { [Op.or]: [{ email }] } });
      if (user) {
        throw new APIError('User with that email already exists', 422, true);
      }

      await User.create({
        email,
        firstname,
        lastname,
        password: hash(password),
      });
      return res.status(201).send({ message: 'Account created successfully' });
    } catch (error) {
      console.error(error);
      return res.send(error);
    }
  },
  async getUsers(req, res) {},

  async getUsersByFilter(req, res) {},
};
async function filterDeactivatedUsers(req, res) {
  const { email, password, name, phone } = req.body;
  try {
    const user = await User.findOne({ where: { [Op.or]: [{ phone }, { email }] } });
    if (user) {
      return res.status(422).send({ message: 'User with that email or phone already exists' });
    }

    await User.create({
      name,
      email,
      password,
      phone,
    });
    return res.status(201).send({ message: 'Account created successfully' });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send({ message: 'Could not perform operation at this time, kindly try again later.' });
  }
}
async function getUserFirstAndLastNameAppended(req, res) {
  const { email, password, name, phone } = req.body;
  try {
    const user = await User.findOne({ where: { [Op.or]: [{ phone }, { email }] } });
    if (user) {
      return res.status(422).send({ message: 'User with that email or phone already exists' });
    }

    await User.create({
      name,
      email,
      password,
      phone,
    });
    return res.status(201).send({ message: 'Account created successfully' });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send({ message: 'Could not perform operation at this time, kindly try again later.' });
  }
}
async function getCountOfUsersAfterGivenDate(req, res) {
  const { email, password, name, phone } = req.body;
  try {
    const user = await User.findOne({ where: { [Op.or]: [{ phone }, { email }] } });
    if (user) {
      return res.status(422).send({ message: 'User with that email or phone already exists' });
    }

    await User.create({
      name,
      email,
      password,
      phone,
    });
    return res.status(201).send({ message: 'Account created successfully' });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send({ message: 'Could not perform operation at this time, kindly try again later.' });
  }
}
async function sortUsersByDate(req, res) {
  const { email, password, name, phone } = req.body;
  try {
    const user = await User.findOne({ where: { [Op.or]: [{ phone }, { email }] } });
    if (user) {
      return res.status(422).send({ message: 'User with that email or phone already exists' });
    }

    await User.create({
      name,
      email,
      password,
      phone,
    });
    return res.status(201).send({ message: 'Account created successfully' });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send({ message: 'Could not perform operation at this time, kindly try again later.' });
  }
}
