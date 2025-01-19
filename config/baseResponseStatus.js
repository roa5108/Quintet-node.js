module.exports = {

    // Success
    SUCCESS : { "isSuccess": true, "code": 200, "message":"성공" },

    //Request error
    USER_NOT_LOGGED_IN : { "isSuccess": false, "code": 403, "message": "로그인 필요"},
    USER_IS_LOGGED_IN : { "isSuccess": false, "code": 403, "message": "로그인 상태입니다."},
    USER_UNAUTHORIZED : { "isSuccess": false, "code": 401, "message": "인증된 사용자가 아닙니다."},
    USERNAME_LENGTH : { "isSuccess": false, "code": 400, "message": "이름은 10자 이내로 설정해주세요."},
    DUPLICATE_DATA : { "isSuccess": false, "code": 400, "message": "퀸텟 체크는 1일 1회만 가능합니다."},
    INVALID_IDTOKEN : { "isSuccess": false, "code": 400, "message": "유효하지 않은 ID 토큰입니다." },
    INVALID_TOKEN : { "isSuccess": false, "code": 400, "message": "유효하지 않은 토큰입니다." },
    TOKEN_NOT_EXIST : { "isSuccess": false, "code": 400, "message": "토큰이 존재하지 않습니다." },
    EXPIRED_TOKEN : { "isSuccess": false, "code": 400, "message": "만료된 토큰입니다." },
    AUTHORIZATION_NOT_FOUND : { "isSuccess": false, "code": 400, "message": "Authorization이 존재하지 않습니다." },
    // Response error

    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 500, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 500, "message": "서버 에러"},
    LOG_OUT_ERROR : { "isSuccess": false, "code": 500, "message": "로그아웃 과정에서 에러가 발생했습니다."}
}
