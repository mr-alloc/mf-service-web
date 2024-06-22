import LocalAsset from "@/constant/LocalAsset";
import type {IProfileMember} from "@/stores/ProfileMemberStore";

export default class SelectImageOption {

    private readonly _id: number;
    private readonly _name: string;
    private readonly _image: string;

    constructor(id: number, name: string, image: string) {
        this._id = id;
        this._name = name;
        this._image = image;
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get image() {
        return this._image;
    }

    static ofDefault(): SelectImageOption {
        return new SelectImageOption(0, "", LocalAsset.DEFAULT_NO_IMAGE);
    }

    static of(id: number, name: string, image: string): SelectImageOption {
        return new SelectImageOption(id, name, image);
    }

    static ofProfileMember(profileMember: IProfileMember) {
        return new SelectImageOption(0, profileMember.nickname, profileMember.profile);
    }
}


export interface ISelectImageOptionConvertable {

    toSelectImageOption(): SelectImageOption;
}
