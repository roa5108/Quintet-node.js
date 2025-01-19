const staticProvider = require("../provider/staticProvider");
const baseResponse = require("../../config/baseResponseStatus");
const {response, errResponse} = require("../../config/response");

exports.getWeeklyStatic = async function (req, res) {
    //const user_id = req.user.user_id;
    const { startDate, endDate } = req.query;

    const weeklyStaticResult = await staticProvider.weeklySum(req.user_id, startDate, endDate);

    return res.send(response(baseResponse.SUCCESS, weeklyStaticResult));
};

exports.getMonthlyStatic = async function (req, res) {
    //const user_id = req.user.user_id;
    const { year, month } = req.query;

    const monthlyStaticResult = await staticProvider.monthlySum(req.user_id, year, month);

    return res.send(response(baseResponse.SUCCESS, monthlyStaticResult));
};

exports.getAnnualStatic = async function (req, res) {
    const year = req.query.year;
    //const user_id = req.user.user_id;

    const annualStaticResult = await staticProvider.annualSum(req.user_id, year);
    return res.send(response(baseResponse.SUCCESS, annualStaticResult));
};