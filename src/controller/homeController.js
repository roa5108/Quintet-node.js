//homeController.js
const homeProvider = require("../provider/homeProvider");
const {response, errResponse} = require("../../config/response");
const baseResponse = require("../../config/baseResponseStatus");
const moment = require("moment-timezone");

// 입력한 날짜가 포함된 한 주의 시작 날짜와 끝 날짜를 계산하는 함수
function getWeekRange() {
  const KST = moment().tz('Asia/Seoul');
  const day = KST.day(); // 요일 (0: 일요일, 1: 월요일, ..., 6: 토요일)
  const diff = KST.date() - day + (day === 0 ? -6 : 0);

  const startOfWeek = KST.date(diff); // 해당 주의 첫 날짜
  const endOfWeek = startOfWeek.clone().add('6', 'days');// 해당 주의 마지막 날짜

  return { start: startOfWeek.format('YYYY-MM-DD'), end: endOfWeek.format('YYYY-MM-DD') };
}

exports.getHome = async function getQuintetCheckRecordsAPI(req, res) {
  try {
    const userId = req.user_id;
    const { start, end } = getWeekRange();
    const quintetCheckResult = await homeProvider.retrieveQuintetCheck(userId, start, end);
    const result = {
      user_id : userId,
      startOfWeek : start,
      endOfWeek : end,
      weeklyData : quintetCheckResult
    }

    return res.send(response(baseResponse.SUCCESS, result));
  } catch (error) {
    console.log(error);
    return res.send(errResponse(baseResponse.DB_ERROR));
  }
}


