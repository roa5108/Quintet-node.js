const express = require('express');
const compression = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');

module.exports = function () {
    const app = express();

    //passportConfig(app);

    app.use(compression());

    app.use(express.json());

    app.use(express.urlencoded({extended: true}));

    app.use(methodOverride());

    app.use(cors());

/*    app.use(cookieParser())

    app.use(session({
        secret: 'quintet secret value',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000
        },
        rolling: true
    }));

    app.use(passport.initialize());
    app.use(passport.session());*/

    app.get('/', (req, res) => {
        console.log("루트 페이지로 접속하셨습니다.");
        res.send('Hi Quintet');
    });

    require('../src/route/staticRoute')(app);
    require('../src/route/recordRoute')(app);
    require('../src/route/authRoute')(app);
    require('../src/route/userRoute')(app);
    require('../src/route/homeRoute')(app);

    return app;
};