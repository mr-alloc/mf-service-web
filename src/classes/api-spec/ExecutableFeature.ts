export default class ExecutableFeature {
    private readonly _name: string;
    private readonly _executeFunction: (event?: Event) => void;

    constructor(name: string, executeFunction: (event?: Event) => void) {
        this._name = name;
        this._executeFunction = executeFunction;
    }

    get name(): string {
        return this._name;
    }

    get executeFunction(): (event?: Event) => void {
        return this._executeFunction;
    }

    static of(name: string, executeFunction: (event?: Event) => void): ExecutableFeature {
        return new ExecutableFeature(name, executeFunction);
    }
}
