const {response, errResponse} = require("../../config/response");
const baseResponse = require("../../config/baseResponseStatus");
const {OAuth2Client} = require('google-auth-library');
const userProvider = require("../provider/userProvider");
const userService = require("../service/userService");
const dotenv = require("dotenv");
const customJWT = require('../../config/jwtModules');
const jwt = require('jsonwebtoken');
const jwksClient = require("jwks-rsa");
const base64url = require("base64url");
const redisClient = require('../../config/redisConfig');

dotenv.config();

// 구글 로그인
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
exports.loginGoogleUser = async function (req, res) {

    try {
        const ticket = await client.verifyIdToken({
            idToken: req.body.idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = await ticket.getPayload();

        await generalSignup(payload['sub'], 'google', payload.name, payload.email)
            .then(tokens => {
                const accessToken = tokens.accessToken;
                const refreshToken = tokens.refreshToken;

                return res.header('Authorization', `Bearer ${accessToken}`).send(response(baseResponse.SUCCESS, refreshToken));
            })
            .catch(errResponse => {
                console.log('loginGoogle error: ', errResponse);
            });

    } catch (e) { //유효성 검증에 실패했을 경우
        console.log(e);
        return res.send(errResponse(baseResponse.INVALID_TOKEN));
    }
};

// 애플 로그인
const verifyDecode = (decode) => {
    //TODO: nonce 관련 추가 필요
    return new Promise ((resolve) => {
        const result =
            decode.iss === "https://appleid.apple.com" &&
            decode.aud === process.env.APPLE_CLIENT_ID &&
            Math.floor(Date.now() / 1000) <= decode.exp

        resolve(result);
    })
}
exports.loginAppleUser = async function (req, res) {
    const { name, email, idToken } = req.body;

    try {
        const client = await jwksClient({
            jwksUri: 'https://appleid.apple.com/auth/keys'
        });

        const encodedHeader = idToken.split('.')[0];
        const decodedHeader = base64url.decode(encodedHeader);
        const tokenHeader = JSON.parse(decodedHeader);

        const tokenKid = tokenHeader.kid;
        const key = await client.getSigningKey(tokenKid);
        const publicKey = key.getPublicKey();

        const decode = jwt.verify(idToken, publicKey);

        verifyDecode(decode)
            .then(_ => {
                return generalSignup(decode.sub, 'apple', name, email);
            })
            .then(tokens => {
                const accessToken = tokens.accessToken;
                const refreshToken = tokens.refreshToken;

                return res.header('Authorization', `Bearer ${accessToken}`).send(response(baseResponse.SUCCESS, refreshToken));
            })
            .catch(errResponse => {
                console.log('loginApple error: ', errResponse);
            });

    } catch (e) {
        console.log('loginAppleUser verify: ' + e);
        return res.send(errResponse(baseResponse.INVALID_IDTOKEN));
    }
}

const verifyKakoPayload = (payload) => {
    return new Promise((resolve) => {
        const result =
            payload.iss === 'https://kauth.kakao.com' &&
            payload.aud === process.env.KAKAO_SERVICE_APP_KEY &&
            Math.floor(Date.now() / 1000) <= payload.exp

        resolve(result);
    });
}

const generalSignup = async (platformId, provider, nickname, email) => {
    try {
        let exUser = await userProvider.getUserBySnsId(platformId, provider);
        if (exUser) {
            console.log(exUser); //해당 유저 존재 시 콘솔 출력
        } else {
            console.log("해당 유저 없음");
            await userService.insertNewUser(nickname, nickname, email, provider, null, platformId);
        }

        exUser = await userProvider.getUserBySnsId(platformId, provider);
        const accessToken = await customJWT.accessSign(exUser);
        const refreshToken = await customJWT.refreshSign();
        await redisClient.set(`${exUser.id}`, `${refreshToken}`, {EX: 365 * 24 * 60 * 60}); //1년 만료

        return {"accessToken": accessToken, "refreshToken": refreshToken}
    } catch (e) {
        console.log('generalSignup error: ' + e);
    }

}

exports.loginKakaoUser = async function (req, res) {
    const idToken = req.body.idToken;

    const encodedPayload = idToken.split('.')[1];
    const decodedPayload = base64url.decode(encodedPayload);
    const tokenPayload = JSON.parse(decodedPayload);
    verifyKakoPayload(tokenPayload)
        .then(_ => {
            const client = jwksClient({
                jwksUri: 'https://kauth.kakao.com/.well-known/jwks.json'
            });

            const encodedHeader = idToken.split('.')[0];
            const decodedHeader = base64url.decode(encodedHeader);
            const tokenHeader = JSON.parse(decodedHeader);

            const tokenKid = tokenHeader.kid;

            return client.getSigningKey(tokenKid)
                .then(key => {
                    return key.getPublicKey();
                })
                .then(pubKey => {
                    return jwt.verify(idToken, pubKey)
                });
        })
        .then(token => {
            return generalSignup(token.sub, 'kakao', token.nickname, token.email);
        })
        .then(tokens => {
            const accessToken = tokens.accessToken;
            const refreshToken = tokens.refreshToken;

            return res.header('Authorization', `Bearer ${accessToken}`).send(response(baseResponse.SUCCESS, refreshToken));
        })
        .catch(errResponse => {
            console.log('loginKakao error: ', errResponse);
        });
}

// 테스트 로그인
exports.loginTestUser = async function (req, res) {
    const {testSnsId, name, email} = req.body;
    try {
        let exUser = await userProvider.getUserBySnsId(testSnsId, 'test');
        if(exUser){
            console.log(exUser); //해당 유저 존재 시 콘솔 출력
        } else {
            console.log("해당 유저 없음");
            await userService.insertNewUser(name, name, email, 'test', null, testSnsId);
        }

        exUser = await userProvider.getUserBySnsId(testSnsId, 'test');
        const accessToken = await customJWT.accessSign(exUser);
        const refreshToken = await customJWT.refreshSign();
        await redisClient.set(`${exUser.id}`, `${refreshToken}`, { EX: 365 * 24 * 60 * 60 }); //1년 만료
        const expire = await redisClient.ttl(`${exUser.id}`);
        console.log(expire);
        const testval = await redisClient.get(`${exUser.id}`);
        console.log(testval);

        return res.header('Authorization', `Bearer ${accessToken}`).send(response(baseResponse.SUCCESS, refreshToken));
    } catch (e) {
        console.log(e);
        return res.send(errResponse(baseResponse.INVALID_TOKEN));
    }
}