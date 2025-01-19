const baseResponse = require("../../config/baseResponseStatus");
const {response, errResponse} = require("../../config/response");
const userService = require("../../src/service/userService");
const userProvider = require("../../src/provider/userProvider");
const dotenv = require('dotenv');
const customJWT = require("../../config/jwtModules");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const redisClient = require('../../config/redisConfig');

dotenv.config();
function removeDuplicate(arr) {
    const dateMap = new Map();

    for(let i = 0; i < arr.length; i++){
        const item = arr[i];
        const { date } = item;

        if(!dateMap.has(date)) { //map에 없는 날짜일때만
            dateMap.set(date, i); //map에 date:i 저장 -> 겹치는 date를 가지는 뒷 데이터는 map에 못들어옴
        }
    }

    const idx = Array.from(dateMap.values()); //map에 저장된 i로 배열 생성
    const result = [];
    for (let i = 0; i < arr.length; i++){
        if(idx.includes(i)) { //배열에 i가 있으면
            result.push(arr[i]); //result에 arr 값을 추가한다.
        }
    }

    return result;
}

exports.refresh = async function (req, res) {
    const refreshToken = req.body.refreshToken;

    let decodeToken = null;
    if (!req.headers.authorization) {
        return res.send(errResponse(baseResponse.AUTHORIZATION_NOT_FOUND));
    } else {
        const token = req.headers.authorization.split('Bearer ')[1];
        if (!token) {
            res.send(errResponse(baseResponse.TOKEN_NOT_EXIST));
        }
        decodeToken = await jwt.decode(token, process.env.JWT_SECRET);
    }

    if (decodeToken !== null) {
        const decode = await customJWT.refreshVerify(refreshToken, decodeToken.id);
        if (decode.valid) {
            const userInfo = await userProvider.getUserById(decodeToken.id);
            const accessToken = await customJWT.accessSign(userInfo); //atk 발급
            const newRefreshToken = await customJWT.refreshSign(); //rtk 발급
            await redisClient.set(`${userInfo.id}`, `${newRefreshToken}`, { EX: 365 * 24 * 60 * 60 }); //rtk 갱신

            return res.header('Authorization', `Bearer ${accessToken}`).send(response(baseResponse.SUCCESS, newRefreshToken));
        } else {
            return res.send(errResponse(baseResponse.INVALID_TOKEN));
        }
    }
}

exports.getProfile = async function (req, res) {
    const userProfile = await userProvider.getUserById(req.user_id);

    return res.send(response(baseResponse.SUCCESS, userProfile));
}

exports.patchNickName = async function (req, res) {
    const nickname = req.body.newNickname;

    if(nickname.length > 10) {
        return res.send(errResponse(baseResponse.USERNAME_LENGTH));
    } else {
        await userService.updateUserName(req.user_id, nickname);
        const changeNickname = await userProvider.getUserNicknameById(req.user_id);

        return res.send(response(baseResponse.SUCCESS, changeNickname));
    }
};

exports.logOut = async function (req, res) {
    try {
        await redisClient.del(`${req.user_id}`); //rtk 없애기

        return res.send(response(baseResponse.SUCCESS));
    } catch (err) {
        console.log('App - Log Out Err: ' + err);
        return res.send(errResponse(baseResponse.LOG_OUT_ERROR));
    }
}

const withdrawApple = async (code) => {
    // 1. client_secret 만들기
    const header = {
        alg: 'ES256',
        kid: process.env.APPLE_PRIVATE_KEY
    }

    const payload = {
        iss: process.env.APPLE_TEAM_ID,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 30*24*60*60,
        aud: "https://appleid.apple.com",
        sub: process.env.APPLE_CLIENT_ID
    }

    const clientSecret = jwt.sign(payload, process.env.JWT_SECRET, {algorithm: "ES256", header: header});

    // 2. apple로부터 access_token 얻기
    const requestData = {
        client_id: process.env.APPLE_CLIENT_ID,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code'
    }

    const apple_atk = await axios.post("https://appleid.apple.com/auth/token", JSON.stringify(requestData), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    })
        .then(response => {
            return response.data.access_token;
        })
        .catch(errResponse => {
            console.log("error from getAppleAccessToken: ", errResponse.error);
        });

    // 3. 토큰 없애기
    const requestData2 = {
        client_id: process.env.APPLE_CLIENT_ID,
        client_secret: clientSecret,
        token: apple_atk,
        token_type_hint: 'access_token'
    }

    await axios.post("https://appleid.apple.com/auth/revoke", JSON.stringify(requestData2), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    })
        .catch(errResponse => {
            console.log("error from revokeAppleToken: ", errResponse.error);
        })
}

exports.deleteUser = async function (req, res) {
    const provider = req.body.provider;
    const code = req.body.code;

    try {
        if (provider === 'apple') {
            await withdrawApple(code);
        }

        await redisClient.del(`${req.user_id}`); //rtk 없애기
        const deleteUserResult = await userService.deleteUserData(req.user_id); //유저 관련 db 정보 없애기

        return res.send(deleteUserResult);
    } catch (err) {
        console.log('App - Withdraw Err: ' + err);
        return res.send(errResponse(baseResponse.LOG_OUT_ERROR));
    }
};

exports.postData = async (req, res) => {
    const user_id = req.user_id;
    const userLocalData = removeDuplicate(req.body.data);

    const localDataSave = await userService.postLocalData(user_id, userLocalData);

    return res.send(localDataSave);
};