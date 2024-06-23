import TemporalUtil from "@/utils/TemporalUtil";

export default class ComponentInfo {

    private readonly _id: number
    private readonly _componentName: string
    private readonly _componentProps: any

    constructor(componentName: string, componentProps: any) {
        this._id = TemporalUtil.getEpochSecond(false);
        this._componentName = componentName;
        this._componentProps = componentProps;
    }

    get id(): number {
        return this._id;
    }

    get componentName(): string {
        return this._componentName;
    }

    get componentProps(): any {
        return this._componentProps;
    }
}
