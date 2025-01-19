const { pool } = require("../../config/database");

const staticDao = require("../dao/staticDao");

// Provider: Read 비즈니스 로직 처리
exports.weeklySum = async function (user_id, startDate, endDate) {
    const connection = await pool.getConnection(async (conn) => conn);
    const weeklySumResult = await staticDao.weeklySum(connection, user_id, startDate, endDate);
    connection.release();

    /*const maxVals = findAllMaxKeys(weeklySumResult[0]);
    const maxValList = maxVals.map((key) => keyText[key]);*/

    const result = degToPer(weeklySumResult[0]);
    return {
        user_id: user_id,
        start_date: startDate,
        end_date: endDate,
        work_per: result.work_per,
        health_per: result.health_per,
        family_per: result.family_per,
        relationship_per: result.relationship_per,
        money_per: result.money_per,
    };
}

exports.monthlySum = async function (user_id, year, month) {
    const connection = await pool.getConnection(async (conn) => conn);
    const monthlySumResult = await staticDao.monthlySum(connection, user_id, year, month);
    connection.release();

    /*const maxVals = findAllMaxKeys(monthlySumResult[0]);
    const maxValList = maxVals.map((key) => keyText[key]);*/

    const result = degToPer(monthlySumResult[0]);
    return {
        user_id: user_id,
        year: year,
        month: month,
        work_per: result.work_per,
        health_per: result.health_per,
        family_per: result.family_per,
        relationship_per: result.relationship_per,
        money_per: result.money_per,
    };
}

exports.annualSum = async function (user_id, year) {
    const connection = await pool.getConnection(async (conn) => conn);
    const annualSumResult = await staticDao.annualSum(connection, user_id, year);
    connection.release();

    /*const maxVals = findAllMaxKeys(annualSumResult[0]);
    const maxValList = maxVals.map((key) => keyText[key]);*/

    const result = degToPer(annualSumResult[0]);
    return {
        user_id: user_id,
        year: year,
        work_per: result.work_per,
        health_per: result.health_per,
        family_per: result.family_per,
        relationship_per: result.relationship_per,
        money_per: result.money_per,
    };
}

const keyText = {
    work_deg: '일',
    health_deg: '건강',
    family_deg: '가족',
    relationship_deg: '관계',
    money_deg: '자산'
};
const findAllMaxKeys = (obj) => {
    let maxKeys = [];
    let maxValue = Number.MIN_SAFE_INTEGER;

    for (const key in obj) {
        const value = Number(obj[key]);
        if (!isNaN(value)) {
            if (value > maxValue) {
                maxValue = value;
                maxKeys = [key]; // 새로운 최댓값을 찾았을 때 배열 초기화
            } else if (value === maxValue) {
                maxKeys.push(key); // 기존 최댓값과 같은 값이라면 배열에 추가
            }
        }
    }

    return maxKeys;
};
const degToPer = (obj) => {
    const work_deg = Number(obj.work_deg);
    const health_deg = Number(obj.health_deg);
    const family_deg = Number(obj.family_deg);
    const relationship_deg = Number(obj.relationship_deg);
    const money_deg = Number(obj.money_deg);
    const total_deg = work_deg + health_deg + family_deg + relationship_deg + money_deg;

    const work_per = calculatePercent(work_deg, total_deg);
    const health_per = calculatePercent(health_deg, total_deg);
    const family_per = calculatePercent(family_deg, total_deg);
    const relationship_per = calculatePercent(relationship_deg, total_deg);
    const money_per = calculatePercent(money_deg, total_deg);

    return { work_per: work_per,
        health_per: health_per,
        family_per: family_per,
        relationship_per: relationship_per,
        money_per: money_per};
};

const calculatePercent = (element_deg, total_deg) => {
    return (element_deg / total_deg * 100).toFixed(1);
};