export function convertList<T>(list: Array<any>, converter: (item: any) => T): Array<T> {
    if (!list || list.length === 0) return [];
    return list.map(converter);
}
