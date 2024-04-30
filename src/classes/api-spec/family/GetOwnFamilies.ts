export class FamilySummary {
    private readonly _id: number;
    private readonly _color: string;
    private readonly _image: string;
    private readonly _name: string;
    private readonly _description: string;
    private readonly _registeredAt: number;

    constructor(id: number, color: string, image: string, name: string, description: string, registeredAt: number) {
        this._id = id;
        this._color = color;
        this._image = image;
        this._name = name;
        this._description = description;
        this._registeredAt = registeredAt;
    }

    get id(): number {
        return this._id;
    }

    get color(): string {
        return this._color;
    }

    get image(): string {
        return this._image;
    }

    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }

    get registeredAt(): number {
        return this._registeredAt;
    }

    static fromJson(json: any): FamilySummary {
        return new FamilySummary(
            json.familyId,
            json.hexColor,
            json.imageUrl,
            json.familyName,
            json.familyDescription,
            json.registeredAt
        );
    }
}

export class ResponseBody {
    private readonly _families: Array<FamilySummary>;

    constructor(families: Array<FamilySummary>) {
        this._families = families;
    }

    get families(): Array<FamilySummary> {
        return this._families;
    }

    static fromJson(json: any): ResponseBody {
        const families = json.ownFamilies.map(FamilySummary.fromJson);
        return new ResponseBody(families);
    }
}

