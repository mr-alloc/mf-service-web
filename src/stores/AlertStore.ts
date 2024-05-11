import {defineStore} from "pinia";
import {ref} from "vue";

export const useAlertStore = defineStore('alert', () => {

    const notifications = ref<Array<Notification>>([]);

    function alert(type: AlertType, title: string, message: string, timeoutSecond?: number) {
        const notification = new Notification(type, title, message);
        notifications.value.push(notification);

        setTimeout(() => {
            notifications.value
                .forEach((alert, index) => {
                    if (alert.timestamp === notification.timestamp) {
                        notifications.value.splice(index, 1)
                    }
                });
        }, (timeoutSecond ?? 5) * 1000)

        if (notifications.value.length > 5) {
            notifications.value.shift();
        }
    }

    function clear() {
        notifications.value = [];
    }

    function warning(title: string, message: string, timeoutSecond?: number) {
        alert(AlertType.WARNING, title, message, timeoutSecond);
    }

    function info(title: string, message: string, timeoutSecond?: number) {
        alert(AlertType.INFO, title, message, timeoutSecond);
    }

    function success(title: string, message: string, timeoutSecond?: number) {
        alert(AlertType.SUCCESS, title, message, timeoutSecond);
    }

    function guide(title: string, message: string, timeoutSecond?: number) {
        alert(AlertType.GUIDE, title, message, timeoutSecond);
    }

    function none(title: string, message: string, timeoutSecond?: number) {
        alert(AlertType.NONE, title, message, timeoutSecond);
    }

    return {
        notifications,
        alert,
        clear,
        warning,
        info,
        success,
        guide,
        none
    }
})

export type AlertStore = ReturnType<typeof useAlertStore>;

export class Notification {
    private readonly _timestamp: number;
    private readonly _type: AlertType;
    private readonly _title: string;
    private readonly _message: string;

    constructor(type: AlertType, title: string, message: string) {
        this._timestamp = Date.now();
        this._type = type;
        this._title = title;
        this._message = message;
    }

    get timestamp(): number {
        return this._timestamp;
    }

    get type(): AlertType {
        return this._type;
    }

    get title(): string {
        return this._title;
    }

    get message(): string {
        return this._message;
    }
}

export enum AlertType {
    INFO = "info",
    WARNING = "warning",
    SUCCESS = "success",
    GUIDE = "guide",
    NONE = "none"
}
