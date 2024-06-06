import axios, {AxiosError, AxiosHeaders, type AxiosResponse,} from "axios";
import {
    getAccessToken,
    getSelectedFamilyId,
    hasSelectedFamilyId,
    noAccessToken,
    removeTokens
} from "@/utils/LocalCache";
import Spec from "@/constant/api-meta/ApiSpecification";
import {HttpMethod} from "@/constant/HttpMethod";
import {type AlertStore, AlertType, useAlertStore} from "@/stores/AlertStore";
import {useMemberInfoStore} from "@/stores/MemberInfoStore";
import {useOwnFamiliesStore} from "@/stores/OwnFamiliesStore";

axios.defaults.baseURL = "http://localhost:9090";
axios.interceptors.response.use(
    response => response,
    error => {
        const alertStore = useAlertStore();
        if (error.response?.status === 401) {
            handleUnAuthorized(error, alertStore);
        } else if (error.response?.status === 403) {
            handleForbidden(error, alertStore);
        } else if (error.response?.status === 500) {
            // alertStore.warning("서버오류", "처리 중 오류가 발생했습니다. 잠시후 다시 시도해 주시기 바랍니다.");
        } else {
            alertStore.info("네트워크 연결 오류", "서버에 연결할 수 없습니다. 잠시후 다시 시도해 주시기 바랍니다.");
        }
        return Promise.reject(error);
    }
)

function handleUnAuthorized(error: AxiosError, alertStore: AlertStore) {
    alertStore.warning("인증 실패", "로그인이 필요한 서비스입니다.");
    const memberInfoStore = useMemberInfoStore();
    memberInfoStore.removeMemberInfo();
    removeTokens();
}

function handleForbidden(error: AxiosError, alertStore: AlertStore) {
    const userStatus = error.response?.headers["user-status"];
    const memberInfoStore = useMemberInfoStore();
    if (userStatus === "BLOCKED") {
        alertStore.warning("서비스 이용 정지", "이용이 정지된 계정입니다.");
    }
    removeTokens();
    memberInfoStore.removeMemberInfo();
}
const pathVariableRE = /{(\w+)}/g;


function getHeader(): AxiosHeaders {
    const headers = new AxiosHeaders();
    noAccessToken() || headers.set("Authorization", `Bearer ${getAccessToken()}`)
    headers.set("Selected-Family-Id", getSelectedFamilyId())

    return headers;
}

const defaultError = (spec: Spec, error: any) => {
    const alertStore = useAlertStore();
    const res = error.response;

    alertStore.alert(AlertType.WARNING, "서버 에러", spec.getMessage(res?.code) ?? spec.defaultMessage);
}

export async function call<REQ, RES>(
    spec: Spec,
    body: REQ,
    success: ((value: AxiosResponse<RES, any>) => any) | null | undefined,
    error?: ((consumeSpec: Spec, axiosError: any) => any) | null | undefined
) {
    const ownFamiliesStore = useOwnFamiliesStore();
    const targetSpec = ownFamiliesStore.hasSelectFamily && hasSelectedFamilyId() && spec.hasFamilyApiSpec() ? spec.familyApiSpec : spec;
    let bindPath = targetSpec.path;
    pathVariableRE.lastIndex = 0;
    const pathVariables = pathVariableRE.exec(bindPath);
    if (pathVariables) {
        //replace path variables
        const bodyEntries = Object.entries(body);
        for (const [key, value] of bodyEntries) {
            const beforeReplace = bindPath;
            bindPath = bindPath.replace(`{${key}}`, `${value}`);
            if (beforeReplace !== bindPath) {
                delete body[key];
            }
        }
    }
    let request;
    switch (targetSpec.method) {
        case HttpMethod.GET: {
            const getParams = body as { toJSON?: () => any };
            request = axios.get(bindPath, {
                params: (getParams?.toJSON ? getParams.toJSON() : body) ?? {},
                headers: getHeader(),
            });
            break;
        }
        case HttpMethod.POST:
            request = axios.post(bindPath, body ?? {}, {
                headers: getHeader()
            });
            break;
        case HttpMethod.PUT:
            request = axios.put(bindPath, body ?? {}, {
                headers: getHeader()
            });
            break;
        case HttpMethod.DELETE:
            request = axios.delete(bindPath, {
                data: body ?? body ?? {},
                headers: getHeader()
            })
            break;
        default:
            throw new Error(`Unsupported method: ${targetSpec.method}`);
    }
    return await request
        ?.then(success)
        .catch((axiosError) => {
            console.error(`${bindPath}: ${axiosError}`);
            return error
                ? error(targetSpec, axiosError)
                : defaultError(targetSpec, axiosError)
        });
}
