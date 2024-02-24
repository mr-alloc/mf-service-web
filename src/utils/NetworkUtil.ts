import axios from "axios";
import {useSessionStore} from "@/stores/SessionStore";
import {getAccessToken} from "@/utils/LocalCache";
axios.defaults.baseURL = "http://localhost:9090";

export function get(url: string, params: any) {
    const sessionStore = useSessionStore();
    return axios.get(url, {
        params: params,
        headers: {
            "Authorization": "Bearer " + getAccessToken()
        }
    })
}

export async function post(url: string, body: any) {
    return await axios.post(url, body);
}

export async function put(url: string, body: any) {
    return await axios.put(url, body, {
        headers: {
            "Authorization": "Bearer " + getAccessToken()
        }
    });
}
