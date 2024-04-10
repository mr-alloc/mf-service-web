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

    return {
        notifications,
        alert,
        clear
    }
})

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
