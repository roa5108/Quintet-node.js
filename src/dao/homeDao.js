//homeDao.js
//해당 주 퀸텟 기록을 배열로 반환
async function selectQuintet(connection, userId, startDate, endDate) {
    const selectQuintetQuery = `
                SELECT date, work_deg, health_deg, family_deg, relationship_deg, money_deg
                FROM document
                WHERE user_id = ? and date between ? and ?
                ORDER BY date;`;
    const result = await connection.query(selectQuintetQuery, [userId, startDate, endDate]);

    let arr = [];
    result[0].map(row => {
        const formattedData = {
            date: new Date(row.date.getFullYear(), row.date.getMonth(), row.date.getDate(), row.date.getHours()+9),
            work_deg: row.work_deg,
            health_deg: row.health_deg,
            family_deg: row.family_deg,
            relationship_deg: row.relationship_deg,
            money_deg: row.money_deg
        };

        arr.push(formattedData);
    });
    console.log(arr);
    return arr;
}

module.exports = {
    selectQuintet
};