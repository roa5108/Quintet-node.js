const {authChecker} = require('../../config/jwtMiddleware');
module.exports = function (app) {
    const record = require("../controller/recordController");
    //app.get(), app.post() ...
    app.post('/record', authChecker, record.postTodayChecks);

    app.get('/records/date', authChecker, record.getRecordsByDate);

    app.get('/records/element', authChecker, record.getRecordsByElement);
}