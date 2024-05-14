export class TabViewComponent {
    private readonly _name: string;
    private readonly _component: string;
    private readonly _alertCount: number;

    constructor(name: string, component: string, alertCount: number) {
        this._name = name;
        this._component = component;
        this._alertCount = alertCount;
    }

    get name(): string {
        return this._name;
    }

    get component(): string {
        return this._component;
    }

    get alertCount(): number {
        return this._alertCount;
    }

    static of(name: string, component: string, alertCount: number): TabViewComponent {
        return new TabViewComponent(name, component, alertCount);
    }

}
