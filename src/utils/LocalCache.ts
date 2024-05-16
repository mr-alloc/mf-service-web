import {useMemberInfoStore} from "@/stores/MemberInfoStore";
import {useOwnFamiliesStore} from "@/stores/OwnFamiliesStore";

const ACCESS_TOKEN = "mf_ac_tk";
const REFRESH_TOKEN = "mf_rf_tk";
const SELECTED_FAMILY_ID = "mf_sf_id";

export const noAccessToken = () => {
    return localStorage.getItem(ACCESS_TOKEN) == null
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
