import CollectionUtil from "@/utils/CollectionUtil";

export class AccountRole {
    static readonly GUEST: AccountRole = new AccountRole(0, "GUEST", "guest");
    static readonly MEMBER: AccountRole = new AccountRole(1, "MEMBER", "member");
    static readonly ADMIN: AccountRole = new AccountRole(2, "ADMIN", "admin");

    private static readonly CACHED: Map<number, AccountRole> = CollectionUtil.toMap(AccountRole.values(), (role) => role._level);

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

    isGrantedFrom(role: AccountRole): boolean {
        return this._level >= role._level;
    }

    static from(level: number): AccountRole {
        return AccountRole.CACHED.get(level) ?? AccountRole.GUEST;
    }

    static values(): AccountRole[] {
        return [AccountRole.GUEST, AccountRole.MEMBER, AccountRole.ADMIN];
    }
}
