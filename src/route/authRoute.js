const dotenv = require('dotenv');
const auth = require('../controller/authController');

dotenv.config();

module.exports = function (app) {
    //app.get(), app.post() ...
    app.post('/auth/google', auth.loginGoogleUser);

    app.post('/auth/apple', auth.loginAppleUser);

    app.post('/auth/kakao', auth.loginKakaoUser);

    app.post('/auth/test', auth.loginTestUser);
}