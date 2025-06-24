type ExtractPlus<T, U, K> = any extends T ? K : T extends U ? T : K;

export function isArray<T>(value: T | unknown[]): value is ExtractPlus<T, any[] | readonly any[], unknown[]> {
    return Array.isArray(value);
}
