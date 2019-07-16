
export namespace Utils {
    export function getItemsFromIterable<T>(iter: Iterable<T>) {
        const result:T[] = []
        for(const item of iter) {
            result.push(item)
        }
        return result   
    }

    export function flattenArray(array: any[][]) {
        return [].concat.apply([], array)
    }

    export function getUniqueEntries<T>(array: Array<T>) {
        return getItemsFromIterable(new Set(array).keys())
    }

    export function mapToArray<T>(map: {[name: string]: T}): Array<{key: string, value: T}> {
        return Object.keys(map).map(key  => {
            return {
                key: key,
                value: map[key]
            }
        })
    }
}