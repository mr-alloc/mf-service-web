export default {
    toMap<K, T>(list: Array<T>, keyMapper: (t: T) => K): Map<K, T> {
        const map = new Map<K, T>();
        list.forEach(item => {
            const keyValue = keyMapper(item);
            map.set(keyValue, item);
        });
        return map;
    },
    groupBy<K, T>(list: Array<T>, keyMapper: (t: T) => K): Map<K, Array<T>> {
        const map = new Map<K, Array<T>>();
        list.forEach(item => {
            const keyValue = keyMapper(item);
            if (!map.has(keyValue)) {
                map.set(keyValue, []);
            }
            map.get(keyValue)?.push(item);
        });
        return map;
    },
    convertList<T>(list: Array<any>, converter: (item: any) => T): Array<T> {
        if (!list || list.length === 0) return [];
        return list.map(converter);
    }
}
