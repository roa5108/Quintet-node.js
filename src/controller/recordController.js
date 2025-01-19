const baseResponse = require("../../config/baseResponseStatus");
const {response, errResponse} = require("../../config/response");
const recordService = require("../service/recordService");
const recordProvider = require("../provider/recordProvider");
const moment = require('moment-timezone');

exports.postTodayChecks = async function (req, res) {
    //const user_id = req.user.user_id;
    const { work_deg, health_deg, family_deg, relationship_deg, money_deg, work_doc, health_doc, family_doc, relationship_doc, money_doc } = req.body;

    const KST = moment().tz('Asia/Seoul');
    const todayDate = KST.format('YYYY-MM-DD');

    const checkDuplicate = await recordProvider.checkDuplicateData(req.user_id, todayDate);
    const previousCount = await checkDuplicate[0].count;

    if(previousCount === 1 || previousCount === 0){ //데이터가 0 또는 1개일때
        if (previousCount === 1) {
            await recordService.deletePreviousData(checkDuplicate[0].id); //이미 같은 날짜에 데이터가 있으면 삭제
        }

        const params = [ req.user_id, todayDate, work_deg, health_deg, family_deg, relationship_deg, money_deg, work_doc, health_doc, family_doc, relationship_doc, money_doc ];
        const postTodayChecksResult = await recordService.todayChecks(params);

        return res.send(postTodayChecksResult);
    } else { //데이터가 2개 이상이면 에러 발생(정상적이지 않은 상황 -> 서버 확인 필요)
        console.log('App - previousData > 1');
        return res.send(errResponse(baseResponse.DB_ERROR));
    }
};

exports.getRecordsByDate = async function (req, res) {
    //const user_id = req.user.user_id;
    const { year, month } = req.query;

    const recordsListByDate = await recordProvider.getRecordsByDate(req.user_id, year, month);

    return res.send(response(baseResponse.SUCCESS, recordsListByDate));
};

exports.getRecordsByElement = async function (req, res) {
    //const user_id = req.user.user_id;
    const { year, month, element } = req.query;

    const recordsListByElement = await recordProvider.getRecordsByElement(req.user_id, year, month, element);

    return res.send(response(baseResponse.SUCCESS, recordsListByElement));
};