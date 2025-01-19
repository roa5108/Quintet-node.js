async function todayChecks(connection, todayCheckParams) {
    const todayChecksQuery = `insert into document (user_id, date, work_deg, health_deg, family_deg, relationship_deg, money_deg, work_doc, health_doc, family_doc, relationship_doc, money_doc)
                              values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    return await connection.query(todayChecksQuery, todayCheckParams);
}

/*async function todayRecords(connection, todayRecordParams) {
    const todayRecordsQuery = `update document set work_doc = ?, health_doc = ?, family_doc = ?, relationship_doc = ?, money_doc = ?
                                where user_id = ? and date = ?;`;
    return await connection.query(todayRecordsQuery, todayRecordParams);
}*/

async function selectRecordsByDate(connection, user_id, year, month) {
    const selectRecordsQuery = `select * from document 
                                        where user_id = ? and year(date) = ? and month(date) = ?
                                        order by date;`;
    const selectRecordsResult = await connection.query(selectRecordsQuery, [user_id, year, month]);
    console.log(selectRecordsResult[0]);

    let selectRecordResultArr = [];
    selectRecordsResult[0].map(row => {
        const formattedData = {
            "id": row.id,
            "date": new Date(row.date.getFullYear(), row.date.getMonth(), row.date.getDate(), row.date.getHours()+9),
            "work_deg": row.work_deg,
            "work_doc": row.work_doc,
            "health_deg": row.health_deg,
            "health_doc": row.health_doc,
            "family_deg": row.family_deg,
            "family_doc": row.family_doc,
            "relationship_deg": row.relationship_deg,
            "relationship_doc": row.relationship_doc,
            "money_deg": row.money_deg,
            "money_doc": row.money_doc,
        };
        selectRecordResultArr.push(formattedData);
    });
    return selectRecordResultArr;
}

async function selectRecordsByElement(connection, user_id, year, month, element) {
    let selectRecordsQuery = ``
    if (element === "일"){
        selectRecordsQuery = `select id, date, work_deg, work_doc
                                from document
                                where user_id = ? and year(date) = ? and month(date) = ?
                                order by date;`;
    } else if (element === "건강") {
        selectRecordsQuery = `select id, date, health_deg, health_doc
                                from document
                                where user_id = ? and year(date) = ? and month(date) = ?
                                order by date;`;
    } else if (element === "가족") {
        selectRecordsQuery = `select id, date, family_deg, family_doc
                                from document
                                where user_id = ? and year(date) = ? and month(date) = ?
                                order by date;`;
    } else if (element === "관계") {
        selectRecordsQuery = `select id, date, relationship_deg, relationship_doc
                                from document
                                where user_id = ? and year(date) = ? and month(date) = ?
                                order by date;`;
    } else if (element === "자산") {
        selectRecordsQuery = `select id, date, money_deg, money_doc
                                from document
                                where user_id = ? and year(date) = ? and month(date) = ?
                                order by date;`;
    }

    const selectRecordsResult = await connection.query(selectRecordsQuery, [user_id, year, month]);

    let selectRecordResultArr = [];
    let formattedData = {};
    selectRecordsResult[0].map(row => {
        if (element === "일"){
            formattedData = {
                "id": row.id,
                "date": new Date(row.date.getFullYear(), row.date.getMonth(), row.date.getDate(), row.date.getHours()+9),
                "work_deg": row.work_deg,
                "work_doc": row.work_doc,
            };
        } else if (element === "건강") {
            formattedData = {
                "id": row.id,
                "date": new Date(row.date.getFullYear(), row.date.getMonth(), row.date.getDate(), row.date.getHours()+9),
                "health_deg": row.health_deg,
                "health_doc": row.health_doc,
            };
        } else if (element === "가족") {
            formattedData = {
                "id": row.id,
                "date": new Date(row.date.getFullYear(), row.date.getMonth(), row.date.getDate(), row.date.getHours()+9),
                "family_deg": row.family_deg,
                "family_doc": row.family_doc,
            };
        } else if (element === "관계") {
            formattedData = {
                "id": row.id,
                "date": new Date(row.date.getFullYear(), row.date.getMonth(), row.date.getDate(), row.date.getHours()+9),
                "relationship_deg": row.relationship_deg,
                "relationship_doc": row.relationship_doc,
            };
        } else if (element === "자산") {
            formattedData = {
                "id": row.id,
                "date": new Date(row.date.getFullYear(), row.date.getMonth(), row.date.getDate(), row.date.getHours()+9),
                "money_deg": row.money_deg,
                "money_doc": row.money_doc,
            };
        }

        selectRecordResultArr.push(formattedData);
    });

    return selectRecordResultArr;
}

async function selectDuplicateData(connection, user_id, date) {
    const selectRecordsQuery = `select count(*) as count, id from document where user_id = ? and date = ?;`;
    const selectRecordsResult = await connection.query(selectRecordsQuery, [user_id, date]);
    return selectRecordsResult[0];
}

async function deletePrevious(connection, id) {
    const deletePreviousRecord = `delete from document where id = ?;`;
    const deletePreviousRecordResult = await connection.query(deletePreviousRecord, id);
    return deletePreviousRecordResult[0];
}

module.exports = {
    todayChecks,
    selectRecordsByDate,
    selectRecordsByElement,
    selectDuplicateData,
    deletePrevious
};