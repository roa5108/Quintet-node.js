const {pool} = require("../../config/database");
const recordDao = require("../dao/recordDao");
const baseResponse = require("../../config/baseResponseStatus");
const {response, errResponse} = require("../../config/response");
const dotenv = require('dotenv');

dotenv.config()

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.todayChecks = async function (params) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        const todayChecksResult = await recordDao.todayChecks(connection, params);
        console.log(todayChecksResult);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        console.log(`App - todayCheck Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.deletePreviousData = async function (id) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const deletePreviousData = await recordDao.deletePrevious(connection, id);
        console.log(deletePreviousData);
        connection.release();

        return response(baseResponse.DB_ERROR);
    } catch (err) {
        console.log(`App - deletePrevious Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
