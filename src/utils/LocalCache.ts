import {useMemberInfoStore} from "@/stores/MemberInfoStore";
import {useOwnFamiliesStore} from "@/stores/OwnFamiliesStore";
import Account from "@/constant/api-meta/Account";
import {call} from "@/utils/NetworkUtil";
import {useAlertStore} from "@/stores/AlertStore";
import {useRouter} from "vue-router";

const ACCESS_TOKEN = "mf_ac_tk";
const REFRESH_TOKEN = "mf_rf_tk";
const SELECTED_FAMILY_ID = "mf_sf_id";

export const noAccessToken = () => {
    return getAccessToken() == null;
}

export const setAccessToken = (token: string) => {
    localStorage.setItem(ACCESS_TOKEN, token)
}

export const getAccessToken = () => {
    return localStorage.getItem(ACCESS_TOKEN)
}

export const removeAccessToken = () => {
    localStorage.removeItem(ACCESS_TOKEN)
}
export const noRefreshToken = () => {
    return getRefreshToken() == null;
}
export const noTokens = () => {
    return noAccessToken() && noRefreshToken();
}


export const setRefreshToken = (token: string) => {
    localStorage.setItem(REFRESH_TOKEN, token)
}

export const getRefreshToken = () => {
    return localStorage.getItem(REFRESH_TOKEN)
}


export const removeRefreshToken = () => {
    localStorage.removeItem(REFRESH_TOKEN)
}

export const removeTokens = () => {
    removeAccessToken()
    removeRefreshToken()
}

export const refreshToken = async () => {
    const router = useRouter();
    const alertStore = useAlertStore();
    const requestBody = {
        deviceCode: 0,
        refreshToken: getRefreshToken(),
        accessToken: getAccessToken()
    }
    await call<any, any>(Account.RefreshToken, requestBody, (response) => {
        response.data.accessToken && setAccessToken(response.data.accessToken)
        alertStore.info("다시 오신걸 환영해요!", "기존정보로 자동로그인 합니다.");
        router.push("/")
    }, (spec, error) => {
        alertStore.info("재로그인 필요", "자동로그인 기간이 만료되어, 재로그인이 필요해요! 로그인 화면으로 보내드릴게요!")
        removeTokens()
        router.push("/sign-in");
    });
}

export const setSelectedFamilyId = (id: number) => {
    const ownFamiliesStore = useOwnFamiliesStore();
    ownFamiliesStore.hasSelectFamily = id !== 0;
    localStorage.setItem(SELECTED_FAMILY_ID, id.toString())
}

export const getSelectedFamilyId = () => {
    const memberInfoStore = useMemberInfoStore();
    if (memberInfoStore.needMemberInfo()) {
        setSelectedFamilyId(0)
    }
    const familyId = localStorage.getItem(SELECTED_FAMILY_ID);
    return parseInt(familyId ?? '0')
}

export const hasSelectedFamilyId = () => {
    return getSelectedFamilyId() !== 0
}
