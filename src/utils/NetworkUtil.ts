import axios, {AxiosHeaders, type AxiosResponse} from "axios";
import {getAccessToken, noAccessToken} from "@/utils/LocalCache";
import Spec from "@/constant/api-meta/ApiSpecification";
import {HttpMethod} from "@/constant/HttpMethod";
import {useRouter} from "vue-router";

axios.defaults.baseURL = "http://localhost:9090";


function getHeader(): AxiosHeaders {
    const headers = new AxiosHeaders();
    noAccessToken() || headers.set("Authorization", `Bearer ${getAccessToken()}`)

    return headers;
}

const defaultError = (spec: Spec, error: any) => {
    const res = error.response;
    console.error(`[${error.response?.status}] ${spec.method} ${spec.path}:\n${res.data}`);
}

export async function call(
    spec: Spec,
    body: any | null = {},
    success: ((value: AxiosResponse<any, any>) => any) | null | undefined,
    error?: ((consumeSpec: Spec, axiosError: any) => any) | null | undefined
) {
    let request;
    switch (spec.method) {
        case HttpMethod.GET:
            request = axios.get(spec.path, {
                params: body,
                headers: getHeader()
            });
            break;
        case HttpMethod.POST:
            request = axios.post(spec.path, body, {
                headers: getHeader()
            });
            break;
        case HttpMethod.PUT:
            request = axios.put(spec.path, body, {
                headers: getHeader()
            });
            break;
        case HttpMethod.DELETE:
            request = axios.delete(spec.path, {
                data: body,
                headers: getHeader()
            })
            break;
        default:
            throw new Error("Unsupported method: " + spec.method);
    }

    return await request
        ?.then(success)
        .catch((axiosError) => {
            return error
                ? error(spec, axiosError)
                : defaultError(spec, axiosError)
        });
}

export const dispatchIf = (condition: boolean, path: string, callback: () => void) => {
    const router = useRouter();
    if (condition) {
        callback();
        router.push(path);
    }
}
