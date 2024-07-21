export class CurrentPopup {
    private readonly _type: PopupType
    private readonly _title: string
    private readonly _message: string
    private readonly _buttons: Array<PopupButton>

    private _componentName?: string
    private _componentProps?: any
    private _includeBodyComponent: boolean = false
    private _cancelConfirm: boolean = false
    private _progress: boolean = false

    constructor(type: PopupType, title: string, message?: string) {
        this._type = type;
        this._title = title;
        this._message = message ?? "";
        this._buttons = new Array<PopupButton>();
    }

    get type(): PopupType {
        return this._type;
    }

    get title(): string {
        return this._title;
    }

    get message(): string {
        return this._message;
    }

    get buttons(): Array<PopupButton> {
        return this._buttons;
    }

    get componentName(): string {
        return this._componentName ?? "";
    }

    get componentProps(): any {
        return this._componentProps;
    }

    get includeBodyComponent(): boolean {
        return this._includeBodyComponent;
    }

    get cancelConfirm(): boolean {
        return this._cancelConfirm;
    }

    get progress(): boolean {
        return this._progress;
    }

    tryCancel(timeoutSecond?: number): void {
        this._cancelConfirm = true;
        if (timeoutSecond) {
            setTimeout(() => {
                this._cancelConfirm = false;
            }, timeoutSecond * 1000);
        }
    }

    addBodyComponent(componentName: string, props: any): CurrentPopup {
        this._componentName = componentName;
        this._componentProps = props;
        this._includeBodyComponent = true;
        return this;
    }

    addProgress() {
        this._progress = true;
        return this;
    }

    addButton(title: string, action: () => void): CurrentPopup {
        this._buttons.push(PopupButton.create(title, action));
        return this;
    }

    addCancelButton(buttonName: string, action: () => void, checkMethod: () => number): CurrentPopup {
        const checkCancelProxy = () => {
            if (this._cancelConfirm) {
                action();
            } else {
                const timeout = checkMethod();
                this.tryCancel(timeout);
            }
        }

        this._buttons.push(PopupButton.create(buttonName, checkCancelProxy, true));
        return this;
    }

    hasButtonProxy() {
        return this._buttons.some(button => button.hasProxy);
    }
}

export class PopupButton {
    private readonly _name: string
    private readonly _hasProxy: boolean = false
    private readonly _action: () => void

    constructor(name: string, action: () => void, hasProxy?: boolean) {
        this._name = name;
        this._action = action;
        this._hasProxy = hasProxy ?? false;
    }

    static create(name: string, action: () => void, hasProxy?: boolean): PopupButton {
        return new PopupButton(name, action, hasProxy);
    }

    get name(): string {
        return this._name;
    }

    get action(): () => void {
        return this._action;
    }

    get hasProxy(): boolean {
        return this._hasProxy;
    }
}

export enum PopupType {
    INFO = "info",
    WARNING = "warning",
    NORMAL = "normal"
}
