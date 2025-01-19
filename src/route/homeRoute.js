const {authChecker} = require('../../config/jwtMiddleware');
module.exports = function(app){
    const home = require('../controller/homeController');
    app.get('/home', authChecker, home.getHome);

};