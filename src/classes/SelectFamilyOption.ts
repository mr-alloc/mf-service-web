export default class SelectFamilyOption {

    private readonly _id: number;
    private readonly _frameColor: string;
    private readonly _image: string;
    private readonly _title: string;

    constructor(id: number, frameColor: string, image: string, title: string) {
        this._id = id;
        this._frameColor = frameColor;
        this._image = image;
        this._title = title;
    }

    get id() {
        return this._id;
    }

    get frameColor() {
        return this._frameColor;
    }

    get image() {
        return this._image;
    }

    get title() {
        return this._title;
    }

}
