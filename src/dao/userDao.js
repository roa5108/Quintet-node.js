async function findUserBySnsId(connection, snsId, provider) {
    const findUserQuery = `SELECT id, nickname, email, provider FROM user WHERE snsId = ? and provider = ?;`;
    const userRow = await connection.query(findUserQuery, [snsId, provider]);
    return userRow[0];
}

async function insertNewUser(connection, newUserParams) {
    const insertNewUserQuery = `insert into user (name, nickname, email, provider, refreshToken, snsId) values (?, ?, ?, ?, ?, ?);`;
    return await connection.query(insertNewUserQuery, newUserParams);
}

async function findUserById(connection, id) {
    const findUserQuery = `SELECT id, nickname, email, provider FROM user WHERE id = ?;`;
    const weeklySumRow = await connection.query(findUserQuery,id);
    return weeklySumRow[0];
}

async function updateUserName(connection, user_id, nickname) {
    const findUserQuery = `UPDATE user SET nickname = ? WHERE id = ?;`;
    const weeklySumRow = await connection.query(findUserQuery,[nickname, user_id]);
    return weeklySumRow[0];
}

async function findUserNicknameById(connection, id) {
    const findUserNicknameQuery = `SELECT nickname FROM user WHERE id = ?;`;
    const weeklySumRow = await connection.query(findUserNicknameQuery,id);
    return weeklySumRow[0];
}

async function deleteUser(connection, user_id) {
    const delUserQuery = `DELETE from user WHERE id = ?;`;

    const delUserResultRow = await connection.query(delUserQuery, user_id);
    return delUserResultRow[0];
}

async function findSnsId(connection, user_id) {
    const delDocumentQuery = `SELECT snsId FROM user WHERE id = ?;`;
    const weeklySumRow = await connection.query(delDocumentQuery, user_id);
    return weeklySumRow[0];
}

async function updateRefreshToken(connection, user_id, refreshToken) {
    const findUserQuery = `UPDATE user SET refreshToken = ? WHERE id = ?;`;
    const weeklySumRow = await connection.query(findUserQuery,[refreshToken, user_id]);
    return weeklySumRow[0];
}

async function insertLocalData(connection, dataParams) {
    const localDataQuery = `insert into document (user_id, date, work_deg, work_doc, health_deg, health_doc, family_deg, family_doc, relationship_deg, relationship_doc, money_deg, money_doc)
                            values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    return await connection.query(localDataQuery, dataParams);
}

module.exports = {
    findUserBySnsId,
    insertNewUser,
    findUserById,
    updateUserName,
    findUserNicknameById,
    deleteUser,
    updateRefreshToken,
    findSnsId,
    insertLocalData
};