const deleteUser = require('./delete');

module.exports = async (app) => {
  await deleteUser(app);
};
