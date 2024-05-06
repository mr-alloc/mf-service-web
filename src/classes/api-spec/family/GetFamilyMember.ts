import type {ISelectImageOptionConvertable} from "@/classes/api-spec/SelectImageOption";
import SelectImageOption from "@/classes/api-spec/SelectImageOption";
import {DEFAULT_USER_PROFILE} from "@/constant/LocalAsset";

export class FamilyMember implements ISelectImageOptionConvertable {

    private readonly _id: number;
    private readonly _name: string;
    private readonly _image: string;
    private readonly _role: number;

    constructor(id: number, name: string, image: string, role: number) {
        this._id = id;
        this._name = name;
        this._image = image;
        this._role = role;
    }

    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get image(): string {
        return this._image;
    }

    get role(): number {
        return this._role;
    }

    toSelectImageOption(): SelectImageOption {
        return new SelectImageOption(this._id, this._name, this._image);
    }

    static fromJson(json: any): FamilyMember {
        return new FamilyMember(
            json.id,
            json.nickname,
            json.profileImageUrl ?? DEFAULT_USER_PROFILE,
            json.role
        );
    }
}

export class ResponseBody {

    private readonly _members: FamilyMember [];

    constructor(members: FamilyMember []) {
        this._members = members;
    }

    get members(): FamilyMember [] {
        return this._members;
    }

    static fromJson(json: any): ResponseBody {
        const members = json.members.map(FamilyMember.fromJson);
        return new ResponseBody(members);
    }
}
