import axios, {AxiosHeaders, type AxiosResponse} from "axios";
import {getAccessToken, getSelectedFamilyId, noAccessToken} from "@/utils/LocalCache";
import Spec from "@/constant/api-meta/ApiSpecification";
import {HttpMethod} from "@/constant/HttpMethod";
import {useRouter} from "vue-router";
import {AlertType, useAlertStore} from "@/stores/AlertStore";

axios.defaults.baseURL = "http://localhost:9090";
axios.interceptors.response.use(
    response => response,
    error => {
        const notificationStore = useAlertStore();
        const router = useRouter();
        if (error.response?.status === 401) {
            // notificationStore.notice(NotificationType.WARNING, "인증 실패", "로그인이 필요한 서비스입니다.")
        } else if (error.response?.status === 500) {
            notificationStore.alert(AlertType.WARNING, "서버오류", "처리 중 오류가 발생했습니다. 잠시후 다시 시도해 주시기 바랍니다.")
        } else {
            const notificationStore = useAlertStore();
            notificationStore.alert(AlertType.INFO, "네트워크 연결 오류", "서버에 연결할 수 없습니다. 잠시후 다시 시도해 주시기 바랍니다.")
        }
        return Promise.reject(error);
    }
)


function getHeader(): AxiosHeaders {
    const headers = new AxiosHeaders();
    noAccessToken() || headers.set("Authorization", `Bearer ${getAccessToken()}`)
    headers.set("Selected-Family-Id", getSelectedFamilyId() ?? '0')

    return headers;
}

const defaultError = (spec: Spec, error: any) => {
    const alertStore = useAlertStore();
    const res = error.response;

    alertStore.alert(AlertType.WARNING, "서버 에러", spec.getMessage(res?.code) ?? spec.defaultMessage);
}

export async function call(
    spec: Spec,
    body: any | null = {},
    success: ((value: AxiosResponse<any, any>) => any) | null | undefined,
    error?: ((consumeSpec: Spec, axiosError: any) => any) | null | undefined
) {
    const targetSpec = getSelectedFamilyId() !== '0' && spec.hasFamilyApiSpec() ? spec.familyApiSpec : spec;

    let request;
    switch (targetSpec.method) {
        case HttpMethod.GET:
            request = axios.get(targetSpec.path, {
                params: body,
                headers: getHeader(),
            });
            break;
        case HttpMethod.POST:
            request = axios.post(targetSpec.path, body, {
                headers: getHeader()
            });
            break;
        case HttpMethod.PUT:
            request = axios.put(targetSpec.path, body, {
                headers: getHeader()
            });
            break;
        case HttpMethod.DELETE:
            request = axios.delete(targetSpec.path, {
                data: body,
                headers: getHeader()
            })
            break;
        default:
            throw new Error(`Unsupported method: ${targetSpec.method}`);
    }
    return await request
        ?.then(success)
        .catch((axiosError) => {
            console.error(`${targetSpec.path}: ${axiosError}`);
            return error
                ? error(targetSpec, axiosError)
                : defaultError(targetSpec, axiosError)
        });
}

export const dispatchIf = (condition: boolean, path: string, callback: () => void) => {
    const router = useRouter();
    if (condition) {
        callback();
        router.push(path);
    }
}
