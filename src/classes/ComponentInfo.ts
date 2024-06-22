export default class ComponentInfo {

    private readonly _componentName: string
    private readonly _componentProps: any

    constructor(componentName: string, componentProps: any) {
        this._componentName = componentName;
        this._componentProps = componentProps;
    }

    get componentName(): string {
        return this._componentName;
    }

    get componentProps(): any {
        return this._componentProps;
    }
}
