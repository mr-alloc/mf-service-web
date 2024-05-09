import type {HttpMethod} from "@/constant/HttpMethod";

export default class ApiSpecification {
    private readonly _method: HttpMethod;
    private readonly _path: string;
    private _defaultMessage: string = "알수 없는 오류로 실패하였습니다.";
    private _statusMap: Map<number, string> = new Map<number, string>();
    private _familyApiSpec: ApiSpecification | null = null;

    constructor(method: HttpMethod, path: string) {
        this._method = method;
        this._path = path;
    }

    get method(): HttpMethod {
        return this._method;
    }

    get path(): string {
        return this._path;
    }

    get defaultMessage(): string {
        return this._defaultMessage;
    }

    getMessage(code: number): string {
        return this._statusMap?.get(code) || this.defaultMessage
    }

    andDefaultMessage(defaultMessage: string):ApiSpecification {
        this._defaultMessage = defaultMessage;
        return this;
    }

    andPairs(pairs: Array<[number, string]>): ApiSpecification {
        this._statusMap = new Map(pairs)
        return this;
    }

    whenFamily(familyApiSpec: ApiSpecification): ApiSpecification {
        this._familyApiSpec = familyApiSpec;
        return this;
    }

    get familyApiSpec(): ApiSpecification {
        return this._familyApiSpec!;
    }

    hasFamilyApiSpec(): boolean {
        return this._familyApiSpec !== null;
    }

    static of(method: HttpMethod, path: string): ApiSpecification {
        return new ApiSpecification(method, path);
    }
}

