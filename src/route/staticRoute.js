const {authChecker} = require("../../config/jwtMiddleware");
module.exports = function (app) {
    const statics = require('../controller/staticController');

    //app.get(), app.post() ...
    app.get('/static/week', authChecker, statics.getWeeklyStatic);
    app.get('/static/month', authChecker, statics.getMonthlyStatic);
    app.get('/static/year', authChecker, statics.getAnnualStatic)
}