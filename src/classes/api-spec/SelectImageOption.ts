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
        return new SelectImageOption(0, "", "");
    }
}


export interface ISelectImageOptionConvertable {

    toSelectImageOption(): SelectImageOption;
}
