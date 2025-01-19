const { pool } = require("../../config/database");

const homeDao = require("../dao/homeDao");

exports.retrieveQuintetCheck = async function (userId, startDate, endDate) {
  const connection = await pool.getConnection(async (conn) => conn);
  const quintetCheckResult = await homeDao.selectQuintet(connection, userId, startDate, endDate);
  connection.release();
  return quintetCheckResult;
}