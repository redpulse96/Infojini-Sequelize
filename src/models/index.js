import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import enVariables from '../config/config.js';

const filename = import.meta.url;
const dirname = import.meta.url.substring(
  import.meta.url.indexOf('///'),
  import.meta.url.lastIndexOf('/')
);
const basename = path.basename(filename);
const env = process.env.NODE_ENV || 'development';
const config = enVariables[env];
class db {}

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(dirname)
  .filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach((file) => {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    import(`${dirname}/${file}`).then((modelName) => {
      const model = modelName.default(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    });
  });

setTimeout(() => {
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
}, 1000);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
