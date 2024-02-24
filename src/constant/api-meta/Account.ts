export default {
    CONFIRM_ACCOUNT_V1: {
        name: "/v1/account/confirm",
        defaultErrorMessage: "이메일 형식이 올바르지 않습니다.",
        codes: {
            "-1": "이메일 형식이 올바르지 않습니다.",
            "-3": "이미 사용중인 이메일 입니다."
        }
    },
    CREATE_ACCOUNT_V1: {
        name: "/v1/account/create",
        codes: {
            "-1": "이메일 형식이 올바르지 않습니다.",
            "-3": "이미 사용중인 이메일 입니다."
        }
    },
    VERIFY_ACCOUNT_V1: {
        name: "/v1/account/verify",
        codes: {
            "-4": "잘못된 계정 정보입니다."
        },
        defaultErrorMessage: "계정 인증 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
    },
}
