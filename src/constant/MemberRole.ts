import CollectionUtil from "@/utils/CollectionUtil";
import type {IEnum} from "@/constant/IEnum";

export class MemberRole implements IEnum<MemberRole> {
    static readonly REGULAR: MemberRole = new MemberRole(0, "일반", "regular");
    static readonly SUB_MASTER: MemberRole = new MemberRole(1, "부마스터", "sub-master");
    static readonly MASTER: MemberRole = new MemberRole(2, "마스터", "master");

    private static readonly CACHED: Map<number, MemberRole> = CollectionUtil.toMap(MemberRole.values(), (role) => role._level)


    private readonly _level: number;
    private readonly _name: string;
    private readonly _simpleName: string;

    private constructor(level: number, name: string, simpleName: string) {
        this._level = level;
        this._name = name;
        this._simpleName = simpleName;
    }

    get level(): number {
        return this._level;
    }

    get name(): string {
        return this._name;
    }

    get simpleName(): string {
        return this._simpleName;
    }

    isGrantedFrom(role: MemberRole): boolean {
        return this._level >= role._level;
    }


    static from(level: number): MemberRole {
        return MemberRole.CACHED.get(level) ?? MemberRole.REGULAR;
    }

    static values(): MemberRole[] {
        return [MemberRole.REGULAR, MemberRole.SUB_MASTER, MemberRole.MASTER];
    }
}
