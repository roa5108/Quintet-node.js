const {authChecker} = require("../../config/jwtMiddleware");
const user = require("../controller/userController");

module.exports = function (app) {
    //app.get(), app.post() ...
    app.post('/auth/refresh', user.refresh);

    app.get('/user', authChecker, user.getProfile);

    app.patch('/user', authChecker, user.patchNickName);

    app.get('/user/logout', authChecker, user.logOut);

    app.post('/user/delete', authChecker, user.deleteUser);

    app.post('/user/data', authChecker, user.postData); //비회원->회원 전환 라우트
}