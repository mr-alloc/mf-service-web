export class DefaultButtonValue {
    private readonly _title: string;
    private readonly _icon: string [];
    private readonly _clickBehavior: () => void;
    private readonly _visibleCondition: () => boolean;

    constructor(title: string, icon: string [], clickBehavior: () => void, visibleCondition?: () => boolean) {
        this._title = title;
        this._icon = icon;
        this._clickBehavior = clickBehavior;
        this._visibleCondition = visibleCondition ?? (() => true);
    }

    get title(): string {
        return this._title;
    }

    get icon(): string [] {
        return this._icon;
    }

    get clickBehavior(): () => void {
        return this._clickBehavior;
    }

    get visibleCondition(): () => boolean {
        return this._visibleCondition;
    }

    static of(title: string, icon: string [], clickBehavior: () => void, visibleCondition?: () => boolean): DefaultButtonValue {
        return new DefaultButtonValue(title, icon, clickBehavior, visibleCondition);
    }
}
