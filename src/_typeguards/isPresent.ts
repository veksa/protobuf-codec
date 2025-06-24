export function isPresent<T>(value: T): value is Exclude<T, undefined | null> {
    return value !== undefined && value !== null;
}
