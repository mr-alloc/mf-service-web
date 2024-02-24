export default {
    MEMBER_INFO_V1: {
        name: "/v1/member/info",
        defaultErrorMessage: "회원 정보를 불러오는 중 오류가 발생했습니다.",
        codes: {

        }
    },
    MEMBER_CHANGE_NICKNAME_V1: {
        name: "/v1/member/change-nickname",
        defaultErrorMessage: "닉네임을 변경하는 중 오류가 발생했습니다.",
        codes: {
            "-3": "닉네임은 2~10자로 입력해주세요."
        }
    }
}
