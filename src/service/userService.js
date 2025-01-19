const {pool} = require("../../config/database");
const userDao = require("../dao/userDao");
const baseResponse = require("../../config/baseResponseStatus");
const {response, errResponse} = require("../../config/response");
const dotenv = require('dotenv');

dotenv.config()

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.insertNewUser = async function (name, nickname, email, provider, refreshToken, snsId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        const newUserParams = [name, nickname, email, provider, refreshToken, snsId]
        const insertNewUserResult = await userDao.insertNewUser(connection, newUserParams);
        console.log(insertNewUserResult);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        console.log(`App - insertNewUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.updateUserName = async function (user_id, nickname) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        const updateUserNameResult = await userDao.updateUserName(connection, user_id, nickname);
        console.log(updateUserNameResult);
        connection.release();
        const result = { user_id : user_id, newUserName : nickname }

        return response(baseResponse.SUCCESS, result);
    } catch (err) {
        console.log(`App - updateUserName Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.deleteUserData = async function (user_id) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        const deleteUserDataResult = await userDao.deleteUser(connection, user_id);
        console.log(deleteUserDataResult);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        console.log(`App - deleteUserData Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.updateRefreshToken = async function (user_id, refreshToken) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        const updateRefreshResult = await userDao.updateRefreshToken(connection, user_id, refreshToken);
        console.log(updateRefreshResult);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        console.log(`App - updateRefreshToken Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.postLocalData = async function (user_id, userLocalData) {
    try{
        const connection = await pool.getConnection(async (conn) => conn);

        for(const item of userLocalData) {
            const dataParams = [ user_id, item.date, item.work_deg, item.work_doc, item.health_deg, item.health_doc, item.family_deg,
                item.family_doc, item.relationship_deg, item.relationship_doc, item.money_deg, item.money_doc ]

            const localDataTransmission = await userDao.insertLocalData(connection, dataParams);
            console.log(localDataTransmission[0]);
        }
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch(err) {
        console.log(`App - data transmission Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};