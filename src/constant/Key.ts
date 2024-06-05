import CollectionUtil from "@/utils/CollectionUtil";

export default class Key {

    static readonly ENTER = new Key("Enter");
    static readonly ESCAPE = new Key("Escape");
    static readonly TAB = new Key("Tab");

    private static readonly CACHED = CollectionUtil.toMap(Key.values(), (key) => key._code);
    private static readonly OTHERS = new Key("");

    private readonly _code: string;

    private constructor(code: string) {
        this._code = code;
    }

    static of(event: KeyboardEvent): Key {
        return this.CACHED.get(event.code) ?? this.OTHERS;
    }

    is(key: Key): boolean {
        return this._code === key._code;
    }

    static values(): Key[] {
        return [
            Key.ENTER,
            Key.ESCAPE,
            Key.TAB
        ];
    }
}
